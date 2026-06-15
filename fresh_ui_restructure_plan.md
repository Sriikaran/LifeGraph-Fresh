# Fresh UI Restructure Plan

## Goal
Transform the current generic `fresh.tsx` page into a premium, Amazon Fresh-style storefront experience with categorized carousels, hero banners, and a sticky navigation strip, while strictly reusing existing APIs and backend logic.

## Component Tree
The `fresh.tsx` file will be refactored into the following high-level structure:

```tsx
<FreshPage>
  <FreshNavigation /> {/* Sticky horizontal category strip */}
  <FreshHero />       /* Premium lifestyle banner */
  
  <div className="main-content-container">
    <FreshCarousel title="Featured Products" products={featuredProducts} />
    <FreshCarousel title="Fruits & Vegetables" products={fruits} />
    <FreshCarousel title="Grocery" products={grocery} />
    <FreshCarousel title="Bakery, Cakes & Dairy" products={bakery} />
    <FreshCarousel title="Beverages" products={beverages} />
    
    <PromoBanner />   /* Promotional strip */
    
    <FreshCarousel title="Snacks & Sweets" products={snacks} />
    <FreshCarousel title="Health & Personal Care" products={health} />
    <FreshCarousel title="Beauty & Hygiene" products={beauty} />
    <FreshCarousel title="Cleaning & Household" products={cleaning} />
    <FreshCarousel title="Baby Care" products={baby} />
    <FreshCarousel title="Pet Care" products={pet} />
    <FreshCarousel title="Festivals" products={festivals} />
    <FreshCarousel title="Home" products={home} />
    <FreshCarousel title="Student" products={student} />
    <FreshCarousel title="Travel" products={travel} />
  </div>
</FreshPage>
```

## Category Mapping
Categories will be rendered strictly in this requested order. Sections with zero products will be hidden automatically.

1. **Featured Products** (Top 15 globally)
2. **Fruits & Vegetables** (`FRUITS_&_VEGETABLES`)
3. **Grocery** (`GROCERY`)
4. **Bakery, Cakes & Dairy** (`BAKERY,_CAKES_&_DAIRY`)
5. **Beverages** (`BEVERAGES`)
6. *[Promo Banner]*
7. **Snacks & Sweets** (`SNACKS_&_SWEETS`)
8. **Health & Personal Care** (`HEALTH_AND_PERSONAL_CARE`)
9. **Beauty & Hygiene** (`BEAUTY_&_HYGIENE`)
10. **Cleaning & Household** (`CLEANING_&_HOUSEHOLD`)
11. **Baby Care** (`BABY_CARE`)
12. **Pet Care** (`PET_CARE`)
13. **Festivals** (`FESTIVALS`)
14. **Home** (`HOME`)
15. **Student** (`STUDENT`)
16. **Travel** (`TRAVEL`)

## Product Ranking Logic
To ensure a premium feel, the existing `hasOriginalProductImage` helper will be utilized to prioritize products with original imagery.

For each category, products will be sorted by:
1. `hasOriginalProductImage` (TRUE > FALSE)
2. `reviews` (DESC)
3. `rating` (DESC)
4. `price` (DESC)

We will slice the sorted array to take a maximum of **20 products** per category showcase.

## Carousel Architecture
Instead of using the heavy `ProductRow` (which is quite large and limits visible cards), we will build a `FreshCarousel` component in `fresh.tsx` tailored to the requirements:
- **Card sizing:** Smaller footprint to allow 6-7 cards on desktop, 4 on tablet, and 2 on mobile.
- **Scroll behavior:** Native horizontal scroll with `snap-x` and hidden scrollbars, paired with absolute positioned Left/Right chevron buttons on desktop.
- **Design:** Each carousel section will have `background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px;` with a 28px bold title and a blue "See All >" link.

## Performance Strategy
- **Memoization:** Product filtering and sorting will be wrapped in `useMemo` hooks per category to prevent recalculating on re-renders.
- **Dom Nodes Reduction:** Rendering max 20 products across ~15 categories limits the DOM to ~300 product cards, rather than the current 1400+ massive grid.
- **Lazy Loading:** All product images will continue to use `loading="lazy"`.

## Mobile Responsiveness Strategy
- **Sticky Navigation:** `overflow-x-auto scrollbar-hide` to allow swiping through categories smoothly.
- **Hero:** Height adjusts automatically (e.g., 200px mobile, 300-400px desktop).
- **Carousels:** Will rely on CSS Grid/Flex sizing (e.g., `w-[calc(50%-10px)]` on mobile) to ensure exactly 2 cards are shown at a time. Scroll buttons will be hidden on mobile/touch devices.

## User Review Required
> [!IMPORTANT]
> The current global `hasOriginalProductImage` function from `@/lib/imageFallbacks` will be utilized. Let me know if the plan aligns with your expectations, and I will begin the implementation!
