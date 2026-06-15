import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import {
  Leaf, Search, ShoppingCart, MapPin, Apple, Wheat, Coffee,
  HeartPulse, Package, ChevronLeft, ChevronRight, AlertTriangle, Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { analyzeOutcome, OutcomeResponse } from "../services/outcomeApi";
import { useProducts } from "@/lib/api/products";
import { FreshProductCard } from "@/components/fresh/FreshComponents";

// ─── Constants ────────────────────────────────────────────────────────────────

const LOADING_TEXTS = [
  "Detecting Mission...",
  "Building Smart Cart...",
  "Running Verification...",
  "Calculating Risks...",
  "Simulating Success...",
  "Finalizing Recommendations...",
];

const EXAMPLE_QUERIES = [
  "Need to make pasta tonight",
  "Planning a birthday party",
  "Need train journey snacks",
  "I want to lose weight",
  "Movie night with friends",
];

const CATEGORIES = [
  { id: "", path: "/fresh", label: "Home", icon: <Leaf className="w-4 h-4" /> },
  { id: "grocery", path: "/fresh/grocery", label: "Grocery Essentials", icon: <Package className="w-4 h-4" /> },
  { id: "spices", path: "/fresh/spices", label: "Spices & Seasonings", icon: <Leaf className="w-4 h-4 text-orange-600" /> },
  { id: "snacks", path: "/fresh/snacks", label: "Snacks & Confectionery", icon: <Apple className="w-4 h-4 text-red-500" /> },
  { id: "beverages", path: "/fresh/beverages", label: "Tea & Coffee", icon: <Coffee className="w-4 h-4 text-amber-700" /> },
  { id: "atta", path: "/fresh/atta", label: "Atta & Flours", icon: <Wheat className="w-4 h-4 text-yellow-600" /> },
  { id: "health", path: "/fresh/health", label: "Health & Personal Care", icon: <HeartPulse className="w-4 h-4 text-pink-500" /> },
];

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/fresh")({
  component: FreshLayout,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMissionName(mission: string) {
  return mission.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function formatItemName(item: string) {
  return item.split("_").slice(0, 5).join(" ").replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}

// ─── Section 2: Pure Fresh Navbar (sticky, navigation only) ──────────────────

function FreshNavbar() {
  const location = useLocation();

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="h-16 flex items-center justify-between px-4 sm:px-6 max-w-[1500px] w-full mx-auto overflow-hidden">
        
        {/* Logo */}
        <Link to="/" className="flex flex-col justify-center leading-none group shrink-0">
          <span className="text-xl md:text-2xl font-black tracking-tighter text-[#0f1111]">LifeGraph</span>
          <div className="flex items-center -mt-1.5">
            <span className="text-lg md:text-xl font-extrabold tracking-tight text-[#008296]">fresh</span>
            <div className="h-[3px] w-8 bg-[#f3a847] ml-1 rounded-full group-hover:w-12 transition-all duration-300" />
          </div>
        </Link>

        {/* Category navigation tabs */}
        <div className="flex-1 flex items-center justify-center mx-2 lg:mx-4">
          <div className="flex justify-between items-center w-full gap-1 lg:gap-2 xl:gap-4">
            {CATEGORIES.map((cat) => {
              const isActive = location.pathname === cat.path;
              return (
                <Link
                  key={cat.id}
                  to={cat.path}
                  className={`
                    flex items-center gap-1 lg:gap-1.5 whitespace-nowrap px-1.5 py-2 lg:px-2 xl:px-3 lg:py-3 transition-all rounded-full sm:rounded-none
                    ${
                      isActive
                        ? "bg-[#008296]/10 sm:bg-transparent text-[#008296] font-bold sm:border-b-[3px] sm:border-[#008296]"
                        : "bg-gray-100 sm:bg-transparent text-gray-700 font-medium hover:text-[#008296] sm:hover:bg-gray-50"
                    }
                  `}
                >
                  <span className={`scale-75 lg:scale-90 xl:scale-100 ${isActive ? "opacity-100" : "opacity-70"}`}>{cat.icon}</span>
                  <span className="text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm tracking-tight">{cat.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative flex items-center gap-1 p-2 hover:bg-gray-50 rounded shrink-0">
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
  );
}

// ─── Section 3: Outcome Search Section (in normal document flow) ──────────────

function OutcomeSearchSection({
  query,
  setQuery,
  loading,
  onSubmit,
}: {
  query: string;
  setQuery: (q: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <section className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
        {/* Headline */}
        <p className="text-xs font-semibold tracking-widest text-[#008296] uppercase">
          Outcome Intelligence
        </p>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f1111] text-center leading-snug">
          Tell us what you want to achieve
        </h2>

        {/* Search form */}
        <form
          onSubmit={onSubmit}
          className="w-full flex items-center bg-gray-50 rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-[#e77600] focus-within:border-[#e77600] transition-all shadow-sm"
        >
          <input
            id="outcome-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Need to make pasta tonight, Planning a birthday party..."
            className="w-full bg-transparent px-5 py-3.5 outline-none text-sm text-gray-900 placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#febd69] hover:bg-[#f3a847] px-5 py-3.5 transition-colors disabled:opacity-60 shrink-0"
          >
            <Search className="w-5 h-5 text-gray-900" />
          </button>
        </form>

        {/* Example chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_QUERIES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setQuery(ex)}
              className="bg-gray-100 hover:bg-[#008296]/10 hover:text-[#008296] border border-gray-200 hover:border-[#008296]/30 px-3 py-1.5 rounded-full text-xs text-gray-600 font-medium whitespace-nowrap transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Outcome Product Slider ───────────────────────────────────────────────────

function OutcomeProductSlider({
  title,
  items,
  allProducts,
  accent,
  icon,
}: {
  title: string;
  items: string[];
  allProducts: any[];
  accent: "red" | "blue";
  icon: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const cards = useMemo(() => {
    return items.map((slug) => {
      const found = allProducts.find(
        (p) =>
          p.id === slug ||
          p.id?.replace(/-/g, "_") === slug ||
          slug?.replace(/-/g, "_") === p.id?.replace(/-/g, "_")
      );
      return found ? { type: "real" as const, product: found } : { type: "stub" as const, slug };
    });
  }, [items, allProducts]);

  if (items.length === 0) return null;

  const accentBorder = accent === "red" ? "border-red-100" : "border-blue-100";
  const accentBg     = accent === "red" ? "bg-red-50"     : "bg-blue-50";
  const accentTitle  = accent === "red" ? "text-red-800"  : "text-[#008296]";

  return (
    <div className={`rounded-lg border ${accentBorder} ${accentBg} p-3`}>
      <h4 className={`font-bold ${accentTitle} mb-3 flex items-center gap-1.5 text-sm`}>
        {icon}
        {title}
        <span className="ml-auto text-xs font-normal opacity-60">{items.length} items</span>
      </h4>
      <div className="relative group/slider">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-10 hidden sm:grid place-items-center w-8 h-8 bg-white border border-gray-200 shadow rounded-full opacity-0 group-hover/slider:opacity-100 transition"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        <div
          ref={ref}
          className="flex overflow-x-auto gap-3 scroll-smooth snap-x pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card, idx) =>
            card.type === "real" ? (
              <FreshProductCard
                key={card.product.id}
                p={card.product}
                className="w-[150px] md:w-[180px] shrink-0 snap-start"
              />
            ) : (
              <div
                key={idx}
                className="w-[150px] md:w-[180px] shrink-0 snap-start flex flex-col items-center bg-white border border-gray-100 rounded-lg p-3 gap-2"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                  <Package className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-[11px] text-center text-gray-600 font-medium leading-tight line-clamp-3">
                  {formatItemName(card.slug)}
                </p>
                <button className="mt-auto w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-medium text-[11px] py-1.5 rounded-full transition">
                  Add to Cart
                </button>
              </div>
            )
          )}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-10 hidden sm:grid place-items-center w-8 h-8 bg-white border border-gray-200 shadow rounded-full opacity-0 group-hover/slider:opacity-100 transition"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

// ─── Section 4: Outcome Results (in normal document flow, conditional) ─────────

function OutcomeResultsSection({
  loading,
  loadingStep,
  error,
  outcome,
  allProducts,
}: {
  loading: boolean;
  loadingStep: number;
  error: string | null;
  outcome: OutcomeResponse | null;
  allProducts: any[];
}) {
  if (!loading && !error && !outcome) return null;

  return (
    <section className="bg-white border-b border-gray-200 px-4 sm:px-6 py-5">
      <div className="max-w-[1500px] mx-auto">
        {/* Loading */}
        {loading && (
          <div className="text-[#008296] font-semibold flex items-center gap-2 py-2">
            <div className="w-4 h-4 border-2 border-[#008296] border-t-transparent rounded-full animate-spin" />
            {LOADING_TEXTS[loadingStep]}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-red-600 font-medium bg-red-50 p-3 rounded-md border border-red-100">
            {error}
          </div>
        )}

        {/* Rejected */}
        {outcome?.status === "REJECTED" && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-100">
            <span className="font-bold">Mission Rejected:</span> {outcome.message}
          </div>
        )}

        {/* Success results */}
        {outcome?.mission && (
          <div className="flex flex-col gap-5">
            {/* Product sliders */}
            <div className="flex flex-col gap-4">
              {outcome.verification?.missing_items && outcome.verification.missing_items.length > 0 && (
                <OutcomeProductSlider
                  title="Missing Essentials"
                  items={outcome.verification.missing_items}
                  allProducts={allProducts}
                  accent="red"
                  icon={<AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                />
              )}
              {outcome.verification?.recommended_products && outcome.verification.recommended_products.length > 0 && (
                <OutcomeProductSlider
                  title="Recommended Additions"
                  items={outcome.verification.recommended_products}
                  allProducts={allProducts}
                  accent="blue"
                  icon={<Sparkles className="w-3.5 h-3.5 text-[#008296]" />}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

function FreshLayout() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<OutcomeResponse | null>(null);
  const { data: allProducts = [] } = useProducts();

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_TEXTS.length);
      }, 600);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setOutcome(null);
    try {
      const data = await analyzeOutcome(query);
      setOutcome(data);
    } catch {
      setError("Unable to process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#eaeded] min-h-screen flex flex-col font-sans">
      {/* Section 2: Pure sticky nav — logo, location, tabs, cart only */}
      <FreshNavbar />

      {/* Sections 3 + 4 + page content — all in normal document flow */}
      <div className="flex flex-col flex-1">
        {/* Section 3: Outcome Search */}
        <OutcomeSearchSection
          query={query}
          setQuery={setQuery}
          loading={loading}
          onSubmit={handleSearch}
        />

        {/* Section 4: Outcome Results (only when search has been run) */}
        <OutcomeResultsSection
          loading={loading}
          loadingStep={loadingStep}
          error={error}
          outcome={outcome}
          allProducts={allProducts}
        />

        {/* Page content (Hero + Carousels or Category grid) */}
        <div className="flex-1 w-full mx-auto max-w-[1500px] px-0 sm:px-4 md:px-6 pb-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
