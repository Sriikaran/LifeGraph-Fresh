const fs = require('fs');

fetch('http://127.0.0.1:8000/products').then(r=>r.json()).then(d=>{
  const products = d.data || [];

  function hasRealImage(product) {
    if (!product || !product.image) return false;
    if (typeof product.image !== 'string') return false;
    const img = product.image.trim();
    if (img === '') return false;
    if (img.startsWith('/assets/')) return false;
    return true;
  }

  const mappedCategories = {
    "Fruits & Vegetables": { products: [], subcategories: {} },
    "Grocery & Staples": { products: [], subcategories: {} },
    "Oil & Ghee": { products: [], subcategories: {} },
    "Dairy & Bakery": { products: [], subcategories: {} },
    "Beverages": { products: [], subcategories: {} },
    "Snacks & Sweets": { products: [], subcategories: {} },
    "Household Essentials": { products: [], subcategories: {} },
    "Health & Personal Care": { products: [], subcategories: {} },
    "Other/Unmapped": { products: [], subcategories: {} }
  };

  products.forEach(p => {
    const c = p.category || '';
    const s = p.subcategory || '';
    const t = (p.title || '').toLowerCase();
    
    let targetCategory = "Other/Unmapped";
    let targetSubcategory = s;

    // Mapping Logic
    if (c === 'FRUITS_&_VEGETABLES' || t.includes('fruit') || t.includes('vegetable')) {
      targetCategory = "Fruits & Vegetables";
      if (!s || s === 'NONE') targetSubcategory = t.includes('fruit') ? 'Fresh Fruits' : 'Fresh Vegetables';
    }
    else if (c === 'BEVERAGES' || (c === 'GROCERY' && (s === 'Tea' || s === 'Coffee' || t.includes('juice')))) {
      targetCategory = "Beverages";
    }
    else if (c === 'SNACKS_&_SWEETS' || (c === 'GROCERY' && s === 'Snacks & Confectionery') || t.includes('biscuit') || t.includes('chocolate')) {
      targetCategory = "Snacks & Sweets";
    }
    else if (c === 'BAKERY,_CAKES_&_DAIRY' || (c === 'GROCERY' && (s.toLowerCase().includes('dairy') || s.toLowerCase().includes('bakery'))) || t.includes('milk') || t.includes('paneer') || t.includes('butter')) {
      targetCategory = "Dairy & Bakery";
    }
    else if (c === 'GROCERY' && (s.toLowerCase().includes('oil') || t.includes('oil') || t.includes('ghee'))) {
      targetCategory = "Oil & Ghee";
      if (t.includes('olive')) targetSubcategory = 'Olive Oil';
      else if (t.includes('mustard')) targetSubcategory = 'Mustard Oil';
      else if (t.includes('coconut')) targetSubcategory = 'Coconut Oil';
      else if (t.includes('ghee')) targetSubcategory = 'Ghee';
      else targetSubcategory = 'Edible Oils';
    }
    else if (['CLEANING_&_HOUSEHOLD', 'HOME', 'PET_CARE'].includes(c)) {
      targetCategory = "Household Essentials";
    }
    else if (['HEALTH_AND_PERSONAL_CARE', 'BEAUTY_&_HYGIENE', 'BABY_CARE'].includes(c)) {
      targetCategory = "Health & Personal Care";
    }
    else if (c === 'GROCERY') {
      targetCategory = "Grocery & Staples";
    }

    if (!targetSubcategory || targetSubcategory === 'NONE') targetSubcategory = "General";

    mappedCategories[targetCategory].products.push(p);
    if (!mappedCategories[targetCategory].subcategories[targetSubcategory]) {
      mappedCategories[targetCategory].subcategories[targetSubcategory] = 0;
    }
    mappedCategories[targetCategory].subcategories[targetSubcategory]++;
  });

  let md = `# Fresh Category Audit\n\n`;
  md += `## Route Mapping\n`;
  md += `- \`/fresh/fruits-vegetables\` -> Fruits & Vegetables\n`;
  md += `- \`/fresh/grocery-staples\` -> Grocery & Staples\n`;
  md += `- \`/fresh/oil-ghee\` -> Oil & Ghee\n`;
  md += `- \`/fresh/dairy-bakery\` -> Dairy & Bakery\n`;
  md += `- \`/fresh/beverages\` -> Beverages\n`;
  md += `- \`/fresh/snacks-sweets\` -> Snacks & Sweets\n`;
  md += `- \`/fresh/household\` -> Household Essentials\n`;
  md += `- \`/fresh/health-personal-care\` -> Health & Personal Care\n\n`;

  md += `## Homepage Section Mapping\n`;
  md += `- **Season's Special**: Top rated overall\n`;
  md += `- **Fresh Fruits**: Real-image products from Fruits & Vegetables\n`;
  md += `- **All Vegetables**: Real-image products from Fruits & Vegetables\n`;
  md += `- **Drinks & Juices**: Real-image products from Beverages\n`;
  md += `- **Atta & Flours**: Real-image products from Grocery & Staples (Atta/Flour subcats)\n`;
  md += `- **Household Cleaners**: Real-image products from Household Essentials\n`;
  md += `- **Popular Near You**: Most reviewed overall\n`;
  md += `- **Trending Near You**: High review/price ratio overall\n`;
  md += `- **Deals of the Day**: Highest MRP discount overall\n`;
  md += `- **Best Rated Products**: 5-star items\n`;
  md += `- **Frequently Purchased**: Random high-rating shuffle\n\n`;

  md += `## Category Counts & Audit\n\n`;

  for (const [catName, data] of Object.entries(mappedCategories)) {
    if (catName === 'Other/Unmapped' && data.products.length === 0) continue;
    
    const total = data.products.length;
    const real = data.products.filter(hasRealImage).length;
    const fallback = total - real;

    const subcats = Object.entries(data.subcategories)
      .sort((a,b) => b[1] - a[1])
      .map(([k,v]) => `- ${k}: ${v}`)
      .join('\n');

    md += `### ${catName}\n`;
    md += `**Products:** ${total}\n`;
    md += `**Real Images:** ${real}\n`;
    md += `**Fallback Images:** ${fallback}\n\n`;
    md += `**Top Subcategories:**\n${subcats}\n\n`;
    md += `---\n\n`;
  }

  fs.writeFileSync('C:/Users/srika/.gemini/antigravity-ide/brain/6122a41d-195e-48af-8c3c-d5f5a2eba867/fresh_category_audit.md', md);
  console.log('fresh_category_audit.md generated in artifacts dir');
});
