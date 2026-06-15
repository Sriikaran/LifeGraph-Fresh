import { useEffect, useState } from "react";
import { useCartContext } from "@/context/CartContext";
import { detectMission, isDemoMission } from "@/lib/missionEngine";
import { Target, AlertTriangle, ArrowRight, CheckCircle2, XCircle, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function OutcomeIntelligencePanel() {
  const { cartItems } = useCartContext();
  const [analyzing, setAnalyzing] = useState(false);

  // Mock reactivity
  useEffect(() => {
    setAnalyzing(true);
    const t = setTimeout(() => setAnalyzing(false), 600);
    return () => clearTimeout(t);
  }, [cartItems]);

  const result = detectMission(cartItems);

  if (!result) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden font-sans flex flex-col items-center justify-center p-10 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 text-indigo-600 rotate-3 transition-transform hover:rotate-6">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">
            🎯 Build Outcomes, Not Carts
          </h3>
          <p className="text-gray-500 text-base leading-relaxed max-w-[320px] mb-8">
            Add products and Amazon will identify your goal, detect missing components, and estimate your likelihood of success.
          </p>
          <Link 
            to="/browse"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-base transition-colors shadow-sm flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  let riskColors = "bg-green-100 text-green-700 border-green-200/50";
  if (result.riskScore === "High") riskColors = "bg-orange-100 text-orange-700 border-orange-200/50";
  else if (result.riskScore === "Medium") riskColors = "bg-yellow-100 text-yellow-700 border-yellow-200/50";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden font-sans flex flex-col relative transition-opacity duration-300">
      {analyzing && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center transition-all">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Header section */}
      <div className="p-8 border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[12px] font-semibold text-indigo-600 tracking-wider uppercase">Mission Detected</span>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${riskColors}`}>
            <AlertTriangle className="w-3 h-3" />
            {result.riskScore} Risk
          </span>
        </div>
        <h2 className="text-[34px] md:text-4xl font-extrabold text-gray-900 tracking-tighter leading-tight">
          {isDemoMission(result.mission) ? result.mission : "Mission Detected"}
        </h2>
      </div>

      <div className="p-8 space-y-10">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100/50 shadow-inner">
            <div className="text-sm text-gray-500 font-semibold mb-2 uppercase tracking-wider">Probability</div>
            <div className="text-5xl font-extrabold text-gray-900 tracking-tighter">{result.probability}%</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100/50 shadow-inner">
            <div className="text-sm text-gray-500 font-semibold mb-2 uppercase tracking-wider">Missing</div>
            <div className="text-5xl font-extrabold text-gray-900 tracking-tighter">{result.missingItems.length} <span className="text-xl font-medium text-gray-400 tracking-normal ml-1">items</span></div>
          </div>
        </div>

        {/* Mission Graph (Checklist) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-indigo-500 mb-5 tracking-widest uppercase">Mission Progress</h3>
          <div className="space-y-4 relative">
            <div className="absolute left-2.5 top-2.5 bottom-2.5 w-[2px] bg-gray-100 -z-10 rounded-full" />
            {result.graph.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 text-base relative bg-white">
                {item.acquired ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 bg-white" />
                    <span className="text-gray-900 font-bold">{item.name}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-gray-300 bg-white" />
                    <span className="text-gray-400 font-medium">{item.name}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Simulator */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-gray-400 mb-4 tracking-widest uppercase">Outcome Simulator</h3>
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100/50 rounded-2xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]"><Target className="w-32 h-32" /></div>
            <div className="relative z-10">
              <div className="text-xs text-indigo-600/80 font-bold tracking-widest uppercase mb-1">Current</div>
              <div className="text-3xl font-extrabold text-indigo-900 tracking-tighter">{result.probability}%</div>
            </div>
            <div className="bg-white rounded-full p-2 shadow-sm border border-indigo-100/50 relative z-10">
               <ArrowRight className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-right relative z-10">
              <div className="text-xs text-indigo-600/80 font-bold tracking-widest uppercase mb-1">Recommended</div>
              <div className="text-3xl font-extrabold text-indigo-600 tracking-tighter">100%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {result.missingItems.length > 0 && (
        <div className="bg-gray-50 p-8 border-t border-gray-100/80">
          <h3 className="text-xs font-semibold text-gray-400 mb-4 tracking-wider uppercase">Recommended Missing Items</h3>
          <ul className="space-y-4">
            {result.missingItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-base">
                <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                <span className="font-semibold text-gray-900">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
