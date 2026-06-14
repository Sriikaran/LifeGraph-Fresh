import requests
import json
import time

test_cases = [
    "My wife and I complete 10 years next month",
    "Our wedding milestone is coming",
    "Need something for our marriage celebration",
    "My friend turns 20 tomorrow",
    "We finally bought our first apartment",
    "Our baby arrives in a few weeks"
]

print("Executing API tests against http://127.0.0.1:8000/detect-mission\n")
for text in test_cases:
    start = time.time()
    r = requests.post("http://127.0.0.1:8000/detect-mission", json={"text": text})
    end = time.time()
    
    latency = (end - start) * 1000
    res = r.json()
    
    print(f"Request:  {text}")
    print(f"Latency:  {latency:.2f} ms")
    print(f"Response: {json.dumps(res, indent=2)}\n")
    print("-" * 50)
