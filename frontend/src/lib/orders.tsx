import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Address, LegacyCartItem } from "./checkout";
import { useAuth } from "./auth";
import { supabase } from "./supabase";

export type Order = {
  id: string;
  userId: string;
  date: string;
  total: number;
  items: LegacyCartItem[];
  address: Address;
  paymentMethod: string;
};

type OrderCtx = {
  orders: Order[];
  loading: boolean;
  addOrder: (order: Omit<Order, "userId" | "id" | "date">) => Promise<string | null>;
};

const Ctx = createContext<OrderCtx | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (ordersData) {
      // Need to fetch order items
      const orderIds = ordersData.map((o: any) => o.id);
      
      let allItems: any[] = [];
      if (orderIds.length > 0) {
        const { data: itemsData } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orderIds);
        if (itemsData) allItems = itemsData;
      }

      const mappedOrders: Order[] = ordersData.map((o: any) => {
        const oItems = allItems.filter(i => i.order_id === o.id).map(i => ({
          product: i.product_snapshot,
          qty: i.qty
        }));
        return {
          id: o.id,
          userId: o.user_id,
          date: new Date(o.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          total: Number(o.total),
          paymentMethod: o.payment_method,
          address: o.address_snapshot,
          items: oItems
        };
      });
      setOrders(mappedOrders);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const addOrder = async (order: Omit<Order, "userId" | "id" | "date">) => {
    if (!user) return null;
    
    // Insert order
    const { data: orderData, error: orderError } = await supabase.from("orders").insert({
      user_id: user.id,
      total: order.total,
      payment_method: order.paymentMethod,
      address_snapshot: order.address
    }).select().single();

    if (orderError || !orderData) return null;

    // Insert items
    const itemsToInsert = order.items.map(it => ({
      order_id: orderData.id,
      product_id: it.product.id,
      product_snapshot: it.product,
      qty: it.qty
    }));

    await supabase.from("order_items").insert(itemsToInsert);

    // Refresh orders
    await fetchOrders();
    return orderData.id;
  };

  return <Ctx.Provider value={{ orders, loading, addOrder }}>{children}</Ctx.Provider>;
}

export function useOrders() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOrders outside provider");
  return c;
}
