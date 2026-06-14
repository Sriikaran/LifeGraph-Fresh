import type { MissionResult } from "@/lib/missionEngine";

function RiskRow({ label, score }: { label: string; score: number }) {
  let riskLevel = "Low";
  let colorClass = "bg-emerald-500";
  let textClass = "text-emerald-700";
  let bgClass = "bg-emerald-50";

  if (score > 60) {
    riskLevel = "High";
    colorClass = "bg-red-500";
    textClass = "text-red-700";
    bgClass = "bg-red-50";
  } else if (score > 30) {
    riskLevel = "Medium";
    colorClass = "bg-orange-500";
    textClass = "text-orange-700";
    bgClass = "bg-orange-50";
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${bgClass} ${textClass}`}>
        <div className={`w-2 h-2 rounded-full ${colorClass}`} />
        {riskLevel}
      </div>
    </div>
  );
}

export function DecisionRiskPanel({ result }: { result: MissionResult }) {
  if (!result) return null;

  const overallRisk = 100 - result.probability;
  
  let riskLevel = "Low Risk";
  let colorClass = "text-emerald-500";
  let borderClass = "border-emerald-500";
  let svgColor = "#10b981";

  if (overallRisk > 60) {
    riskLevel = "High Risk";
    colorClass = "text-red-500";
    borderClass = "border-red-500";
    svgColor = "#ef4444";
  } else if (overallRisk > 30) {
    riskLevel = "Medium Risk";
    colorClass = "text-orange-500";
    borderClass = "border-orange-500";
    svgColor = "#f97316";
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overallRisk / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-sm font-bold text-gray-400 mb-6 tracking-widest uppercase">Decision Risk Analysis</h3>
      
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-28 h-28 flex shrink-0 items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-gray-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            <circle
              stroke={svgColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${colorClass}`}>{overallRisk}%</span>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wider">Overall Risk Score</div>
          <div className={`text-xl font-bold ${colorClass}`}>{riskLevel}</div>
        </div>
      </div>

      <div className="flex flex-col">
        <RiskRow label="Compatibility Risk" score={result.risks.compatibility} />
        <RiskRow label="Mission Completion Risk" score={result.risks.completion} />
        <RiskRow label="Budget Risk" score={result.risks.budget} />
        <RiskRow label="Timing Risk" score={result.risks.timing} />
      </div>
    </div>
  );
}
