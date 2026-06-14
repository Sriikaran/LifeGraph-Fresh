import requests
import json

def test_prevention():
    url = "http://127.0.0.1:8000/prevent-checkout"
    payload = {
        "missionId": "MISSION_1",
        "cartId": "CART_1"
    }
    
    try:
        res = requests.post(url, json=payload)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_prevention()
