import React from 'react';

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "GROCERY": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
  "FRUITS_&_VEGETABLES": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80",
  "HEALTH_AND_PERSONAL_CARE": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
  "CLEANING_&_HOUSEHOLD": "https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?auto=format&fit=crop&w=400&q=80",
  "BEAUTY_&_HYGIENE": "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&w=400&q=80",
  "FESTIVALS": "https://images.unsplash.com/photo-1605335520442-70b8095bdf35?auto=format&fit=crop&w=400&q=80",
  "BABY_CARE": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80",
  "SNACKS_&_SWEETS": "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80",
  "BEVERAGES": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80",
  "BAKERY,_CAKES_&_DAIRY": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
  "PET_CARE": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80",
  "STUDENT": "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=400&q=80",
  "HOME": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
  "TRAVEL": "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=400&q=80",
  "DEFAULT": "https://images.unsplash.com/photo-1580974852861-c381510bc98a?auto=format&fit=crop&w=400&q=80"
};

export function getProductImage(image?: string | null, category?: string | null): string {
    const fallback = (category && CATEGORY_FALLBACK_IMAGES[category]) || CATEGORY_FALLBACK_IMAGES.DEFAULT;
    
    if (!image) return fallback;
    if (image.startsWith("/assets/")) return fallback;
    
    return image;
}

export function handleProductImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, category?: string | null) {
    const fallback = (category && CATEGORY_FALLBACK_IMAGES[category]) || CATEGORY_FALLBACK_IMAGES.DEFAULT;
    if (e.currentTarget.src !== fallback) {
        e.currentTarget.src = fallback;
    }
}


export function isPlaceholderImage(imageUrl?: string | null): boolean {
  if (!imageUrl) return true;
  const img = imageUrl.trim();
  if (img === "") return true;
  if (img.startsWith("/assets/")) return true;
  if (img.includes("unsplash.com")) return true;
  
  for (const fallback of Object.values(CATEGORY_FALLBACK_IMAGES)) {
    if (img === fallback) return true;
  }
  return false;
}

export function hasOriginalProductImage(product: any): boolean {
  if (!product) return false;
  return !isPlaceholderImage(product.image);
}

export function sortProductsByImagePriority(products: any[]): any[] {
  return products.slice().sort((a, b) => {
    const aScore = isPlaceholderImage(a.image) ? 0 : 1000000;
    const bScore = isPlaceholderImage(b.image) ? 0 : 1000000;
    
    const aFinal = aScore + (a.reviews || 0) + ((a.rating || 0) * 100);
    const bFinal = bScore + (b.reviews || 0) + ((b.rating || 0) * 100);
    
    return bFinal - aFinal;
  });
}
