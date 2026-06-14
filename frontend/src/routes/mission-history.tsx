import { createFileRoute } from "@tanstack/react-router";
import { Target, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { KnowledgeGraphPreview } from "@/components/intelligence/KnowledgeGraphPreview";

export const Route = createFileRoute("/mission-history")({
  component: MissionHistory,
});

const mockMissions = [
  {
    id: 1,
    name: "Home Entertainment Setup",
    status: "Completed",
    completion: 100,
    date: "Oct 12, 2026",
  },
  {
    id: 2,
    name: "Gaming Setup",
    status: "Completed",
    completion: 100,
    date: "Sep 28, 2026",
  },
  {
    id: 3,
    name: "Travel Kit",
    status: "Completed",
    completion: 100,
    date: "Aug 15, 2026",
  },
  {
    id: 4,
    name: "Home Office Setup",
    status: "In Progress",
    completion: 65,
    date: "Active",
  },
];

function MissionHistory() {
  return (
    <div className="bg-[#f9fafb] min-h-[calc(100vh-120px)] w-full py-12">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mission History</h1>
            <p className="text-gray-500">Track your outcome achievements and ongoing goals.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockMissions.map((m) => (
            <div key={m.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{m.name}</h3>
                  {m.status === "Completed" ? (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      In Progress
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-gray-500">Outcome Probability</span>
                    <span className={m.completion === 100 ? "text-emerald-600" : "text-amber-600"}>{m.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${m.completion === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${m.completion}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                <span className="text-sm text-gray-400 font-medium">{m.date}</span>
                <span className="text-indigo-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Details <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <KnowledgeGraphPreview />
        </div>
      </div>
    </div>
  );
}
