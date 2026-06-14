import requests
import json

def detect(text):
    url = "http://127.0.0.1:8000/detect-mission"
    try:
        res = requests.post(url, json={"text": text})
        print(f"Input:\n\"{text}\"\n")
        print("Output:")
        print(json.dumps(res.json().get("data", {}), indent=2))
        print("-" * 40)
    except Exception as e:
        print(f"Failed to call API: {e}")

if __name__ == "__main__":
    phrases = [
        "My wife and I are celebrating our anniversary",
        "We are moving into a new house",
        "Need supplies for a baby shower"
    ]
    for p in phrases:
        detect(p)
