import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { inr } from "@/lib/format";
import { getProductImage, handleProductImageError } from "@/lib/imageFallbacks";

export function ProductRow({
  title,
  products,
  seeMore = "/browse",
}: {
  title: string;
  products: Product[];
  seeMore?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <section className="bg-white w-full p-8 shadow-[0_1px_4px_rgba(0,0,0,0.15)] overflow-hidden">
      <div className="flex items-end gap-[15px] mb-[20px]">
        <h2 className="text-[28px] font-bold text-gray-900 leading-tight tracking-tight">{title}</h2>
        <Link to={seeMore} className="text-indigo-600 hover:text-indigo-800 hover:underline text-[16px] font-semibold leading-[20px] mb-[3px]">
          Explore Collection
        </Link>
      </div>
      <div className="relative group">
        <button
          onClick={() => scroll(-1)}
          className="hidden sm:grid absolute left-[-10px] top-[calc(50%-45px)] z-10 place-items-center h-[90px] w-[55px] bg-white border border-[#cdcdcd] shadow-[0_1px_3px_rgba(0,0,0,0.2)] rounded-[3px] opacity-90 hover:opacity-100 transition"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-[28px] w-[28px] text-[#333]" />
        </button>
        <div ref={ref} className="flex overflow-x-auto gap-[20px] scroll-smooth snap-x pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden items-stretch">
          {products.map((p) => (
            <Link
              key={p.id}
              to="/product/$id"
              params={{ id: p.id }}
              className="snap-start shrink-0 w-[260px] xl:w-[300px] group/card flex flex-col p-4 bg-white border border-gray-100 hover:border-gray-300 rounded-2xl hover:shadow-lg transition-all"
            >
              <div className="bg-gray-50 h-[260px] xl:h-[280px] flex items-center justify-center p-6 mb-4 rounded-xl overflow-hidden mix-blend-multiply">
                <img src={getProductImage(p.image, p.category)} alt={p.title} loading="lazy" onError={(e) => handleProductImageError(e, p.category)}
                  className="max-h-full max-w-full object-contain group-hover/card:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-indigo-50 text-indigo-700 text-[13px] xl:text-[14px] font-bold px-[10px] py-[6px] leading-none rounded-md border border-indigo-100">
                  Featured
                </span>
                <span className="text-gray-500 text-[13px] xl:text-[14px] font-medium">Top Rated</span>
              </div>
              <div className="mt-3">
                <div className="text-[18px] xl:text-[20px] text-gray-900 font-semibold line-clamp-2 leading-[26px] group-hover/card:text-indigo-600 transition-colors">{p.title}</div>
              </div>
            </Link>
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="hidden sm:grid absolute right-[-10px] top-[calc(50%-35px)] z-10 place-items-center h-[70px] w-[45px] bg-white border border-[#cdcdcd] shadow-[0_1px_3px_rgba(0,0,0,0.2)] rounded-[3px] opacity-90 hover:opacity-100 transition"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-[24px] w-[24px] text-[#333]" />
        </button>
      </div>
    </section>
  );
}
