import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { inr } from "@/lib/format";
import { useCartContext } from "@/context/CartContext";
import { getProductImage, handleProductImageError } from "@/lib/imageFallbacks";

export function StarRating({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-[2px] text-[#ffa41c]">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i <= Math.round(value) ? "fill-current" : "opacity-30 fill-current"}
        />
      ))}
    </div>
  );
}

// Removed PrimeBadge

export function ProductCard({ p, compact }: { p: Product; compact?: boolean }) {
  const { addToCart } = useCartContext();
  const off = Math.round((1 - p.price / p.mrp) * 100);
  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group overflow-hidden">
      <Link to="/product/$id" params={{ id: p.id }} className="block bg-gray-50 p-6 relative">
        <div className="aspect-square flex items-center justify-center">
          <img
            src={getProductImage(p.image, p.category)}
            alt={p.title}
            loading="lazy"
            onError={(e) => handleProductImageError(e, p.category)}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
          />
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <Link
          to="/product/$id"
          params={{ id: p.id }}
          className="text-[20px] leading-[28px] line-clamp-3 text-gray-900 hover:text-indigo-600 mb-2 font-semibold transition-colors"
        >
          {p.title}
        </Link>
        {!compact && (
          <div className="flex items-center gap-2 mb-2">
            <StarRating value={p.rating} size={18} />
            <span className="text-[14px] text-indigo-600 hover:underline cursor-pointer font-medium">
              {p.reviews.toLocaleString("en-IN")}
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-1 mt-auto pt-4">
          <span className="text-[34px] font-bold leading-none text-gray-900 tracking-tight">
            <span className="text-[18px] relative -top-[0.5em] font-medium">₹</span>{inr(p.price)}
          </span>
        </div>
        <div className="text-[14px] text-gray-500 mt-1">
          M.R.P: <span className="line-through">₹{inr(p.mrp)}</span> <span className="text-emerald-600 font-medium ml-1">({off}% off)</span>
        </div>
        {p.prime && (
          <div className="text-[13px] mt-1 text-emerald-600 font-medium">
            Eligible for Free Standard Delivery
          </div>
        )}
        {!compact && (
          <button
            onClick={() => addToCart(p, 1)}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[16px] shadow-sm py-3 rounded-xl w-full font-bold transition-all active:scale-[0.98]"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}
