import json

catalog_file = r'c:\Users\srika\.gemini\antigravity-ide\brain\421ccc06-4fc9-4d26-b01e-33dd188ff93e\scratch\catalog_prototype.json'
cat = json.load(open(catalog_file, encoding='utf-8'))

groups = {}
for p in cat:
    k = (p['category'], p['subcategory'])
    groups.setdefault(k, []).append(p)

with open('catalog_grouped.txt', 'w', encoding='utf-8') as f:
    for (c, sc), items in sorted(groups.items()):
        f.write(f'--- {c} -> {sc} ---\n')
        for i in items:
            f.write(f"{i['id']} | {i['name']}\n")
        f.write('\n')
