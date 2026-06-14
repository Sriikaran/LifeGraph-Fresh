import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useProducts } from "@/lib/api/products";
import { sortProductsByImagePriority } from "@/lib/imageFallbacks";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductRow } from "@/components/store/ProductRow";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/new-releases")({
  component: NewReleasesPage,
});

function NewReleasesPage() {
  const { data: products = [], isLoading } = useProducts();

  // Show newest arrivals – use stable sort by id (no dateAdded in live DB)
  const newProducts = useMemo(() => sortProductsByImagePriority(products).slice(0, 48), [products]);

  return (
    <div className="bg-[#eaeded] min-h-screen pb-10">
      <div className="bg-white border-b border-gray-200 py-2 px-4 shadow-sm">
        <div className="mx-auto max-w-[1500px] flex gap-6 overflow-x-auto scrollbar-hide text-[14px] font-medium text-[#0f1111]">
          <span className="font-bold border-r pr-6">Amazon New Releases</span>
          <span className="text-gray-600">Our best-selling new and future releases. Updated frequently.</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px]">
        <div className="w-full h-[250px] md:h-[300px] bg-gradient-to-r from-orange-600 to-red-500 text-white flex flex-col justify-center items-center text-center p-8 mb-6 mt-4 relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-white opacity-10 rounded-full blur-3xl"></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Hot New Releases</h1>
          <p className="text-xl md:text-2xl mb-6">Discover the latest products across all categories</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-2 flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.15)] mb-4 min-h-[300px]">
            <h2 className="text-xl font-bold mb-4">Latest Launches</h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-3" />
                <span className="text-gray-500">Loading products...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {newProducts.slice(0, 16).map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {!isLoading && (
        <div className="mx-auto max-w-[1500px] mt-6 px-2 space-y-6">
          <ProductRow title="Trending New Arrivals in Grocery" products={newProducts.filter(p => p.category === "GROCERY" || p.category === "FRUITS_&_VEGETABLES")} />
          <ProductRow title="Latest in Beverages" products={newProducts.filter(p => p.category === "BEVERAGES")} />
        </div>
      )}
    </div>
  );
}

