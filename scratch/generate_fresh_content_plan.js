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

  // Define Category Mapping Logic (Updated with merge)
  function getCategoryInfo(p) {
    const c = p.category || '';
    const s = p.subcategory || '';
    const t = (p.title || '').toLowerCase();
    
    let targetCategory = "Other/Unmapped";
    let targetSubcategory = s;

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
      targetCategory = "Health, Household & Personal Care"; // Merged
    }
    else if (['HEALTH_AND_PERSONAL_CARE', 'BEAUTY_&_HYGIENE', 'BABY_CARE'].includes(c)) {
      targetCategory = "Health, Household & Personal Care"; // Merged
    }
    else if (c === 'GROCERY') {
      targetCategory = "Grocery & Staples";
    }

    if (!targetSubcategory || targetSubcategory === 'NONE') targetSubcategory = "General";
    return { cat: targetCategory, sub: targetSubcategory };
  }

  // Pre-process all products
  const processedProducts = products.map(p => {
    const info = getCategoryInfo(p);
    return { ...p, mappedCat: info.cat, mappedSub: info.sub, hasImage: hasRealImage(p) };
  });

  // HOMEPAGE SECTIONS LOGIC
  const homepageSections = [
    { name: "Season's Special", source: "All Categories", limit: 8 },
    { name: "Fresh Fruits", source: "Fruits & Vegetables", limit: 8 },
    { name: "All Vegetables", source: "Fruits & Vegetables", limit: 8 },
    { name: "Drinks & Juices", source: "Beverages", limit: 8 },
    { name: "Atta & Flours", source: "Grocery & Staples", limit: 8 },
    { name: "Household Cleaners", source: "Health, Household & Personal Care", limit: 8 },
    { name: "Popular Near You", source: "All Categories", limit: 8 },
    { name: "Trending Near You", source: "All Categories", limit: 8 }
  ];

  function selectProducts(sectionName, limit) {
    let pool = [];
    if (sectionName === "Season's Special") {
      pool = processedProducts.filter(p => p.hasImage).sort((a,b) => (b.rating||0) - (a.rating||0));
    } else if (sectionName === "Fresh Fruits") {
      pool = processedProducts.filter(p => p.hasImage && p.mappedCat === "Fruits & Vegetables" && p.title.toLowerCase().includes("fruit"));
    } else if (sectionName === "All Vegetables") {
      pool = processedProducts.filter(p => p.hasImage && p.mappedCat === "Fruits & Vegetables" && !p.title.toLowerCase().includes("fruit"));
    } else if (sectionName === "Drinks & Juices") {
      pool = processedProducts.filter(p => p.hasImage && p.mappedCat === "Beverages");
    } else if (sectionName === "Atta & Flours") {
      pool = processedProducts.filter(p => p.hasImage && p.mappedCat === "Grocery & Staples" && (p.mappedSub.toLowerCase().includes("flour") || p.mappedSub.toLowerCase().includes("atta")));
    } else if (sectionName === "Household Cleaners") {
      pool = processedProducts.filter(p => p.hasImage && p.mappedCat === "Health, Household & Personal Care" && (p.category === 'CLEANING_&_HOUSEHOLD' || p.category === 'HOME'));
    } else if (sectionName === "Popular Near You") {
      pool = processedProducts.filter(p => p.hasImage).sort((a,b) => (b.reviews||0) - (a.reviews||0));
    } else if (sectionName === "Trending Near You") {
      pool = processedProducts.filter(p => p.hasImage).sort((a,b) => {
        const aScore = (a.reviews||0) / ((a.price||1)+1);
        const bScore = (b.reviews||0) / ((b.price||1)+1);
        return bScore - aScore;
      });
    }

    // Attempt to respect diversity: max 40% brand, max 60% subcategory
    const selected = [];
    const brandCounts = {};
    const subCounts = {};
    const MAX_BRAND = Math.ceil(limit * 0.4); // e.g. 3
    const MAX_SUB = Math.ceil(limit * 0.6);   // e.g. 5

    // Very simplistic greedy selection
    for (const p of pool) {
      if (selected.length >= limit) break;
      const b = p.brand || 'Unknown';
      const s = p.mappedSub;

      if ((brandCounts[b] || 0) < MAX_BRAND && (subCounts[s] || 0) < MAX_SUB) {
        selected.push(p);
        brandCounts[b] = (brandCounts[b] || 0) + 1;
        subCounts[s] = (subCounts[s] || 0) + 1;
      }
    }
    
    // Fallback if we couldn't fill limit because constraints were too tight
    if (selected.length < limit) {
        for (const p of pool) {
            if (selected.length >= limit) break;
            if (!selected.includes(p)) selected.push(p);
        }
    }

    return { pool, selected };
  }

  let md = `# Fresh Homepage Content Plan\n\n`;

  homepageSections.forEach(sec => {
    const { pool, selected } = selectProducts(sec.name, sec.limit);
    md += `### ${sec.name}\n`;
    md += `**Product Source:** ${sec.source}\n\n`;
    md += `**Product Count Available:** ${pool.length}\n`;
    md += `**Real Images Available:** ${pool.filter(p=>p.hasImage).length}\n\n`;
    
    md += `**Selected Products:**\n`;
    if (selected.length === 0) {
        md += `*None available with real images matching criteria*\n\n`;
    } else {
        selected.forEach((p, idx) => {
            md += `${idx+1}. ${p.title} (Brand: ${p.brand || 'Unknown'}, Subcat: ${p.mappedSub})\n`;
        });
        md += '\n';
        
        // Diversity Validation
        const bCounts = {};
        const sCounts = {};
        selected.forEach(p => {
           bCounts[p.brand || 'Unknown'] = (bCounts[p.brand || 'Unknown'] || 0) + 1;
           sCounts[p.mappedSub] = (sCounts[p.mappedSub] || 0) + 1;
        });
        const maxB = Math.max(...Object.values(bCounts));
        const maxS = Math.max(...Object.values(sCounts));
        const bPct = ((maxB / selected.length) * 100).toFixed(0);
        const sPct = ((maxS / selected.length) * 100).toFixed(0);
        
        md += `**Diversity Validation:**\n`;
        md += `- Unique Brands: ${Object.keys(bCounts).length}\n`;
        md += `- Unique Subcategories: ${Object.keys(sCounts).length}\n`;
        md += `- Max Brand Concentration: ${bPct}%\n`;
        md += `- Max Subcategory Concentration: ${sPct}%\n`;
        md += `- Image Quality Score: 100% Real\n\n`;
    }
    md += `---\n\n`;
  });

  md += `## Category Page Validation\n\n`;
  const catGroups = {};
  processedProducts.forEach(p => {
    if (!catGroups[p.mappedCat]) catGroups[p.mappedCat] = { total: 0, real: 0, fall: 0, subs: {} };
    catGroups[p.mappedCat].total++;
    if (p.hasImage) catGroups[p.mappedCat].real++; else catGroups[p.mappedCat].fall++;
    catGroups[p.mappedCat].subs[p.mappedSub] = (catGroups[p.mappedCat].subs[p.mappedSub] || 0) + 1;
  });

  for (const [c, info] of Object.entries(catGroups)) {
      if (c === "Other/Unmapped" && info.total === 0) continue;
      md += `### Route: \`/fresh/${c.toLowerCase().replace(/[ &,]+/g, '-')}\`\n`;
      md += `- Product Count: ${info.total}\n`;
      md += `- Real Image Count: ${info.real}\n`;
      md += `- Fallback Image Count: ${info.fall}\n`;
      md += `- Subsection Count: ${Object.keys(info.subs).length}\n`;
      md += `- Subsection Names: ${Object.keys(info.subs).join(', ')}\n`;
      if (info.total < 20) {
          md += `**⚠️ WARNING: Less than 20 products!**\n`;
      }
      md += '\n';
  }

  fs.writeFileSync('C:/Users/srika/.gemini/antigravity-ide/brain/6122a41d-195e-48af-8c3c-d5f5a2eba867/fresh_homepage_content_plan.md', md);
  console.log('fresh_homepage_content_plan.md generated');
});
