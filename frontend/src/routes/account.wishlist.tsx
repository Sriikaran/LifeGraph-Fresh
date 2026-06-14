import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useWishlist } from "@/lib/wishlist";
import { useCartContext } from "@/context/CartContext";
import { useAuth } from "@/lib/auth";
import { inr } from "@/lib/format";
import { toast } from "sonner";
import { getProductImage, handleProductImageError } from "@/lib/imageFallbacks";

export const Route = createFileRoute("/account/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const { user, loading } = useAuth();
  const { userItems, removeItem } = useWishlist();
  const { addToCart } = useCartContext();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { returnUrl: router.latestLocation.pathname }, replace: true });
    }
  }, [user, loading, navigate, router.latestLocation.pathname]);

  if (loading || !user) return null;

  const handleMoveToCart = (item: any) => {
    addToCart(item.product, 1);
    removeItem(item.id);
    toast.success("Moved to cart");
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/account" className="hover:underline hover:text-[#c45500]">Your Account</Link>
        <span>›</span>
        <span className="text-[#c45500]">Your Wish List</span>
      </div>
      
      <h1 className="text-3xl font-medium mb-6">Your Wish List</h1>

      {userItems.length === 0 ? (
        <div className="border rounded-lg p-8 text-center bg-white shadow-sm">
          <p className="text-lg text-gray-600 mb-4">Your wish list is empty.</p>
          <Link to="/" className="text-[#007185] hover:text-[#c45500] hover:underline">Continue shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 flex gap-6 bg-white shadow-sm">
              <div className="w-40 h-40 shrink-0">
                <img src={getProductImage(item.product.image, item.product.category)} alt={item.product.title} className="max-h-full max-w-full object-contain mx-auto" onError={(e) => handleProductImageError(e, item.product.category)} />
              </div>
              <div className="flex-1">
                <Link to="/product/$id" params={{ id: item.product.id }} className="text-[#007185] hover:text-[#c45500] hover:underline text-lg font-medium block mb-2">
                  {item.product.title}
                </Link>
                <div className="text-2xl font-bold text-[#B12704] mb-2">₹{inr(item.product.price)}</div>
                <div className="text-sm text-gray-500 mb-4">Added on {new Date(item.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div className="flex gap-4">
                  <button onClick={() => handleMoveToCart(item)} className="bg-[#ffd814] hover:bg-[#f7ca00] text-black rounded-lg px-4 py-1.5 font-medium shadow-sm border border-[#FCD200] text-sm">
                    Move to Cart
                  </button>
                  <button onClick={() => removeItem(item.id)} className="bg-white hover:bg-gray-50 text-black rounded-lg px-4 py-1.5 font-medium shadow-sm border border-gray-300 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
