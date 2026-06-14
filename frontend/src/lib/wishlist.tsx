import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./auth";
import type { Product } from "./products";
import { supabase } from "./supabase";

export type WishlistItem = {
  id: string; // unique ID for the wishlist entry
  userId: string;
  product: Product;
  addedAt: string;
};

type WishlistCtx = {
  userItems: WishlistItem[];
  loading: boolean;
  addItem: (product: Product) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
};

const Ctx = createContext<WishlistCtx | null>(null);

function mapFromRow(row: any): WishlistItem {
  return {
    id: row.id,
    userId: row.user_id,
    product: row.product_snapshot,
    addedAt: row.created_at
  };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userItems, setUserItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) {
      setUserItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setUserItems(data.map(mapFromRow));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const addItem = async (product: Product) => {
    if (!user) return;
    
    // Check local state if already present
    if (userItems.some(i => i.product.id === product.id)) return;

    const { data, error } = await supabase.from("wishlist_items").insert({
      user_id: user.id,
      product_id: product.id,
      product_snapshot: product
    }).select().single();

    if (data && !error) {
      setUserItems(prev => [mapFromRow(data), ...prev]);
    }
  };

  const removeItem = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from("wishlist_items").delete().eq("id", id).eq("user_id", user.id);
    if (!error) {
      setUserItems(prev => prev.filter(i => i.id !== id));
    }
  };

  return (
    <Ctx.Provider value={{ userItems, loading, addItem, removeItem }}>
      {children}
    </Ctx.Provider>
  );
}

export function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist outside provider");
  return c;
}
