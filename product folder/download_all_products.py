import os
import sys
import csv
import time
import re
import io
import shutil
import hashlib
import argparse
import requests
from PIL import Image
from ddgs import DDGS

# Ensure UTF-8 output
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

ECOMMERCE_DOMAINS = [
    "walmartimages.com", "media-amazon.com", "cdn.shopify.com",
    "target.scene7.com", "instacart.com", "openfoodfacts.org",
    "kroger.com", "drizly.com", "exoticsnack", "candygurus",
    "snackcrate", "secretcandyshop", "sweetmarket"
]

CATEGORIES = [
    {
        "name": "Candy products",
        "csv_files": ["Candy products_List.csv"],
        "category_tag": "candy snack",
        "product_type": "candy",
        "legacy_dir": "candy_images"
    },
    {
        "name": "Carbonated Drinks",
        "csv_files": ["Carbonated Drinks_List.csv"],
        "category_tag": "carbonated drink beverage can bottle",
        "product_type": "drink",
        "legacy_dir": None
    },
    {
        "name": "Exotic Energy Drink",
        "csv_files": ["Exotic Energy Drink_List.csv"],
        "category_tag": "energy drink can",
        "product_type": "energy drink",
        "legacy_dir": None
    },
    {
        "name": "Exotic Soda",
        "csv_files": ["Exotic Soda_List.csv"],
        "category_tag": "soda drink can bottle",
        "product_type": "soda",
        "legacy_dir": None
    },
    {
        "name": "Snacks products",
        "csv_files": ["Snacks products_List_Page 1.csv", "Snacks products_List_Page 2.csv"],
        "category_tag": "snack food pack bag box",
        "product_type": "snack",
        "legacy_dir": None
    }
]

def sanitize_folder_name(name: str, product_id: str) -> str:
    cleaned = re.sub(r'[\\/:*?"<>|]', '_', name)
    cleaned = cleaned.strip(' .')
    if not cleaned:
        cleaned = f"Product_{product_id}"
    if len(cleaned) > 100:
        cleaned = cleaned[:100].strip(' .')
    return cleaned

def clean_product_name_for_search(name: str) -> str:
    cleaned = re.sub(r'\b\d{8,14}\b', '', name)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip(' .,-')
    return cleaned

