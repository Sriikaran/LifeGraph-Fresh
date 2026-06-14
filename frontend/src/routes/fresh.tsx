import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { Leaf, Search, ShoppingCart, MapPin, Apple, Wheat, Coffee, HeartPulse, Package } from "lucide-react";

export const Route = createFileRoute("/fresh")({
  component: FreshLayout,
});

const CATEGORIES = [
  { id: "", path: "/fresh", label: "Home", icon: <Leaf className="w-4 h-4" /> },
  { id: "grocery", path: "/fresh/grocery", label: "Grocery Essentials", icon: <Package className="w-4 h-4" /> },
  { id: "spices", path: "/fresh/spices", label: "Spices & Seasonings", icon: <Leaf className="w-4 h-4 text-orange-600" /> },
  { id: "snacks", path: "/fresh/snacks", label: "Snacks & Confectionery", icon: <Apple className="w-4 h-4 text-red-500" /> },
  { id: "beverages", path: "/fresh/beverages", label: "Tea & Coffee", icon: <Coffee className="w-4 h-4 text-amber-700" /> },
  { id: "atta", path: "/fresh/atta", label: "Atta & Flours", icon: <Wheat className="w-4 h-4 text-yellow-600" /> },
  { id: "health", path: "/fresh/health", label: "Health & Personal Care", icon: <HeartPulse className="w-4 h-4 text-pink-500" /> },
];

function PremiumNavbar() {
  const location = useLocation();

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm flex flex-col">
      {/* Top Header - Desktop/Mobile shared */}
      <div className="h-16 flex items-center justify-between px-4 sm:px-6 max-w-[1500px] w-full mx-auto">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex flex-col justify-center leading-none mt-1 group mr-2">
             <span className="text-xl md:text-2xl font-black tracking-tighter text-[#0f1111]">LifeGraph</span>
             <div className="flex items-center -mt-1.5">
               <span className="text-lg md:text-xl font-extrabold tracking-tight text-[#008296]">fresh</span>
               <div className="h-[3px] w-8 bg-[#f3a847] ml-1 rounded-full group-hover:w-12 transition-all duration-300"></div>
             </div>
          </Link>
          <div className="hidden md:flex items-center gap-1 text-sm text-gray-600 ml-4 hover:text-gray-900 cursor-pointer border border-transparent hover:border-gray-300 p-2 rounded">
            <MapPin className="w-4 h-4" />
            <div className="flex flex-col leading-none">
              <span className="text-[11px]">Delivering to</span>
              <span className="font-bold text-[#0f1111]">Update location</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar Placeholder */}
        <div className="hidden flex-1 max-w-2xl mx-8 md:flex items-center bg-gray-100 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#e77600] border border-transparent focus-within:border-[#e77600] transition-all">
          <input
            type="text"
            placeholder="Search Amazon Fresh..."
            className="w-full bg-transparent px-4 py-2.5 outline-none text-sm text-gray-900"
          />
          <button className="bg-[#febd69] hover:bg-[#f3a847] px-4 py-2.5 transition-colors">
            <Search className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative flex items-center gap-1 p-2 hover:bg-gray-50 rounded">
            <div className="relative">
              <ShoppingCart className="w-7 h-7 text-gray-800" />
              <span className="absolute -top-2 -right-2 bg-[#008296] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                0
              </span>
            </div>
            <span className="font-bold text-[#0f1111] hidden sm:block mt-2 text-sm">Cart</span>
          </Link>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-[1500px] mx-auto overflow-x-auto no-scrollbar flex items-center px-4 sm:px-6">
          <div className="flex gap-2 sm:gap-6 py-2 sm:py-0">
            {CATEGORIES.map((cat) => {
              const isActive = location.pathname === cat.path;
              return (
                <Link
                  key={cat.id}
                  to={cat.path}
                  className={`
                    flex items-center gap-2 whitespace-nowrap px-4 py-2 sm:py-3 transition-all rounded-full sm:rounded-none
                    ${
                      isActive
                        ? "bg-[#008296]/10 sm:bg-transparent text-[#008296] font-bold sm:border-b-[3px] sm:border-[#008296]"
                        : "bg-gray-100 sm:bg-transparent text-gray-700 font-medium hover:text-[#008296] sm:hover:bg-gray-50"
                    }
                  `}
                >
                  <span className={`${isActive ? "opacity-100" : "opacity-70"}`}>{cat.icon}</span>
                  <span className="text-sm">{cat.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function FreshLayout() {
  return (
    <div className="bg-[#eaeded] min-h-screen flex flex-col font-sans">
      <PremiumNavbar />
      <div className="flex-1 w-full mx-auto max-w-[1500px] px-0 sm:px-4 md:px-6 pb-12">
        <Outlet />
      </div>
    </div>
  );
}
