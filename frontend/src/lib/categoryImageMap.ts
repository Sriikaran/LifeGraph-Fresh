export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "mobiles": "/assets/categories/smartphones.jpg",
  "smartphones": "/assets/categories/smartphones.jpg",
  "laptops": "/assets/categories/laptops.jpg",
  "televisions": "/assets/categories/televisions.jpg",
  "electronics": "/assets/categories/laptops.jpg",
  "fashion": "/assets/categories/marketplace.jpg",
  "men": "/assets/categories/marketplace.jpg",
  "women": "/assets/categories/marketplace.jpg",
  "kitchen": "/assets/categories/kitchen.jpg",
  "home & kitchen": "/assets/categories/kitchen.jpg",
  "grocery": "/assets/categories/grocery.jpg",
  "gaming": "/assets/categories/marketplace.jpg",
  "travel": "/assets/categories/marketplace.jpg",
  "accessories": "/assets/categories/smartphones.jpg",
  "beauty": "/assets/categories/marketplace.jpg",
  "books": "/assets/categories/books.jpg",
};

export const getCategoryImage = (product: { category?: string; subcategory?: string; title?: string }): string => {
  if (!product) return "/assets/categories/marketplace.jpg";

  const cat = (product.category || "").toLowerCase();
  const sub = (product.subcategory || "").toLowerCase();
  const title = (product.title || "").toLowerCase();

  // 1. Direct subcategory match
  if (sub && CATEGORY_IMAGE_MAP[sub]) {
    return CATEGORY_IMAGE_MAP[sub];
  }

  // 2. Direct category match
  if (cat && CATEGORY_IMAGE_MAP[cat]) {
    return CATEGORY_IMAGE_MAP[cat];
  }

  // 3. Inference from title/category strings
  if (cat.includes("mobile") || sub.includes("phone") || title.includes("phone")) {
    return CATEGORY_IMAGE_MAP["mobiles"];
  }
  if (cat.includes("laptop") || sub.includes("laptop") || title.includes("laptop")) {
    return CATEGORY_IMAGE_MAP["laptops"];
  }
  if (cat.includes("tv") || sub.includes("tv") || title.includes("tv")) {
    return CATEGORY_IMAGE_MAP["televisions"];
  }
  if (cat.includes("fashion") || cat.includes("clothing") || title.includes("shirt")) {
    return CATEGORY_IMAGE_MAP["fashion"];
  }
  if (cat.includes("kitchen") || sub.includes("kitchen")) {
    return CATEGORY_IMAGE_MAP["kitchen"];
  }

  // 4. Ultimate Generic Fallback
  return "/assets/categories/marketplace.jpg";
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, product: any) => {
  const fallback = getCategoryImage(product);
  // Prevent infinite loops if fallback also fails
  if (e.currentTarget.src !== fallback && !e.currentTarget.src.includes(fallback)) {
    e.currentTarget.src = fallback;
  } else {
    // If even the local fallback fails, use the most reliable local fallback
    const safeFallback = "/assets/categories/marketplace.jpg";
    if (!e.currentTarget.src.includes("marketplace.jpg")) {
      e.currentTarget.src = safeFallback;
    }
  }
};
