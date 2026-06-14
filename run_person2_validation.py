import requests
import json
import traceback

def test_endpoint(name, method, url, payload=None, expected_status=None):
    print(f"\n--- {name} ---")
    print(f"Request: {method} {url}")
    if payload:
        print(f"Payload: {json.dumps(payload)}")
        
    try:
        if method == "GET":
            res = requests.get(url)
        else:
            res = requests.post(url, json=payload)
            
        print(f"Status Code: {res.status_code}")
        try:
            body = res.json()
            print(f"Response Body: {json.dumps(body, indent=2)}")
        except:
            body = res.text
            print(f"Response Body: {body[:200]}...")
            
        if expected_status and res.status_code == expected_status:
            print("RESULT: PASS")
        elif expected_status:
            print("RESULT: FAIL (Status Mismatch)")
        elif res.status_code == 200:
            print("RESULT: PASS")
        else:
            print("RESULT: FAIL (Non-200 Status)")
            
    except Exception as e:
        print(f"Exception: {str(e)}")
        print("RESULT: FAIL (Exception)")

def main():
    base_url = "http://127.0.0.1:8000"
    
    # 2. Verify Docs
    test_endpoint("Swagger Docs", "GET", f"{base_url}/docs", expected_status=200)
    test_endpoint("OpenAPI JSON", "GET", f"{base_url}/openapi.json", expected_status=200)
    
    # A. Mission Detection
    test_endpoint("Mission Detection 1", "POST", f"{base_url}/detect-mission", {"text": "My friend turns 20 tomorrow"}, expected_status=200)
    test_endpoint("Mission Detection 2", "POST", f"{base_url}/detect-mission", {"text": "I am going camping this weekend"}, expected_status=200)
    test_endpoint("Mission Detection 3", "POST", f"{base_url}/detect-mission", {"text": "Need groceries for movie night"}, expected_status=200)
    
    # B. Verification Engine
    test_endpoint("Verification Engine", "POST", f"{base_url}/verification/verify", {"missionId": "birthday_party", "cartId": "cart_test"}, expected_status=200)
    
    # C. Risk Engine
    test_endpoint("Risk Engine", "POST", f"{base_url}/risk/analyze", {"verification_score": 50, "missing_items": ["product_cake"]}, expected_status=200)
    
    # D. Prevention Engine
    test_endpoint("Prevention Engine - Allow", "POST", f"{base_url}/prevent-checkout", {"missionId": "birthday_party", "cartId": "cart_full"}, expected_status=200)
    test_endpoint("Prevention Engine - Block", "POST", f"{base_url}/prevent-checkout", {"missionId": "birthday_party", "cartId": "cart_empty"}, expected_status=200)

if __name__ == "__main__":
    main()
