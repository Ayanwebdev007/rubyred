"""
Build the Ruby Red product catalog from the supplier CSVs in "product folder/".

For each of the 5 categories it:
  1. reads the CSV rows,
  2. skips non-retail rows (vendor invoices such as "... Wholesale Purchased",
     rows with no retail price, inactive rows, case-only listings) and rows
     with no downloaded images,
  3. picks N products (default 20), at most 2 per brand on the first pass so a
     category is not filled with flavours of a single brand,
  4. resizes each product's images to web size into public/products/<category>/<sku>/,
  5. writes src/data/catalog.json, which the website, the admin and the
     Firestore seed script (scripts/seed-firestore.mjs) all read.

Usage (from the repo root):
    python scripts/build_catalog.py            # 20 products per category
    python scripts/build_catalog.py --per-category 40
"""
import argparse
import csv
import glob
import json
import os
import re
import shutil
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE_DIR = os.path.join(ROOT, "product folder")
PUBLIC_DIR = os.path.join(ROOT, "public", "products")
CATALOG_PATH = os.path.join(ROOT, "src", "data", "catalog.json")
# Hand-picked photos that replace a product's downloaded ones:
# <this folder>/<supplier ProductId>/image_1.jpg (see SOURCES.json for origins)
REPLACEMENT_DIR = os.path.join(SOURCE_DIR, "_replacement_images")

MAX_IMAGE_SIDE = 700
JPEG_QUALITY = 76
MAX_IMAGES_PER_PRODUCT = 3

CATEGORIES = [
    {
        "id": "candy",
        "title": "Candy",
        "folder": "Candy products",
        "csv": ["Candy products_List.csv"],
        "description": "Exotic candies, chocolates, gummies and freeze-dried treats from around the world",
        "storage": "Store in a cool, dry place away from direct sunlight",
    },
    {
        "id": "snacks",
        "title": "Snacks",
        "folder": "Snacks products",
        "csv": ["Snacks products_List_Page 1.csv", "Snacks products_List_Page 2.csv"],
        "description": "Imported chips, crackers, noodles and savory snacks in rare international flavors",
        "storage": "Store in a cool, dry place away from direct sunlight",
    },
    {
        "id": "carbonated-drinks",
        "title": "Carbonated Drinks",
        "folder": "Carbonated Drinks",
        "csv": ["Carbonated Drinks_List.csv"],
        "description": "International sparkling drinks and limited-edition colas",
        "storage": "Best served chilled. Store away from direct sunlight",
    },
    {
        "id": "exotic-soda",
        "title": "Exotic Soda",
        "folder": "Exotic Soda",
        "csv": ["Exotic Soda_List.csv"],
        "description": "Rare soda flavors imported from Asia, Europe and Latin America",
        "storage": "Best served chilled. Store away from direct sunlight",
    },
    {
        "id": "exotic-energy-drinks",
        "title": "Exotic Energy Drinks",
        "folder": "Exotic Energy Drink",
        "csv": ["Exotic Energy Drink_List.csv"],
        "description": "Imported energy drinks and international editions you won't find locally",
        "storage": "Best served chilled. Store away from direct sunlight",
    },
]

ORIGIN_KEYWORDS = [
    (r"\bjapan(ese)?\b", "🇯🇵 Japan"),
    (r"\bkorea(n)?\b", "🇰🇷 Korea"),
    (r"\bchin(a|ese)\b", "🇨🇳 China"),
    (r"\btaiwan(ese)?\b", "🇹🇼 Taiwan"),
    (r"\bthai(land)?\b", "🇹🇭 Thailand"),
    (r"\bindia(n)?\b", "🇮🇳 India"),
    (r"\bmexic(o|an)\b", "🇲🇽 Mexico"),
    (r"\bvietnam(ese)?\b", "🇻🇳 Vietnam"),
    (r"\bturk(ey|ish)\b", "🇹🇷 Turkey"),
    (r"\bgerman(y)?\b", "🇩🇪 Germany"),
    (r"\b(uk|british)\b", "🇬🇧 United Kingdom"),
    (r"\bital(y|ian)\b", "🇮🇹 Italy"),
    (r"\bfrench|france\b", "🇫🇷 France"),
    (r"\bbrazil(ian)?\b", "🇧🇷 Brazil"),
    (r"\bphilippine(s)?|filipino\b", "🇵🇭 Philippines"),
    (r"\bindonesia(n)?\b", "🇮🇩 Indonesia"),
    (r"\bmalaysia(n)?\b", "🇲🇾 Malaysia"),
    (r"\bpakistan(i)?\b", "🇵🇰 Pakistan"),
    (r"\bdubai|arab(ic|ian)?\b", "🇦🇪 Middle East"),
    (r"\baustria(n)?\b", "🇦🇹 Austria"),
    (r"\brussia(n)?\b", "🇷🇺 Russia"),
    (r"\bpol(and|ish)\b", "🇵🇱 Poland"),
    (r"\bserbia(n)?\b", "🇷🇸 Serbia"),
    (r"\bspain|spanish\b", "🇪🇸 Spain"),
]

