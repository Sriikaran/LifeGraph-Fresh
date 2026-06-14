import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCheckout } from "@/lib/checkout";
import { useOrders } from "@/lib/orders";
import { inr } from "@/lib/format";
import { toast } from "sonner";
import { getProductImage, handleProductImageError } from "@/lib/imageFallbacks";

export const Route = createFileRoute("/checkout/review")({
  component: ReviewStep,
});

function ReviewStep() {
  const navigate = useNavigate();
  const { address, paymentMethod, cartSnapshot, orderTotal, setSuccessOrder } = useCheckout();
  const { addOrder } = useOrders();

  useEffect(() => {
    if (!address || !paymentMethod || cartSnapshot.length === 0) {
      navigate({ to: "/checkout/address", replace: true });
    }
  }, [address, paymentMethod, cartSnapshot, navigate]);

  if (!address || !paymentMethod || cartSnapshot.length === 0) return null;

  const handlePlaceOrder = () => {
    toast.loading("Placing your order...", { id: "checkout" });
    setTimeout(() => {
      const order = {
        id: `ORD-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        date: new Date().toISOString(),
        total: orderTotal,
        items: cartSnapshot,
        address,
        paymentMethod
      };
      addOrder(order);
      setSuccessOrder(order);
      toast.success("Order placed successfully!", { id: "checkout" });
      navigate({ to: "/checkout/success", replace: true });
    }, 1500);
  };

  const pmLabel = {
    cc: "Credit or debit card",
    upi: "Other UPI Apps",
    emi: "EMI",
    cod: "Cash on Delivery/Pay on Delivery",
  }[paymentMethod] || paymentMethod;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Review your order</h2>

        <div className="border border-gray-300 rounded-lg p-4 bg-white flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <h3 className="font-bold mb-2">Shipping address <Link to="/checkout/address" className="text-[#007185] hover:text-[#c45500] hover:underline text-sm ml-2 font-normal">Change</Link></h3>
            <p className="text-sm">{address.fullName}</p>
            <p className="text-sm">{address.addressLine1}</p>
            {address.addressLine2 && <p className="text-sm">{address.addressLine2}</p>}
            <p className="text-sm">{address.city}, {address.state} {address.zip}</p>
            <p className="text-sm">Phone: {address.phone}</p>
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-2">Payment method <Link to="/checkout/payment" className="text-[#007185] hover:text-[#c45500] hover:underline text-sm ml-2 font-normal">Change</Link></h3>
            <p className="text-sm">{pmLabel}</p>
          </div>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <h3 className="font-bold text-lg mb-4 text-red-700">Guaranteed delivery: Tomorrow</h3>
          <div className="space-y-4 divide-y">
            {cartSnapshot.map((item, idx) => (
              <div key={idx} className="flex gap-4 pt-4 first:pt-0">
                <div className="w-20 h-20 shrink-0 bg-gray-50 flex items-center justify-center p-1 rounded">
                  <img src={getProductImage(item.product.image, item.product.category)} alt="" className="max-h-full max-w-full object-contain" onError={(e) => handleProductImageError(e, item.product.category)} />
                </div>
                <div>
                  <h4 className="font-bold">{item.product.title}</h4>
                  <p className="text-sm text-gray-600">{item.product.brand}</p>
                  <div className="text-sm mt-1">
                    <span className="font-bold text-[#b12704]">₹{inr(item.product.price)}</span>
                    <span className="ml-2">Qty: {item.qty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 bg-white h-fit sticky top-4">
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black rounded-lg py-2.5 font-bold shadow-sm"
        >
          Place your order
        </button>
        <p className="text-xs text-center text-gray-500 mt-2">
          By placing your order, you agree to Kart.in's privacy notice and conditions of use.
        </p>
        <div className="border-t border-gray-200 mt-4 pt-4">
          <h3 className="font-bold mb-2">Order Summary</h3>
          <div className="space-y-1 text-sm flex flex-col gap-1">
            <div className="flex justify-between"><span>Items:</span> <span>₹{inr(orderTotal)}</span></div>
            <div className="flex justify-between"><span>Delivery:</span> <span>₹0.00</span></div>
            <div className="flex justify-between text-lg font-bold text-[#b12704] mt-2 pt-2 border-t">
              <span>Order Total:</span> <span>₹{inr(orderTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
