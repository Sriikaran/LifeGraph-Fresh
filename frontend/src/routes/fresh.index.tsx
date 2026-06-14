import { createFileRoute } from "@tanstack/react-router";
import { useProducts } from "@/lib/api/products";
import { Loader2, AlertCircle } from "lucide-react";
import { FreshCarousel, sortAndFilterProducts } from "@/components/fresh/FreshComponents";
import { hasOriginalProductImage } from "@/lib/imageFallbacks";
import { useMemo } from "react";

export const Route = createFileRoute("/fresh/")({
  component: FreshHomePage,
});

function FreshHero({ trendingProduct }: { trendingProduct?: any }) {
  return (
    <div className="w-full h-[200px] md:h-[300px] bg-gradient-to-r from-[#008296] to-[#00a8e1] rounded-2xl flex flex-col md:flex-row items-center justify-between px-8 md:px-16 mb-8 mt-6 shadow-sm relative overflow-hidden text-white">
      <div className="z-10 max-w-xl py-6 flex flex-col justify-center h-full">
        <div className="inline-block bg-[#febd69] text-slate-900 text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-sm mb-3 md:mb-4 w-fit uppercase tracking-widest">
          Fresh & Fast
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-4 leading-tight">
          Groceries delivered <br className="hidden md:block"/> at Amazon speed.
        </h1>
        <button className="bg-white text-[#008296] font-bold py-2.5 px-6 rounded-md hover:bg-gray-100 shadow-sm text-sm md:text-base w-fit transition-colors">
          Shop Fresh Now
        </button>
      </div>
      
      {trendingProduct && (
        <div className="hidden md:flex z-10 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 items-center gap-4 max-w-[320px]">
          <img 
            src={trendingProduct.image} 
            alt={trendingProduct.title} 
            className="w-20 h-20 object-contain rounded-md bg-white p-1 mix-blend-screen"
          />
          <div>
            <div className="text-xs font-bold text-[#febd69] mb-1">🔥 TOP TRENDING</div>
            <div className="text-sm font-medium line-clamp-2 leading-tight">{trendingProduct.title}</div>
          </div>
        </div>
      )}

      {/* Decorative Background Element */}
      <div className="absolute right-[-10%] top-[-20%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}

function FreshHomePage() {
  const { data: products = [], isLoading, isError } = useProducts();

  const sections = useMemo(() => {
    if (!products.length) return null;

    // Strict image prioritization for the homepage to ensure high-quality visual experience
    const realImageProducts = products.filter(hasOriginalProductImage);

    const getItems = (cat: string, subcats: string[], max: number = 15) => {
      const match = realImageProducts.filter(p => p.category === cat && (subcats.length === 0 || subcats.includes(p.subcategory || '')));
      return sortAndFilterProducts(match, max);
    };

    return {
      trending: sortAndFilterProducts(realImageProducts, 20),
      grocery: getItems("GROCERY", ["General Grocery"]),
      spices: getItems("GROCERY", ["Spices"]),
      snacks: getItems("GROCERY", ["Snacks & Confectionery"]),
      teaCoffee: getItems("GROCERY", ["Tea", "Coffee"]),
      atta: getItems("GROCERY", ["Flour & Atta"]),
      health: getItems("HEALTH_AND_PERSONAL_CARE", []),
    };
  }, [products]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#008296]" />
      </div>
    );
  }

  if (isError || !sections) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh] text-red-600">
        <AlertCircle className="w-10 h-10 mr-2" /> Failed to load Fresh inventory.
      </div>
    );
  }

  // The hero uses the absolute top trending item with a real image
  const topTrendingProduct = sections.trending[0];

  return (
    <div className="animate-in fade-in duration-500">
      <FreshHero trendingProduct={topTrendingProduct} />
      
      <FreshCarousel title="Trending Near You" products={sections.trending} />
      <FreshCarousel title="Grocery Essentials" products={sections.grocery} seeAllLink="/fresh/grocery" />
      <FreshCarousel title="Spices & Seasonings" products={sections.spices} seeAllLink="/fresh/spices" />
      <FreshCarousel title="Snacks & Confectionery" products={sections.snacks} seeAllLink="/fresh/snacks" />
      <FreshCarousel title="Tea & Coffee Blends" products={sections.teaCoffee} seeAllLink="/fresh/beverages" />
      <FreshCarousel title="Atta & Flours" products={sections.atta} seeAllLink="/fresh/atta" />
      <FreshCarousel title="Health & Personal Care" products={sections.health} seeAllLink="/fresh/health" />
    </div>
  );
}
