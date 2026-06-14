import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useProducts, CATEGORY_LABELS } from "@/lib/api/products";
import { sortProductsByImagePriority, hasOriginalProductImage } from "@/lib/imageFallbacks";
import { ProductCard, StarRating } from "@/components/store/ProductCard";
import { ChevronDown, Loader2 } from "lucide-react";

export const Route = createFileRoute("/browse")({
  validateSearch: (s: Record<string, unknown>) => ({
    cat: (s.cat as string) || "",
    sort: (s.sort as string) || "featured",
    minRating: Number(s.minRating) || 0,
    prime: s.prime === "true",
  }),
  component: Browse,
});

function Browse() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/browse" });
  const [maxPrice, setMaxPrice] = useState(10000);
  const [brand, setBrand] = useState<string>("");

  const { data: products = [], isLoading } = useProducts();

  const filtered = useMemo(() => {
    let list = products.slice();
    if (search.q) {
      const qLower = search.q.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(qLower) || p.brand.toLowerCase().includes(qLower) || p.category.toLowerCase().includes(qLower));
    }
    if (search.cat && search.cat !== "All Categories") list = list.filter((p) => p.category === search.cat);
    if (search.minRating) list = list.filter((p) => p.rating >= search.minRating);
    if (search.prime) list = list.filter((p) => p.prime);
    if (brand) list = list.filter((p) => p.brand === brand);
    list = list.filter((p) => p.price <= maxPrice);
    list = sortProductsByImagePriority(list);
    if (search.sort !== "featured") {
      list.sort((a, b) => {
        const aReal = hasOriginalProductImage(a);
        const bReal = hasOriginalProductImage(b);
        if (aReal && !bReal) return -1;
        if (!aReal && bReal) return 1;
        if (search.sort === "price-asc") return a.price - b.price;
        if (search.sort === "price-desc") return b.price - a.price;
        if (search.sort === "rating") return b.rating - a.rating;
        return 0;
      });
    }
    return list;
  }, [products, search, maxPrice, brand]);

  const categories = Array.from(new Set(products.map(p => p.category)));
  const brands = Array.from(new Set(products.filter(p => !search.cat || p.category === search.cat).map(p => p.brand))).filter(Boolean);

  return (
    <div className="mx-auto max-w-[1500px] px-2 py-4 flex gap-4">
      <aside className="hidden lg:block w-60 shrink-0 bg-card p-4 h-fit sticky top-[105px]">
        <h3 className="font-bold mb-2">Category</h3>
        <ul className="space-y-1 text-sm mb-4">
          <li>
            <button
              onClick={() => navigate({ search: (p: any) => ({ ...p, cat: "" }) })}
              className={`hover:text-link-hover hover:underline ${!search.cat ? "font-bold" : ""}`}
            >All categories</button>
          </li>
          {categories.map((c) => (
            <li key={c}>
              <button
                onClick={() => navigate({ search: (p: any) => ({ ...p, cat: c }) })}
                className={`hover:text-link-hover hover:underline ${search.cat === c ? "font-bold" : ""}`}
              >{CATEGORY_LABELS[c] || c.replace(/_/g, " ")}</button>
            </li>
          ))}
        </ul>

        <h3 className="font-bold mb-2">Customer Reviews</h3>
        <div className="space-y-1 mb-4">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => navigate({ search: (p: any) => ({ ...p, minRating: r }) })}
              className="flex items-center gap-2 text-sm hover:text-link-hover"
            >
              <StarRating value={r} /> & up
            </button>
          ))}
        </div>

        <h3 className="font-bold mb-2">Price</h3>
        <input type="range" min={50} max={10000} step={50} value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full" />
        <div className="text-xs text-muted-foreground mb-4">Up to ₹{maxPrice.toLocaleString("en-IN")}</div>

        <h3 className="font-bold mb-2">Brand</h3>
        <ul className="space-y-1 text-sm max-h-48 overflow-auto">
          <li><button onClick={() => setBrand("")} className={!brand ? "font-bold" : ""}>All brands</button></li>
          {brands.map((b) => (
            <li key={b}><button onClick={() => setBrand(b)} className={brand === b ? "font-bold" : ""}>{b}</button></li>
          ))}
        </ul>

      </aside>

      <div className="flex-1 min-w-0">
        <div className="bg-card px-4 py-3 flex items-center justify-between flex-wrap gap-2 shadow-sm">
          <div className="text-sm">
            {search.cat && <span className="text-deal font-bold">"{CATEGORY_LABELS[search.cat] || search.cat.replace(/_/g, " ")}"</span>}
            <span className="text-muted-foreground"> — {filtered.length} results</span>
          </div>
          <label className="text-sm flex items-center gap-2">
            Sort by:
            <div className="relative">
              <select
                value={search.sort}
                onChange={(e) => navigate({ search: (p: any) => ({ ...p, sort: e.target.value }) })}
                className="border border-border rounded px-3 py-1.5 appearance-none pr-8 bg-card"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 pointer-events-none" />
            </div>
          </label>
        </div>

        {isLoading ? (
           <div className="flex justify-center items-center py-20 text-muted-foreground">
             <Loader2 className="w-8 h-8 animate-spin" />
             <span className="ml-3">Loading products...</span>
           </div>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">No products match your filters.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

