import { createFileRoute } from "@tanstack/react-router";
import { Check, ArrowRight, DollarSign, Globe, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/sell")({
  component: SellPage,
});

function SellPage() {
  return (
    <div className="bg-white pb-20">
      {/* Hero Section */}
      <div className="bg-[#232f3e] text-white overflow-hidden relative">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="z-10 relative">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Become an Amazon Seller
            </h1>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Reach crores of customers, get access to Amazon's world-class logistics, and build your business online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#f0c14b] text-[#111] font-bold py-3 px-8 rounded border border-[#a88734] hover:bg-[#e4b340] text-lg shadow-[0_1px_0_rgba(255,255,255,0.4)_inset]">
                Start Selling
              </button>
              <button className="bg-transparent border border-white text-white font-bold py-3 px-8 rounded hover:bg-white/10 text-lg">
                How it works
              </button>
            </div>
            <div className="mt-6 text-sm opacity-80">
              Only ₹1 to register. Terms & Conditions apply.
            </div>
          </div>
          <div className="hidden md:block z-10 relative">
            <img 
              src="https://placehold.co/600x400/131a22/FFFFFF?text=Seller+Dashboard" 
              alt="Seller Dashboard" 
              className="rounded-lg shadow-2xl border-4 border-gray-700 transform rotate-2"
            />
          </div>
          {/* Background decorator */}
          <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-blue-900/30 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Stats/Metrics Section */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-[1200px] px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-black text-[#232f3e] mb-2">10+</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Crore Customers</div>
          </div>
          <div>
            <div className="text-4xl font-black text-[#232f3e] mb-2">100%</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pincodes Served</div>
          </div>
          <div>
            <div className="text-4xl font-black text-[#232f3e] mb-2">1 Lakh+</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Crorepati Sellers</div>
          </div>
          <div>
            <div className="text-4xl font-black text-[#232f3e] mb-2">0%</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Referral fee* (Limited Time)</div>
          </div>
        </div>
      </div>

      {/* Why Sell Section */}
      <div className="mx-auto max-w-[1200px] px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">Why sell on Amazon?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Join millions of small businesses that are scaling with our world-class infrastructure.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Globe className="w-10 h-10 text-[#007185]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Global Reach</h3>
            <p className="text-gray-600">Access millions of loyal customers instantly. Put your products in front of buyers globally, not just locally.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <DollarSign className="w-10 h-10 text-[#16a34a]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
            <p className="text-gray-600">Funds are deposited securely and regularly directly into your bank account, on time, every time.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="w-10 h-10 text-[#7e22ce]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Fulfillment by Amazon (FBA)</h3>
            <p className="text-gray-600">You store your products in our fulfillment centers, and we pack, ship, and provide customer service.</p>
          </div>
        </div>
      </div>

      {/* Registration CTA Banner */}
      <div className="bg-[#f3f9fa] border-y border-gray-200">
        <div className="mx-auto max-w-[1000px] px-4 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-[#111] mb-2">Ready to start growing?</h2>
            <p className="text-lg text-gray-600">It only takes 15 minutes to register your account.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2"><Check className="w-5 h-5 text-[#007185]" /> GST Number required</li>
              <li className="flex items-center gap-2"><Check className="w-5 h-5 text-[#007185]" /> Active Bank Account</li>
            </ul>
          </div>
          <button className="shrink-0 bg-[#f0c14b] text-[#111] font-bold py-4 px-10 rounded-full hover:bg-[#e4b340] text-lg shadow-md flex items-center gap-2 transition-transform hover:scale-105">
            Register Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-auto max-w-[800px] px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-bold mb-2">What do I need to register?</h3>
            <p className="text-gray-600">You will need your GST Number, PAN details, an active bank account, and an email address or mobile number.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-bold mb-2">How much does it cost to sell?</h3>
            <p className="text-gray-600">There are no listing fees. You only pay a small referral fee and closing fee when a product is sold successfully. Fees vary by product category.</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-bold mb-2">Who handles the delivery?</h3>
            <p className="text-gray-600">You can choose between FBA (Fulfillment by Amazon), Easy Ship (we pick up and deliver), or Self Ship (you ship via your own courier).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
