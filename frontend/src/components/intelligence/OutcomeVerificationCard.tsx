import { Target, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import type { MissionResult } from "@/lib/missionEngine";

export function OutcomeVerificationCard({ result }: { result: MissionResult }) {
  if (!result) return null;

  let statusColor = "bg-green-100 text-green-700 border-green-200";
  let StatusIcon = CheckCircle2;

  if (result.status === "At Risk" || result.status === "Not Started") {
    statusColor = "bg-red-100 text-red-700 border-red-200";
    StatusIcon = AlertCircle;
  } else if (result.status === "In Progress") {
    statusColor = "bg-orange-100 text-orange-700 border-orange-200";
    StatusIcon = AlertTriangle;
  } else if (result.status === "Nearly Complete") {
    statusColor = "bg-emerald-100 text-emerald-700 border-emerald-200";
    StatusIcon = CheckCircle2;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-sans relative">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-indigo-900 pointer-events-none">
        <Target className="w-48 h-48" />
      </div>
      
      <div className="p-8 pb-6 border-b border-gray-100 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <Target className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">Outcome Verification</span>
          </div>
          <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${statusColor}`}>
            <StatusIcon className="w-4 h-4" />
            {result.status}
          </div>
        </div>
        <div className="text-sm text-gray-500 font-semibold mb-1 tracking-wider uppercase">Mission</div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">{result.mission}</h2>
      </div>

      <div className="p-8 relative z-10">
        <div className="mb-8">
          <div className="text-sm text-gray-500 font-semibold mb-2 tracking-wider uppercase">Success Probability</div>
          <div className="flex items-end gap-3">
            <div className="text-6xl font-extrabold text-gray-900 tracking-tighter leading-none">{result.probability}%</div>
          </div>
        </div>

        {result.missingItems.length > 0 && (
          <div>
            <div className="text-sm text-gray-500 font-semibold mb-3 tracking-wider uppercase flex items-center gap-2">
              Missing Components <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{result.missingItems.length}</span>
            </div>
            <ul className="space-y-3">
              {result.missingItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-lg font-medium text-gray-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
