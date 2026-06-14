import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCartContext } from "@/context/CartContext";
import { useCheckout } from "@/lib/checkout";
import { CheckCircle } from "lucide-react";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/checkout/success")({
  component: SuccessStep,
});

function SuccessStep() {
  const navigate = useNavigate();
  const { clearCart } = useCartContext();
  const { clearCheckout, successOrder } = useCheckout();

  useEffect(() => {
    if (!successOrder) {
      navigate({ to: "/", replace: true });
      return;
    }
    // Clear cart and checkout context but KEEP successOrder to render page
    clearCart();
    clearCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successOrder, navigate]);

  if (!successOrder) return null;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 1);
  const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-20 w-20 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold mb-4">Order placed, thank you!</h2>
      <p className="text-lg text-gray-700 mb-2">Confirmation will be sent to your registered email.</p>
      
      <div className="bg-gray-50 border border-gray-200 rounded p-6 my-6 text-left max-w-sm mx-auto">
        <p className="text-sm text-gray-600 mb-1">Order Number</p>
        <p className="font-bold text-lg mb-4">{successOrder.id}</p>
        
        <p className="text-sm text-gray-600 mb-1">Order Total</p>
        <p className="font-bold text-lg mb-4 text-[#B12704]">₹{inr(successOrder.total)}</p>
        
        <p className="text-sm text-gray-600 mb-1">Guaranteed Delivery</p>
        <p className="font-bold text-lg text-green-700">{formattedDate}</p>
      </div>

      <div className="flex gap-4 justify-center">
        <Link 
          to="/account/orders" 
          className="bg-[#ffd814] hover:bg-[#f7ca00] text-black rounded-lg px-8 py-3 font-medium shadow-sm inline-block"
        >
          View Orders
        </Link>
        <Link 
          to="/" 
          className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-black rounded-lg px-8 py-3 font-medium shadow-sm inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
