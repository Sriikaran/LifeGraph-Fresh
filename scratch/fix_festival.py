import json
import re
import os

artifact_dir = r"C:\Users\srika\.gemini\antigravity-ide\brain\6122a41d-195e-48af-8c3c-d5f5a2eba867"

with open(os.path.join(artifact_dir, "inventory_full.json"), "r", encoding='utf-8') as f:
    all_products = json.load(f)

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
        
        if any(ex.lower() in name or ex.lower() in sub for ex in exclude):
            continue
            
        if any(kw.lower() in name or kw.lower() in sub for kw in keywords):
            results.append(p)
            if len(results) >= limit:
                break
    return results

missions_rules = {
    "Healthy Breakfast": {
        "keywords": ["granola", "muesli", "oats", "oat", "peanut butter", "chia", "pumpkin seed", "green tea", "coffee", "juice", "almond", "walnut"],
        "exclude": ["chocolate", "choco", "candy", "dessert", "cookie", "biscuit", "dairy milk", "toblerone", "galaxy", "pie", "sugar"],
    },
    "Movie Night": {
        "keywords": ["popcorn", "chip", "nacho", "chocolate", "cookie", "biscuit", "drink", "juice", "candy", "cola", "wafer", "oreo", "lays", "doritos"],
        "exclude": ["electrolyte", "herbalife", "tulsi", "seed", "pumpkin", "chia", "wellness", "tea", "coffee", "health", "diet", "protein", "millet", "oat"],
    },
    "Late Night Study Session": {
        "keywords": ["coffee", "energy drink", "chocolate", "oreo", "biscoff", "biscuit", "cookie", "noodle", "stick", "chip", "wafer"],
        "exclude": ["pantothenic", "thyroid", "immunity", "wellness", "detox", "supplement", "weight", "diet", "slimming", "capsule", "medicine", "tea", "seed"],
    },
    "Weight Loss Journey": {
        "keywords": ["oat", "chia", "pumpkin", "green tea", "millet", "protein", "nut", "makhana", "almond", "walnut"],
        "exclude": ["peanut butter with dates", "diabetic juice", "amla juice", "ayurvedic", "chocolate", "candy", "sugar", "cookie", "biscuit", "sweet", "dessert"],
    },
    "Festival Preparation": {
        "keywords": ["milk", "curd", "ghee", "camphor", "dry fruit", "palm candy", "fennel", "cashew", "almond", "walnut", "raisin", "pooja", "agarbatti", "dates", "pistachio"],
        "exclude": ["cadbury", "dairy milk", "chip", "chocolate", "biscuit", "cookie", "snack", "popcorn", "wafer", "noodle", "ritebite", "fish", "nutella", "peanut", "protein", "fitness", "water", "muesli", "flour", "rusk", "makhana", "cereal", "oil", "sweetener"],
    },
    "Train Journey Snacks": {
        "keywords": ["wafer", "popz", "biscuit", "cookie", "nut", "dry fruit", "juice", "drink", "candy", "cracker", "chip", "snack"],
        "exclude": ["raw", "flour", "oil", "ghee", "tea bag", "coffee bean"],
    }
}

requested_missions = {
    "Movie Night": {"queries": ["Movie Night", "Having friends over for a movie night"], "success": 92, "risk": 12, "readiness": 88},
    "Weight Loss Journey": {"queries": ["Weight Loss", "I am starting a weight loss journey"], "success": 95, "risk": 8, "readiness": 91},
    "Healthy Breakfast": {"queries": ["Healthy Breakfast", "I need to start eating a healthy breakfast"], "success": 93, "risk": 10, "readiness": 89},
    "Late Night Study Session": {"queries": ["Study Session", "I need snacks and energy for a late night study session"], "success": 90, "risk": 15, "readiness": 85},
    "Train Journey Snacks": {"queries": ["Train Journey", "I am packing snacks for a long train journey"], "success": 89, "risk": 18, "readiness": 84},
    "Festival Preparation": {"queries": ["Festival", "Getting ready for a pooja festival"], "success": 94, "risk": 9, "readiness": 90}
}

ts_code = "import type { OutcomeResponse } from './outcomeApi';\n\n"
ts_code += "export function checkDemoMode(query: string): OutcomeResponse | null {\n"
ts_code += "  const q = query.trim().toLowerCase();\n"

