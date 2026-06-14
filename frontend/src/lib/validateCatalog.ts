import { PRODUCTS, CATEGORIES } from "./products";

export function validateCatalog() {
  console.log("=== Running Catalog Validation ===");
  let warnings = 0;

  // 1. Verify Categories contain products
  CATEGORIES.forEach((cat) => {
    const hasProducts = PRODUCTS.some(p => p.category.includes(cat.name) || cat.name.includes(p.category));
    if (!hasProducts) {
      console.warn(`[Catalog Warning] Category "${cat.name}" has no products assigned!`);
      warnings++;
    }
  });

  const imageUsage = new Map<string, string>();

  // 2. Verify Product structure and Duplicate Detection
  PRODUCTS.forEach((product) => {
    if (!product.title) {
      console.warn(`[Catalog Warning] Product ${product.id} is missing a title.`);
      warnings++;
    }
    if (!product.category) {
      console.warn(`[Catalog Warning] Product ${product.id} is missing a category.`);
      warnings++;
    }
    
    const image = product.image;
    if (!image) {
      console.warn(`[Catalog Warning] Product ${product.id} (${product.title}) is missing an image string.`);
      warnings++;
    } else {
      // Check for external HTTP URLs
      if (image.startsWith('http')) {
        console.warn(`[Catalog Warning] Product ${product.id} (${product.title}) relies on an external HTTP URL: ${image}. Preferred: Local /assets/`);
        warnings++;
      }

      // Check for duplicated image paths (Duplicate Image Detection)
      if (imageUsage.has(image)) {
        console.warn(`[Duplicate Image Warning] "${product.title}" shares image with "${imageUsage.get(image)}" -> ${image}`);
        warnings++;
      } else {
        imageUsage.set(image, product.title);
      }
      
      // Async preload check (browser only)
      if (typeof window !== 'undefined') {
        const img = new Image();
        img.onerror = () => {
          console.warn(`[Catalog Error] Image failed to load for Product ${product.id} (${product.title}): ${image}`);
        };
        img.src = image;
      }
    }
  });

  if (warnings === 0) {
    console.log("=== Catalog Validation Passed: 0 Warnings ===");
  } else {
    console.warn(`=== Catalog Validation Completed with ${warnings} Warnings ===`);
  }
}
