const fs = require('fs');

fetch('http://127.0.0.1:8000/products').then(r=>r.json()).then(d=>{
  const products = d.data || [];
  const allFresh = products.filter(p => ['FRUITS_&_VEGETABLES', 'GROCERY', 'BAKERY,_CAKES_&_DAIRY', 'BEVERAGES', 'SNACKS_&_SWEETS'].includes(p.category));
  
  function hasOriginalProductImage(product) {
    if (!product || !product.image) return false;
    if (typeof product.image !== 'string') return false;
    const img = product.image.trim();
    if (img === '') return false;
    if (img.startsWith('/assets/')) return false;
    return true;
  }
  
  const sorted = allFresh.slice().sort((a, b) => {
    const aReal = hasOriginalProductImage(a);
    const bReal = hasOriginalProductImage(b);
    if (aReal && !bReal) return -1;
    if (!aReal && bReal) return 1;
    const aReviews = a.reviews || 0;
    const bReviews = b.reviews || 0;
    if (aReviews !== bReviews) return bReviews - aReviews;
    const aRating = a.rating || 0;
    const bRating = b.rating || 0;
    return bRating - aRating;
  });

  let realCount = 0;
  for (let p of sorted) {
    if (hasOriginalProductImage(p)) realCount++;
    else break;
  }
  
  let markdown = `# Image Bucket Sort Verification\n\n`;
  markdown += `**Count of real-image products before first fallback product appears:** ${realCount}\n\n`;
  markdown += `## First 50 Products (Fresh Page)\n\n`;
  markdown += `| Rank | Title | Image URL | Real Image? | Reviews | Rating |\n`;
  markdown += `|---|---|---|---|---|---|\n`;
  
  sorted.slice(0, 50).forEach((p, i) => {
    markdown += `| ${i+1} | ${p.title} | ${p.image} | ${hasOriginalProductImage(p)} | ${p.reviews} | ${p.rating} |\n`;
  });
  
  fs.writeFileSync('c:/Users/srika/OneDrive/Desktop/LifeGraph_official/image_bucket_sort_verification.md', markdown);
  console.log('Verification file generated.');
});
