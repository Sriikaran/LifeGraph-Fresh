import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductImage, handleProductImageError, sortProductsByImagePriority } from "@/lib/imageFallbacks";
import { inr } from "@/lib/format";

export function extractPackSize(title: string): string | null {
  if (!title) return null;
  // Look for patterns like 500g, 1kg, 250ml, Pack of 6
  const match = title.match(/\b(\d+(?:\.\d+)?\s*(?:g|kg|ml|l|gm|lb|oz|pcs|pieces)|pack\s+of\s+\d+|x\s*\d+)\b/i);
  return match ? match[1].toLowerCase() : null;
}

export function FreshProductCard({ p, className }: { p: any; className?: string }) {
  const packSize = extractPackSize(p.title);
  
  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className={`snap-start shrink-0 group/card flex flex-col p-3 bg-white border border-gray-200 hover:shadow-lg rounded-lg transition-all relative overflow-hidden ${className || "w-[160px] md:w-[220px]"}`}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {p.mrp && p.price < p.mrp && (
          <span className="bg-[#cc0c39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
          </span>
        )}
      </div>

      <div className="bg-[#f8f8f8] h-[160px] md:h-[200px] flex items-center justify-center p-4 mb-3 rounded-md overflow-hidden mix-blend-multiply">
        <img
          src={getProductImage(p.image, p.category)}
          alt={p.title}
          loading="lazy"
          onError={(e) => handleProductImageError(e, p.category)}
          className="max-h-full max-w-full object-contain group-hover/card:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="text-[13px] md:text-[14px] text-[#0f1111] font-medium line-clamp-2 leading-snug group-hover/card:text-[#007185] transition-colors mb-1">
          {p.title}
        </div>
        
        {packSize && (
          <div className="text-[11px] md:text-[12px] text-gray-500 mb-1 font-medium">
            {packSize}
          </div>
        )}

        <div className="flex items-center gap-1 text-[11px] md:text-[12px] text-[#007185] mb-1">
          {p.rating > 0 && (
            <>
              <span className="font-bold text-[#e77600]">{p.rating} ★</span>
              <span className="text-[#007185]">({p.reviews})</span>
            </>
          )}
        </div>

        <div className="flex items-baseline gap-1 mt-auto">
          <span className="text-[#0f1111] font-bold text-[18px]">{inr(p.price)}</span>
          {p.mrp && p.mrp > p.price && (
            <span className="text-[#565959] text-[12px] line-through ml-1">{inr(p.mrp)}</span>
          )}
        </div>
      </div>
      
      <button className="mt-3 w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-medium text-[13px] py-1.5 md:py-2 rounded-full shadow-sm transition">
        Add to Cart
      </button>
    </Link>
  );
}

export function FreshCarousel({ title, products, seeAllLink }: { title: string; products: any[]; seeAllLink?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="bg-white rounded-xl p-4 md:p-6 mb-6 md:mb-8 shadow-sm border border-gray-100">
      <div className="flex items-end justify-between mb-4 md:mb-5">
        <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900 leading-tight tracking-tight">{title}</h2>
        {seeAllLink && (
          <Link to={seeAllLink} className="text-[#007185] hover:text-[#c4001d] hover:underline text-[13px] md:text-[14px] font-semibold mb-1">
            See All &rsaquo;
          </Link>
        )}
      </div>
      <div className="relative group">
        <button
          onClick={() => scroll(-1)}
          className="hidden sm:grid absolute left-[-15px] top-[calc(50%-45px)] z-10 place-items-center h-[90px] w-[45px] bg-white border border-[#cdcdcd] shadow-[0_1px_3px_rgba(0,0,0,0.2)] rounded-[3px] opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronLeft className="h-[28px] w-[28px] text-[#333]" />
        </button>
        <div
          ref={ref}
          className="flex overflow-x-auto gap-3 md:gap-4 scroll-smooth snap-x pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((p) => (
            <FreshProductCard key={p.id} p={p} />
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="hidden sm:grid absolute right-[-15px] top-[calc(50%-45px)] z-10 place-items-center h-[90px] w-[45px] bg-white border border-[#cdcdcd] shadow-[0_1px_3px_rgba(0,0,0,0.2)] rounded-[3px] opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronRight className="h-[28px] w-[28px] text-[#333]" />
        </button>
      </div>
    </section>
  );
}

export function sortAndFilterProducts(products: any[], max: number) {
  return sortProductsByImagePriority(products).slice(0, max);
}
