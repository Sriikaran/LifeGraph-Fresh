import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./auth";
import type { Address } from "./checkout";
import { supabase } from "./supabase";

export type SavedAddress = Address & {
  id: string;
  userId: string;
};

type AddressCtx = {
  userAddresses: SavedAddress[];
  loading: boolean;
  addAddress: (addr: Omit<SavedAddress, "id" | "userId">) => Promise<void>;
  updateAddress: (id: string, addr: Partial<SavedAddress>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
};

const Ctx = createContext<AddressCtx | null>(null);

function mapFromRow(row: any): SavedAddress {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    addressLine1: row.address_line_1,
    addressLine2: row.address_line_2,
    city: row.city,
    state: row.state,
    zip: row.zip,
    phone: row.phone,
  };
}

export function AddressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userAddresses, setUserAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    if (!user) {
      setUserAddresses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    
    if (data) {
      setUserAddresses(data.map(mapFromRow));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const addAddress = async (addr: Omit<SavedAddress, "id" | "userId">) => {
    if (!user) return;
    const { data, error } = await supabase.from("addresses").insert({
      user_id: user.id,
      full_name: addr.fullName,
      address_line_1: addr.addressLine1,
      address_line_2: addr.addressLine2,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      phone: addr.phone,
    }).select().single();

    if (data) {
      setUserAddresses(prev => [...prev, mapFromRow(data)]);
    }
  };

  const updateAddress = async (id: string, updates: Partial<SavedAddress>) => {
    if (!user) return;
    const payload: any = {};
    if (updates.fullName !== undefined) payload.full_name = updates.fullName;
    if (updates.addressLine1 !== undefined) payload.address_line_1 = updates.addressLine1;
    if (updates.addressLine2 !== undefined) payload.address_line_2 = updates.addressLine2;
    if (updates.city !== undefined) payload.city = updates.city;
    if (updates.state !== undefined) payload.state = updates.state;
    if (updates.zip !== undefined) payload.zip = updates.zip;
    if (updates.phone !== undefined) payload.phone = updates.phone;

    const { error } = await supabase.from("addresses").update(payload).eq("id", id).eq("user_id", user.id);
    if (!error) {
      setUserAddresses(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    }
  };

  const deleteAddress = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from("addresses").delete().eq("id", id).eq("user_id", user.id);
    if (!error) {
      setUserAddresses(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <Ctx.Provider value={{ userAddresses, loading, addAddress, updateAddress, deleteAddress }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAddresses() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAddresses outside provider");
  return c;
}
