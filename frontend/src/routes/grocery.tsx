import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useProducts } from "@/lib/api/products";
import { sortProductsByImagePriority } from "@/lib/imageFallbacks";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductRow } from "@/components/store/ProductRow";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/grocery")({
  component: GroceryPage,
});

function GroceryPage() {
  const [subcat, setSubcat] = useState<string>("");
  const { data: products = [], isLoading } = useProducts();

  const allGrocery = useMemo(
    () => products.filter((p) =>
      p.category === "GROCERY" ||
      p.category === "FRUITS_&_VEGETABLES" ||
      p.category === "SNACKS_&_SWEETS" ||
      p.category === "BEVERAGES" ||
      p.category === "BAKERY,_CAKES_&_DAIRY"
    ),
    [products]
  );

  const filtered = useMemo(() => {
    if (!subcat) return sortProductsByImagePriority(allGrocery);
    return sortProductsByImagePriority(allGrocery.filter((p) => p.subcategory?.toLowerCase().includes(subcat.toLowerCase())));
  }, [allGrocery, subcat]);

  const subcategories = ["Fruits", "Vegetables", "Beverages", "Snacks", "Bakery", "Daily essentials"];

  return (
    <div className="bg-[#eaeded] min-h-screen pb-10">
      <div className="bg-white border-b border-gray-200 py-2 px-4 shadow-sm">
        <div className="mx-auto max-w-[1500px] flex gap-6 overflow-x-auto scrollbar-hide text-[14px] font-medium text-[#0f1111]">
          <span className="font-bold border-r pr-6">Amazon Grocery</span>
          <button onClick={() => setSubcat("")} className={`whitespace-nowrap hover:text-[#c45500] ${!subcat ? "text-[#c45500] underline" : ""}`}>All</button>
          {subcategories.map(s => (
            <button key={s} onClick={() => setSubcat(s)} className={`whitespace-nowrap hover:text-[#c45500] ${subcat === s ? "text-[#c45500] underline" : ""}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1500px]">
        <div className="w-full h-[250px] md:h-[400px] bg-gradient-to-r from-green-800 to-emerald-600 text-white flex flex-col justify-center items-center text-center p-8 mb-6 mt-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Super Value Days</h1>
          <p className="text-xl md:text-2xl mb-6">Up to 35% off on Groceries &amp; Household supplies</p>
          <div className="flex gap-4">
            <button className="bg-[#ffd814] text-black font-medium py-2 px-6 rounded-full hover:bg-[#f7ca00]">Shop Offers</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-2 flex gap-4">
        <aside className="hidden lg:block w-[240px] shrink-0 bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.15)] h-fit">
          <h3 className="font-bold mb-2">Category</h3>
          <ul className="space-y-1 text-sm mb-4">
            <li><button onClick={() => setSubcat("")} className={!subcat ? "font-bold text-[#c45500]" : "hover:text-[#c45500]"}>All Grocery</button></li>
            {subcategories.map(s => (
              <li key={s}><button onClick={() => setSubcat(s)} className={subcat === s ? "font-bold text-[#c45500]" : "hover:text-[#c45500]"}>{s}</button></li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.15)] mb-4 min-h-[400px]">
            <h2 className="text-xl font-bold mb-4">{subcat ? subcat : "Everyday Essentials"}</h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-700 mr-3" />
                <span className="text-gray-500">Loading products...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500">No products found.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] mt-6 px-2 space-y-6">
        {!isLoading && allGrocery.length > 0 && (
          <ProductRow title="Stock up and save more" products={sortProductsByImagePriority(allGrocery).slice(0, 10)} />
        )}
      </div>
    </div>
  );
}

