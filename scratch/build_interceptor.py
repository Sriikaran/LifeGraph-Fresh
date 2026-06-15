import re
import json
import os

artifact_dir = r"C:\Users\srika\.gemini\antigravity-ide\brain\6122a41d-195e-48af-8c3c-d5f5a2eba867"

with open(os.path.join(artifact_dir, "final_demo_products_verified.md"), "r", encoding='utf-8') as f:
    lines = f.readlines()

missions = {}
current_mission = None
current_section = None

for line in lines:
    m = re.match(r'^### (.+)', line.strip())
    if m:
        current_mission = m.group(1).strip()
        missions[current_mission] = {"missing": [], "recommended": []}
        continue
    
    if line.startswith("**Missing Essentials"):
        current_section = "missing"
        continue
    if line.startswith("**Recommended Additions"):
        current_section = "recommended"
        continue
        
    m2 = re.match(r'^- \[VERIFIED\].*\(`([^`]+)`\)', line.strip())
    if m2 and current_mission and current_section:
        missions[current_mission][current_section].append(m2.group(1))

# Now map the data to the user's requested output
requested_missions = {
    "Movie Night": {
        "queries": ["Movie Night", "Having friends over for a movie night"],
        "success": 92, "risk": 12, "readiness": 88,
        "source_key": "Movie Night"
    },
    "Weight Loss Journey": {
        "queries": ["Weight Loss", "I am starting a weight loss journey"],
        "success": 95, "risk": 8, "readiness": 91,
        "source_key": "Weight Loss Journey"
    },
    "Healthy Breakfast": {
        "queries": ["Healthy Breakfast", "I need to start eating a healthy breakfast"],
        "success": 93, "risk": 10, "readiness": 89,
        "source_key": "Healthy Breakfast"
    },
    "Late Night Study Session": {
        "queries": ["Study Session", "I need snacks and energy for a late night study session"],
        "success": 90, "risk": 15, "readiness": 85,
        "source_key": "Student Late Night Study"
    },
    "Train Journey Snacks": {
        "queries": ["Train Journey", "I am packing snacks for a long train journey"],
        "success": 89, "risk": 18, "readiness": 84,
        "source_key": "Travel Snacks" # Or maybe Train Journey Snacks? In my report it was Travel Snacks.
    },
    "Festival Preparation": {
        "queries": ["Festival", "Getting ready for a pooja festival"],
        "success": 94, "risk": 9, "readiness": 90,
        "source_key": "Festival Preparation"
    }
}

ts_code = """import type { OutcomeResponse } from './outcomeApi';

export function checkDemoMode(query: string): OutcomeResponse | null {
  const q = query.trim().toLowerCase();
"""

for target_name, data in requested_missions.items():
    source = data['source_key']
    missing_ids = missions[source]["missing"]
    recommended_ids = missions[source]["recommended"]
    
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

print("demoInterceptor.ts generated successfully.")
