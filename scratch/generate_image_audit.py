import json
import os
from collections import Counter

artifact_dir = r"C:\Users\srika\.gemini\antigravity-ide\brain\6122a41d-195e-48af-8c3c-d5f5a2eba867"

with open(os.path.join(artifact_dir, "inventory_full.json"), "r", encoding='utf-8') as f:
    products = json.load(f)

fallback_urls = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e",
  "https://images.unsplash.com/photo-1610832958506-aa56368176cf",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571",
  "https://images.unsplash.com/photo-1585909695284-32d2985ac9c0",
  "https://images.unsplash.com/photo-1596462502278-27bf85033e5a",
  "https://images.unsplash.com/photo-1605335520442-70b8095bdf35",
  "https://images.unsplash.com/photo-1519689680058-324335c77eba",
  "https://images.unsplash.com/photo-1599599810769-bcde5a160d32",
  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd",
  "https://images.unsplash.com/photo-1509440159596-0249088772ff",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
  "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f",
  "https://images.unsplash.com/photo-1500835556837-99ac94a94552",
  "https://images.unsplash.com/photo-1580974852861-c381510bc98a"
]

def classify_image(img_url):
    if not img_url: return "FALLBACK_IMAGE"
    img_url = img_url.strip()
    if not img_url: return "FALLBACK_IMAGE"
    
    if img_url.startswith("/assets/categories/"): return "GENERIC_CATEGORY_IMAGE"
    
    for f in fallback_urls:
        if f in img_url: return "FALLBACK_IMAGE"
        
    if "unsplash.com" in img_url: return "PLACEHOLDER_IMAGE"
    if "/images/W/" in img_url: return "BROKEN_IMAGE"
    
    if img_url.startswith("/assets/products/"):
        local_path = os.path.join(r"C:\Users\srika\OneDrive\Desktop\LifeGraph_official\frontend\public", img_url.lstrip("/"))
        if not os.path.exists(local_path): return "BROKEN_IMAGE"
        if os.path.getsize(local_path) < 100: return "BROKEN_IMAGE"
        
    return "UNIQUE_IMAGE"

for p in products:
    p['image_classification'] = classify_image(p['image_url'])

# 1. image_audit_export.md
with open(os.path.join(artifact_dir, "image_audit_export.md"), "w", encoding='utf-8') as f:
    f.write("# Image Audit Export\n\n")
    for p in products:
        f.write(f"### {p['product_name']} (`{p['product_id']}`)\n")
        f.write(f"- **Category:** {p['category']}\n")
        f.write(f"- **Image URL:** {p['image_url']}\n")
        f.write(f"- **Classification:** {p['image_classification']}\n\n")

# 2. image_quality_summary.md
counts = Counter(p['image_classification'] for p in products)
with open(os.path.join(artifact_dir, "image_quality_summary.md"), "w", encoding='utf-8') as f:
    f.write("# Image Quality Summary\n\n")
    f.write(f"- **Total products:** {len(products)}\n")
    f.write(f"- **UNIQUE_IMAGE count:** {counts.get('UNIQUE_IMAGE', 0)}\n")
    f.write(f"- **GENERIC_CATEGORY_IMAGE count:** {counts.get('GENERIC_CATEGORY_IMAGE', 0)}\n")
    f.write(f"- **FALLBACK_IMAGE count:** {counts.get('FALLBACK_IMAGE', 0)}\n")
    f.write(f"- **BROKEN_IMAGE count:** {counts.get('BROKEN_IMAGE', 0)}\n")
    f.write(f"- **PLACEHOLDER_IMAGE count:** {counts.get('PLACEHOLDER_IMAGE', 0)}\n")

# 3. hq_products_only.md
hq_products = [p for p in products if p['image_classification'] == 'UNIQUE_IMAGE']
with open(os.path.join(artifact_dir, "hq_products_only.md"), "w", encoding='utf-8') as f:
    f.write("# Truly Unique Image Products (HQ Only)\n\n")
    for p in hq_products:
        f.write(f"- **{p['product_name']}** (`{p['product_id']}`) - *{p['category']}* | Rating: {p.get('rating', '0')}\n")

print("Files generated successfully.")
