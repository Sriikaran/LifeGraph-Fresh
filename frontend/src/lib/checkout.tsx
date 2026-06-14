import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type LegacyCartItem = { product: any; qty: number; };

export type Address = {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

type CheckoutCtx = {
  address: Address | null;
  setAddress: (address: Address) => void;
  paymentMethod: string | null;
  setPaymentMethod: (method: string) => void;
  cartSnapshot: LegacyCartItem[];
  setCartSnapshot: (items: LegacyCartItem[]) => void;
  orderTotal: number;
  setOrderTotal: (total: number) => void;
  clearCheckout: () => void;
  successOrder: any | null;
  setSuccessOrder: (order: any) => void;
};

const Ctx = createContext<CheckoutCtx | null>(null);

const KEY = "checkout-v1";

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<Address | null>(() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem(KEY + "-address") || "null"); } catch { return null; }
  });
  
  const [paymentMethod, setPaymentMethod] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(KEY + "-payment") || null;
  });

  const [cartSnapshot, setCartSnapshot] = useState<LegacyCartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(KEY + "-cart") || "[]"); } catch { return []; }
  });

  const [orderTotal, setOrderTotal] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem(KEY + "-total") || 0);
  });

  const [successOrder, setSuccessOrder] = useState<any | null>(() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem(KEY + "-success") || "null"); } catch { return null; }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY + "-address", JSON.stringify(address));
      if (paymentMethod) localStorage.setItem(KEY + "-payment", paymentMethod);
      else localStorage.removeItem(KEY + "-payment");
      localStorage.setItem(KEY + "-cart", JSON.stringify(cartSnapshot));
      localStorage.setItem(KEY + "-total", String(orderTotal));
      localStorage.setItem(KEY + "-success", JSON.stringify(successOrder));
    }
  }, [address, paymentMethod, cartSnapshot, orderTotal, successOrder]);

  const clearCheckout = () => {
    setAddress(null);
    setPaymentMethod(null);
    setCartSnapshot([]);
    setOrderTotal(0);
  };

  return (
    <Ctx.Provider
      value={{
        address,
        setAddress,
        paymentMethod,
        setPaymentMethod,
        cartSnapshot,
        setCartSnapshot,
        orderTotal,
        setOrderTotal,
        clearCheckout,
        successOrder,
        setSuccessOrder,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCheckout() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCheckout outside provider");
  return c;
}
