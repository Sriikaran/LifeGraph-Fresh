import { useQuery } from "@tanstack/react-query";
import { Product } from "@/lib/products";

export const CATEGORY_LABELS: Record<string, string> = {
  "GROCERY": "Grocery & Staples",
  "FRUITS_&_VEGETABLES": "Fruits & Vegetables",
  "BAKERY,_CAKES_&_DAIRY": "Bakery, Cakes & Dairy",
  "BEVERAGES": "Beverages",
  "BABY_CARE": "Baby Care",
  "PET_CARE": "Pet Care",
  "CLEANING_&_HOUSEHOLD": "Cleaning & Household",
  "BEAUTY_&_HYGIENE": "Beauty & Hygiene",
  "SNACKS_&_SWEETS": "Snacks & Sweets",
  "HEALTH_AND_PERSONAL_CARE": "Health & Personal Care",
  "FESTIVALS": "Festivals",
  "HOME": "Home",
  "TRAVEL": "Travel",
  "STUDENT": "Student",
  "MOBILES": "Mobiles",
  "ELECTRONICS": "Electronics",
  "FASHION": "Fashion",
  "BOOKS": "Books"
};

export interface NormalizedProduct extends Product {
  categoryLabel: string;
}

export function normalizeProduct(p: any): NormalizedProduct {
  return {
    ...p,
    categoryLabel: CATEGORY_LABELS[p.category] || p.category.replace(/_/g, " ")
  };
}

export async function getProducts(): Promise<NormalizedProduct[]> {
  const res = await fetch("http://localhost:8000/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  const json = await res.json();
  return (json.data || []).map(normalizeProduct);
}

export async function getProductById(id: string): Promise<NormalizedProduct> {
  const res = await fetch(`http://localhost:8000/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const json = await res.json();
  return normalizeProduct(json.data);
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id),
    enabled: !!id
  });
}
