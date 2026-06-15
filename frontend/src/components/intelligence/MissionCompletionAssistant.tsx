import { useEffect, useState, useMemo } from "react";
import { useCartContext } from "@/context/CartContext";
import { useProducts } from "@/lib/api/products";
import { FreshProductCard } from "@/components/fresh/FreshComponents";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { isDemoMission } from "@/lib/missionEngine";

export function MissionCompletionAssistant() {
  const [outcomeSession, setOutcomeSession] = useState<any>(null);
  const { cartItems, addToCart } = useCartContext();
  const { data: allProducts = [] } = useProducts();

  useEffect(() => {
    const saved = sessionStorage.getItem("outcome_session");
    if (saved) {
      try {
        setOutcomeSession(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const outcome = outcomeSession?.outcome;
  const rawMissionName = outcome?.mission?.detected_mission || "Mission";
  const missionName = isDemoMission(rawMissionName) ? rawMissionName : "Mission";

  // Dynamic filtering
  const missingItemsIds = outcome?.verification?.missing_items || [];
  const cartIds = new Set(cartItems.map((item: any) => item.productId));
  const remainingEssentialsIds = missingItemsIds.filter((id: string) => !cartIds.has(id));

  // Compute probability progress
  const totalMissingCount = missingItemsIds.length;
  const addedCount = totalMissingCount - remainingEssentialsIds.length;
  const progressPercent = totalMissingCount > 0 ? Math.round((addedCount / totalMissingCount) * 100) : 100;
  
  const currentSuccess = outcome?.simulation?.current_success || 50;
  const optimizedSuccess = outcome?.simulation?.optimized_success || 95;
  
  // Interpolate dynamic success based on added items
  const dynamicSuccess = totalMissingCount > 0 
    ? Math.round(currentSuccess + (addedCount / totalMissingCount) * (optimizedSuccess - currentSuccess))
    : optimizedSuccess;

  // Resolve products
  const remainingProducts = useMemo(() => {
    return remainingEssentialsIds.map((id: string) => {
      return allProducts.find(
        (p: any) =>
          p.id === id ||
          p.id?.replace(/-/g, "_") === id ||
          id?.replace(/-/g, "_") === p.id?.replace(/-/g, "_")
      );
    }).filter(Boolean);
  }, [remainingEssentialsIds, allProducts]);

  const handleAddAll = () => {
    remainingProducts.forEach((p: any) => {
      addToCart(p, 1);
    });
  };

  const isComplete = remainingEssentialsIds.length === 0;

  if (!outcome) return null;

  return (
    <div className="mt-8 bg-white border border-[#008296]/30 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-[#f0f8ff] px-6 py-4 border-b border-[#008296]/20">
        <h2 className="text-[#0f1111] font-extrabold text-xl flex items-center gap-2">
          🎯 Complete Your {missionName}
        </h2>
      </div>
      
      <div className="p-6">
        {isComplete ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">✅ Mission Complete</h3>
            <p className="text-gray-600 mb-4">Your {missionName} is fully prepared.</p>
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-6 py-3 flex items-center gap-3">
               <Sparkles className="w-5 h-5 text-emerald-600" />
               <span className="font-bold text-emerald-800 text-lg">Success Probability: {optimizedSuccess}%</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
              {/* Progress Tracker */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Mission Progress</p>
                <div className="flex items-center gap-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-[#008296] h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <span className="font-bold text-gray-700 whitespace-nowrap">{progressPercent}% Complete</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold text-gray-900">{addedCount}</span> of <span className="font-semibold text-gray-900">{totalMissingCount}</span> essentials added
                </p>
              </div>

              {/* Success Probability Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shrink-0 flex items-center gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Current</p>
                  <p className="text-2xl font-bold text-gray-700">{dynamicSuccess}%</p>
                </div>
                <div className="w-px h-10 bg-gray-300"></div>
                <div>
                  <p className="text-xs text-[#008296] font-semibold uppercase tracking-wider mb-1">After Completion</p>
                  <p className="text-2xl font-bold text-[#008296]">{optimizedSuccess}%</p>
                </div>
              </div>
            </div>

            {/* Remaining Essentials List */}
            <div>
              <p className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Remaining Essentials</p>
              <div className="flex overflow-x-auto gap-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x">
                {remainingProducts.map((p: any) => (
                  <div key={p.id} className="relative group shrink-0">
                    {/* Missing Essential Badge overlay */}
                    <div className="absolute top-2 right-2 z-20 pointer-events-none">
                       <span className="bg-[#c4001d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-[#c4001d]/20 uppercase tracking-wider">
                          Missing Essential
                       </span>
                    </div>
                    <FreshProductCard p={p} className="w-[180px] border-[#008296]/20 shadow-sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Add All CTA */}
            <div className="pt-2">
              <button 
                onClick={handleAddAll}
                className="w-full bg-[#008296] hover:bg-[#007185] active:bg-[#006073] text-white py-4 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Add Remaining Essentials
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