def simplify_product_name_for_search(name: str) -> str:
    cleaned = clean_product_name_for_search(name)
    cleaned = re.sub(r'\b\d+(\.\d+)?\s*(oz|gm|g|ml|ct|pcs|pk|box|lbs?)\b', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'[/\\()\-]', ' ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip(' .,-')
    return cleaned

def is_valid_ecommerce_image(image_bytes: bytes, min_dim: int = 200) -> tuple[bool, Image.Image | None]:
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        img = Image.open(io.BytesIO(image_bytes))
        width, height = img.size
        if width < min_dim or height < min_dim:
            return False, None
        # Reject banners or extreme aspect ratios
        ratio = width / float(height)
        if ratio < 0.45 or ratio > 2.2:
            return False, None
        return True, img
    except Exception:
        return False, None

def save_clean_ecommerce_image(img: Image.Image, target_path: str):
    # If image has transparency (PNG/WebP), composite onto clean pure white background
    if img.mode in ("RGBA", "LA", "P"):
        rgb_img = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        rgb_img.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
        rgb_img.save(target_path, "JPEG", quality=92, optimize=True)
    else:
        rgb_img = img.convert("RGB")
        rgb_img.save(target_path, "JPEG", quality=92, optimize=True)

def score_candidate(candidate: dict) -> int:
    score = 0
    url = (candidate.get("image") or "").lower()
    title = (candidate.get("title") or "").lower()
    source = (candidate.get("source") or "").lower()

    # Prioritize trusted e-commerce CDNs
    for domain in ECOMMERCE_DOMAINS:
        if domain in url or domain in source:
            score += 50
            break

    # Prioritize packshot / packaging / isolated product
    if any(k in title for k in ["pack", "bottle", "can", "bag", "box", "flavor", "oz", "ml", "gm"]):
        score += 15
    if "white background" in title or "isolated" in title or "transparent" in title:
        score += 20
    if "review" in title or "meme" in title or "recipe" in title or "blog" in title:
        score -= 20

    # Resolution bonus
    try:
        w = int(candidate.get("width") or 0)
        h = int(candidate.get("height") or 0)
        if 400 <= w <= 2500 and 400 <= h <= 2500:
            score += 20
            # Square-ish aspect ratio bonus (typical for e-commerce)
            ratio = w / float(h)
            if 0.75 <= ratio <= 1.35:
                score += 15
    except Exception:
        pass

    return score

def search_images(ddgs_client: DDGS, query: str, max_results: int = 15) -> list[dict]:
    for attempt in range(4):
        try:
            results = ddgs_client.images(query=query, max_results=max_results)
            if results:
                return results
            break
        except Exception:
            time.sleep(2 * (attempt + 1))
    return []

def download_candidate(candidate: dict, session: requests.Session) -> tuple[Image.Image | None, bytes | None]:
    urls_to_try = []
    if candidate.get("image"):
        urls_to_try.append(candidate["image"])
    if candidate.get("thumbnail"):
        urls_to_try.append(candidate["thumbnail"])

    for url in urls_to_try:
        try:
            resp = session.get(url, headers=HEADERS, timeout=8, allow_redirects=True)
            if resp.status_code == 200 and resp.content:
                valid, img = is_valid_ecommerce_image(resp.content)
                if valid and img:
                    return img, resp.content
        except Exception:
            continue
    return None, None

def get_file_hash(filepath: str) -> str:
    try:
        with open(filepath, "rb") as f:
            return hashlib.md5(f.read()).hexdigest()
    except Exception:
        return ""

def process_single_product(
    product_id: str,
    product_name: str,
    category_dir: str,
    legacy_dir: str | None,
    category_tag: str,
    product_type: str,
    ddgs_client: DDGS,
    session: requests.Session,
    target_count: int = 3
) -> tuple[str, list[str]]:
    folder_name = sanitize_folder_name(product_name, product_id)
    product_folder = os.path.join(category_dir, folder_name)
    os.makedirs(product_folder, exist_ok=True)

    # 1. Existing images in product_folder
    current_images = []
    existing_hashes = set()

    for i in range(1, target_count + 1):
        p = os.path.join(product_folder, f"image_{i}.jpg")
        if os.path.exists(p) and os.path.getsize(p) > 1024:
            current_images.append(p)
            h = get_file_hash(p)
            if h:
                existing_hashes.add(h)

    # 2. Check legacy images if available
    if len(current_images) < target_count and legacy_dir and os.path.exists(legacy_dir):
        for legacy_idx in (1, 2):
            legacy_file = os.path.join(legacy_dir, f"{product_id}_{legacy_idx}.jpg")
            if os.path.exists(legacy_file) and os.path.getsize(legacy_file) > 1024:
                lh = get_file_hash(legacy_file)
                if lh and lh not in existing_hashes:
                    next_idx = len(current_images) + 1
                    if next_idx <= target_count:
                        dest_file = os.path.join(product_folder, f"image_{next_idx}.jpg")
                        shutil.copy2(legacy_file, dest_file)
                        current_images.append(dest_file)
                        existing_hashes.add(lh)

    if len(current_images) >= target_count:
        return "SUCCESS", current_images

    # 3. Targeted e-commerce search queries
    needed = target_count - len(current_images)
    cleaned = clean_product_name_for_search(product_name)
    simplified = simplify_product_name_for_search(product_name)

    # Skip non-product entries (e.g. accounting wholesale invoices)
    if "wholesale purchased" in cleaned.lower() or "import purchased" in cleaned.lower():
        return "SKIPPED_NON_PRODUCT", []

    queries = [
        f"{cleaned} product packaging white background",
        f"{cleaned} {product_type} packshot",
        f"{cleaned} {category_tag}",
    ]
    if simplified and simplified.lower() != cleaned.lower():
        queries.append(f"{simplified} {product_type} product packaging")

    all_candidates = []
    seen_urls = set()

    for q in queries:
        candidates = search_images(ddgs_client, q, max_results=12)
        for c in candidates:
            u = c.get("image") or c.get("thumbnail")
            if u and u not in seen_urls:
                seen_urls.add(u)
                all_candidates.append(c)
        if len(all_candidates) >= 12:
            break
        time.sleep(0.35)

    # Sort candidates by e-commerce relevance score
    all_candidates.sort(key=score_candidate, reverse=True)

    # Download distinct candidates
    for candidate in all_candidates:
        if needed <= 0:
            break
        img, raw_bytes = download_candidate(candidate, session)
        if img and raw_bytes:
            h = hashlib.md5(raw_bytes).hexdigest()
            if h in existing_hashes:
                continue

            next_idx = len(current_images) + 1
            dest_file = os.path.join(product_folder, f"image_{next_idx}.jpg")
            try:
                save_clean_ecommerce_image(img, dest_file)
                current_images.append(dest_file)
                existing_hashes.add(h)
                needed -= 1
            except Exception:
                pass

    if len(current_images) == target_count:
        return "SUCCESS", current_images
    elif len(current_images) > 0:
        return "PARTIAL", current_images
    else:
        return "FAILED", []

def run_category(cat: dict, session: requests.Session, ddgs_client: DDGS, limit: int | None = None, per_product: int = 3):
    cat_name = cat["name"]
    category_dir = os.path.join(".", cat_name)
    os.makedirs(category_dir, exist_ok=True)
    manifest_path = os.path.join(category_dir, "manifest.csv")

    rows = []
    seen_pids = set()
    for csv_file in cat["csv_files"]:
        if not os.path.exists(csv_file):
            print(f"Warning: {csv_file} not found.", flush=True)
            continue
        with open(csv_file, mode="r", encoding="utf-8", errors="replace") as f:
            reader = csv.DictReader(f)
            for r in reader:
                pid = r.get("ProductId", "").strip()
                if pid and pid not in seen_pids:
                    seen_pids.add(pid)
                    rows.append(r)

    if limit:
        rows = rows[:limit]

    total = len(rows)
    print(f"\n=======================================================", flush=True)
    print(f"Processing Category: '{cat_name}' ({total} products)", flush=True)
    print(f"Folder: '{category_dir}' | Target: {per_product} e-commerce images/product", flush=True)
    print(f"=======================================================", flush=True)

    manifest_exists = os.path.exists(manifest_path)
    manifest_file = open(manifest_path, mode="a", encoding="utf-8", newline="")
    manifest_writer = csv.writer(manifest_file)
    if not manifest_exists:
        manifest_writer.writerow(["ProductId", "ProductName", "Folder", "Status", "ImageCount", "Images"])
        manifest_file.flush()

    success_count = 0
    partial_count = 0
    fail_count = 0

    for idx, row in enumerate(rows, start=1):
        pid = row.get("ProductId", "").strip()
        pname = row.get("ProductName", "").strip()
        if not pid:
            continue

        folder_name = sanitize_folder_name(pname, pid)
        status, files = process_single_product(
            pid, pname, category_dir, cat["legacy_dir"],
            cat["category_tag"], cat["product_type"],
            ddgs_client, session, target_count=per_product
        )

        safe_name = folder_name.encode("ascii", "replace").decode("ascii")[:45]
        if status == "SUCCESS":
            success_count += 1
            print(f"[{cat_name}] [{idx}/{total}] [SUCCESS: {len(files)} imgs] {safe_name}", flush=True)
        elif status == "PARTIAL":
            partial_count += 1
            print(f"[{cat_name}] [{idx}/{total}] [PARTIAL: {len(files)} imgs] {safe_name}", flush=True)
        elif status == "SKIPPED_NON_PRODUCT":
            print(f"[{cat_name}] [{idx}/{total}] [SKIPPED] {safe_name}", flush=True)
        else:
            fail_count += 1
            print(f"[{cat_name}] [{idx}/{total}] [FAILED: 0 imgs] {safe_name}", flush=True)

        manifest_writer.writerow([pid, pname, folder_name, status, len(files), ";".join(files)])
        manifest_file.flush()
        time.sleep(0.3)

    manifest_file.close()
    print(f"Finished '{cat_name}': {success_count} Complete, {partial_count} Partial, {fail_count} Failed.", flush=True)

def main():
    parser = argparse.ArgumentParser(description="Download e-commerce product images into category and product folders.")
    parser.add_argument("--limit", type=int, default=None, help="Limit products per category")
    parser.add_argument("--per-product", type=int, default=3, help="Images per product")
    parser.add_argument("--category", type=str, default=None, help="Process specific category only")
    args = parser.parse_args()

    session = requests.Session()
    ddgs_client = DDGS()

    cats_to_run = CATEGORIES
    if args.category:
        cats_to_run = [c for c in CATEGORIES if args.category.lower() in c["name"].lower()]
        if not cats_to_run:
            print(f"Category '{args.category}' not found.", flush=True)
            return

    for cat in cats_to_run:
        run_category(cat, session, ddgs_client, limit=args.limit, per_product=args.per_product)

    print("\n=======================================================", flush=True)
    print("All categories processed successfully with e-commerce standards!", flush=True)
    print("=======================================================", flush=True)

if __name__ == "__main__":
    main()
