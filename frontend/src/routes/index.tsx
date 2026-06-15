import { createFileRoute } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/store/HeroCarousel";
import { CategoryGrid, SignInCard } from "@/components/store/CategoryGrid";
import { ProductRow } from "@/components/store/ProductRow";
import { useProducts } from "@/lib/api/products";
import { sortProductsByImagePriority } from "@/lib/imageFallbacks";
import { Link } from "@tanstack/react-router";
import { Target, Activity, ShieldCheck, Zap, Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amazon - Shop for Products. Verify Outcomes." },
      { name: "description", content: "Amazon: Online Shopping - Buy mobiles, laptops, cameras, books, watches, apparel, shoes and e-Gift Cards. Free Shipping & Cash on Delivery Available." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [], isLoading } = useProducts();

  const byCategory = (cat: string) => sortProductsByImagePriority(products.filter((p) => p.category === cat));

  return (
    <div className="bg-[#e3e6e6] pb-0 font-sans min-w-[1000px] w-full overflow-x-hidden relative">
      <HeroCarousel />

      <CategoryGrid />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[20px] xl:gap-[25px] mt-[20px] xl:mt-[25px] px-[20px] xl:px-[25px] w-full">
          <ProductRow title="Today's Deals" products={sortProductsByImagePriority(products.slice().sort(() => Math.random() - 0.5).slice(0, 15))} />
          <ProductRow title="Best Sellers in Electronics" products={byCategory("ELECTRONICS")} />
        </div>
      )}

      {/* Small Outcome Commerce Teaser */}
      <div className="w-full bg-white border-y border-gray-200 mt-[20px] xl:mt-[25px]">
        <div className="max-w-[1500px] mx-auto px-[20px] xl:px-[25px] py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Target className="w-3 h-3" /> Intelligence Engine
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              Shop for Products.
              <br/>
              <span className="text-indigo-600">Verify Outcomes.</span>
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-md">
              Amazon helps ensure your purchase actually achieves your goal. Don't just buy parts, complete your mission.
            </p>
            <div className="flex gap-4">
              <Link to="/why-amazon" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-bold text-sm shadow-sm transition-colors">
                Learn Why Amazon Works
              </Link>
              <Link to="/demo" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-sm transition-colors">
                Try Demo Mode &rarr;
              </Link>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center hover:border-indigo-200 transition-colors">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mb-3" />
              <h4 className="font-bold text-gray-900 text-sm mb-1">Mission Detection</h4>
              <p className="text-xs text-gray-500">Automatically identifies your end-goal based on your cart.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center hover:border-indigo-200 transition-colors">
              <Activity className="w-8 h-8 text-amber-500 mb-3" />
              <h4 className="font-bold text-gray-900 text-sm mb-1">Risk Analysis</h4>
              <p className="text-xs text-gray-500">Flags missing dependencies and incompatible products.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center hover:border-indigo-200 transition-colors">
              <Zap className="w-8 h-8 text-indigo-500 mb-3" />
              <h4 className="font-bold text-gray-900 text-sm mb-1">Outcome Verification</h4>
              <p className="text-xs text-gray-500">Guarantees your purchase achieves a 100% success rate.</p>
            </div>
          </div>

        </div>
      </div>

      {!isLoading && (
        <div className="flex flex-col gap-[20px] xl:gap-[25px] mt-[20px] xl:mt-[25px] px-[20px] xl:px-[25px] pb-[40px] w-full">
          <ProductRow title="Fresh Essentials" products={byCategory("GROCERY")} />
          <ProductRow title="Fresh Fruits & Vegetables" products={byCategory("FRUITS_&_VEGETABLES")} />
          
          {/* Simulated banner ad */}
          <div className="bg-white w-full p-[15px] shadow-[0_1px_4px_rgba(0,0,0,0.15)] hidden md:block">
             <div className="w-full h-[250px] bg-gradient-to-r from-[#e0e7ff] to-[#f3e8ff] flex items-center justify-center border border-indigo-100 rounded-lg">
                <div className="text-center">
                   <h3 className="text-[28px] font-bold text-indigo-900">Big Sale on Home Appliances</h3>
                   <p className="text-[16px] mt-1 text-indigo-700">Upgrade your home today. Up to 50% off.</p>
                </div>
             </div>
          </div>

          <ProductRow title="Beverages & Drinks" products={byCategory("BEVERAGES")} />
          <ProductRow title="Beauty & Hygiene | Starting ₹99" products={byCategory("BEAUTY_&_HYGIENE")} />
          <ProductRow title="Baby Care" products={byCategory("BABY_CARE")} />
          <ProductRow title="Pet Care Essentials" products={byCategory("PET_CARE")} />
          
          <ProductRow title="Inspired by your browsing history" products={sortProductsByImagePriority(products.slice().sort(() => Math.random() - 0.5).slice(0, 18))} />
          <ProductRow title="More items to consider" products={sortProductsByImagePriority(products.slice().sort(() => Math.random() - 0.5).slice(0, 12))} />
        </div>
      )}
      
      {/* Sign in recommendation section */}
      <div className="bg-white w-full py-[40px] border-t border-[#dddddd] flex flex-col items-center justify-center mt-8">
        <div className="text-[13px] text-[#0f1111] mb-[4px]">See personalized recommendations</div>
        <Link to="/auth" className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] w-full max-w-[250px] py-[6px] rounded-[4px] text-[13px] border border-[#fcd200] font-bold text-center mb-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
          Sign in
        </Link>
        <div className="text-[11px] text-[#0f1111]">
          New customer? <Link to="/auth" className="text-[#007185] hover:text-[#c45500] hover:underline">Start here.</Link>
        </div>
      </div>
    </div>
  );
}

