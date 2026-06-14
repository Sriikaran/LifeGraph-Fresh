import { CheckCircle2, Circle } from "lucide-react";
import type { MissionResult } from "@/lib/missionEngine";

export function MissionGraphV2({ result }: { result: MissionResult }) {
  if (!result || result.graph.length === 0) return null;

  const rootItem = result.graph[0];
  const children = result.graph.slice(1);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 font-mono">
      <h3 className="font-sans text-sm font-bold text-gray-400 mb-6 tracking-widest uppercase">Mission Graph</h3>
      
      <div className="text-gray-900 font-bold text-lg mb-4 font-sans">{result.mission}</div>
      
      <div className="flex flex-col">
        {/* Root Node */}
        <div className="flex items-center gap-3 py-2">
          {rootItem.acquired ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-300" />
          )}
          <span className={`text-base ${rootItem.acquired ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
            {rootItem.name}
          </span>
        </div>

        {/* Children Nodes */}
        <div className="relative ml-[9px] pl-6 border-l-2 border-gray-200 py-2 flex flex-col gap-3">
          {children.map((child, idx) => {
            const isLast = idx === children.length - 1;
            return (
              <div key={idx} className="relative flex items-center gap-3">
                {/* Horizontal connection line */}
                <div className="absolute left-[-26px] top-1/2 w-4 h-0.5 bg-gray-200" />
                
                {/* Hide the remaining vertical border for the last item */}
                {isLast && (
                  <div className="absolute left-[-26px] top-1/2 bottom-[-100%] w-1 bg-white" />
                )}

                {child.acquired ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 relative z-10 bg-white" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 relative z-10 bg-white" />
                )}
                <span className={`text-base font-sans ${child.acquired ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                  {child.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
