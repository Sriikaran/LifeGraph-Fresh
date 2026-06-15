import json

cat_file = r'c:\Users\srika\.gemini\antigravity-ide\brain\421ccc06-4fc9-4d26-b01e-33dd188ff93e\scratch\catalog_prototype.json'
cat = json.load(open(cat_file, encoding='utf-8'))
p_map = {p['id']: p for p in cat}

sub_file = r'c:\Users\srika\.gemini\antigravity-ide\brain\421ccc06-4fc9-4d26-b01e-33dd188ff93e\graph_edges_prototype_deduped.json'
subs = json.load(open(sub_file, encoding='utf-8'))

dep_file = r'c:\Users\srika\.gemini\antigravity-ide\brain\421ccc06-4fc9-4d26-b01e-33dd188ff93e\graph_edges_dependency_repaired.json'
deps = json.load(open(dep_file, encoding='utf-8'))

with open('suspicious_edges.txt', 'w', encoding='utf-8') as f:
    f.write('--- SUSPICIOUS SUBSTITUTES ---\n')
    for e in subs:
        src = p_map.get(e['source_id'])
        tgt = p_map.get(e['target_id'])
        if src and tgt:
            if src['category'] != tgt['category']:
                f.write(f"{src['name']} ({src['category']}) <-> {tgt['name']} ({tgt['category']})\n")

    f.write('\n--- SUSPICIOUS DEPENDENCIES ---\n')
    for e in deps:
        src = p_map.get(e['source_id'])
        tgt = p_map.get(e['target_id'])
        if src and tgt:
            # Check for non-sensical dependencies. Usually cross category is weird, but some are ok (e.g. Pasta -> Sauce).
            # Let's flag any dependency where one is food and another is non-food, or completely unrelated.
            food_cats = ['Grocery & Staples', 'Beverages', 'Snacks & Sweets', 'Bakery, Cakes & Dairy', 'Fruits & Vegetables']
            non_food_cats = ['Pet Care', 'Baby Care', 'Beauty & Hygiene', 'Cleaning & Household']
            s_food = src['category'] in food_cats
            t_food = tgt['category'] in food_cats
            
            # If cross boundary:
            if s_food != t_food:
                f.write(f"{src['name']} ({src['category']}) -> {tgt['name']} ({tgt['category']})\n")

