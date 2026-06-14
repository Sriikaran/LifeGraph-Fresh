import { createFileRoute, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCartContext } from "@/context/CartContext";
import { useCheckout } from "@/lib/checkout";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/checkout")({
  component: CheckoutLayout,
});

function CheckoutLayout() {
  const { cartItems, getCartTotal } = useCartContext();
  const { cartSnapshot, setCartSnapshot, setOrderTotal } = useCheckout();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  // If not logged in, redirect to auth
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { returnUrl: router.latestLocation.pathname }, replace: true });
    }
  }, [user, loading, navigate, router.latestLocation.pathname]);

  // Capture cart snapshot when entering checkout flow if not already set
  useEffect(() => {
    if (cartItems.length > 0 && cartSnapshot.length === 0) {
      // For legacy compatibility where CartItem was { product: Product, qty: number },
      // let's wrap it if needed or just pass cartItems if checkout is fine with new CartItem format.
      // Wait, checkout snapshot expects { product: Product, qty: number }.
      // Let's adapt it here to avoid breaking checkout.
      const adaptedSnapshot = cartItems.map(item => ({
        product: { id: item.productId, title: item.title, image: item.image, price: item.price, mrp: item.price, rating: 5, reviews: 1, prime: true, category: '', brand: '' },
        qty: item.quantity
      }));
      setCartSnapshot(adaptedSnapshot as any);
      setOrderTotal(getCartTotal());
    }
  }, [cartItems, cartSnapshot, setCartSnapshot, getCartTotal, setOrderTotal]);

  if (loading || !user) return null;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1000px] mx-auto p-4 sm:p-8">
        <Outlet />
      </div>
    </div>
  );
}
