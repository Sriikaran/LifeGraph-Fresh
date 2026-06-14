# Person 2 Manual Test Guide

## 1. Actual Seeded Data in DynamoDB

### Seeded Missions
* `BIRTHDAY`: Birthday Party
* `FITNESS`: Fitness Journey
* `MOVIE_NIGHT`: Movie Night
* `ROAD_TRIP`: Road Trip
* `HOUSE_WARMING`: House Warming

### Seeded Graph Relationships
* `BIRTHDAY` REQUIRES: `CAKE001`, `CANDLE001`, `DRINK001`, `SNACK001`
* `FITNESS` REQUIRES: `PROTEIN001`, `OATS001`, `WATER_BOTTLE001`, `GYM_GLOVES001`
* `MOVIE_NIGHT` REQUIRES: `POPCORN001`, `SOFT_DRINK001`, `CHIPS001`

### Seeded Products (Implied by Edges)
* `CAKE001`, `CANDLE001`, `DRINK001`, `SNACK001`
* `PROTEIN001`, `OATS001`, `WATER_BOTTLE001`, `GYM_GLOVES001`
* `POPCORN001`, `SOFT_DRINK001`, `CHIPS001`

### Example Carts
* `cart_full`: Contains all required items for a mission.
* `cart_missing_cake`: Contains `CANDLE001`, `DRINK001`, `SNACK001`, but missing `CAKE001`.

---

## 2. Test Execution Guide

### A. Mission Detection Tests

**Test 1: Birthday**
* Endpoint: `POST /detect-mission`
* Payload: `{"text": "My friend turns 20 tomorrow"}`
* Expected Response: `{"success": true, "data": {"detected_mission": "BIRTHDAY", "confidence": 0.94, "matched_keywords": ["friend", "turns 20", "turns"]}}`

**Test 2: Camping**
* Endpoint: `POST /detect-mission`
* Payload: `{"text": "I am going camping this weekend"}`
* Expected Response: `{"success": true, "data": {"detected_mission": "CAMPING", "confidence": 0.6, "matched_keywords": ["camping"]}}`

**Test 3: Movie Night**
* Endpoint: `POST /detect-mission`
* Payload: `{"text": "Need groceries for movie night"}`
* Expected Response: `{"success": true, "data": {"detected_mission": "UNKNOWN", "confidence": 0.0, "matched_keywords": []}}` (Rule missing for 'movie night')

### B. Verification Engine Tests

**Test: Birthday Cart with Missing Items**
* Endpoint: `POST /verification/verify`
* Payload: `{"missionId": "BIRTHDAY", "cartId": "cart_missing_cake"}`
* Expected Readiness Score: `75` (3 out of 4 items present)
* Expected Missing Items: `["CAKE001"]`
* Expected Recommendations: `["CAKE001"]` (or dynamically generated alternatives based on the graph)

### C. Risk Engine Tests

**Test: Analyze High Risk**
* Endpoint: `POST /risk/analyze`
* Payload: `{"verification_score": 50, "missing_items": ["CAKE001", "CANDLE001"]}`
* Expected Output:
  * Compatibility Risk: (Graph lookup response)
  * Quantity Risk: "Moderate"
  * Timing Risk: "Low"
  * Budget Risk: "Low"
  * Risk Score: `>= 70`

### D. Prevention Engine Tests

**Test: Allow Checkout**
* Endpoint: `POST /prevent-checkout`
* Payload: `{"missionId": "BIRTHDAY", "cartId": "cart_full"}`
* Expected Response: `{"allow_checkout": true, "reason": ""}`

**Test: Block Checkout**
* Endpoint: `POST /prevent-checkout`
* Payload: `{"missionId": "BIRTHDAY", "cartId": "cart_empty"}`
* Expected Response: `{"allow_checkout": false, "reason": "High risk or low verification score detected. Checkout blocked."}`

### E. End-to-End Demo Tests

**Flow:**
1. Call `POST /detect-mission` -> returns `BIRTHDAY`
2. Call `POST /verification/verify` with `BIRTHDAY` and `cartId` -> returns verification payload
3. Call `POST /risk/analyze` with verification score -> returns risk score
4. Call `POST /prevent-checkout` -> evaluates risk score internally and allows or blocks checkout.
