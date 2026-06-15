import re
import os

artifact_dir = r"C:\Users\srika\.gemini\antigravity-ide\brain\6122a41d-195e-48af-8c3c-d5f5a2eba867"

with open(os.path.join(artifact_dir, "final_demo_products_verified.md"), "r", encoding='utf-8') as f:
    lines = f.readlines()

product_map = {}
for line in lines:
    match = re.match(r'^- \[VERIFIED\] (.+) \(`([^`]+)`\) - \*', line.strip())
    if match:
        name, pid = match.groups()
        product_map[name.strip().lower()] = pid

def get_id(name):
    n = name.strip().lower()
    if n in product_map: return product_map[n]
    # fuzzy matching
    for k, v in product_map.items():
        if n in k or k in n:
            return v
    # exact words
    for k, v in product_map.items():
        if all(w in k for w in n.split()):
            return v
    return f"UNKNOWN_{name}"

missions_data = {
    "Movie Night": {
        "queries": ["Movie Night", "Having friends over for a movie night"],
        "success": 92, "risk": 12, "readiness": 88,
        "missing": ["Act II Instant Popcorn", "4700BC Gourmet Popcorn", "Lay's Gourmet Thai Sweet Chilli", "TAGZ Popped Chips", "Cadbury Oreo Family Pack", "Tim Tam Chocolate Biscuits", "Mogu Mogu Fruit Drink", "Paper Boat Sparkling Coffee"],
        "recommended": ["Toblerone Dark Chocolate", "Galaxy Dark Chocolate", "Orion Choco Pie", "Lotus Biscoff Cookies", "Go Desi Fruit Snacks", "Unibic Choco Chip Cookies", "Tropicana Mixed Fruit Juice", "Limca", "Dry Fruit Hub Dates", "Mr Makhana Roasted Foxnuts", "RightCrunch Crackers", "Cadbury Dairy Milk Treat Pack"]
    },
    "Weight Loss Journey": {
        "queries": ["Weight Loss", "I am starting a weight loss journey"],
        "success": 95, "risk": 8, "readiness": 91,
        "missing": ["Tata Soulfull Masala Oats", "R R Agro Chia Seeds", "True Elements Pumpkin Seeds", "Organic Amaranth Seeds", "NatureVit Chia Seeds", "Nutrilin Makhana", "Vahdam Lemon Ginger Green Tea", "Teabox Rose Green Tea"],
        "recommended": ["Manna Millet Combo", "Barnyard Millet", "MYFITNESS Peanut Butter", "High Protein Peanut Butter", "RiteBite Protein Bars", "Saffola Protein Shake", "Yellow Dates", "Almonds", "Walnuts", "Organic India Tulsi Tea", "Fearless Green Tea", "Gladful Date Nut Squares"]
    },
    "Healthy Breakfast": {
        "queries": ["Healthy Breakfast", "I need to start eating a healthy breakfast"],
        "success": 93, "risk": 10, "readiness": 89,
        "missing": ["Kellogg's Granola", "The Whole Truth Muesli", "Alt Co Oats Milk", "MYFITNESS Peanut Butter", "Peanut Butter Crunchy", "Tropicana Juice", "Chai Point Instant Tea", "Lavazza Coffee Beans"],
        "recommended": ["Oats Cookies", "Green Tea", "Tulsi Tea", "Lemon Grass Green Tea", "Organic India Tea", "Colombian Brew Coffee", "Black Reaper Coffee", "Dry Fruits Mix", "Pumpkin Seeds", "Chia Seeds", "Makhana", "Fruit Juice"]
    },
    "Late Night Study Session": {
        "queries": ["Study Session", "I need snacks and energy for a late night study session"],
        "success": 90, "risk": 15, "readiness": 85,
        "missing": ["Nescafe Gold Coffee", "Blue Tokai Pour Over Coffee", "Lavazza Coffee Beans", "Paper Boat Sparkling Coffee", "Lotus Biscoff Cookies", "Oreo Family Pack", "Timios Snack Sticks", "Millet Noodles"],
        "recommended": ["TAGZ Chips", "Popcorn", "Dairy Milk", "Choco Pie", "Fruit Juice", "Protein Bar", "Pumpkin Seeds", "Dry Fruits Mix", "Makhana", "Green Tea", "Instant Tea Premix", "Tulsi Tea"]
    },
    "Train Journey Snacks": {
        "queries": ["Train Journey", "I am packing snacks for a long train journey"],
        "success": 89, "risk": 18, "readiness": 84,
        "missing": ["Go Desi Popz", "Dry Fruit Hub Dates", "Loacker Wafers", "Mr Makhana Foxnuts", "Tropicana Juice", "Mogu Mogu Drink", "Peanut Butter Dates", "Cranberries"],
        "recommended": ["Oreo Cookies", "Lotus Biscoff", "RightCrunch Crackers", "Walnuts", "Almonds", "Dry Fruits Mix", "Chocolate Bars", "Fruit Snacks", "Protein Cookies", "Makhana", "Fruit Juice", "Energy Gel"]
    },
    "Festival Preparation": {
        "queries": ["Festival", "Getting ready for a pooja festival"],
        "success": 94, "risk": 9, "readiness": 90,
        "missing": ["Desi Cow Ghee", "Coconut Oil", "Premium Dry Fruits Mix", "Palm Candy", "Fennel Seeds", "Almonds", "Dates", "Sweet Amla Candy"],
        "recommended": ["Pistachios", "Cashews", "Walnuts", "Groundnuts", "Bilona Ghee", "Dry Fruits Combo", "Amla Candy", "Cranberries", "Prunes", "Almond Oil", "Festival Sweets", "Mixed Nuts Pack"]
    }
}

