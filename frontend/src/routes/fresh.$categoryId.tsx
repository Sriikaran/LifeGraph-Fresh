import { createFileRoute } from "@tanstack/react-router";
import { useProducts } from "@/lib/api/products";
import { Loader2, AlertCircle } from "lucide-react";
import { FreshProductCard, sortAndFilterProducts } from "@/components/fresh/FreshComponents";
import { useMemo } from "react";

export const Route = createFileRoute("/fresh/$categoryId")({
  component: FreshCategoryPage,
});

const CATEGORY_MAP: Record<string, { title: string; gradient: string; dbCategory: string; dbSubcats: string[] }> = {
  "grocery": {
    title: "Grocery Essentials",
    gradient: "from-green-500 to-emerald-700",
    dbCategory: "GROCERY",
    dbSubcats: ["General Grocery"]
  },
  "spices": {
    title: "Spices & Seasonings",
    gradient: "from-orange-500 to-red-600",
    dbCategory: "GROCERY",
    dbSubcats: ["Spices"]
  },
  "snacks": {
    title: "Snacks & Confectionery",
    gradient: "from-yellow-400 to-orange-500",
    dbCategory: "GROCERY",
    dbSubcats: ["Snacks & Confectionery"]
  },
  "beverages": {
    title: "Tea & Coffee Blends",
    gradient: "from-amber-600 to-amber-900",
    dbCategory: "GROCERY",
    dbSubcats: ["Tea", "Coffee"]
  },
  "atta": {
    title: "Atta & Flours",
    gradient: "from-yellow-600 to-yellow-800",
    dbCategory: "GROCERY",
    dbSubcats: ["Flour & Atta"]
  },
  "health": {
    title: "Health & Personal Care",
    gradient: "from-pink-500 to-rose-700",
    dbCategory: "HEALTH_AND_PERSONAL_CARE",
    dbSubcats: []
  }
};

function FreshCategoryPage() {
  const { categoryId } = Route.useParams();
  const { data: products = [], isLoading, isError } = useProducts();

  const config = CATEGORY_MAP[categoryId];

  const matchedProducts = useMemo(() => {
    if (!products.length || !config) return [];
    
    // We allow both real and fallback images in the detailed category page to ensure we show the whole catalog,
    // but we use our sortAndFilterProducts which strictly prioritizes real images to the top.
    const match = products.filter(p => 
        p.category === config.dbCategory && 
        (config.dbSubcats.length === 0 || config.dbSubcats.includes(p.subcategory || ''))
    );
    
    return sortAndFilterProducts(match, 100); // load up to 100 items per category page
  }, [products, config]);

  if (!config) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh] text-gray-500">
        <AlertCircle className="w-6 h-6 mr-2" /> Category not found
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#008296]" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Category Hero */}
      <div className={`w-full h-[150px] md:h-[200px] bg-gradient-to-r ${config.gradient} rounded-2xl flex flex-col justify-center px-8 md:px-12 mb-8 mt-6 shadow-sm relative overflow-hidden text-white`}>
        <div className="z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
            {config.title}
          </h1>
          <p className="opacity-90 font-medium">
            {matchedProducts.length} premium items available
          </p>
        </div>
        <div className="absolute right-[-10%] top-[-20%] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Grid of Products */}
      <div className="bg-white rounded-xl p-4 md:p-6 mb-8 shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {matchedProducts.map(p => (
            <div key={p.id} className="w-full flex">
              <div className="w-full flex-1">
                {/* To reuse the FreshProductCard exactly as it is in the carousel, we override the w- fixed sizes with 100% width via a wrapper */}
                <div className="w-full h-full flex flex-col">
                  <FreshProductCard p={p} className="w-full h-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {matchedProducts.length === 0 && !isLoading && (
          <div className="py-20 text-center text-gray-500">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