# Words that come before the brand in supplier names ("Exotic Japanese MONSTER")
NON_BRAND_PREFIXES = {"exotic", "whp", "the", "new", "mini", "big"}
COUNTRY_WORDS = {
    "japanese", "korean", "chinese", "taiwanese", "thai", "indian", "mexican",
    "vietnamese", "turkish", "german", "british", "uk", "italian", "french",
    "brazilian", "filipino", "indonesian", "malaysian", "pakistani", "arabic",
    "dubai", "asian", "european",
}

SIZE_RE = re.compile(
    r"(\d+(?:\.\d+)?)\s*(oz|fl\.?\s*oz|gm|g|gr|grams?|kg|ml|l|ltr|ct|pcs|pc)\b\.?",
    re.IGNORECASE,
)


# Manual image review of the downloaded photos (the downloader sometimes grabbed
# toys, other brands or watermarked stock photos). Maps supplier ProductId to the
# image numbers to keep, in display order. An empty list excludes the product.
IMAGE_REVIEW = {
    "302985": [1],        # Cinnamoroll Lemonade: 2-3 are toy cups
    "303618": [],         # Pochacco: all images are toys/merch
    "303622": [2],        # Bunni Konbiny: 1 is a plush, 3 a figurine set
    "312709": [1],        # Godzilla soda: 2-3 are statues
    "303848": [],         # X TURBO Berry Boost: images show another brand (BOOST)
    "303847": [3],        # X TURBO Jungle Buff: 1-2 are blurry hand-held photos
    "308565": [2],        # Monster Passion Fruit Guava: 1 and 3 are vape liquid
    "308567": [1],        # Monster Original: 2-3 are Monster Ultra White
    "312697": [1, 2],     # Red Bull Purple: 3 is a promo graphic
    "312605": [1, 3],     # Mtn Dew can: 2 is a watermarked stock photo
    "310984": [1, 3],     # Pepsi can: 2 is a watermarked stock photo
    "312690": [1, 2],     # Monster Ultra Paradise: 3 is watermarked
    "229562": [2, 3],     # Carolina Kettle Sea Salt: 1 is another brand
    "303623": [],         # Transformers soda: all images are toys
    "303846": [1],        # X TURBO Mango: 2-3 are other brands
    # Review of products 21-50 per category
    "320033": [1],        # PANDA Bobo Soda: 2 toy box, 3 can cooler
    "320037": [],         # Wrigley's Iced Guava Tea: generic gum photos
    "321431": [1],        # Jasmine Rose Green Plums: 2-3 are fresh fruit
    "320036": [1, 2],     # ORION Pink Guava: 3 is a banner
    "321891": [],         # Wrigley's Coffee gum: generic gum photos
    "263467": [],         # Fortune Choice Mochi: mixed unrelated products
    "314604": [1, 2],     # Cheetos Smoky BBQ: 3 watermarked
    "314605": [2, 3],     # Cheetos Spicy & Sweet: 1 is a variety box
    "318680": [2],        # Pocky Blueberry: other images wrong/transparent
    "308161": [],         # Hershey's Chocolate Drink: images are syrup/cocoa
    "308162": [2],        # Hershey's Cookies & Cream Drink: 1, 3 are candy bars
    "264420": [2, 3],     # Mirinda Grape: 1 is vape liquid
    "264660": [],         # "Sushi Depot Products": not a product
    "291140": [1, 2],     # Starbucks Oolong Latte: 3 watermarked
    "302986": [1, 2],     # Hello Kitty Strawberry: 3 is a water bottle
    "319363": [],         # Japanese Daifuku collectible: toys/merch
    "310985": [],         # Sanrio collectible: merch
    "304123": [],         # Kuromi 50th: figurines
    "304151": [1, 3],     # Lemon Warabimochi: 2 is a toy
    "308174": [1],        # Marvel 330 Ml: 2 mug, 3 box
    "304148": [],         # Marvel Q VER2: action figures
    "304122": [],         # Sanrio Characters: merch
    "304150": [],         # Collectible Soda ORG: mixed/unrelated
    "303619": [],         # Super Soldier: blank pouch photos
    "310510": [2, 3],     # Fanta Jasmine Peach slim: 1 is a different can
    "312761": [1, 2],     # Tsubumi Aloe: 3 is generic bottle
    "306273": [1, 2],     # Pokka Orange: 3 watermarked
    "311098": [2],        # Red Bull Vitamin: 1, 3 are multi-packs
    "263943": [2, 3],     # Fortune Mochi Strawberry: 1 is a mixed gift set
    "298520": [2, 3],     # Jammie Dodgers: 1 watermarked
    "309249": [],         # KitKat Cacao: assortment ads only
    "310621": [1, 2],     # Fanta Lychee slim: 3 watermarked
    "320739": [1, 3],     # Fanta Sarsi: 2 is another flavor
    "310625": [1, 2],     # Minute Maid Rose & Grape: 3 is another flavor
    # Review of the 6-category expansion
    "243075": [],
    "243074": [],
    "243073": [],
    "243071": [],
    "243072": [],
    "306272": [],
    "318748": [2],
    "263465": [],
    "303747": [],
    "265612": [1, 2],
    "303047": [2, 3],
    "310724": [1],
    "314625": [1, 2],
    "298524": [2, 3],
    "303880": [2, 3],
    "152023": [2, 3],     # Rancheritos: 1 is sour cream
    "228161": [1],        # Beef Jerky Garlic Ginger: 2-3 other jerky
    "310974": [1, 3],     # Koikeya Plum: 2 is another flavor
    "298519": [1, 3],     # Haribo Konfekt: 2 is Lakritz Parade
    "180435": [1, 3],     # Chomis Chamoy Kids: 2 is another flavor
    # Review of the full catalog (all remaining products)
    "292626": [],
    "304628": [],
    "263747": [3],
    "275950": [1, 3],
    "303878": [2],
    "303877": [1],
    "310723": [1],
    "263483": [2, 3],
    "310648": [1, 3],
    "223774": [1, 2],
    "228612": [2, 3],
    "249337": [2, 3],
    "307100": [1, 2],
    "228609": [3],
    "310718": [1, 2],
    "304121": [1, 3],
    "229744": [1, 2],
    "159797": [2, 3],
    "309625": [1, 2],
    "281518": [2, 3],
    "302968": [2, 3],
    "305638": [1, 3],
    "320164": [1, 3],
    "320165": [2],
    "320163": [1, 3],
    "260464": [2, 3],
    "305640": [1, 3],
    "258344": [2, 3],
    "231413": [1, 2],
    "290877": [1, 2],
    "304681": [1],
    "242304": [1, 2],
    "228162": [2, 3],
    "228159": [1],
    "241349": [1, 2],
    "263945": [2, 3],
}