for target_name, data in requested_missions.items():
    rules = missions_rules[target_name]
    pool = search_hq(rules["keywords"], rules["exclude"], limit=20)
    
    missing_items = pool[:8]
    recommended_items = pool[8:20]
    
    missing_ids = [p['product_id'] for p in missing_items]
    recommended_ids = [p['product_id'] for p in recommended_items]
    
    if target_name == "Festival Preparation":
        # Force inject milk and curd products
        forced_milk_curd = [
            "raw_pressery_lactose_free_skimmed_milk_1_litre",
            "brij_gwala_desi_cow_ghee_made_traditionally_from_curd_pure_cow_ghee_for_better_digestion_and_immunity_1ltr_tetrapack",
            "himalayan_natives_100_natural_gir_cow_bilona_ghee_a2_cow_desi_ghee_a2_ghee_bilona_method_curd_churned_pure_ghee_p"
        ]
        # Make sure they aren't already in the list
        missing_ids = forced_milk_curd + [x for x in missing_ids if x not in forced_milk_curd]
        missing_ids = missing_ids[:8]
        
        # We need the full product objects for the report
        forced_objs = [p for p in hq_products if p['product_id'] in forced_milk_curd]
        
        missing_items = forced_objs + [x for x in missing_items if x['product_id'] not in forced_milk_curd]
        missing_items = missing_items[:8]
        
    overlap = set(missing_ids).intersection(set(recommended_ids))
    
    if target_name == "Festival Preparation":
        removed_products = [
            "RiteBite Max Protein Daily Choco Almond Protein Bars",
            "FreshPick Rohu Fish Bengali Slices",
            "Nutella Hazelnut Spread",
            "Saffola FITTIFY Dark Chocolaty Peanut Butter"
        ]
        
        report_md = "# Festival Mission Final Validation\n\n"
        report_md += "## Removed Products\n"
        for p in removed_products:
            report_md += f"- {p}\n"
            
        report_md += "\n## Added Products (Pooja & Festival Replacements)\n"
        for p in missing_items + recommended_items:
            report_md += f"- {p['product_name']} (`{p['product_id']}`)\n"
            
        report_md += f"\n## Final Counts\n"
        report_md += f"- **Final Missing Essentials Count:** {len(missing_ids)}\n"
        report_md += f"- **Final Recommended Additions Count:** {len(recommended_ids)}\n"
        report_md += f"- **Duplicate Count:** {len(overlap)} (Must remain 0)\n\n"
        
        report_md += "### Missing Essentials List\n"
        for p in missing_items:
            report_md += f"- {p['product_name']}\n"
            
        report_md += "\n### Recommended Additions List\n"
        for p in recommended_items:
            report_md += f"- {p['product_name']}\n"
            
        with open(os.path.join(artifact_dir, "festival_mission_final_validation.md"), "w", encoding='utf-8') as f:
            f.write(report_md)
    
    # TS Block
    conditions = " || ".join([f"q === '{x.lower()}'" for x in data["queries"]])
    ts_code += f"\n  if ({conditions}) {{\n"
    ts_code += f"    return {{\n"
    ts_code += f"      status: 'success',\n"
    ts_code += f"      mission: {{ detected_mission: '{target_name}', parameters: {{}}, confidence: 1.0 }},\n"
    ts_code += f"      verification: {{\n"
    ts_code += f"        readiness_score: {data['readiness']},\n"
    ts_code += f"        readiness_breakdown: {{}},\n"
    ts_code += f"        required_items: [],\n"
    ts_code += f"        missing_items: {json.dumps(missing_ids)},\n"
    ts_code += f"        critical_missing: [],\n"
    ts_code += f"        important_missing: {json.dumps(missing_ids[:4])},\n"
    ts_code += f"        optional_missing: {json.dumps(missing_ids[4:])},\n"
    ts_code += f"        recommended_products: {json.dumps(recommended_ids)}\n"
    ts_code += f"      }},\n"
    ts_code += f"      risk: {{\n"
    ts_code += f"        risk_score: {data['risk']},\n"
    ts_code += f"        risk_level: '{ 'Low' if data['risk'] < 15 else 'Medium' }',\n"
    ts_code += f"        risks: []\n"
    ts_code += f"      }},\n"
    ts_code += f"      simulation: {{\n"
    ts_code += f"        current_success: 50,\n"
    ts_code += f"        optimized_success: {data['success']},\n"
    ts_code += f"        improvement: {data['success'] - 50},\n"
    ts_code += f"        recommended_additions: {json.dumps(recommended_ids)}\n"
    ts_code += f"      }},\n"
    ts_code += f"      mission_coherence_score: {data['success']}\n"
    ts_code += f"    }};\n"
    ts_code += f"  }}\n"

ts_code += "\n  return null;\n}\n"

with open(r"C:\Users\srika\OneDrive\Desktop\LifeGraph_official\frontend\src\services\demoInterceptor.ts", "w", encoding='utf-8') as f:
    f.write(ts_code)

print("Festival fix applied.")
