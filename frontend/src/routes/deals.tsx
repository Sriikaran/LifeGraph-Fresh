import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductRow } from "@/components/store/ProductRow";
import { sortProductsByImagePriority, hasOriginalProductImage } from "@/lib/imageFallbacks";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/deals")({
  component: Deals,
});

function Countdown() {
  const [t, setT] = useState(() => 4 * 3600 + 23 * 60 + 11);
  useEffect(() => {
    const id = setInterval(() => setT((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(t / 3600)).padStart(2, "0");
  const m = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
  const s = String(t % 60).padStart(2, "0");
  return <span className="font-mono">{h}:{m}:{s}</span>;
}

function Deals() {
  const { data: products = [], isLoading } = useProducts();

  // Infer "deals" as products where mrp > price (discount exists)
  const dealsProducts = products.filter(p => p.mrp && p.mrp > p.price);

  // Flash deals: top 12
  const flash = sortProductsByImagePriority(dealsProducts).slice(0, 12);

  // Big deals: next 24
  const big = sortProductsByImagePriority(dealsProducts).slice(12, 36);

  // Daily essentials with deals
  const essentials = sortProductsByImagePriority(dealsProducts.filter(p =>
    p.category === "GROCERY" || p.category === "HEALTH_AND_PERSONAL_CARE" || p.category === "CLEANING_&_HOUSEHOLD"
  ));

  return (
    <div>
      <div className="bg-nav text-nav-foreground">
        <div className="mx-auto max-w-[1500px] px-4 py-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold">Today's Deals</h1>
            <p className="text-sm text-white/80">Flash sales · Lightning deals · Daily savings</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80">Sale ends in</div>
            <div className="text-2xl text-cta font-bold"><Countdown /></div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          Loading deals...
        </div>
      ) : (
        <>
          <div className="mx-auto max-w-[1500px] px-2 py-4">
            <h2 className="text-xl font-bold mb-3 px-2">⚡ Lightning Deals</h2>
            {flash.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No lightning deals available right now.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {flash.map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            )}
          </div>

          <ProductRow title="Top deals across categories" products={big} />
          <ProductRow title="Daily essentials on sale" products={essentials} />
        </>
      )}
    </div>
  );
}

