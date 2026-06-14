import requests

texts = [
    'My wife and I complete 10 years next month',
    'Our wedding milestone is coming',
    'Need something for our marriage celebration'
]

print('Current Accuracy:')
for text in texts:
    r = requests.post('http://127.0.0.1:8000/detect-mission', json={'text': text})
    print(f'"{text}" -> {r.json().get("data", {}).get("detected_mission")}')
