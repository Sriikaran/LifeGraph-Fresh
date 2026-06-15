import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useCartContext } from "@/context/CartContext";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";
import { inr } from "@/lib/format";
import { detectMission } from "@/lib/missionEngine";
import { OutcomeVerificationCard } from "@/components/intelligence/OutcomeVerificationCard";
import { DecisionRiskPanel } from "@/components/intelligence/DecisionRiskPanel";
import { OutcomeSimulator } from "@/components/intelligence/OutcomeSimulator";
import { MissionGraphV2 } from "@/components/intelligence/MissionGraphV2";
import { useLocationContext } from "@/context/LocationContext";
import { toast } from "sonner";
import { CheckCircle2, MapPin } from "lucide-react";
import { getProductImage, handleProductImageError } from "@/lib/imageFallbacks";
import { MissionCompletionAssistant } from "@/components/intelligence/MissionCompletionAssistant";
import { CartDiscoverySections } from "@/components/cart/CartDiscoverySections";

export const Route = createFileRoute("/cart")({
  component: Cart,
});

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount, clearCart } = useCartContext();
  const { location: userLocation } = useLocationContext();
  const { addItem } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  const missionResult = detectMission(cartItems);

  const handleProceedToBuy = () => {
    if (user) {
      navigate({ to: "/checkout/address" });
    } else {
      navigate({ to: "/auth", search: { returnUrl: "/checkout/address" } });
    }
  };

  const handleMoveToWishlist = (item: any) => {
    if (!user) {
      navigate({ to: "/auth", search: { returnUrl: "/cart" } });
      return;
    }
    // Cart items carry full product data; use it directly
    addItem(item as any);
    removeFromCart(item.productId);
    toast.success("Moved to Wishlist");
  };

  return (
    <div className="mx-auto max-w-[1500px] px-2 py-4 grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-8">
      {/* 70% Left Section - Commerce */}
      <div className="bg-card p-6 lg:p-8 rounded-xl border">
        <div className="flex items-end justify-between border-b border-gray-100 pb-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
          <span className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Price</span>
        </div>
        {cartItems.length === 0 ? (
          <div className="py-4">
            <h2 className="text-2xl font-bold mb-2">Your Amazon Cart is empty.</h2>
            <Link to="/browse" className="text-link hover:text-link-hover hover:underline text-lg">Shop today's deals</Link>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {cartItems.map((it) => {
                const mrp = (it as any).mrp || it.price;
                const off = mrp > it.price ? Math.round((1 - it.price / mrp) * 100) : 0;
                return (
                  <div key={it.productId} className="py-8 flex flex-col sm:flex-row gap-8 group">
                    <Link to="/product/$id" params={{ id: it.productId }} className="w-48 h-48 shrink-0 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden flex items-center justify-center p-6 group-hover:border-indigo-200 group-hover:shadow-md transition-all">
                      <img src={getProductImage(it.image, (it as any).category)} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" onError={(e) => handleProductImageError(e, (it as any).category)} />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <Link to="/product/$id" params={{ id: it.productId }} className="text-2xl font-bold text-gray-900 hover:text-indigo-600 line-clamp-2 leading-snug transition-colors">
                        {it.title}
                      </Link>
                      <div className="text-base text-emerald-600 font-semibold mt-2">In stock</div>
                      <div className="flex items-center gap-4 mt-6 text-sm">
                        <div className="flex items-center border rounded-lg overflow-hidden bg-white shadow-sm">
                          <button onClick={() => updateQuantity(it.productId, it.quantity - 1)} className="px-4 py-2 hover:bg-gray-50 transition-colors text-lg">−</button>
                          <span className="px-5 font-medium border-x border-gray-100 text-base">{it.quantity}</span>
                          <button onClick={() => updateQuantity(it.productId, it.quantity + 1)} className="px-4 py-2 hover:bg-gray-50 transition-colors text-lg">+</button>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <button onClick={() => removeFromCart(it.productId)} className="text-gray-500 hover:text-red-600 font-medium transition-colors">Remove</button>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <button onClick={() => handleMoveToWishlist(it)} className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Save for later</button>
                      </div>
                    </div>
                    <div className="text-right shrink-0 sm:pt-4">
                      <div className="font-extrabold text-3xl text-gray-900 tracking-tight">₹{inr(it.price * it.quantity)}</div>
                      {off > 0 && <div className="text-base text-gray-400 line-through mt-1">₹{inr(mrp * it.quantity)}</div>}
                      {off > 0 && <div className="text-base text-emerald-600 font-semibold mt-0.5">({off}% off)</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end items-center gap-6 pt-8 border-t border-gray-100 mt-6">
              <button onClick={clearCart} className="text-base font-semibold text-gray-400 hover:text-red-500 transition-colors">Clear all items</button>
              <div className="text-[28px] tracking-tight text-gray-700">Subtotal ({getCartCount()} items): <span className="font-extrabold text-gray-900 ml-1">₹{inr(getCartTotal())}</span></div>
            </div>
          </>
        )}
        
        {/* Intelligence Assistant */}
        <MissionCompletionAssistant />

        {/* Discovery Sections */}
        <CartDiscoverySections />
      </div>

      {/* 30% Right Section - Intelligence & Checkout */}
      <aside className="h-fit lg:sticky lg:top-[105px] flex flex-col gap-6">
        
        {missionResult && (
          <>
            <OutcomeVerificationCard result={missionResult} />
            <DecisionRiskPanel result={missionResult} />
            <OutcomeSimulator result={missionResult} />
            <MissionGraphV2 result={missionResult} />
          </>
        )}

        {/* Separate Checkout Card */}
        {cartItems.length > 0 && (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl flex flex-col">
            <div className="text-sm font-medium text-gray-700 flex items-start gap-2 mb-4 pb-4 border-b border-gray-100">
              <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
              <span>
                Delivery to <span className="text-gray-900 font-bold block mt-0.5">{userLocation.locality ? `${userLocation.locality}, ` : ''}{userLocation.city} {userLocation.pincode}</span>
              </span>
            </div>
            {getCartTotal() > 499 && (
              <div className="text-sm text-emerald-700 bg-emerald-50 p-4 rounded-xl flex gap-2 font-medium mb-6 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Eligible for Free Standard Shipping</span>
              </div>
            )}
            <div className="text-lg text-gray-500 mb-6">Subtotal: <span className="text-3xl font-extrabold text-gray-900 block mt-1">₹{inr(getCartTotal())}</span></div>
            <button 
              onClick={handleProceedToBuy}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 text-lg font-bold transition-all shadow-md active:scale-[0.98]">
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
