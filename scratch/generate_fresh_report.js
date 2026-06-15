const fs = require('fs');

fetch('http://127.0.0.1:8000/products').then(r=>r.json()).then(d=>{
  const products = d.data || [];
  
  function hasOriginalProductImage(product) {
    if (!product || !product.image) return false;
    if (typeof product.image !== 'string') return false;
    const img = product.image.trim();
    if (img === '') return false;
    if (img.startsWith('/assets/')) return false;
    return true;
  }
  
  function getTopProducts(prods, max = 20) {
    const realImageProducts = prods.filter(hasOriginalProductImage);
    const fallbackProducts = prods.filter(p => !hasOriginalProductImage(p));
  
    const sortFn = (a, b) => {
      const aRev = a.reviews || 0;
      const bRev = b.reviews || 0;
      if (aRev !== bRev) return bRev - aRev;
      const aRat = a.rating || 0;
      const bRat = b.rating || 0;
      if (aRat !== bRat) return bRat - aRat;
      return (b.price || 0) - (a.price || 0);
    };
  
    realImageProducts.sort(sortFn);
    fallbackProducts.sort(sortFn);
  
    return [...realImageProducts, ...fallbackProducts].slice(0, max);
  }

  const sectionsRendered = [];
  let totalReal = 0;
  let totalFallback = 0;
  let initialRenderCount = 0;

  // 1. Featured
  const featuredCategories = ["GROCERY", "FRUITS_&_VEGETABLES", "BAKERY,_CAKES_&_DAIRY", "BEVERAGES", "SNACKS_&_SWEETS"];
  const featuredProds = getTopProducts(products.filter(p => featuredCategories.includes(p.category)), 15);
  
  if (featuredProds.length > 0) {
    const real = featuredProds.filter(hasOriginalProductImage).length;
    const fall = featuredProds.length - real;
    sectionsRendered.push({ title: 'Featured Products', total: featuredProds.length, real, fall });
    totalReal += real;
    totalFallback += fall;
    initialRenderCount += featuredProds.length; // Featured is above the fold
  }

  // Group by category
  const grouped = {};
  products.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  const CATEGORY_ORDER = [
    { id: "FRUITS_&_VEGETABLES", label: "Fruits & Vegetables" },
    { id: "GROCERY", label: "Grocery" },
    { id: "BAKERY,_CAKES_&_DAIRY", label: "Bakery, Cakes & Dairy" },
    { id: "BEVERAGES", label: "Beverages" },
    { id: "SNACKS_&_SWEETS", label: "Snacks & Sweets" },
    { id: "HEALTH_AND_PERSONAL_CARE", label: "Health & Personal Care" },
    { id: "BEAUTY_&_HYGIENE", label: "Beauty & Hygiene" },
    { id: "CLEANING_&_HOUSEHOLD", label: "Cleaning & Household" },
    { id: "BABY_CARE", label: "Baby Care" },
    { id: "PET_CARE", label: "Pet Care" },
    { id: "FESTIVALS", label: "Festivals" },
    { id: "HOME", label: "Home" },
    { id: "STUDENT", label: "Student" },
    { id: "TRAVEL", label: "Travel" }
  ];

  CATEGORY_ORDER.forEach(cat => {
    const items = grouped[cat.id] || [];
    if (items.length === 0) return;

    const subcats = items.reduce((acc, p) => {
      const s = p.subcategory || "Other";
      if (!acc[s]) acc[s] = [];
      acc[s].push(p);
      return acc;
    }, {});

    const largeSubcats = Object.entries(subcats).filter(([k, v]) => k && k !== "Other" && v.length >= 5);

    if (largeSubcats.length > 0) {
      largeSubcats.forEach(([subLabel, subItems]) => {
        const top = getTopProducts(subItems, 20);
        const real = top.filter(hasOriginalProductImage).length;
        const fall = top.length - real;
        sectionsRendered.push({ title: `${cat.label} - ${subLabel}`, total: top.length, real, fall });
        totalReal += real;
        totalFallback += fall;
      });
      if (subcats["Other"] && subcats["Other"].length > 0) {
        const top = getTopProducts(subcats["Other"], 20);
        const real = top.filter(hasOriginalProductImage).length;
        const fall = top.length - real;
        sectionsRendered.push({ title: `${cat.label} Essentials`, total: top.length, real, fall });
        totalReal += real;
        totalFallback += fall;
      }
    } else {
      const top = getTopProducts(items, 20);
      const real = top.filter(hasOriginalProductImage).length;
      const fall = top.length - real;
      sectionsRendered.push({ title: cat.label, total: top.length, real, fall });
      totalReal += real;
      totalFallback += fall;
    }
  });

  let markdown = `# Amazon Fresh UI Implementation Report\n\n`;
  markdown += `## Performance Metrics\n`;
  markdown += `- **Initial Render Product Count:** ${initialRenderCount} products (Only Featured is loaded initially; the rest are lazy-loaded via IntersectionObserver).\n`;
  markdown += `- **Total Products Loaded Across All Sections:** ${totalReal + totalFallback} (Significantly reduced from 1400+).\n`;
  markdown += `- **Total Carousels Rendered:** ${sectionsRendered.length}\n`;
  markdown += `- **Total Real-Image Products Used:** ${totalReal}\n`;
  markdown += `- **Total Fallback-Image Products Used:** ${totalFallback}\n\n`;

  markdown += `## Category & Subcategory Breakdown\n`;
  markdown += `| Section Title | Total Products | Real Images | Fallback Images |\n`;
  markdown += `|---|---|---|---|\n`;
  sectionsRendered.forEach(s => {
    markdown += `| ${s.title} | ${s.total} | ${s.real} | ${s.fall} |\n`;
  });

  fs.writeFileSync('c:/Users/srika/OneDrive/Desktop/LifeGraph_official/fresh_ui_implementation_report.md', markdown);
  console.log('Report generated.');
});
