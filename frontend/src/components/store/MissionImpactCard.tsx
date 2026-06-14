import { Target, TrendingUp } from "lucide-react";
import { detectMission } from "@/lib/missionEngine";
import type { Product } from "@/lib/products";

export function MissionImpactCard({ product }: { product: Product }) {
  // Mock a cart with just this product to see what mission it triggers
  const mockCart = [{ productId: product.id, quantity: 1, title: product.title }];
  const missionResult = detectMission(mockCart);

  if (!missionResult) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-sm mb-6 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <Target className="w-32 h-32 text-indigo-900" />
      </div>

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Target className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-bold tracking-widest uppercase text-indigo-900">Mission Impact</h3>
      </div>

      <div className="mb-4 relative z-10">
        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Contributes To</div>
        <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
          {missionResult.mission}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-white p-3 rounded-xl border border-indigo-50">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Contribution</div>
          <div className="text-emerald-600 font-extrabold text-xl flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +25%
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-indigo-50">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Missing</div>
          <div className="text-gray-900 font-extrabold text-xl">
            {missionResult.missingItems.length}
          </div>
        </div>
      </div>
    </div>
  );
}
