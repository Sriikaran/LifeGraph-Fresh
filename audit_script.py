import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    report = {
        "openapi_status": None,
        "endpoints_found": [],
        "tests": []
    }
    
    # 1. Verify Swagger / OpenAPI
    try:
        res = requests.get(f"{BASE_URL}/openapi.json", timeout=2)
        report["openapi_status"] = res.status_code
        if res.status_code == 200:
            openapi = res.json()
            report["endpoints_found"] = list(openapi.get("paths", {}).keys())
    except Exception as e:
        report["openapi_error"] = str(e)
        
    # Test definitions
    # Note: We'll send empty or minimal payloads to see how the system handles them.
    # Since AWS creds might be missing, we expect many 500s. We want to capture the exact error.
    
    endpoints = [
        # Users
        {"method": "GET", "path": "/users", "payload": None},
        {"method": "POST", "path": "/users", "payload": {"user_id": "u1", "name": "Test", "email": "test@test.com"}},
        {"method": "GET", "path": "/users/u1", "payload": None},
        
        # Products
        {"method": "GET", "path": "/products", "payload": None},
        {"method": "POST", "path": "/products", "payload": {"product_id": "p1", "name": "Cake", "price": 10.0, "category": "Food"}},
        {"method": "GET", "path": "/products/p1", "payload": None},
        
        # Carts
        {"method": "GET", "path": "/carts", "payload": None},
        {"method": "POST", "path": "/carts", "payload": {"cart_id": "c1", "user_id": "u1"}},
        {"method": "POST", "path": "/carts/c1/items", "payload": {"product_id": "p1", "quantity": 1}},
        
        # Missions
        {"method": "GET", "path": "/missions", "payload": None},
        {"method": "POST", "path": "/missions", "payload": {"mission_id": "m1", "name": "Birthday"}},
        
        # Relationships
        {"method": "GET", "path": "/relationships", "payload": None},
        {"method": "POST", "path": "/relationships", "payload": {"source_id": "m1", "target_id": "p1", "type": "REQUIRES"}},
        
        # Graph
        {"method": "GET", "path": "/missions/m1/requirements", "payload": None},
        {"method": "GET", "path": "/products/p1/dependencies", "payload": None},
        
        # Engines (Mocked)
        {"method": "POST", "path": "/verification/verify", "payload": {"missionId": "m1", "cartId": "c1"}},
        {"method": "POST", "path": "/risk/analyze", "payload": {"verification_score": 50, "missing_items": ["A"]}},
        {"method": "POST", "path": "/prevent-checkout", "payload": {"missionId": "m1", "cartId": "c1"}},
        
        # Memory / Adaptive / Simulator
        {"method": "GET", "path": "/memory/active/u1", "payload": None},
        {"method": "POST", "path": "/memory/track", "payload": {"user_id": "u1", "mission_id": "m1", "status": "ACTIVE", "context": {}}},
        {"method": "POST", "path": "/adaptive/analyze", "payload": {"user_id": "u1", "event_type": "TEST", "data": {}}},
        {"method": "POST", "path": "/simulator/run", "payload": {"user_id": "u1", "mission_id": "m1", "cart_id": "c1"}},
        
        # Orchestrator
        {"method": "POST", "path": "/workflows/checkout", "payload": {"user_id": "u1", "mission_id": "m1", "cart_id": "c1"}},
        {"method": "POST", "path": "/mission/execute", "payload": {"userId": "u1", "missionId": "m1", "cartId": "c1"}}
    ]
    
    for ep in endpoints:
        test_res = {"method": ep["method"], "path": ep["path"]}
        url = f"{BASE_URL}{ep['path']}"
        try:
            if ep["method"] == "GET":
                r = requests.get(url, timeout=2)
            else:
                r = requests.post(url, json=ep["payload"], timeout=2)
                
            test_res["status_code"] = r.status_code
            try:
                test_res["response"] = r.json()
            except:
                test_res["response"] = r.text
        except Exception as e:
            test_res["error"] = str(e)
            
        report["tests"].append(test_res)
        time.sleep(0.1)
        
    with open("d:/LifeGraph/audit_results.json", "w") as f:
        json.dump(report, f, indent=2)

if __name__ == "__main__":
    run_tests()