ts_code = "export const demoModeInterceptor = (query: string) => {\n  const q = query.trim().toLowerCase();\n"

for m_name, m_data in missions_data.items():
    missing_ids = [get_id(x) for x in m_data["missing"]]
    recommended_ids = [get_id(x) for x in m_data["recommended"]]
    
    # check if any UNKNOWN
    for i, x in enumerate(m_data["missing"]):
        if missing_ids[i].startswith("UNKNOWN"): print(f"UNKNOWN MISSING: {x} in {m_name}")
    for i, x in enumerate(m_data["recommended"]):
        if recommended_ids[i].startswith("UNKNOWN"): print(f"UNKNOWN RECOM: {x} in {m_name}")
        
    conditions = " || ".join([f"q === '{x.lower()}'" for x in m_data["queries"]])
    ts_code += f"  if ({conditions}) {{\n"
    ts_code += f"    return {{\n"
    ts_code += f"      status: 'success',\n"
    ts_code += f"      mission: {{ detected_mission: '{m_name}', parameters: {{}}, confidence: 1.0 }},\n"
    ts_code += f"      verification: {{\n"
    ts_code += f"        readiness_score: {m_data['readiness']},\n"
    ts_code += f"        readiness_breakdown: {{}},\n"
    ts_code += f"        required_items: [],\n"
    ts_code += f"        missing_items: {missing_ids},\n"
    ts_code += f"        critical_missing: [],\n"
    ts_code += f"        important_missing: {missing_ids[:4]},\n"
    ts_code += f"        optional_missing: {missing_ids[4:]},\n"
    ts_code += f"        recommended_products: {recommended_ids}\n"
    ts_code += f"      }},\n"
    ts_code += f"      risk: {{\n"
    ts_code += f"        risk_score: {m_data['risk']},\n"
    ts_code += f"        risk_level: '{ 'Low' if m_data['risk'] < 15 else 'Medium' }',\n"
    ts_code += f"        risks: []\n"
    ts_code += f"      }},\n"
    ts_code += f"      simulation: {{\n"
    ts_code += f"        current_success: 50,\n"
    ts_code += f"        optimized_success: {m_data['success']},\n"
    ts_code += f"        improvement: {m_data['success'] - 50},\n"
    ts_code += f"        recommended_additions: {recommended_ids}\n"
    ts_code += f"      }},\n"
    ts_code += f"      mission_coherence_score: {m_data['success']}\n"
    ts_code += f"    }};\n"
    ts_code += f"  }}\n"

ts_code += "  return null;\n};\n"

with open(os.path.join(artifact_dir, "demoInterceptor.ts"), "w", encoding='utf-8') as f:
    f.write(ts_code)

print("TS Code generated.")
