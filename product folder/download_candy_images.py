import os
import sys
import csv
import time
import re
import io
import argparse
import requests
from PIL import Image
from ddgs import DDGS

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

def clean_product_name(name: str) -> str:
    # 1. Remove barcodes (8-14 consecutive digits)
    cleaned = re.sub(r'\b\d{8,14}\b', '', name)
    # 2. Normalize whitespace
    cleaned = re.sub(r'\s+', ' ', cleaned).strip(' .,-')
    return cleaned

def simplify_product_name(name: str) -> str:
    cleaned = clean_product_name(name)
    # Remove units like 2.5 Oz., 80 GM, 100 Pcs./Box
    cleaned = re.sub(r'\b\d+(\.\d+)?\s*(oz|gm|g|ml|ct|pcs|pk|box|lbs?)\b', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'[/\\()\-]', ' ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip(' .,-')
    return cleaned

def is_valid_image(image_bytes: bytes, min_dim: int = 100) -> tuple[bool, Image.Image | None]:
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        # Re-open after verify()
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

def search_images(ddgs_client: DDGS, query: str, max_results: int = 8) -> list[dict]:
    for attempt in range(4):
        try:
            results = ddgs_client.images(query=query, max_results=max_results)
            if results:
                return results
            break
        except Exception as e:
            time.sleep(2 * (attempt + 1))
    return []

def download_image_from_candidates(candidate: dict, session: requests.Session) -> Image.Image | None:
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
                    return img
        except Exception:
            continue
    return None

def process_product(
    product_id: str,
    product_name: str,
    output_dir: str,
    ddgs_client: DDGS,
    session: requests.Session,
    images_needed: int = 2
) -> tuple[str, list[str]]:
    saved_files = []
    
    # Check if files already exist
    existing = []
    for i in range(1, images_needed + 1):
        p = os.path.join(output_dir, f"{product_id}_{i}.jpg")
        if os.path.exists(p) and os.path.getsize(p) > 1024:
            existing.append(p)
            
    if len(existing) >= images_needed:
        return "EXISTS", existing

    # Queries in order of priority
    cleaned = clean_product_name(product_name)
    simplified = simplify_product_name(product_name)
    
    queries = [
        f"{cleaned} candy",
        cleaned,
    ]
    if simplified and simplified.lower() != cleaned.lower():
        queries.append(f"{simplified} candy")

    all_candidates = []
    seen_urls = set()

    for q in queries:
        candidates = search_images(ddgs_client, q, max_results=8)
        for c in candidates:
            img_url = c.get("image") or c.get("thumbnail")
            if img_url and img_url not in seen_urls:
                seen_urls.add(img_url)
                all_candidates.append(c)
        if len(all_candidates) >= 8:
            break
        time.sleep(0.4)

    downloaded_imgs = []
    for candidate in all_candidates:
        img = download_image_from_candidates(candidate, session)
        if img:
            downloaded_imgs.append(img)
            if len(downloaded_imgs) >= images_needed:
                break

    # Save images
    for idx, img in enumerate(downloaded_imgs[:images_needed], start=1):
        target_path = os.path.join(output_dir, f"{product_id}_{idx}.jpg")
        try:
            save_image_as_jpeg(img, target_path)
            saved_files.append(target_path)
        except Exception as e:
            print(f"Error saving {target_path}: {e}")

    if len(saved_files) == images_needed:
        return "SUCCESS", saved_files
    elif len(saved_files) > 0:
        return "PARTIAL", saved_files
    else:
        return "FAILED", []

def main():
    parser = argparse.ArgumentParser(description="Download product images from CSV.")
    parser.add_argument("--csv", default="Candy products_List.csv", help="CSV path")
    parser.add_argument("--output", default="candy_images", help="Output directory")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of products to process")
    parser.add_argument("--per-product", type=int, default=2, help="Images per product")
    args = parser.parse_args()

    os.makedirs(args.output, exist_ok=True)
    manifest_path = os.path.join(args.output, "manifest.csv")

    with open(args.csv, mode="r", encoding="utf-8", errors="replace") as f:
        reader = list(csv.DictReader(f))

    if args.limit:
        reader = reader[:args.limit]

    total = len(reader)
    print(f"Starting image download for {total} products into '{args.output}'...")

    session = requests.Session()
    ddgs_client = DDGS()

    manifest_exists = os.path.exists(manifest_path)
    manifest_file = open(manifest_path, mode="a", encoding="utf-8", newline="")
    manifest_writer = csv.writer(manifest_file)
    if not manifest_exists:
        manifest_writer.writerow(["ProductId", "ProductName", "Status", "Image1", "Image2"])
        manifest_file.flush()

    success_count = 0
    partial_count = 0
    fail_count = 0

    for idx, row in enumerate(reader, start=1):
        pid = row.get("ProductId", "").strip()
        pname = row.get("ProductName", "").strip()
        if not pid:
            continue

        print(f"[{idx}/{total}] Processing ID {pid}: {pname[:50]}...")
        try:
            status, files = process_product(pid, pname, args.output, ddgs_client, session, images_needed=args.per_product)
            img1 = files[0] if len(files) > 0 else ""
            img2 = files[1] if len(files) > 1 else ""

            if status in ("SUCCESS", "EXISTS"):
                success_count += 1
                print(f"  -> {status}: {len(files)} image(s) saved.")
            elif status == "PARTIAL":
                partial_count += 1
                print(f"  -> PARTIAL: Only {len(files)} image saved.")
            else:
                fail_count += 1
                print(f"  -> FAILED: Could not find/download suitable images.")

            manifest_writer.writerow([pid, pname, status, img1, img2])
            manifest_file.flush()
        except Exception as e:
            print(f"  -> ERROR: {e}")
            fail_count += 1
            manifest_writer.writerow([pid, pname, f"ERROR: {e}", "", ""])
            manifest_file.flush()

        time.sleep(0.5)

    manifest_file.close()
    print("\nDownload finished!")
    print(f"Success/Existing: {success_count}, Partial: {partial_count}, Failed: {fail_count}")

if __name__ == "__main__":
    main()
