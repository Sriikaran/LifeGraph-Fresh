# Verification Engine: FRD Alignment

## Objective
Upgrade the Verification Engine from basic missing-item detection to a full mission readiness assessment, complying with the Business Functional Requirements Document (FRD).

## Schema Upgrades

### Old Response (`VerificationResponseData`)
```json
{
  "verification_score": 60,
  "missing_items": ["Cake", "Candles"]
}
```

### New Response (`VerificationResponseData`)
```json
{
  "verification_score": 60,
  "missing_items": ["Cake", "Candles"],
  "readiness_score": 50,
  "recommended_additions": ["Ice Cream Cake", "Sparkler Candles", "Lighter"]
}
```

## Logic Enhancements

### Readiness Scoring Formula
The engine now explicitly calculates how "ready" a cart is to execute its mission:
```python
readiness_score = (required_items_present / total_required_items) * 100
```
This guarantees a strict `0-100` score based purely on boolean presence of required components.

### Recommendation Generation Logic
For every item detected in the `missing_items` array, the Verification Service now queries the `GraphService`:
```python
substitutes = graph_service.get_product_substitutes(missing_item)
```
These substitutes are appended to the `recommended_additions` list and deduplicated. This prevents user cart abandonment by offering immediate, graphed alternatives to out-of-stock or missing items.

---

## Example Outputs

### 1. Birthday
**Scenario:** User has Balloons and Drinks, but forgot the Cake.
* **Missing:** `["Cake", "Candles"]`
* **Readiness Score:** `50` (2/4 required items present)
* **Recommendations:** `["Ice Cream Cake", "Cupcakes", "Sparkler Candles", "Lighter"]`

### 2. Camping
**Scenario:** User bought a Sleeping Bag, but no Tent.
* **Missing:** `["Tent", "Flashlight"]`
* **Readiness Score:** `33` (1/3 required items present)
* **Recommendations:** `["Pop-up Tent", "Headlamp", "Lantern"]`

### 3. Road Trip
**Scenario:** User bought Snacks, but no emergency gear.
* **Missing:** `["Spare Tire", "Jumper Cables"]`
* **Readiness Score:** `20` (1/5 required items present)
* **Recommendations:** `["Tire Repair Kit", "Portable Jump Starter"]`

### 4. Fitness
**Scenario:** User bought Protein Powder, but no equipment.
* **Missing:** `["Dumbbells", "Yoga Mat"]`
* **Readiness Score:** `33` (1/3 required items present)
* **Recommendations:** `["Kettlebells", "Resistance Bands", "Exercise Mat"]`
