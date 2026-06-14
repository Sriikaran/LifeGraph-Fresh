import { Network } from "lucide-react";

const GRAPH_DATA = [
  {
    root: "TV",
    children: ["HDMI Cable", "Soundbar", "Wall Mount"]
  },
  {
    root: "Laptop",
    children: ["Mouse", "Keyboard", "Monitor"]
  },
  {
    root: "Phone",
    children: ["Charger", "Case", "Screen Protector"]
  }
];

export function KnowledgeGraphPreview() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 font-mono text-slate-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none p-4">
        <Network className="w-64 h-64 text-slate-100" />
      </div>
      
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <Network className="w-6 h-6 text-indigo-400" />
        <h3 className="font-sans text-sm font-bold text-slate-400 tracking-widest uppercase">Commerce Knowledge Graph (Preview)</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {GRAPH_DATA.map((tree, i) => (
          <div key={i} className="flex flex-col">
            <div className="font-bold text-white text-lg mb-3 pb-2 border-b border-slate-700">
              {tree.root}
            </div>
            <div className="flex flex-col">
              {tree.children.map((child, idx) => {
                const isLast = idx === tree.children.length - 1;
                return (
                  <div key={idx} className="flex items-center text-sm py-1.5 text-slate-400 hover:text-indigo-300 transition-colors cursor-default">
                    <span className="text-slate-600 mr-2">{isLast ? '└─' : '├─'}</span>
                    {child}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 font-sans">
        * Displaying deterministic relationship paths from the underlying knowledge graph framework.
      </div>
    </div>
  );
}
