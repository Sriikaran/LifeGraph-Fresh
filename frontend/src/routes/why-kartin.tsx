import { createFileRoute } from "@tanstack/react-router";
import { Target, Activity, CheckCircle, Database, Server, Network, BrainCircuit, LineChart, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/why-kartin")({
  component: WhyKartIn,
});

function WhyKartIn() {
  return (
    <div className="bg-[#f9fafb] min-h-screen pb-24">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-16">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            The Evolution of Commerce
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Why optimizing for transactions is no longer enough, and how Outcome Commerce guarantees success.
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 mt-16 space-y-24">
        
        {/* Section 1: Problem vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 text-gray-500 mb-6">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Traditional Commerce</h3>
            <p className="text-gray-500 mb-6">
              Optimizes for purchases. The system wants you to buy more items, regardless of whether those items actually work together or solve your underlying problem.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> "Customers also bought"
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Generic Upselling
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Chronological History
              </li>
            </ul>
          </div>

          <div className="bg-indigo-900 border border-indigo-700 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Target className="w-32 h-32 text-white" />
            </div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-800 text-indigo-300 mb-6 relative z-10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 relative z-10">Outcome Commerce</h3>
            <p className="text-indigo-200 mb-6 relative z-10">
              Optimizes for success. The system understands your goal, verifies you have all required dependencies, and flags risks before you checkout.
            </p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-center gap-3 text-sm text-indigo-100 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Mission Detection
              </li>
              <li className="flex items-center gap-3 text-sm text-indigo-100 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Risk Analysis
              </li>
              <li className="flex items-center gap-3 text-sm text-indigo-100 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Outcome Verification
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: Current System Architecture */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b border-gray-200 pb-4">Today: Foundation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Deterministic Mission Engine", icon: <Target />, desc: "Rules-based classification of cart combinations." },
              { title: "Decision Risk Engine", icon: <Activity />, desc: "Calculates compatibility and completion risks locally." },
              { title: "Mission Graph", icon: <Network />, desc: "Maps required vs acquired dependencies." },
              { title: "Outcome Simulator", icon: <BrainCircuit />, desc: "Projects post-purchase success probability." }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-indigo-600 mb-4">{item.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Future Architecture */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b border-gray-200 pb-4">Future: Intelligence Layer</h2>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
              
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="font-bold text-gray-700">Client Application</span>
                  <span className="text-xs font-mono text-gray-400">React / Vite</span>
                </div>
                <div className="flex justify-center text-indigo-400"><Activity className="w-5 h-5 rotate-90" /></div>
                <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <span className="font-bold text-indigo-900">AWS API Gateway + Lambda</span>
                  <span className="text-xs font-mono text-indigo-500">Serverless Orchestration</span>
                </div>
                <div className="flex justify-center text-indigo-400"><Activity className="w-5 h-5 rotate-90" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                    <Database className="w-6 h-6 text-purple-600 mb-2" />
                    <span className="font-bold text-purple-900 text-sm">Amazon Neptune</span>
                    <span className="text-xs text-purple-600 mt-1">Commerce Knowledge Graph</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <BrainCircuit className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="font-bold text-blue-900 text-sm">Amazon Bedrock</span>
                    <span className="text-xs text-blue-600 mt-1">Adaptive Decision Engine</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full text-left space-y-6 md:pl-12 md:border-l border-gray-200">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2"><Network className="w-5 h-5 text-indigo-500"/> Commerce Knowledge Graph</h4>
                  <p className="text-sm text-gray-500">A massive graph database (Amazon Neptune) mapping millions of products to their true interoperability requirements, rather than just "people who bought this also bought".</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-indigo-500"/> Adaptive Decision Engine</h4>
                  <p className="text-sm text-gray-500">Powered by Amazon Bedrock, dynamically analyzing edge-case compatibility (e.g. "Will this specific 65W charger work with this obscure laptop model?").</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2"><Server className="w-5 h-5 text-indigo-500"/> Outcome Verification Engine</h4>
                  <p className="text-sm text-gray-500">Real-time AWS Lambda functions that block risky purchases and proactively suggest missing dependencies before checkout.</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