def folder_name_for(name: str, product_id: str) -> str:
    """Same rule the image downloader used to name each product folder."""
    cleaned = re.sub(r'[\\/:*?"<>|]', "_", name).strip(" .")
    if not cleaned:
        cleaned = f"Product_{product_id}"
    if len(cleaned) > 100:
        cleaned = cleaned[:100].strip(" .")
    return cleaned


TRAILING_CODE_RE = re.compile(r"(\s*[-–]?\s*\d{5,})+\s*$")


def display_name(name: str) -> str:
    """Supplier names often end in internal item codes ("... 80 GM. - 07935"); drop them."""
    title = name.strip().rstrip(".").strip()
    title = TRAILING_CODE_RE.sub("", title).strip(" .-–")
    return re.sub(r"\s{2,}", " ", title) or name.strip()


def slugify(text: str) -> str:
    text = text.lower().replace("’", "").replace("'", "")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:70].strip("-")


def to_float(value) -> float:
    try:
        return float(str(value).strip() or 0)
    except ValueError:
        return 0.0


def to_int(value, default=1) -> int:
    try:
        return int(float(str(value).strip()))
    except ValueError:
        return default


def brand_key(name: str) -> str:
    """First meaningful word of the name, used only to spread picks across brands."""
    for word in re.split(r"\s+", name.lower()):
        w = word.strip(".,-’'")
        if w and w not in NON_BRAND_PREFIXES and w not in COUNTRY_WORDS:
            return w
    return name.lower()


