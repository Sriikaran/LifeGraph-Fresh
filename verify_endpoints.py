import requests
import json
import time

def test_endpoint(name, method, path, payload=None):
    url = f"http://127.0.0.1:8000{path}"
    print(f"\n--- {name} ---")
    print(f"{method} {path}")
    try:
        if method == 'GET':
            res = requests.get(url)
        else:
            res = requests.post(url, json=payload)
        print(f"Status Code: {res.status_code}")
        try:
            print(f"Response: {json.dumps(res.json(), indent=2)}")
        except:
            print(f"Response: {res.text}")
    except Exception as e:
        print(f"Exception: {str(e)}")

def main():
    # Wait a bit just in case
    time.sleep(1)
    
    # Workflow endpoint(s)
    test_endpoint("Workflow - Checkout", "POST", "/workflows/checkout", payload={"missionId": "BIRTHDAY", "cartId": "CART123"})
    
    # Graph traversal endpoints
    test_endpoint("Mission Requirements", "GET", "/missions/BIRTHDAY/requirements")
    
    # Product dependency endpoints
    test_endpoint("Product Dependencies", "GET", "/products/CAKE001/dependencies")
    
    # Product substitution endpoints
    test_endpoint("Product Substitutes", "GET", "/products/CAKE001/substitutes")
    
    # Seed endpoints
    test_endpoint("Seed Mission", "POST", "/graph/seed-mission", payload={
        "mission": {
            "mission_id": "TEST_MISSION",
            "name": "Test",
            "description": "Test",
            "category": "TEST"
        },
        "dependencies": [],
        "compatibilities": [],
        "substitutions": [],
        "consumption_rules": []
    })
    
if __name__ == "__main__":
    main()
