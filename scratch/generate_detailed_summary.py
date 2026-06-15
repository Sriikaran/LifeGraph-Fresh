import json
from collections import defaultdict, Counter

with open(r"C:\Users\srika\.gemini\antigravity-ide\brain\6122a41d-195e-48af-8c3c-d5f5a2eba867\inventory_full.json", "r", encoding='utf-8') as f:
    products = json.load(f)

# Structure for Section 1
# category -> { 'subcategories': set, 'count': int, 'hq_count': int, 'products': list }
categories = defaultdict(lambda: {'subcategories': set(), 'count': 0, 'hq_count': 0, 'products': []})

for p in products:
    c = p['category']
    categories[c]['count'] += 1
    if p['subcategory']:
        categories[c]['subcategories'].add(p['subcategory'])
    if p['image_type'] in ['Priority 1', 'Priority 2']:
        categories[c]['hq_count'] += 1
    categories[c]['products'].append(p)

md = "# AWS Inventory Detailed Summary\n\n"

md += "## Part 1: Category Overview\n\n"
for c_name, data in categories.items():
    md += f"### Category: {c_name}\n"
    md += f"- **Product Count:** {data['count']}\n"
    md += f"- **HQ Image Count:** {data['hq_count']}\n"
    md += f"- **Subcategories:** {', '.join(sorted(list(data['subcategories']))) if data['subcategories'] else 'None'}\n"
    
    # Sort products by rating if available, otherwise just take first 5
    top = sorted(data['products'], key=lambda x: x.get('rating', 0), reverse=True)[:5]
    md += "- **Top Products:**\n"
    for tp in top:
        md += f"  - {tp['product_name']}\n"
    md += "\n"

# Section 2: Specific Export
target_groups = [
    "Snacks & Confectionery",
    "Tea & Coffee",
    "Dairy & Alternatives",
    "Cereals",
    "Protein Supplements",
    "Nutrition Bars",
    "Bakery",
    "Beverages",
    "Dry Fruits",
    "Festival Products"
]

def map_to_groups(p):
    groups = []
    sub = p.get('subcategory', '').lower()
    cat = p.get('category', '').lower()
    name = p.get('product_name', '').lower()
    
    # We return all groups that apply, to not miss anything.
    if 'snack' in sub or 'confectionery' in sub or 'chip' in name or 'biscuit' in name or 'cookie' in name or 'namkeen' in name or 'bhujia' in name or 'popcorn' in name or 'chocolate' in name:
        groups.append("Snacks & Confectionery")
    
    if 'tea' in sub or 'coffee' in sub or 'tea' in name or 'coffee' in name or 'chai' in name:
        groups.append("Tea & Coffee")
        
    if 'dairy' in sub or 'milk' in name or 'ghee' in name or 'butter' in name or 'cheese' in name or 'paneer' in name or 'curd' in name:
        groups.append("Dairy & Alternatives")
        
    if 'cereal' in sub or 'oat' in name or 'muesli' in name or 'granola' in name or 'millet' in name or 'corn flakes' in name:
        groups.append("Cereals")
        
    if 'protein' in sub or 'protein' in name or 'whey' in name or 'isolate' in name or 'bcaa' in name:
        groups.append("Protein Supplements")
        
    if 'bar' in name and ('nutrition' in name or 'protein' in name or 'energy' in name or 'snack bar' in name):
        groups.append("Nutrition Bars")
        
    if 'bakery' in sub or 'bread' in name or 'cake' in name or 'flour' in name or 'baking' in name or 'yeast' in name or 'atta' in name.split():
        groups.append("Bakery")
        
    if 'beverage' in sub or 'beverage' in cat or 'drink' in name or 'juice' in name or 'soda' in name or 'water' in name or 'cola' in name or 'squash' in name:
        groups.append("Beverages")
        
    if 'dry fruit' in sub or 'almond' in name or 'cashew' in name or 'raisin' in name or 'nut' in name.split() or 'seed' in name or 'walnut' in name or 'pistachio' in name or 'date' in name or 'khajoor' in name:
        groups.append("Dry Fruits")
        
    if 'festival' in cat or 'festival' in sub or 'pooja' in name or 'agarbatti' in name or 'gulal' in name or 'diya' in name or 'camphor' in name:
        groups.append("Festival Products")
        
    return groups

export_groups = defaultdict(list)
seen_pairs = set()

for p in products:
    groups = map_to_groups(p)
    for g in groups:
        pair = (g, p['product_id'])
        if pair not in seen_pairs:
            seen_pairs.add(pair)
            export_groups[g].append(p['product_name'])

md += "## Part 2: Detailed Export by Requested Groups\n\n"
for g in target_groups:
    md += f"### {g} ({len(export_groups[g])} items)\n"
    if not export_groups[g]:
        md += "- No products found matching this group.\n\n"
    else:
        for name in sorted(export_groups[g]):
            md += f"- {name}\n"
        md += "\n"

with open(r"C:\Users\srika\.gemini\antigravity-ide\brain\6122a41d-195e-48af-8c3c-d5f5a2eba867\inventory_summary.md", "w", encoding="utf-8") as f:
    f.write(md)

print("Markdown generated.")
