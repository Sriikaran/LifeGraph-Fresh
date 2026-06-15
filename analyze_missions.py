import json

mission_file = r'c:\Users\srika\.gemini\antigravity-ide\brain\421ccc06-4fc9-4d26-b01e-33dd188ff93e\scratch\missions_prototype.json'
missions = json.load(open(mission_file, encoding='utf-8'))

cat_file = r'c:\Users\srika\.gemini\antigravity-ide\brain\421ccc06-4fc9-4d26-b01e-33dd188ff93e\scratch\catalog_prototype.json'
cat = json.load(open(cat_file, encoding='utf-8'))
p_map = {p['id']: p for p in cat}

with open('mission_analysis.txt', 'w', encoding='utf-8') as f:
    for m in missions:
        f.write(f"\nMISSION: {m['mission_name']}\n")
        for item_id in m['items']:
            p = p_map.get(item_id)
            if p:
                f.write(f"  - {p['name']} ({p['category']} -> {p['subcategory']})\n")
            else:
                f.write(f"  - MISSING ID: {item_id}\n")
