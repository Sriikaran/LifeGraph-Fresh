# Image Priority Fix Report

## Previous Logic
```typescript
const aPriority = (hasRealImage(a) ? 1000 : 0) + (a.reviews || 0) + ((a.rating || 0) * 100);
const bPriority = (hasRealImage(b) ? 1000 : 0) + (b.reviews || 0) + ((b.rating || 0) * 100);
return bPriority - aPriority;
```
*Flaw: A fallback image with 15,000 reviews scored 15,000, beating a real image with 0 reviews (score 1000).*

## New Logic
```typescript
const aReal = hasRealImage(a);
const bReal = hasRealImage(b);
if (aReal && !bReal) return -1;
if (!aReal && bReal) return 1;
if (a.reviews !== b.reviews) return (b.reviews || 0) - (a.reviews || 0);
return (b.rating || 0) - (a.rating || 0);
```
*Result: Strict two-tier sort. Real images ALWAYS beat fallback images regardless of reviews/rating.*

## Affected Files
- `src/lib/imageFallbacks.ts` (Core logic updated)
- `src/routes/deals.tsx` (Replaced inline discount sorts with strict two-tier sort)
- All other files (`fresh.tsx`, `browse.tsx`, `grocery.tsx`, `index.tsx`, `new-releases.tsx`, `product.$id.tsx`) automatically inherit the fix because they call `sortProductsByImagePriority`.

## Verification (First 20 Rendered Fresh Products)

| # | Product Name | Real Image | Rating | Reviews |
|---|---|---|---|---|
| 1 | Pintola Organic Wholegrain Brown Rice Cakes - All Natural (Lightly Salted, Pack of 1) (125 g) | Yes | 3.9 | 1904 |
| 2 | Aashirvaad Sugar Release Control Atta, 5kg Pack, Low GI Atta | Yes | 4.4 | 1762 |
| 3 | Manna Foxtail Millet Natural Grains, 1kg (500g x 2 Packs) - (Kaon/Kang/Kangni/Kakum/Navani/korralu/Korra/Thinai) | Native ... | Yes | 4.3 | 1572 |
| 4 | Catch Meat Masala, 100g | Yes | 4.3 | 1368 |
| 5 | Tata Sampann 6 Grain Khichdi Mix, Instant Ready to Cook Mix, 180g | Yes | 4.2 | 1307 |
| 6 | Rungtas Real Gold Special Assam Black Tea - 2 Kg | Strong & Fresh Kadak Chai | India Premium Blended Aromatic Long Leaf Te... | Yes | 4.3 | 1154 |
| 7 | VAHDAM Organic Chamomile Tea Bags with Mint & Citrus - 15 Units | Green Tea for Weight Loss | USDA Certified | For Stress ... | Yes | 4.3 | 1086 |
| 8 | HAIM Organic wholegrain Brown Rice Cakes (All Natural, Unsalted) Pack of 1 110g | Yes | 4.2 | 1020 |
| 9 | Haldiram's Nagpur All in One, 200g | Yes | 4.2 | 973 |
| 10 | Beyond Snáck Natural Kerala Banana Chips Healthy and Delicious Snacks- No Hand Touch- Original Style Salted 600gms | Yes | 3.8 | 794 |
| 11 | Birju Mahavir Gond Katira - Tragacanth Gum 1 KG | Yes | 4.2 | 747 |
| 12 | Keya Arabian Sea Salt 1kg… | Yes | 4.3 | 583 |
| 13 | WAGH BAKRI INSTANT TEA PREMIX ELAICHI,GINGER & MASALA COMBO PACK | Yes | 4.1 | 575 |
| 14 | Samyang Vegetarian Kimchi Ramen, 5 X 120 g | Yes | 4.1 | 514 |
| 15 | Naturals & Consumatic Brand Kerala PAPPADAM - Traditional Homemade PAPPADAM / PAPAD -(55~60 Nos - 4Inch - 300 GM) - Ready ... | Yes | 4.2 | 471 |
| 16 | Sunbean Beaten Caffe Strong, 125g | Rich, Creamy Strong Beaten Coffee | Whipped Coffee Paste | Strong Instant Beaten Coffe... | Yes | 3.9 | 450 |
| 17 | Mapro Lemon Ginger Squash, 750ml | Yes | 4.3 | 421 |
| 18 | Del Monte Tomato Ketchup, Classic Blend, 200g | Yes | 4.2 | 389 |
| 19 | MORDE DARK COMPOUND - 500 g (Combo Pack of 2) | Yes | 4.3 | 387 |
| 20 | ElectroFizz Instant Hydration Energy Drink for Workout for Men and Women- Electrolyte Powder, Vitamin C, Probiotics - 1 Kg... | Yes | 4 | 387 |
