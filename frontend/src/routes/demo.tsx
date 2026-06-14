import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCartContext } from "@/context/CartContext";
import { Target, Smartphone, Tv, Briefcase, Gamepad, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";

export const Route = createFileRoute("/demo")({
  component: DemoMode,
});

function createDummyProduct(id: string, title: string, price: number): Product {
  return {
    id,
    title,
    brand: "Kart.in Basics",
    category: "Accessories",
    image: `https://placehold.co/400x400/FAFAFA/333333?text=${encodeURIComponent(title)}`,
    price,
    mrp: price * 1.5,
    rating: 4.5,
    reviews: 120,
    prime: true,
    deliveryDays: 1,
  };
}

const SCENARIOS = [
  {
    id: "phone",
    title: "New Phone Setup",
    icon: <Smartphone className="w-8 h-8" />,
    description: "Adds Phone and Case. Triggers 65% success probability (Missing Charger & Screen Protector).",
    products: [
      createDummyProduct("demo-phone", "Smartphone 5G Pro", 55000),
      createDummyProduct("demo-case", "Silicone Case", 999),
    ]
  },
  {
    id: "tv",
    title: "Home Entertainment",
    icon: <Tv className="w-8 h-8" />,
    description: "Adds TV only. Triggers 45% success probability (Missing Soundbar, Mount, HDMI).",
    products: [
      createDummyProduct("demo-tv", "4K Smart LED TV 55\"", 45000),
    ]
  },
  {
    id: "travel",
    title: "Travel Kit",
    icon: <Briefcase className="w-8 h-8" />,
    description: "Adds Bag, Power Bank, and Adapter. Triggers 95% success probability.",
    products: [
      createDummyProduct("demo-bag", "Travel Luggage Suitcase", 4000),
      createDummyProduct("demo-pb", "10000mAh Power Bank", 1500),
      createDummyProduct("demo-adapter", "Universal Travel Adapter", 800),
    ]
  },
  {
    id: "gaming",
    title: "Gaming Setup",
    icon: <Gamepad className="w-8 h-8" />,
    description: "Adds Console and Headset. Triggers 60% success probability.",
    products: [
      createDummyProduct("demo-console", "PlayStation 5 Console", 50000),
      createDummyProduct("demo-headset", "Wireless Gaming Headset", 4000),
    ]
  }
];

function DemoMode() {
  const { clearCart, addToCart } = useCartContext();
  const navigate = useNavigate();

  const handleTriggerScenario = (products: Product[]) => {
    // 1. Clear cart
    clearCart();
    
    // 2. Insert predefined products
    setTimeout(() => {
      products.forEach(p => addToCart(p, 1));
      
      // 3. Navigate to Cart Page
      navigate({ to: "/cart" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] py-16">
      <div className="max-w-[1000px] mx-auto px-6">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
            <Target className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Interactive Demo Mode
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Skip the manual shopping experience. Select a scenario below to instantly populate your cart and experience Kart.in's Outcome Verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SCENARIOS.map((scenario) => (
            <div 
              key={scenario.id} 
              className="bg-white border border-gray-200 hover:border-indigo-300 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => handleTriggerScenario(scenario.products)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {scenario.icon}
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {scenario.title}
              </h3>
              <p className="text-gray-500 font-medium">
                {scenario.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