def detect_origin(name: str) -> str:
    for pattern, label in ORIGIN_KEYWORDS:
        if re.search(pattern, name, re.IGNORECASE):
            return label
    return "🌍 Imported"


def detect_size(name: str) -> str:
    match = SIZE_RE.search(name)
    if not match:
        return ""
    unit = match.group(2).upper().replace("GM", "g").replace("GRAMS", "g").replace("GRAM", "g")
    unit = {"G": "g", "GR": "g", "OZ": "oz", "ML": "ml", "L": "L", "LTR": "L", "KG": "kg",
            "CT": "ct", "PCS": "pcs", "PC": "pc"}.get(unit, unit.lower())
    return f"{match.group(1)} {unit}"


def is_retail_row(row: dict) -> bool:
    name = row["ProductName"]
    sale = to_float(row["SalePrice"])
    srp = to_float(row["SuggestedRetailPrice"])
    if re.search(r"purchas|wholesale|distro products|^WHP\b", name.strip(), re.IGNORECASE):
        return False
    if row.get("IsActive", "True").strip() != "True":
        return False
    if sale <= 0 or srp <= 0 or srp < sale:
        return False
    return True


def read_rows(category: dict) -> list[dict]:
    rows = []
    for csv_name in category["csv"]:
        with open(os.path.join(SOURCE_DIR, csv_name), encoding="utf-8-sig", newline="") as fh:
            rows.extend(csv.DictReader(fh))
    return rows


def source_images(category: dict, row: dict) -> list[str]:
    replacements = sorted(glob.glob(os.path.join(REPLACEMENT_DIR, row["ProductId"].strip(), "image_*.jpg")))
    if replacements:
        return replacements[:MAX_IMAGES_PER_PRODUCT]
    folder = os.path.join(SOURCE_DIR, category["folder"],
                          folder_name_for(row["ProductName"].strip(), row["ProductId"]))
    files = sorted(glob.glob(os.path.join(folder, "image_*.jpg")))
    keep = IMAGE_REVIEW.get(row["ProductId"].strip())
    if keep is not None:
        by_number = {int(re.search(r"image_(\d+)", f).group(1)): f for f in files}
        files = [by_number[n] for n in keep if n in by_number]
    return files[:MAX_IMAGES_PER_PRODUCT]


def pick_products(category: dict, rows: list[dict], limit: int) -> list[tuple[dict, list[str]]]:
    candidates, seen_names = [], set()
    for row in rows:
        name_key = display_name(row["ProductName"]).lower()
        if name_key in seen_names or not is_retail_row(row):
            continue
        images = source_images(category, row)
        if not images:
            continue
        seen_names.add(name_key)
        candidates.append((row, images))
    return select_spread(candidates, limit)


def select_spread(candidates: list, limit: int) -> list:
    """Take up to `limit` items, at most 2 per brand first, then top up."""
    picked, per_brand = [], {}
    for row, images in candidates:            # pass 1: max 2 per brand
        key = brand_key(row["ProductName"])
        if per_brand.get(key, 0) < 2:
            picked.append((row, images))
            per_brand[key] = per_brand.get(key, 0) + 1
        if len(picked) == limit:
            return picked
    for item in candidates:                   # pass 2: top up if a category is small
        if item not in picked:
            picked.append(item)
        if len(picked) == limit:
            break
    return picked


def export_image(src: str, dest: str) -> None:
    with Image.open(src) as img:
        img = img.convert("RGB")
        img.thumbnail((MAX_IMAGE_SIDE, MAX_IMAGE_SIDE), Image.LANCZOS)
        img.save(dest, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)


