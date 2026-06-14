# API Test Cases for Swagger UI

Use these payloads to test the LifeGraph engine endpoints via Swagger UI (`http://127.0.0.1:8000/docs`).

## 1. Birthday Party
**POST /verification/verify**
```json
{
  "missionId": "MISSION_BIRTHDAY_01",
  "cartId": "CART_BIRTHDAY_01"
}
```
**POST /risk/analyze**
```json
{
  "verification_score": 50,
  "missing_items": ["Candles", "Balloons"]
}
```
**POST /prevent-checkout**
```json
{
  "missionId": "MISSION_BIRTHDAY_01",
  "cartId": "CART_BIRTHDAY_01"
}
```

## 2. Road Trip
**POST /verification/verify**
```json
{
  "missionId": "MISSION_ROADTRIP_01",
  "cartId": "CART_ROADTRIP_01"
}
```
**POST /risk/analyze**
```json
{
  "verification_score": 50,
  "missing_items": ["Spare Tire", "First Aid Kit"]
}
```
**POST /prevent-checkout**
```json
{
  "missionId": "MISSION_ROADTRIP_01",
  "cartId": "CART_ROADTRIP_01"
}
```

## 3. Camping
**POST /verification/verify**
```json
{
  "missionId": "MISSION_CAMPING_01",
  "cartId": "CART_CAMPING_01"
}
```
**POST /risk/analyze**
```json
{
  "verification_score": 50,
  "missing_items": ["Sleeping Bag", "Bug Spray"]
}
```
**POST /prevent-checkout**
```json
{
  "missionId": "MISSION_CAMPING_01",
  "cartId": "CART_CAMPING_01"
}
```

## 4. Fitness Journey
**POST /verification/verify**
```json
{
  "missionId": "MISSION_FITNESS_01",
  "cartId": "CART_FITNESS_01"
}
```
**POST /risk/analyze**
```json
{
  "verification_score": 100,
  "missing_items": []
}
```
**POST /prevent-checkout**
```json
{
  "missionId": "MISSION_FITNESS_01",
  "cartId": "CART_FITNESS_01"
}
```

## 5. New Phone Setup
**POST /verification/verify**
```json
{
  "missionId": "MISSION_PHONE_01",
  "cartId": "CART_PHONE_01"
}
```
**POST /risk/analyze**
```json
{
  "verification_score": 50,
  "missing_items": ["Screen Protector", "Wall Charger"]
}
```
**POST /prevent-checkout**
```json
{
  "missionId": "MISSION_PHONE_01",
  "cartId": "CART_PHONE_01"
}
```

## 6. Home Office Setup
**POST /verification/verify**
```json
{
  "missionId": "MISSION_HOMEOFFICE_01",
  "cartId": "CART_HOMEOFFICE_01"
}
```
**POST /risk/analyze**
```json
{
  "verification_score": 75,
  "missing_items": ["Monitor"]
}
```
**POST /prevent-checkout**
```json
{
  "missionId": "MISSION_HOMEOFFICE_01",
  "cartId": "CART_HOMEOFFICE_01"
}
```

## 7. Movie Night
**POST /verification/verify**
```json
{
  "missionId": "MISSION_MOVIENIGHT_01",
  "cartId": "CART_MOVIENIGHT_01"
}
```
**POST /risk/analyze**
```json
{
  "verification_score": 50,
  "missing_items": ["Candy", "Soda"]
}
```
**POST /prevent-checkout**
```json
{
  "missionId": "MISSION_MOVIENIGHT_01",
  "cartId": "CART_MOVIENIGHT_01"
}
```

## 8. Baby Shower
**POST /verification/verify**
```json
{
  "missionId": "MISSION_BABYSHOWER_01",
  "cartId": "CART_BABYSHOWER_01"
}
```
**POST /risk/analyze**
```json
{
  "verification_score": 75,
  "missing_items": ["Baby Clothes"]
}
```
**POST /prevent-checkout**
```json
{
  "missionId": "MISSION_BABYSHOWER_01",
  "cartId": "CART_BABYSHOWER_01"
}
```

## 9. College Move-In
**POST /verification/verify**
```json
{
  "missionId": "MISSION_COLLEGE_01",
  "cartId": "CART_COLLEGE_01"
}
```
**POST /risk/analyze**
```json
{
  "verification_score": 50,
  "missing_items": ["Twin XL Sheets", "Laundry Hamper"]
}
```
**POST /prevent-checkout**
```json
{
  "missionId": "MISSION_COLLEGE_01",
  "cartId": "CART_COLLEGE_01"
}
```

## 10. Weekend Picnic
**POST /verification/verify**
```json
{
  "missionId": "MISSION_PICNIC_01",
  "cartId": "CART_PICNIC_01"
}
```
**POST /risk/analyze**
```json
{
  "verification_score": 75,
  "missing_items": ["Sandwiches"]
}
```
**POST /prevent-checkout**
```json
{
  "missionId": "MISSION_PICNIC_01",
  "cartId": "CART_PICNIC_01"
}
```
