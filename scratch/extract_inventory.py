import urllib.request
import json
import csv
import os
from collections import Counter

# Fetch products
req = urllib.request.urlopen("http://localhost:8000/products")
data = json.loads(req.read().decode('utf-8'))
products = data.get('data', [])

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

def get_image_type(img_url):
    if not img_url: return "Fallback"
    img_url = img_url.strip()
    if not img_url: return "Fallback"
    if img_url.startswith("/assets/categories/"): return "Priority 3"
    if "unsplash.com" in img_url: return "Priority 3"
    if "/images/W/" in img_url: return "Priority 3"
    for f in fallback_urls:
        if f in img_url: return "Fallback"
        
    if img_url.startswith("/assets/products/"):
        local_path = os.path.join(r"C:\Users\srika\OneDrive\Desktop\LifeGraph_official\frontend\public", img_url.lstrip("/"))
        if not os.path.exists(local_path): return "Priority 3" # missing local image
        if os.path.getsize(local_path) < 100: return "Priority 3" # 404 HTML bytes
        return "Priority 1"
        
    return "Priority 2"

exported_inventory = []
for p in products:
    exported_inventory.append({
        "product_id": p.get("id", ""),
        "product_name": p.get("name", ""),
        "category": p.get("category", ""),
        "subcategory": p.get("subcategory", ""),
        "brand": p.get("brand", ""),
        "price": p.get("price", 0),
        "rating": p.get("rating", 0),
        "image_url": p.get("image", ""),
        "image_type": get_image_type(p.get("image", "")),
        "inventory_status": "In Stock" if int(p.get("stock", 0) or 0) > 0 else "Out of Stock"
    })

artifact_dir = r"C:\Users\srika\.gemini\antigravity-ide\brain\6122a41d-195e-48af-8c3c-d5f5a2eba867"

# JSON
with open(os.path.join(artifact_dir, "inventory_full.json"), "w", encoding='utf-8') as f:
    json.dump(exported_inventory, f, indent=2)

# CSV
with open(os.path.join(artifact_dir, "inventory_full.csv"), "w", newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=exported_inventory[0].keys())
    writer.writeheader()
    for row in exported_inventory:
        writer.writerow(row)

# Summary
total = len(exported_inventory)
categories = Counter(p['category'] for p in exported_inventory)
subcategories = Counter(p['subcategory'] for p in exported_inventory if p['subcategory'])
img_types = Counter(p['image_type'] for p in exported_inventory)
brands = Counter(p['brand'] for p in exported_inventory if p['brand'])

md = "# AWS Inventory Full Export Summary\n\n"
md += f"**Total Products:** {total}\n\n"

hq_count = img_types.get('Priority 1', 0) + img_types.get('Priority 2', 0)
fallback_count = img_types.get('Fallback', 0) + img_types.get('Priority 3', 0)

md += "## Image Quality\n"
md += f"- **Products with HQ Images:** {hq_count}\n"
md += f"- **Products with Fallback/Placeholder Images:** {fallback_count}\n\n"
md += "### Image Types Breakdown\n"
md += f"- **Priority 1 (HQ Local):** {img_types.get('Priority 1', 0)}\n"
md += f"- **Priority 2 (HQ Scraped):** {img_types.get('Priority 2', 0)}\n"
md += f"- **Priority 3 (Placeholder/Broken):** {img_types.get('Priority 3', 0)}\n"
md += f"- **Fallback (Generic Category):** {img_types.get('Fallback', 0)}\n\n"

md += "## Categories\n"
for c, count in categories.most_common():
    md += f"- **{c}**: {count}\n"

md += "\n## Top Subcategories\n"
for s, count in subcategories.most_common(10):
    md += f"- **{s}**: {count}\n"

md += "\n## Top Brands\n"
for b, count in brands.most_common(10):
    md += f"- **{b}**: {count}\n"

with open(os.path.join(artifact_dir, "inventory_summary.md"), "w", encoding='utf-8') as f:
    f.write(md)

print("Export complete.")