def build_product(category: dict, row: dict, images: list[str], position: int) -> dict:
    pid = row["ProductId"].strip()
    supplier_name = row["ProductName"].strip()
    title = display_name(supplier_name)
    product_id = f"{slugify(title)}-{pid}"
    retail = round(to_float(row["SuggestedRetailPrice"]), 2)
    wholesale = round(to_float(row["SalePrice"]), 2)
    case_qty = max(to_int(row["UnitPerCase"], 1), 1)
    size = detect_size(title)
    origin = detect_origin(title)
    barcode = row["Barcode"].strip()

    image_dir = os.path.join(PUBLIC_DIR, category["id"], pid)
    os.makedirs(image_dir, exist_ok=True)
    urls = []
    for idx, src in enumerate(images, start=1):
        export_image(src, os.path.join(image_dir, f"{idx}.jpg"))
        urls.append(f"/products/{category['id']}/{pid}/{idx}.jpg")

    description = f"{title} from Ruby Red's {category['title']} collection."
    if size:
        description += f" Pack size: {size}."
    description += " Available for retail orders and wholesale by the case."

    bullets = [b for b in [
        f"Pack size: {size}" if size else "",
        f"Origin: {origin.split(' ', 1)[1]}" if origin != "🌍 Imported" else "Imported specialty product",
        f"Wholesale case: {case_qty} unit{'s' if case_qty != 1 else ''}",
        f"UPC / Barcode: {barcode}" if barcode else "",
    ] if b]

    return {
        "id": product_id,
        "sku": pid,
        "barcode": barcode,
        "title": title,
        "name": title,
        "supplierName": supplier_name,
        "categoryId": category["id"],
        "categoryName": category["title"],
        "brand": "",
        "origin": origin,
        "netWeight": size,
        "unit": (row.get("Unit") or "ea.").strip() or "ea.",
        "retailPrice": retail,
        "price": retail,
        "originalPrice": retail,
        "wholesalePrice": wholesale,
        "b2bPrice": wholesale,
        "caseQty": case_qty,
        "moq": 1,
        "stock": 100,
        "stockCount": 100,
        "inStock": True,
        "hidden": pid in HIDDEN_PRODUCTS,
        "taxable": row.get("IsTaxable", "False").strip() == "True",
        "featured": position < 3,
        "sortOrder": position,
        "img": urls[0],
        "image": urls[0],
        "gallery": urls,
        "shortDesc": description,
        "fullDesc": description,
        "description": description,
        "flavors": [],
        "overview": {
            "origin": origin,
            "netWeight": size,
            "brand": "",
            "flavor": "",
            "shelfLife": "",
            "storage": category["storage"],
        },
        "bullets": bullets,
        "source": "supplier-csv",
    }


# The 6 storefront categories. Supplier CSVs above are only *sources*; each
# product is placed in a storefront category by keywords in its name.
DRY_STORAGE = "Store in a cool, dry place away from direct sunlight"
STORE_CATEGORIES = [
    {"id": "exotic-beverages", "title": "Exotic Beverages",
     "description": "Fanta, Coke, Monster, Ramune and more",
     "storage": "Best served chilled. Store away from direct sunlight"},
    {"id": "chips-snacks", "title": "Exotic Chips & Snacks",
     "description": "International flavors and specialties", "storage": DRY_STORAGE},
    {"id": "chocolates", "title": "Chocolates",
     "description": "KitKat, Milka, Aero and more", "storage": DRY_STORAGE},
    {"id": "candies-gums", "title": "Candies & Gums",
     "description": "Global candy and chewing gum varieties", "storage": DRY_STORAGE},
    {"id": "mochi-soft-cakes", "title": "Mochi & Soft Cakes",
     "description": "Asian dessert specialties", "storage": DRY_STORAGE},
    {"id": "cookies-biscuits", "title": "Cookies & Biscuits",
     "description": "European and Asian cookies, biscuits and wafers", "storage": DRY_STORAGE},
]
DRINK_SOURCES = {"carbonated-drinks", "exotic-soda", "exotic-energy-drinks"}
# Products the client doesn't currently sell (supplier ProductId). They stay in the
# catalog and the admin panel, but the storefront doesn't show them.
HIDDEN_PRODUCTS = {
    "263947",   # HELLO Kitty Ramune Strawberry 200 Ml
    "228244",   # Carolina Kettle Coastal Crab Boil 2 Oz
    "303876",   # BABAEVSKIY Dark Choc with Crispy Orange & Cherry 85 GR
    "228378",   # ARCTIC Freeze Dried - Hot Reds 2.5 Oz
    "303828",   # CHAO YOU WEI Mochi Mango Flavor 126 GM
    "272076",   # Milka OREO Chocolate
}
# Category images: a top-selling product with a clean photo (supplier ProductId)
CATEGORY_COVERS = {
    "exotic-beverages": "272750",   # Japanese Fanta White Peach 300 Ml
    "chips-snacks": "223763",       # Lay's Spicy Crayfish 70 GM
    "chocolates": "298414",         # Japanese KitKat Strawberry 10 Pcs
    "candies-gums": "187217",       # Chomis Gomis Gushers
    "mochi-soft-cakes": "272078",   # Balconi Hazelnut Cream Roll 250 GM
    "cookies-biscuits": "231412",   # Oreo Birthday Cake
}

