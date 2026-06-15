# Final Fix Strategy

## Root Causes Identified
1. **Stub Products Consuming Slots**: The backend orchestrator returns product IDs that do not exist in the `allProducts` database (hallucinated or outdated IDs). The expansion logic blindly accepted these IDs and counted them towards the 8 and 12 limits. However, `OutcomeProductSlider` silenty drops these "stub" IDs during rendering. This results in the visual count being lower than the logical array length.
2. **Cross-Section Duplication in Non-Demo Expansion**: The deduplication logic successfully prevented products in `missing_items` from entering `recommended_products`. However, during the non-demo AI text-search expansion, the loop pushed high-scoring products into `missing_items` WITHOUT checking if they were already present in `recommended_products`. This caused items like "Nature Purify Dry Fruits Festival Gift Pack" to exist in both arrays.
3. **Broken Images**: The `validPool` correctly filters out `IMAGERENDERING` and `placeholder`, but this filter was ONLY applied to the expansion candidates. It was NEVER applied to the products returned directly by the backend. Therefore, if the backend recommended a product with a broken image, it bypassed the filter and rendered on screen.

## Proposed Fixes

### 1. Pre-Expansion Validation (Fixes Under-rendering & Broken Images)
Before counting the length of `missing_items` and `optional_missing`, we must sanitize the arrays returned by the backend:
- Remove any ID that does not exist in `allProducts`.
- Remove any ID where the product has a broken image (`IMAGERENDERING` or `placeholder`).
- Remove any ID where the product price is 0.

By filtering these out *first*, the arrays will accurately reflect what will actually be rendered. The expansion loops will then correctly fill the remaining slots with valid, real products until the counts reach exactly 8 and 12.

### 2. Bidirectional Deduplication (Fixes Duplicate Rendering)
Update the expansion loops to respect both arrays:
```typescript
while (missingIds.length < 8 && i < ranked.length) {
  if (!currentMissing.has(ranked[i].id) && !currentRecommended.has(ranked[i].id)) {
    missingIds.push(ranked[i].id);
    currentMissing.add(ranked[i].id);
  }
  i++;
}
```
This guarantees that if an item is already queued for Recommended Additions (from the backend), it will not be hijacked by the Missing Essentials expansion loop.