import urllib.request
import json
import os

req = urllib.request.urlopen("http://localhost:8000/products")
data = json.loads(req.read().decode('utf-8'))
products = data.get('data', [])

print(f"Total products from API: {len(products)}")

fallback_urls = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1605335520442-70b8095bdf35?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1580974852861-c381510bc98a?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1542838132-92c53300491e"
]

def is_hq(product):
    img = product.get('image', '')
    if not img: return False
    img = img.strip()
    if not img: return False
    if img.startswith("/assets/categories/"): return False
    if "unsplash.com" in img: return False
    for f in fallback_urls:
        if f in img: return False
    if "/images/W/" in img: return False

    # Check local files to see if they are fake 404s
    if img.startswith("/assets/products/"):
        local_path = os.path.join(r"C:\Users\srika\OneDrive\Desktop\LifeGraph_official\frontend\public", img.lstrip("/"))
        if not os.path.exists(local_path): return False
        if os.path.getsize(local_path) < 100: return False # 404 HTML bytes
    
    return True

hq_products = [p for p in products if is_hq(p)]
print(f"Total HQ products: {len(hq_products)}")

buckets = {
    "Movie Night": ["chip", "popcorn", "chocolate", "soda", "drink", "cola", "beverage", "snack", "nacho", "wafer", "biscuit", "cookie"],
    "Weight Loss Journey": ["oat", "seed", "green tea", "healthy", "peanut butter", "protein", "muesli", "almond", "millet", "quinoa"],
    "Healthy Breakfast": ["oat", "muesli", "granola", "milk", "juice", "honey", "jam", "spread", "bread", "butter", "coffee", "tea", "corn flakes"],
    "Student Late Night Study": ["coffee", "noodle", "energy", "biscuit", "cookie", "maggi", "tea", "snack", "chip", "chocolate", "wafer", "red bull"],
    "Travel Snacks": ["chip", "snack", "juice", "biscuit", "cookie", "wafer", "namkeen", "dry fruit", "nut"],
    "Immunity Boost": ["amla", "honey", "green tea", "turmeric", "ginger", "tulsi", "seed", "healthy", "almond", "dry fruit", "chyawanprash"],
    "Baking a Cake": ["flour", "maida", "sugar", "cocoa", "chocolate", "milk", "butter", "essence", "baking", "powder", "syrup"],
    "Festival Preparation": ["ghee", "sweet", "dry fruit", "nut", "almond", "cashew", "raisin", "pooja", "oil", "agarbatti", "saffron", "cardamom"]
}

mission_pools = {k: [] for k in buckets.keys()}

for p in hq_products:
    name = p.get('name', '').lower()
    cat = p.get('category', '').lower()
    desc = p.get('description', '').lower()
    search_text = name + " " + cat + " " + desc
    
    for mission, keywords in buckets.items():
        if any(kw in search_text for kw in keywords):
            mission_pools[mission].append({
                "id": p.get("id"),
                "name": p.get("name"),
                "category": p.get("category"),
                "image": p.get("image")
            })

with open(r"C:\Users\srika\OneDrive\Desktop\LifeGraph_official\scratch\mission_hq_pools.json", "w") as f:
    json.dump(mission_pools, f, indent=2)

for m, items in mission_pools.items():
    print(f" - {m}: {len(items)} items")