# Checked in order; first match wins
CLASSIFY_RULES = [
    ("exotic-beverages", r"\b(drink|soda|juice|latte|cola|lemonade|ramune|\d+\s*ml)\b"),
    ("chips-snacks", r"popcorn"),
    ("mochi-soft-cakes", r"mochi|daifuku|choco ?pie|cream roll|today roll|swiss roll|sponge|cupcake|custard|\bcake\b(?!.*chocolate)"),
    ("cookies-biscuits", r"oreo|cookie|biscuit|wafer|waffle|pocky|macaron|pastry|sfogliatine|vafel|filbi|delicje|dodgers|hide & seek|bisconni|jaffa"),
    ("chocolates", r"ritter|choc|kit ?kat|milka|hershey|bon o bon|chocart|bananko|schoko|nusso|toblerone|aero|kinder|snickers|twix|m&m"),
    ("chips-snacks", r"kettle|jerky|ritz|rancherito|koikeya"),
    ("candies-gums", r"halva|marmalade|lakritz|licorice|liquorice|gum\b|gummy|gummies|candy|candies|hi-?chew|chupa|haribo|drop|mint|chew|freeze dried|plum|lollipop|jelly|marshmallow|chomis|kuikas|kozed|kalfany"),
    ("chips-snacks", r"kettle|jerky|ritz|rancherito|koikeya|chip|crisp|dorito|cheeto|lay|ramen|noodle|snack|cracker|frito|churrumais|crujito|calbee|taro|cadina"),
]


# Manual category fixes where the name keywords mislead (supplier ProductId -> category)
CATEGORY_OVERRIDES = {
    "228244": "chips-snacks",   # Carolina Kettle Coastal Crab Boil (chips in candy CSV)
    "228247": "chips-snacks",   # Carolina Kettle Cozumel Jalapeño Queso
    "320033": "candies-gums",   # PANDA Bobo Soda & Apple candy
    "306267": "candies-gums",   # KABAYA TOUGH Gummy Cola Lemon
    "265611": "chocolates",     # ChoCart Dubai Chocolate Cheese Cake bar
    "264842": "candies-gums",
    "304084": "candies-gums",
    "320748": "candies-gums",
    "264844": "candies-gums",
    "312760": "candies-gums",
    "301186": "chocolates",
    "234006": "cookies-biscuits",
    "272130": "chocolates",
    "228614": "cookies-biscuits",
    "245122": "cookies-biscuits",  # NABISCO Korean Ritz Sandwich Cracker CHOCO
    "223776": "cookies-biscuits",  # Ritz Cheese Sandwich Crackers
    "234007": "cookies-biscuits",  # Ritz Cracker LEMON
    "242304": "cookies-biscuits",  # Ritz Lemon Small 2 Rolls
    "242232": "cookies-biscuits",
    "234008": "cookies-biscuits",
    "305632": "mochi-soft-cakes",
    "319378": "cookies-biscuits",
    "271364": "chocolates",
    "228158": "chips-snacks",
    "228160": "chips-snacks",
    "307772": "chocolates",
    "228243": "chips-snacks",
    "228246": "chips-snacks",
    "232965": "cookies-biscuits",
    "231412": "cookies-biscuits",
    "313943": "chips-snacks",
    "283597": "cookies-biscuits",
    "321708": "chocolates",
    "314596": "mochi-soft-cakes",  # ORION Fresh Berry Pie
}


def classify(name: str, source_id: str, product_id: str = "") -> str:
    if product_id in CATEGORY_OVERRIDES:
        return CATEGORY_OVERRIDES[product_id]
    if source_id in DRINK_SOURCES:
        return "exotic-beverages"
    lowered = name.lower()
    for target, pattern in CLASSIFY_RULES:
        if re.search(pattern, lowered):
            return target
    return "candies-gums" if source_id == "candy" else "chips-snacks"


