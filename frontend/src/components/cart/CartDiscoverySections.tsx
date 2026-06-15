import { useMemo, useRef } from "react";
import { useCartContext } from "@/context/CartContext";
import { useProducts } from "@/lib/api/products";
import { FreshProductCard } from "@/components/fresh/FreshComponents";
import { ChevronLeft, ChevronRight, TrendingUp, Star } from "lucide-react";

// Simple seeded random number generator for deterministic shuffling
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function CartDiscoverySections() {
  const { cartItems } = useCartContext();
  const { data: allProducts = [] } = useProducts();

  // Read mission essentials to exclude
  const missionIds = useMemo(() => {
    try {
      const saved = sessionStorage.getItem("outcome_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Set(parsed.outcome?.verification?.missing_items || []);
      }
    } catch (e) {}
    return new Set();
  }, []);

  const { trendingProducts, popularProducts } = useMemo(() => {
    // 1. Exclude items in cart and mission
    const cartIds = new Set(cartItems.map(item => item.productId));
    const excludedIds = new Set([...cartIds, ...missionIds]);

    // 2. Filter for valid products (no broken images, has price)
    const validPool = allProducts.filter((p: any) => {
      if (!p.image || p.image.includes("IMAGERENDERING") || p.image.includes("placeholder")) return false;
      if (!p.price || p.price <= 0) return false;
      if (excludedIds.has(p.id)) return false;
      return true;
    });

    // 3. Shuffle with fixed seed for consistent "random" experience
    const rng = mulberry32(12345);
    const shuffled = [...validPool].sort(() => rng() - 0.5);

    // 4. Trending Near You: prioritize high rating (>4.0) and high review count
    const trendingPool = shuffled.filter((p: any) => (p.rating || 0) >= 4.0).sort((a: any, b: any) => (b.reviews || 0) - (a.reviews || 0));
    const trending = trendingPool.slice(0, 8);
    const trendingIds = new Set(trending.map((p: any) => p.id));

    // 5. Popular Near You: diverse categories, excluding trending
    const remainingPool = shuffled.filter((p: any) => !trendingIds.has(p.id));
    const popular = remainingPool.slice(0, 8);

    return {
      trendingProducts: trending,
      popularProducts: popular
    };
  }, [allProducts, cartItems, missionIds]);

  if (trendingProducts.length === 0 || popularProducts.length === 0) return null;

  return (
    <div className="mt-8 flex flex-col gap-10">
      <DiscoveryCarousel 
        title="🔥 Trending Near You" 
        subtitle="Popular products customers are currently viewing and purchasing."
        products={trendingProducts}
      />
      
      <DiscoveryCarousel 
        title="⭐ Popular Near You" 
        subtitle="Frequently purchased products in your area."
        products={popularProducts}
      />
    </div>
  );
}

function DiscoveryCarousel({ title, subtitle, products }: { title: string, subtitle: string, products: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -600, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 600, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between px-2">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={scrollLeft} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition-all active:scale-95">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={scrollRight} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition-all active:scale-95">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative group">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        >
          {products.map((p) => (
            <div key={p.id} className="snap-start shrink-0">
              <FreshProductCard p={p} className="w-[200px] shadow-sm hover:shadow-md transition-shadow" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
