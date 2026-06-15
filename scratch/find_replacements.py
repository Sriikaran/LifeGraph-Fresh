import json
import re
import os

artifact_dir = r"C:\Users\srika\.gemini\antigravity-ide\brain\6122a41d-195e-48af-8c3c-d5f5a2eba867"

with open(os.path.join(artifact_dir, "inventory_full.json"), "r", encoding='utf-8') as f:
    all_products = json.load(f)

# The previous script generated image_classification dynamically. Let's just use the hq_products_only.md
unique_ids = set()
with open(os.path.join(artifact_dir, "hq_products_only.md"), "r", encoding='utf-8') as f:
    for line in f:
        match = re.search(r'\(`([^`]+)`\)', line)
        if match:
            unique_ids.add(match.group(1))

hq_products = [p for p in all_products if p['product_id'] in unique_ids]

def search_hq(keywords, exclude=None, limit=20):
    if exclude is None: exclude = []
    results = []
    for p in hq_products:
        name = p['product_name'].lower()
        sub = p.get('subcategory', '').lower()
        cat = p.get('category', '').lower()
        
        # Check exclusions
        if any(ex.lower() in name or ex.lower() in sub for ex in exclude):
            continue
            
        # Check inclusions
        if any(kw.lower() in name or kw.lower() in sub for kw in keywords):
            results.append(p)
            if len(results) >= limit:
                break
    return results

# Let's map new missions
missions_new = {
    "Healthy Breakfast": {
        "keywords": ["granola", "muesli", "oats", "oat", "peanut butter", "chia", "pumpkin seed", "green tea", "coffee", "juice", "almond", "walnut"],
        "exclude": ["chocolate", "choco", "candy", "dessert", "cookie", "biscuit", "dairy milk", "toblerone", "galaxy", "pie", "sugar"],
    },
    "Movie Night": {
        "keywords": ["popcorn", "chip", "nacho", "chocolate", "cookie", "biscuit", "drink", "juice", "candy", "cola", "wafer", "oreo", "lays", "doritos"],
        "exclude": ["electrolyte", "herbalife", "tulsi", "seed", "pumpkin", "chia", "wellness", "tea", "coffee", "health", "diet", "protein", "millet"],
    },
    "Student Late Night Study": {
        "keywords": ["coffee", "energy drink", "chocolate", "oreo", "biscoff", "biscuit", "cookie", "noodle", "stick", "chip", "wafer"],
        "exclude": ["pantothenic", "thyroid", "immunity", "wellness", "detox", "supplement", "weight", "diet", "slimming", "capsule", "medicine"],
    },
    "Weight Loss Journey": {
        "keywords": ["oat", "chia", "pumpkin", "green tea", "millet", "protein", "nut", "makhana", "almond", "walnut"],
        "exclude": ["peanut butter with dates", "diabetic juice", "amla juice", "ayurvedic", "chocolate", "candy", "sugar", "cookie", "biscuit", "sweet", "dessert"],
    },
    "Festival Preparation": {
        "keywords": ["ghee", "coconut oil", "camphor", "dry fruit", "palm candy", "fennel", "cashew", "almond", "walnut", "nut", "raisin", "sweet", "pooja", "agarbatti"],
        "exclude": ["chip", "chocolate", "biscuit", "cookie", "snack", "popcorn", "wafer", "noodle"],
    },
    "Travel Snacks": {
        "keywords": ["wafer", "popz", "biscuit", "cookie", "nut", "dry fruit", "juice", "drink", "candy", "cracker", "chip"],
        "exclude": ["raw", "flour", "oil", "ghee", "tea bag", "coffee bean"],
    }
}

for m_name, rules in missions_new.items():
    pool = search_hq(rules["keywords"], rules["exclude"], 30)
    print(f"\n--- {m_name} ({len(pool)} found) ---")
    for i, p in enumerate(pool[:20]):
        print(f"{i+1}. {p['product_name']}")