# Words to skip when finding the brand a product is listed under on the shop
# pages: origins and parent companies ("Exotic Japanese Kitkat", "Nestle Aero").
FLOW_SKIP_WORDS = NON_BRAND_PREFIXES | COUNTRY_WORDS | {
    "imported", "austrian", "russian", "spanish", "swedish", "polish",
    "nestle", "nabisco", "glico", "fritolay", "haitai", "choc", "chocolate",
}
FLOW_BRAND_ALIASES = {"fants": "fanta", "coca": "coke"}


def flow_key(title: str) -> tuple[str, str]:
    """Sort key that lists every product of a brand together: (brand, rest of the name)."""
    words = re.sub(r"['’�]s", "", title.lower()).split()
    while words and (words[0].strip(".,-") in FLOW_SKIP_WORDS or words[0].isdigit()):
        words.pop(0)
    if not words:
        return (title.lower(), "")
    brand = words[0].strip(".,-")
    return (FLOW_BRAND_ALIASES.get(brand, brand), " ".join(words[1:]))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--per-category", type=int, default=20,
                        help="products per storefront category")
    args = parser.parse_args()

    if os.path.isdir(PUBLIC_DIR):
        shutil.rmtree(PUBLIC_DIR)
    os.makedirs(PUBLIC_DIR)

    # Pool every usable row from every supplier CSV, sort it into a storefront
    # category, then take up to N per category. Each product keeps the data
    # and images of its own CSV row.
    pool = {c["id"]: [] for c in STORE_CATEGORIES}
    seen_ids = set()
    bev_by_source = {}
    for source in CATEGORIES:
        for row, imgs in pick_products(source, read_rows(source), 10**6):
            pid = row["ProductId"].strip()
            if pid in seen_ids:
                continue
            seen_ids.add(pid)
            target = classify(row["ProductName"], source["id"], pid)
            pool[target].append((row, imgs))
            if target == "exotic-beverages":
                bev_by_source.setdefault(source["id"], []).append((row, imgs))
    # Beverages: alternate between the drink CSVs so sodas, colas and energy
    # drinks (Monster, Red Bull) all get a share of the 50 slots
    queues = [list(q) for q in bev_by_source.values()]
    pool["exotic-beverages"] = [q.pop(0) for _ in range(max(map(len, queues), default=0)) for q in queues if q]
    by_target = {cid: select_spread(items, args.per_category) for cid, items in pool.items()}

    categories, products = [], []
    for order, target in enumerate(STORE_CATEGORIES):
        cat_products = [build_product(target, row, imgs, i) for i, (row, imgs) in enumerate(by_target[target["id"]])]
        products.extend(cat_products)
        # "featured" comes from the selection order above; only the listing order
        # is by brand
        cover = next((p["img"] for p in cat_products if p["sku"] == CATEGORY_COVERS.get(target["id"])), None)
        cover = cover or (cat_products[0]["img"] if cat_products else "/images/cat_snacks.jpg")
        cat_products.sort(key=lambda p: flow_key(p["title"]))
        for sort_order, product in enumerate(cat_products):
            product["sortOrder"] = sort_order
        categories.append({
            "id": target["id"],
            "title": target["title"],
            "name": target["title"],
            "img": cover,
            "image": cover,
            "description": target["description"],
            "itemCount": sum(not p["hidden"] for p in cat_products),
            "sortOrder": order,
        })
        print(f"{target['title']:<24} {len(cat_products):>3} products")

    os.makedirs(os.path.dirname(CATALOG_PATH), exist_ok=True)
    with open(CATALOG_PATH, "w", encoding="utf-8") as fh:
        json.dump({"version": f"store6-{args.per_category}-v4",
                   "categories": categories, "products": products},
                  fh, ensure_ascii=False, indent=2)

    total_bytes = sum(os.path.getsize(p) for p in glob.glob(os.path.join(PUBLIC_DIR, "**", "*.jpg"), recursive=True))
    print(f"\nWrote {len(products)} products to {os.path.relpath(CATALOG_PATH, ROOT)}")
    print(f"Images: public/products/ ({total_bytes / 1_048_576:.1f} MB)")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
