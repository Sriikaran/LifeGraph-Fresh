import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductRow } from "@/components/store/ProductRow";
import { Loader2, PackageOpen } from "lucide-react";

export const Route = createFileRoute("/electronics")({
  component: ElectronicsPage,
});

function ElectronicsPage() {
  const [subcat, setSubcat] = useState<string>("");
  const { data: products = [], isLoading } = useProducts();

  const allElectronics = useMemo(
    () => products.filter((p) => p.category === "ELECTRONICS" || p.category === "MOBILES"),
    [products]
  );

  const filtered = useMemo(() => {
    if (!subcat) return allElectronics;
    return allElectronics.filter((p) => p.subcategory?.toLowerCase().includes(subcat.toLowerCase()));
  }, [allElectronics, subcat]);

  const subcategories = ["Televisions", "Laptops", "Cameras", "Audio", "Monitors", "Accessories"];

  return (
    <div className="bg-[#eaeded] min-h-screen pb-10">
      <div className="bg-white border-b border-gray-200 py-2 px-4 shadow-sm">
        <div className="mx-auto max-w-[1500px] flex gap-6 overflow-x-auto scrollbar-hide text-[14px] font-medium text-[#0f1111]">
          <span className="font-bold border-r pr-6">Electronics &amp; Accessories</span>
          <button onClick={() => setSubcat("")} className={`whitespace-nowrap hover:text-[#c45500] ${!subcat ? "text-[#c45500] underline" : ""}`}>All</button>
          {subcategories.map(s => (
            <button key={s} onClick={() => setSubcat(s)} className={`whitespace-nowrap hover:text-[#c45500] ${subcat === s ? "text-[#c45500] underline" : ""}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1500px]">
        <div className="w-full h-[250px] md:h-[350px] bg-gradient-to-r from-gray-900 to-gray-700 text-white flex flex-col justify-center items-center text-center p-8 mb-6 mt-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Tech Days Are Here</h1>
          <p className="text-xl md:text-2xl mb-6">Up to 60% off on premium laptops, TVs &amp; cameras</p>
          <div className="flex gap-4">
            <button className="bg-[#ffd814] text-black font-medium py-2 px-6 rounded-full hover:bg-[#f7ca00]">Explore Deals</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-2 flex gap-4">
        <aside className="hidden lg:block w-[240px] shrink-0 bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.15)] h-fit">
          <h3 className="font-bold mb-2">Category</h3>
          <ul className="space-y-1 text-sm mb-4">
            <li><button onClick={() => setSubcat("")} className={!subcat ? "font-bold text-[#c45500]" : "hover:text-[#c45500]"}>All Electronics</button></li>
            {subcategories.map(s => (
              <li key={s}><button onClick={() => setSubcat(s)} className={subcat === s ? "font-bold text-[#c45500]" : "hover:text-[#c45500]"}>{s}</button></li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.15)] mb-4 min-h-[400px]">
            <h2 className="text-xl font-bold mb-4">{subcat ? subcat : "Featured Electronics"}</h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-700 mr-3" />
                <span className="text-gray-500">Loading products...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-4">
                <PackageOpen className="w-16 h-16 opacity-40" />
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-500">No products available yet.</p>
                  <p className="text-sm text-gray-400 mt-1">This category will be populated soon.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {!isLoading && allElectronics.length > 0 && (
        <div className="mx-auto max-w-[1500px] mt-6 px-2 space-y-6">
          <ProductRow title="Bestselling Laptops &amp; Monitors" products={allElectronics.filter(p => p.subcategory?.includes("Laptop") || p.subcategory?.includes("Monitor"))} />
          <ProductRow title="Top Cameras &amp; Accessories" products={allElectronics.filter(p => p.subcategory?.includes("Camera") || p.subcategory?.includes("Accessory"))} />
        </div>
      )}
    </div>
  );
}

