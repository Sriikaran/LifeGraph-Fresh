# LifeGraph Demo Scenarios

This document outlines 10 realistic Amazon LifeGraph missions that can be used for demos, testing, and frontend integration.

| Mission Name | Required Products | Example Incomplete Cart | Missing Items | Expected Verification Score | Expected Risk Level | Expected Prevention Result | Expected Success Probability |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Birthday Party** | Cake, Candles, Balloons, Invitations | Cake, Invitations | Candles, Balloons | 50% | MEDIUM | Review Warning | 60% |
| **Road Trip** | Spare Tire, First Aid Kit, Snacks, Jumper Cables | Snacks, Jumper Cables | Spare Tire, First Aid Kit | 50% | HIGH | Checkout Blocked | 40% |
| **Camping** | Tent, Sleeping Bag, Flashlight, Bug Spray | Tent, Flashlight | Sleeping Bag, Bug Spray | 50% | HIGH | Checkout Blocked | 45% |
| **Fitness Journey** | Running Shoes, Water Bottle, Fitness Tracker, Gym Bag | Running Shoes, Water Bottle, Fitness Tracker, Gym Bag | *None* | 100% | LOW | Checkout Allowed | 95% |
| **New Phone Setup** | Smartphone, Phone Case, Screen Protector, Wall Charger | Smartphone, Phone Case | Screen Protector, Wall Charger | 50% | MEDIUM | Review Warning | 70% |
| **Home Office Setup** | Desk, Ergonomic Chair, Monitor, Keyboard | Desk, Ergonomic Chair, Keyboard | Monitor | 75% | LOW | Checkout Allowed | 85% |
| **Movie Night** | Popcorn, Candy, Soda, Blanket | Popcorn, Blanket | Candy, Soda | 50% | LOW | Checkout Allowed | 80% |
| **Baby Shower** | Diapers, Wipes, Baby Clothes, Gift Bag | Diapers, Wipes, Gift Bag | Baby Clothes | 75% | MEDIUM | Review Warning | 75% |
| **College Move-In** | Twin XL Sheets, Shower Caddy, Desk Lamp, Laundry Hamper | Shower Caddy, Desk Lamp | Twin XL Sheets, Laundry Hamper | 50% | HIGH | Checkout Blocked | 30% |
| **Weekend Picnic** | Picnic Basket, Blanket, Sandwiches, Sunscreen | Picnic Basket, Blanket, Sunscreen | Sandwiches | 75% | MEDIUM | Review Warning | 80% |
