import requests
import json

def test_risk():
    url = "http://127.0.0.1:8000/risk/analyze"
    payload = {
        "verification_score": 50,
        "missing_items": ["Cake"]
    }
    
    try:
        res = requests.post(url, json=payload)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_risk()
