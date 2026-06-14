import json
import requests
import sys

def main():
    try:
        data = requests.get('http://127.0.0.1:8000/openapi.json').json()
    except Exception as e:
        print(f"Error loading openapi.json: {e}")
        return

    paths = data.get('paths', {})
    total_endpoints = sum(len(methods) for methods in paths.values())
    
    inventory = {
        'total': total_endpoints,
        'verification': 0,
        'risk': 0,
        'prevention': 0,
        'mission_detection': 0,
        'memory': 0,
        'adaptive': 0,
        'simulator': 0,
        'graph_relationship_mission': 0
    }
    
    for path in paths:
        if '/verification/' in path: inventory['verification'] += len(paths[path])
        elif '/risk/' in path: inventory['risk'] += len(paths[path])
        elif '/prevent-checkout' in path: inventory['prevention'] += len(paths[path])
        elif '/detect-mission' in path: inventory['mission_detection'] += len(paths[path])
        elif '/memory/' in path: inventory['memory'] += len(paths[path])
        elif '/adaptive/' in path: inventory['adaptive'] += len(paths[path])
        elif '/simulator/' in path: inventory['simulator'] += len(paths[path])
        elif '/missions' in path or '/relationships' in path or '/graph' in path:
            inventory['graph_relationship_mission'] += len(paths[path])
            
    print("INVENTORY:")
    print(json.dumps(inventory, indent=2))
    
    # Smoke tests
    endpoints = {
        "/detect-mission": {"method": "POST", "payload": {"text": "birthday party"}},
        "/verification/verify": {"method": "POST", "payload": {"missionId": "MISSION_1", "cartId": "CART_1"}},
        "/risk/analyze": {"method": "POST", "payload": {"verification_score": 50, "missing_items": ["Cake"]}},
        "/prevent-checkout": {"method": "POST", "payload": {"missionId": "MISSION_1", "cartId": "CART_1"}},
        "/simulator/run": {"method": "POST", "payload": {"user_id": "U1", "mission_id": "M1", "cart_id": "C1"}},
        "/adaptive/analyze": {"method": "POST", "payload": {"user_id": "U1"}},
        "/missions": {"method": "GET"},
        "/relationships": {"method": "GET"},
        "/graph/seed-bulk": {"method": "POST", "payload": {"missions": []}}
    }
    
    results = {}
    base_url = "http://127.0.0.1:8000"
    
    for ep, conf in endpoints.items():
        url = base_url + ep
        try:
            if conf['method'] == 'POST':
                res = requests.post(url, json=conf.get('payload', {}))
            else:
                res = requests.get(url)
                
            results[ep] = {
                "status_code": res.status_code,
                "response": res.text
            }
        except Exception as e:
            results[ep] = {
                "status_code": "ERROR",
                "exception": str(e)
            }
            
    print("SMOKE TESTS:")
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
