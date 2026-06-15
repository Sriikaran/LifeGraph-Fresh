# Fresh Page Data Pipeline Verification

## Rendered Fresh Daily Essentials (subcat="")
- **Total products loaded:** 1439
- **Products with real images:** 887
- **Products with fallback images:** 552

## First 20 Rendered Products

| # | Product Name | Image URL | Real Image | Rating | Reviews | Priority |
|---|---|---|---|---|---|---|
| 1 | Tata Tea Gold | Assam teas with Gently Rolled Aromatic Long Leaves | Rich & Aromatic Chai | Black Tea | 500g | `https://m.media-amazon.com/images/I/51kEujuYlpL._AC_UL320_.jpg` | Yes | 4.4 | 15528 | 16968 |
| 2 | Organic - Whole Wheat Multi Grain Atta/Godihittu | `/assets/categories/organic_staples.jpg` | No | 4.5 | 14885 | 15335 |
| 3 | Cheese Crunchy Layered Crackers | `/assets/categories/cookies_rusk_khari.jpg` | No | 4.5 | 14881 | 15331 |
| 4 | Rusk - Garlic | `/assets/categories/cookies_rusk_khari.jpg` | No | 4.6 | 14869 | 15329 |
| 5 | Bar Cake - Chocolate | `/assets/categories/cakes_pastries.jpg` | No | 4.8 | 14848 | 15328 |
| 6 | Carrot Walnut Cake - 100% Wholewheat | `/assets/categories/cakes_pastries.jpg` | No | 4.6 | 14852 | 15312 |
| 7 | Organic Ginger Sliced | `/assets/categories/organic_staples.jpg` | No | 4.8 | 14770 | 15250 |
| 8 | Red Puttu Powder | `/assets/categories/atta_flours_sooji.jpg` | No | 4.8 | 14692 | 15172 |
| 9 | Cookies - Chocochip | `/assets/categories/cookies_rusk_khari.jpg` | No | 4.8 | 14539 | 15019 |
| 10 | Grinder - Rock Salt | `/assets/categories/masalas_spices.jpg` | No | 4.7 | 14528 | 14998 |
| 11 | Cow Ghee/Tuppa - A2 Badri | `/assets/categories/edible_oils_ghee.jpg` | No | 4.6 | 14409 | 14869 |
| 12 | Shahi Sabji Masala | `/assets/categories/masalas_spices.jpg` | No | 4.8 | 14283 | 14763 |
| 13 | Khatai - Two In One | `/assets/categories/cookies_rusk_khari.jpg` | No | 4.6 | 14277 | 14737 |
| 14 | Cheese Spreadz - Roasted Garlic Flavour | `/assets/categories/dairy.jpg` | No | 4.5 | 14282 | 14732 |
| 15 | Cake - Orange Blueberry, Whole Wheat, Eggless | `/assets/categories/cakes_pastries.jpg` | No | 4.6 | 14251 | 14711 |
| 16 | Masala - Dal Makhni | `/assets/categories/masalas_spices.jpg` | No | 4.8 | 14230 | 14710 |
| 17 | Rock Salt/Uppu - Natural | `/assets/categories/salt_sugar_jaggery.jpg` | No | 4.6 | 14241 | 14701 |
| 18 | Dal Tadka Masala With Natural Oils | `/assets/categories/masalas_spices.jpg` | No | 4.7 | 14213 | 14683 |
| 19 | Saindhava Lavana Crystal Rock Salt | `/assets/categories/salt_sugar_jaggery.jpg` | No | 4.8 | 14197 | 14677 |
| 20 | Powder - Sambar | `/assets/categories/masalas_spices.jpg` | No | 4.6 | 14214 | 14674 |

## Pipeline Trace

1. **Where products are fetched:** `src/routes/fresh.tsx` via `useProducts()` which calls `GET http://localhost:8000/products`
2. **Where filtering occurs:** Inside `useMemo` for `allFresh` (filtering by 5 category enums) and another `useMemo` for `filtered` (filtering by subcategory string, though in this case subcat="" so no additional filtering happens).
3. **Where sorting occurs:** Inside the `filtered` useMemo block: `return sortProductsByImagePriority(list);`
4. **Where slicing/limiting occurs:** No slicing occurs in `fresh.tsx` for the main grid! The entire `filtered` array is rendered via `.map()`. However, the page naturally lazy-loads images if configured, but React renders all DOM nodes.

### Execution Order

The execution flow is **Filter -> Sort** (and then render all). There is NO slice step in the main grid, but the data pipeline sequence is:
1. **Filter** (allFresh logic and subcat logic)
2. **Sort** (`sortProductsByImagePriority` applied to the filtered list)

Since there is no slice, all products matching the filter are sorted and mapped into `ProductCard` components.
