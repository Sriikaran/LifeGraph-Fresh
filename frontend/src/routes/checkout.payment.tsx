import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useCheckout } from "@/lib/checkout";

export const Route = createFileRoute("/checkout/payment")({
  component: PaymentStep,
});

function PaymentStep() {
  const navigate = useNavigate();
  const { address, paymentMethod, setPaymentMethod } = useCheckout();
  const [selected, setSelected] = useState(paymentMethod || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!address) {
      navigate({ to: "/checkout/address", replace: true });
    }
  }, [address, navigate]);

  if (!address) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setError("Please select a payment method.");
      return;
    }
    setError("");
    setPaymentMethod(selected);
    navigate({ to: "/checkout/review" });
  };

  const methods = [
    { id: "cc", label: "Credit or debit card" },
    { id: "upi", label: "Other UPI Apps" },
    { id: "emi", label: "EMI" },
    { id: "cod", label: "Cash on Delivery/Pay on Delivery" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Select a payment method</h2>
      
      {error && <div className="text-red-600 mb-4 font-medium">{error}</div>}

      <form onSubmit={handleSubmit} className="border border-gray-300 rounded-lg p-6 bg-white">
        <h3 className="font-bold text-lg mb-4">Payment method</h3>
        <div className="space-y-4">
          {methods.map((m) => (
            <label key={m.id} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value={m.id}
                checked={selected === m.id}
                onChange={() => setSelected(m.id)}
                className="w-4 h-4 text-[#e77600] focus:ring-[#e77600]"
              />
              <span className="font-medium">{m.label}</span>
            </label>
          ))}
        </div>

        <button type="submit" className="mt-6 bg-[#ffd814] hover:bg-[#f7ca00] text-black rounded-lg px-6 py-2.5 font-medium shadow-sm w-full sm:w-auto">
          Use this payment method
        </button>
      </form>
    </div>
  );
}
