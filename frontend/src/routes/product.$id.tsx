import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useProduct, useProducts } from "@/lib/api/products";
import { StarRating } from "@/components/store/ProductCard";
import { ProductRow } from "@/components/store/ProductRow";
import { inr } from "@/lib/format";
import { useCartContext } from "@/context/CartContext";
import { useLocationContext } from "@/context/LocationContext";
import { Heart, Check, Plus, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { detectMission } from "@/lib/missionEngine";
import { MissionImpactCard } from "@/components/store/MissionImpactCard";
import { getProductImage, handleProductImageError, sortProductsByImagePriority } from "@/lib/imageFallbacks";

export const Route = createFileRoute("/product/$id")({
  component: PDP,
  notFoundComponent: () => <div className="p-10 text-center">Product not found</div>,
});

function PDP() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: p, isLoading, isError } = useProduct(id);
  const { data: allProducts = [] } = useProducts();
  const { addToCart } = useCartContext();
  const { location: userLocation } = useLocationContext();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (isError || !p) return <div className="p-10 text-center text-red-500 font-medium mt-10"><AlertCircle className="w-10 h-10 mx-auto mb-4" /> Product not found</div>;

  const gallery = [p.image, p.image.replace(/\/\d+$/, "/601"), p.image.replace(/\/\d+$/, "/602"), p.image.replace(/\/\d+$/, "/603")];
  const off = p.mrp && p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
  const related = sortProductsByImagePriority(allProducts.filter((x) => x.category === p.category && x.id !== p.id)).slice(0, 15);

  // Outcome Intelligence
  const missionResult = detectMission([{ ...p, quantity: 1 }]);
  const missingItemsText = missionResult?.missingItems || [];
  
  // Find mock products for missing items to allow adding them
  const missingProducts = missingItemsText.map(name => {
    // Just find any product that might match, or pick from related
    const found = related.find(r => r.title.toLowerCase().includes(name.toLowerCase()));
    if (found) return found;
    // Fallback dummy product if no exact match
    return {
      id: "mock-" + name.replace(/\s+/g, '-').toLowerCase(),
      title: name,
      price: Math.floor(Math.random() * 2000) + 499,
      mrp: Math.floor(Math.random() * 3000) + 1000,
      image: "https://picsum.photos/seed/" + name.replace(/\s+/g, '') + "/200",
      rating: 4.5,
      reviews: 120,
      brand: "Kart.in Basics",
      category: "Accessories",
      prime: true,
      deliveryDays: 2
    } as any;
  });

  const bundleTotal = p.price + missingProducts.reduce((acc, curr) => acc + curr.price, 0);

  const handleAddBundle = () => {
    addToCart(p, qty);
    missingProducts.forEach(mp => addToCart(mp, 1));
    toast.success("Mission items added to cart!");
  };

  return (
    <div className="bg-card">
      <div className="mx-auto max-w-[1500px] px-4 py-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-link-hover">Home</Link> &rsaquo;{" "}
        <Link to="/browse" search={{ cat: p.category, sort: "featured", minRating: 0, prime: false }} className="hover:text-link-hover">{p.categoryLabel}</Link> &rsaquo;{" "}
        <span>{p.brand}</span>
      </div>
      <div className="mx-auto max-w-[1500px] px-4 grid grid-cols-1 lg:grid-cols-[3fr_4fr_2fr] gap-12 pb-12 items-start">
        {/* IMAGE COLUMN */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-[105px]">
          <div className="aspect-square bg-white grid place-items-center overflow-hidden border border-gray-100 rounded-2xl p-6 shadow-sm">
            <img src={getProductImage(gallery[imgIdx], p.category)} alt={p.title} className="max-h-full max-w-full object-contain mix-blend-multiply" onError={(e) => handleProductImageError(e, p.category)} />
          </div>
          <div className="flex gap-4 justify-center">
            {gallery.map((src, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`border-2 rounded-xl ${imgIdx === i ? "border-indigo-600 ring-2 ring-indigo-600/20 shadow-md scale-105" : "border-gray-200 hover:border-gray-300 hover:scale-105"} w-24 h-24 overflow-hidden bg-white flex items-center justify-center p-2 transition-all duration-200`}>
                <img src={getProductImage(src, p.category)} alt="" className="h-full w-full object-contain mix-blend-multiply" onError={(e) => handleProductImageError(e, p.category)} />
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS COLUMN */}
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-[42px] font-bold text-gray-900 tracking-tight leading-tight">{p.title}</h1>
          <Link to="/browse" search={{ cat: "", sort: "featured", minRating: 0, prime: false }} className="text-indigo-600 hover:text-indigo-800 hover:underline text-base mt-3 inline-block font-medium">Visit the {p.brand} Store</Link>
          <div className="flex items-center gap-3 mt-4 pb-6 border-b border-gray-100">
            <StarRating value={p.rating || 0} size={22} />
            <span className="text-indigo-600 text-base font-medium">{p.rating || 0} · {(p.reviews || 0).toLocaleString("en-IN")} ratings</span>
          </div>
          {/* Removed limited time deal */}
          <div className="mt-5 flex items-start gap-4">
            {off > 0 && <span className="text-[#CC0C39] text-5xl font-light">-{off}%</span>}
            <span className="text-5xl font-bold tracking-tight text-gray-900"><span className="text-2xl align-top relative top-2 font-medium mr-1">₹</span>{inr(p.price)}</span>
          </div>
          {p.mrp && p.mrp > p.price && (
            <div className="text-base text-gray-500 mt-2 font-medium">
              M.R.P.: <span className="line-through">₹{inr(p.mrp)}</span> <span className="ml-1 font-normal">Inclusive of all taxes</span>
            </div>
          )}
          <div className="mt-2 text-sm font-medium text-emerald-600">Eligible for Free Standard Shipping</div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">About this item</h3>
            <ul className="text-sm list-disc pl-5 space-y-2 text-gray-800 leading-relaxed">
              <li>Premium quality {p.brand} build with refined finish</li>
              <li>Best-in-class performance for daily use</li>
              <li>1-year manufacturer warranty included</li>
              <li>Fast shipping and easy returns within 7 days</li>
              <li>Rated {p.rating || 0} stars by over {(p.reviews || 0).toLocaleString("en-IN")} customers</li>
            </ul>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Technical Details</h3>
            <table className="text-sm w-full max-w-xl border-collapse">
              <tbody>
                {[
                  ["Brand", p.brand],
                  ["Category", p.categoryLabel || p.category],
                  ["Item Weight", "450 g"],
                  ["Country of Origin", "India"],
                  ["Warranty", "1 year"],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-100 last:border-0">
                    <td className="py-2.5 px-3 font-semibold text-gray-700 w-1/3 bg-gray-50/50">{k}</td>
                    <td className="py-2.5 px-3 text-gray-600">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BUY BOX COLUMN */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-[105px] h-fit">
          <MissionImpactCard product={p} />
          
          <aside className="border border-gray-200 shadow-xl rounded-2xl p-8 bg-white flex flex-col">
          <div className="text-[40px] font-bold text-gray-900 mb-3 tracking-tight"><span className="text-xl align-top relative top-2 font-medium mr-1">₹</span>{inr(p.price)}</div>
          <div className="text-sm mt-1 text-emerald-600 font-medium">Eligible for Free Standard Shipping</div>
          <div className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mt-3 flex items-center gap-1 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Deliver to {userLocation.locality ? `${userLocation.locality}, ` : ''}{userLocation.city} {userLocation.pincode}
          </div>
          <div className="text-sm mt-1 ml-5 font-medium text-gray-700">
            Estimated Delivery: <span className="font-bold">Tomorrow</span>
          </div>
          <div className="text-lg text-green-700 font-medium mt-4 flex items-center gap-1">
            <Check className="h-5 w-5" /> In stock
          </div>
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Quantity:</label>
            <div className="relative">
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#007185] focus:border-[#007185] block w-20 p-2.5 shadow-sm cursor-pointer pr-8">
                {Array.from({ length: 10 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          <button
            onClick={() => { addToCart(p, qty); toast.success("Added to cart"); }}
            className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 font-bold shadow-sm transition-colors text-[17px] active:scale-[0.98]"
          >Add to Cart</button>
          <button
            onClick={() => { addToCart(p, qty); navigate({ to: "/checkout/address" }); }}
            className="w-full mt-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-4 font-bold shadow-sm transition-colors text-[17px] active:scale-[0.98]"
          >Buy Now</button>
          <div className="text-xs text-gray-500 mt-4 space-y-2 flex flex-col">
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span>Ships from</span><span className="text-gray-900 font-medium">Kart.in</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span>Sold by</span><span className="text-[#007185] hover:underline cursor-pointer">{p.brand} Official</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span>Returns</span><span className="text-[#007185] hover:underline cursor-pointer">7 days Returnable</span>
            </div>
          </div>
          <div className="mt-5 border-t border-gray-200 pt-5">
            <button className="w-full border border-gray-300 rounded-lg py-3 text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm text-gray-700">
              <Heart className="h-4 w-4" /> Add to Wish List
            </button>
          </div>
          </aside>
        </div>
      </div>

      {missionResult && missingProducts.length > 0 ? (
        <div className="mx-auto max-w-[1500px] px-4 py-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-900 pointer-events-none">
              <AlertCircle className="w-64 h-64" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3 flex items-center gap-2">
              <span className="text-indigo-600">🎯 Complete This Mission:</span> {missionResult.mission}
            </h2>
            <p className="text-gray-500 mb-8 max-w-2xl">
              You're building a {missionResult.mission}. Kart.in intelligence indicates you are missing {missingProducts.length} critical components for a successful outcome.
            </p>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 flex flex-wrap items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-32 h-32 border-2 border-indigo-600 rounded-xl p-2 bg-indigo-50/50">
                    <img src={getProductImage(p.image, p.category)} className="w-full h-full object-contain mix-blend-multiply" onError={(e) => handleProductImageError(e, p.category)} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-32 truncate text-center">{p.title}</span>
                  <span className="text-xs text-gray-500">₹{inr(p.price)}</span>
                </div>

                {missingProducts.map((mp, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <Plus className="text-gray-300 w-6 h-6" />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-32 h-32 border border-gray-200 rounded-xl p-2 bg-white shadow-sm hover:border-indigo-300 transition-colors cursor-pointer relative group">
                        <div className="absolute inset-0 bg-indigo-600/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full">Missing</span>
                        </div>
                        <img src={getProductImage(mp.image, mp.category)} className="w-full h-full object-contain mix-blend-multiply" onError={(e) => handleProductImageError(e, mp.category)} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-32 truncate text-center">{mp.title}</span>
                      <span className="text-xs text-gray-500">₹{inr(mp.price)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 min-w-[320px]">
                <div className="text-base text-gray-500 font-medium mb-1">Bundle Total</div>
                <div className="text-4xl font-bold text-gray-900 tracking-tight mb-2">₹{inr(bundleTotal)}</div>
                <div className="text-base text-emerald-600 font-medium mb-8">
                  Save time. Guarantee your outcome.
                </div>
                <button
                  onClick={handleAddBundle}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <Plus className="w-5 h-5" /> Add Missing Items
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ProductRow title="Frequently bought together" products={related.slice().reverse()} />
      )}
      
      <ProductRow title="Customers who viewed this item also viewed" products={related} />
    </div>
  );
}
