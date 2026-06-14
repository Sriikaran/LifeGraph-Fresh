import { ArrowRight } from "lucide-react";
import type { MissionResult } from "@/lib/missionEngine";

export function OutcomeSimulator({ result }: { result: MissionResult }) {
  if (!result) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl border border-indigo-800 shadow-lg p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

      <h3 className="text-sm font-bold text-indigo-300 mb-8 tracking-widest uppercase relative z-10">Outcome Simulator</h3>

      <div className="flex flex-col gap-8 relative z-10">
        <div>
          <div className="flex justify-between items-end mb-3">
            <span className="text-gray-300 font-medium">Current Outcome</span>
            <span className="text-3xl font-bold text-white">{result.probability}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-500 via-orange-500 to-indigo-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${result.probability}%` }}
            />
          </div>
        </div>

        <div className="flex justify-center -my-2 opacity-50">
          <ArrowRight className="w-6 h-6 text-white rotate-90 sm:rotate-0 sm:hidden" />
          <ArrowRight className="w-6 h-6 text-white hidden sm:block" />
        </div>

        <div>
          <div className="flex justify-between items-end mb-3">
            <span className="text-emerald-300 font-medium tracking-wide">After Completing Mission</span>
            <span className="text-4xl font-extrabold text-emerald-400">{result.outcomeAfterCompletion}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${result.outcomeAfterCompletion}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
