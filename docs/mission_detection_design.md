# Mission Detection MVP Design

## Objective
To automatically map natural language user intent to a specific structured Amazon LifeGraph mission. 

*Note: Phase 1 of this implementation relies entirely on a rule-based exact-match and regex heuristic system. No LLMs are invoked in Phase 1 to guarantee deterministic behavior and zero latency during the MVP phase.*

## Supported Missions
The MVP currently maps user text to the following 5 predefined missions:
1. `BIRTHDAY`
2. `CAMPING`
3. `ROAD_TRIP`
4. `FITNESS`
5. `PHONE_SETUP`

## Detection Logic
The `MissionDetectionService` normalizes incoming text to lowercase and iterates through a predefined dictionary of keywords/regex patterns for each mission.

### Keyword Mappings:
* **Birthday:** `friend`, `birthday`, `turns\s+\d+`, `turns`, `celebration`, `party`
* **Camping:** `camping`, `tent`, `trek`, `hiking`
* **Road Trip:** `road trip`, `travel`, `highway`, `drive`
* **Fitness:** `gym`, `workout`, `fitness`, `muscle`
* **Phone Setup:** `phone`, `iphone`, `android`, `charger`

When the service iterates through the rules, it matches substrings or evaluates the regex pattern against the user's input. The mission that yields the highest confidence score is selected.

## Confidence Scoring
Because Phase 1 does not use vector embeddings or probabilistic LLMs, the confidence score is calculated deterministically based on the volume of keyword "hits":
* **1 match found:** `0.60` confidence
* **2 matches found:** `0.85` confidence
* **3+ matches found:** `0.94` confidence

## API Examples

### Example 1: Birthday
**POST /detect-mission**
```json
{
  "text": "My friend turns 20 tomorrow for her birthday party"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "detected_mission": "BIRTHDAY",
    "confidence": 0.94,
    "matched_keywords": [
      "friend",
      "birthday",
      "turns 20",
      "turns",
      "party"
    ]
  }
}
```

### Example 2: Fitness
**POST /detect-mission**
```json
{
  "text": "I need to hit the gym for a workout"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "detected_mission": "FITNESS",
    "confidence": 0.85,
    "matched_keywords": [
      "gym",
      "workout"
    ]
  }
}
```
