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

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

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

def is_valid_image(image_bytes: bytes, min_dim: int = 100) -> tuple[bool, Image.Image | None]:
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        img = Image.open(io.BytesIO(image_bytes))
        width, height = img.size
        if width < min_dim or height < min_dim:
            return False, None
        return True, img
    except Exception:
        return False, None

def save_image_as_jpeg(img: Image.Image, target_path: str):
    if img.mode in ("RGBA", "LA", "P"):
        rgb_img = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        rgb_img.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
        rgb_img.save(target_path, "JPEG", quality=90)
    else:
        rgb_img = img.convert("RGB")
        rgb_img.save(target_path, "JPEG", quality=90)

def search_images(ddgs_client: DDGS, query: str, max_results: int = 10) -> list[dict]:
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
                valid, img = is_valid_image(resp.content)
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

def process_product_v2(
    product_id: str,
    product_name: str,
    base_output_dir: str,
    legacy_dir: str,
    ddgs_client: DDGS,
    session: requests.Session,
    target_count: int = 3
) -> tuple[str, list[str]]:
    folder_name = sanitize_folder_name(product_name, product_id)
    product_folder = os.path.join(base_output_dir, folder_name)
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

    # 2. Check legacy images in candy_images/
    if len(current_images) < target_count and os.path.exists(legacy_dir):
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

    # 3. Search internet for remaining distinct images
    needed = target_count - len(current_images)
    cleaned = clean_product_name_for_search(product_name)
    simplified = simplify_product_name_for_search(product_name)

    queries = [
        f"{cleaned} candy",
        cleaned,
    ]
    if simplified and simplified.lower() != cleaned.lower():
        queries.append(f"{simplified} candy")

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
        time.sleep(0.4)

    # Download distinct candidates
    for candidate in all_candidates:
        if needed <= 0:
            break
        img, raw_bytes = download_candidate(candidate, session)
        if img and raw_bytes:
            h = hashlib.md5(raw_bytes).hexdigest()
            if h in existing_hashes:
                continue  # Skip duplicate image!

            next_idx = len(current_images) + 1
            dest_file = os.path.join(product_folder, f"image_{next_idx}.jpg")
            try:
                save_image_as_jpeg(img, dest_file)
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

def main():
    parser = argparse.ArgumentParser(description="Download 3 images per product into named folders.")
    parser.add_argument("--csv", default="Candy products_List.csv")
    parser.add_argument("--output", default="Candy_Products_Images")
    parser.add_argument("--legacy", default="candy_images")
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--per-product", type=int, default=3)
    args = parser.parse_args()

    os.makedirs(args.output, exist_ok=True)
    manifest_path = os.path.join(args.output, "manifest.csv")

    with open(args.csv, mode="r", encoding="utf-8", errors="replace") as f:
        reader = list(csv.DictReader(f))

    if args.limit:
        reader = reader[:args.limit]

    total = len(reader)
    print(f"Starting organization & download for {total} products into '{args.output}' (target: {args.per_product} images/product)...")

    session = requests.Session()
    ddgs_client = DDGS()

    # Load existing manifest to avoid overwriting or duplicate lines
    processed_pids = set()
    if os.path.exists(manifest_path):
        with open(manifest_path, mode="r", encoding="utf-8", errors="replace") as mf:
            m_reader = csv.DictReader(mf)
            for row in m_reader:
                if row.get("Status") in ("SUCCESS", "EXISTS"):
                    processed_pids.add(row.get("ProductId"))

    manifest_exists = os.path.exists(manifest_path)
    manifest_file = open(manifest_path, mode="a", encoding="utf-8", newline="")
    manifest_writer = csv.writer(manifest_file)
    if not manifest_exists:
        manifest_writer.writerow(["ProductId", "ProductName", "Folder", "Status", "ImageCount", "Images"])
        manifest_file.flush()

    success_count = 0
    partial_count = 0
    fail_count = 0

    for idx, row in enumerate(reader, start=1):
        pid = row.get("ProductId", "").strip()
        pname = row.get("ProductName", "").strip()
        if not pid:
            continue

        folder_name = sanitize_folder_name(pname, pid)
        status, files = process_product_v2(
            pid, pname, args.output, args.legacy, ddgs_client, session, target_count=args.per_product
        )

        if status == "SUCCESS":
            success_count += 1
            print(f"[{idx}/{total}] [SUCCESS: {len(files)} imgs] {folder_name}")
        elif status == "PARTIAL":
            partial_count += 1
            print(f"[{idx}/{total}] [PARTIAL: {len(files)} imgs] {folder_name}")
        else:
            fail_count += 1
            print(f"[{idx}/{total}] [FAILED: 0 imgs] {folder_name}")

        manifest_writer.writerow([pid, pname, folder_name, status, len(files), ";".join(files)])
        manifest_file.flush()
        time.sleep(0.4)

    manifest_file.close()
    print("\nProcessing complete!")
    print(f"Total: {total} | Full ({args.per_product} images): {success_count} | Partial: {partial_count} | Failed: {fail_count}")

if __name__ == "__main__":
    main()
