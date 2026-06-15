import json
import re

with open(r'C:\Users\srika\.gemini\antigravity-ide\brain\6122a41d-195e-48af-8c3c-d5f5a2eba867\inventory_full.json', encoding='utf-8') as f:
    data = json.load(f)
    
unique_ids = set()
with open(r'C:\Users\srika\.gemini\antigravity-ide\brain\6122a41d-195e-48af-8c3c-d5f5a2eba867\hq_products_only.md', encoding='utf-8') as f:
    for line in f:
        match = re.search(r'\(`([^`]+)`\)', line)
        if match:
            unique_ids.add(match.group(1))

hq_products = [p for p in data if p['product_id'] in unique_ids]

res = []
for p in hq_products:
    name = p['product_name'].lower()
    if 'milk' in name or 'curd' in name:
        res.append(p['product_id'] + " || " + p['product_name'])

with open('scratch/milk_curd.txt', 'w', encoding='utf-8') as f:
    for r in res:
        f.write(r + '\n')
