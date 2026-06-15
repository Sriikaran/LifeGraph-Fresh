import json

cat_file = r'c:\Users\srika\.gemini\antigravity-ide\brain\421ccc06-4fc9-4d26-b01e-33dd188ff93e\scratch\catalog_prototype.json'
cat = json.load(open(cat_file, encoding='utf-8'))
p_map = {p['id']: p for p in cat}

sub_file = r'c:\Users\srika\.gemini\antigravity-ide\brain\421ccc06-4fc9-4d26-b01e-33dd188ff93e\graph_edges_prototype_deduped.json'
subs = json.load(open(sub_file, encoding='utf-8'))

dep_file = r'c:\Users\srika\.gemini\antigravity-ide\brain\421ccc06-4fc9-4d26-b01e-33dd188ff93e\graph_edges_dependency_repaired.json'
deps = json.load(open(dep_file, encoding='utf-8'))

with open('suspicious_edges_2.txt', 'w', encoding='utf-8') as f:
    f.write('--- SUSPICIOUS SUBSTITUTES (diff subcat) ---\n')
    for e in subs:
        src = p_map.get(e['source_id'])
        tgt = p_map.get(e['target_id'])
        if src and tgt:
            if src['subcategory'] != tgt['subcategory']:
                f.write(f"{src['name']} ({src['subcategory']}) <-> {tgt['name']} ({tgt['subcategory']})\n")

    f.write('\n--- SUSPICIOUS DEPENDENCIES (cross category) ---\n')
    for e in deps:
        src = p_map.get(e['source_id'])
        tgt = p_map.get(e['target_id'])
        if src and tgt:
            if src['category'] != tgt['category']:
                f.write(f"{src['name']} ({src['category']}) -> {tgt['name']} ({tgt['category']})\n")

