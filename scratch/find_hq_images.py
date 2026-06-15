import json
import os
import glob

base_dir = r"C:\Users\srika\OneDrive\Desktop\LifeGraph_official"
products_file = os.path.join(base_dir, "products.json")
img_dir = os.path.join(base_dir, "frontend", "public", "assets", "products")

print(f"Checking images in {img_dir}...")

with open(products_file, 'r', encoding='utf-16') as f:
    data = json.load(f)

products = list(data.values()) if isinstance(data, dict) else data

hq_products = []
for p in products:
    pid = p.get('id', '')
    if not pid: continue
    
    # Check if image exists
    img_exists = False
    for ext in ['.jpg', '.jpeg', '.png', '.webp']:
        if os.path.exists(os.path.join(img_dir, pid + ext)):
            img_exists = True
            break
    
    if img_exists:
        hq_products.append(p)

print(f"Total True HQ Products with actual image files: {len(hq_products)}")

# Let's organize them into buckets for our 8 missions to make curation easy
buckets = {
    "movie_night": ["chip", "popcorn", "chocolate", "soda", "drink", "cola", "beverage", "snack", "nacho", "wafer", "biscuit", "cookie"],
    "weight_loss": ["oat", "seed", "green tea", "healthy", "peanut butter", "protein", "muesli", "almond", "millet", "quinoa"],
    "breakfast": ["oat", "muesli", "granola", "milk", "juice", "honey", "jam", "spread", "bread", "butter", "coffee", "tea"],
    "study": ["coffee", "noodle", "energy", "biscuit", "cookie", "maggi", "tea", "snack", "chip", "chocolate", "wafer"],
    "travel": ["chip", "snack", "juice", "biscuit", "cookie", "wafer", "namkeen", "dry fruit", "nut"],
    "immunity": ["amla", "honey", "green tea", "turmeric", "ginger", "tulsi", "seed", "healthy", "almond", "dry fruit", "chyawanprash"],
    "baking": ["flour", "maida", "sugar", "cocoa", "chocolate", "milk", "butter", "essence", "baking", "powder", "syrup"],
    "festival": ["ghee", "sweet", "dry fruit", "nut", "almond", "cashew", "raisin", "pooja", "oil", "agarbatti", "saffron", "cardamom"]
}

mission_pools = {k: [] for k in buckets.keys()}

for p in hq_products:
    name = p.get('name', '').lower()
    cat = p.get('category', '').lower()
    desc = p.get('description', '').lower()
    search_text = name + " " + cat + " " + desc
    
    for mission, keywords in buckets.items():
        if any(kw in search_text for kw in keywords):
            mission_pools[mission].append(p)

# Write results
out_file = os.path.join(base_dir, "scratch", "mission_pools.json")
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(mission_pools, f, indent=2)

print("Saved mission pools to scratch/mission_pools.json")
for m, items in mission_pools.items():
    print(f" - {m}: {len(items)} items")
