const fs = require('fs');
const path = require('path');

const API_URL = 'http://127.0.0.1:8000/products';
const ARTIFACT_DIR = 'C:/Users/srika/.gemini/antigravity-ide/brain/6122a41d-195e-48af-8c3c-d5f5a2eba867';

fetch(API_URL).then(r=>r.json()).then(d=>{
  const products = d.data || [];

  const categories = {};
  const subcats = {};

  products.forEach(p => {
    const c = p.category || 'UNMAPPED';
    const s = p.subcategory || 'UNMAPPED';
    const isRealImage = p.image && !p.image.startsWith('/assets/');
    
    if (!categories[c]) {
        categories[c] = { 
            name: c, 
            count: 0, 
            realImages: 0, 
            fallbackImages: 0, 
            ratingGt4: 0, 
            reviewsGt100: 0, 
            totalRating: 0, 
            ratedCount: 0, 
            products: [] 
        };
    }
    const cat = categories[c];
    cat.count++;
    if (isRealImage) cat.realImages++;
    else cat.fallbackImages++;
    
    if (p.rating > 4) cat.ratingGt4++;
    if (p.reviews > 100) cat.reviewsGt100++;
    
    if (p.rating) {
        cat.totalRating += p.rating;
        cat.ratedCount++;
    }
    
    cat.products.push(p);

    if (!subcats[c]) subcats[c] = {};
    if (!subcats[c][s]) subcats[c][s] = { count: 0, realImages: 0, products: [] };
    subcats[c][s].count++;
    if (isRealImage) subcats[c][s].realImages++;
    subcats[c][s].products.push(p);
  });

  // 1. INVENTORY DRIVEN FRESH REPORT
  let invReport = `# Inventory Driven Fresh Report\n\n`;
  for (const [cName, cat] of Object.entries(categories)) {
      const avgRating = cat.ratedCount > 0 ? (cat.totalRating / cat.ratedCount).toFixed(2) : 'N/A';
      invReport += `## Category: ${cName}\n`;
      invReport += `- **Product Count**: ${cat.count}\n`;
      invReport += `- **Products With Real Images**: ${cat.realImages}\n`;
      invReport += `- **Products With Fallback Images**: ${cat.fallbackImages}\n`;
      invReport += `- **Products With Rating > 4**: ${cat.ratingGt4}\n`;
      invReport += `- **Products With Reviews > 100**: ${cat.reviewsGt100}\n`;
      invReport += `- **Average Rating**: ${avgRating}\n\n`;
      invReport += `### Top 10 Products\n`;
      const top10 = [...cat.products].sort((a,b) => (b.reviews||0) - (a.reviews||0)).slice(0, 10);
      top10.forEach((p, idx) => {
          invReport += `${idx+1}. ${p.title} (Subcat: ${p.subcategory}, Reviews: ${p.reviews}, Rating: ${p.rating})\n`;
      });
      invReport += `\n---\n\n`;
  }
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'inventory_driven_fresh_report.md'), invReport);

  // 2. SUBCATEGORY INVENTORY REPORT
  let subcatReport = `# Subcategory Inventory Report\n\n`;
  for (const [cName, subs] of Object.entries(subcats)) {
      subcatReport += `## ${cName}\n\n`;
      const sortedSubs = Object.entries(subs).sort((a,b) => b[1].count - a[1].count);
      sortedSubs.forEach(([sName, data]) => {
          subcatReport += `* **${sName}**: ${data.count} products (${data.realImages} real images)\n`;
      });
      subcatReport += `\n---\n\n`;
  }
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'subcategory_inventory_report.md'), subcatReport);

  // 3. HOMEPAGE SECTIONS PROPOSAL
  let homeProps = `# Fresh Homepage Sections Proposal\n\n`;
  homeProps += `*This proposal is generated dynamically based strictly on the live DynamoDB inventory.*\n\n`;
  
  homeProps += `## Phase 2: Category Eligibility for Homepage\n\n`;
  homeProps += `| Category | Product Count | Real Images | Homepage Eligible |\n`;
  homeProps += `| --- | --- | --- | --- |\n`;
  for (const [cName, cat] of Object.entries(categories)) {
      const eligible = cat.count >= 20 && cat.realImages >= 10 ? 'Yes' : 'No';
      homeProps += `| ${cName} | ${cat.count} | ${cat.realImages} | ${eligible} |\n`;
  }
  homeProps += `\n---\n\n`;

  homeProps += `## Phase 5: New Amazon Fresh Architecture\n\n`;
  homeProps += `Based on the subcategory inventory, the following sections will be built for the homepage. No empty/assumed sections like "Fresh Fruits" are included.\n\n`;
  
  const validSections = [];
  // Build sections dynamically from strong subcategories across GROCERY and others
  for (const [cName, subs] of Object.entries(subcats)) {
      if (categories[cName].count < 20 || categories[cName].realImages < 10) continue;
      const sortedSubs = Object.entries(subs).sort((a,b) => b[1].count - a[1].count);
      sortedSubs.forEach(([sName, data]) => {
          if (data.count >= 15 && data.realImages >= 10) {
              validSections.push({ title: sName, cName, count: data.count, realImages: data.realImages });
          }
      });
  }

  homeProps += `### Data-Backed Homepage Sections:\n\n`;
  homeProps += `1. **Trending Near You** (Top reviewed items overall)\n`;
  homeProps += `2. **Highly Rated Staples** (Rating = 5, Reviews > 100 overall)\n`;
  
  validSections.slice(0, 6).forEach((sec, i) => {
      homeProps += `${i+3}. **${sec.title}** (Source: ${sec.cName} -> ${sec.title} | ${sec.count} items, ${sec.realImages} real images)\n`;
  });
  
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'fresh_homepage_sections_proposal.md'), homeProps);

  // 4. CATEGORY PAGE PROPOSAL
  let catProps = `# Fresh Category Page Proposal\n\n`;
  catProps += `## Phase 3: Dedicated Category Page Analysis\n\n`;
  catProps += `| Category | Product Count | Real Images | Dedicated Page Eligible |\n`;
  catProps += `| --- | --- | --- | --- |\n`;
  
  const eligibleCategories = [];
  for (const [cName, cat] of Object.entries(categories)) {
      const eligible = cat.count >= 40 && cat.realImages >= 15 ? 'Yes' : 'No';
      catProps += `| ${cName} | ${cat.count} | ${cat.realImages} | ${eligible} |\n`;
      if (eligible === 'Yes') eligibleCategories.push(cName);
  }

  catProps += `\n---\n\n`;
  catProps += `## Dedicated Route Architecture\n\n`;
  eligibleCategories.forEach(c => {
      catProps += `### \`/fresh/${c.toLowerCase().replace(/_/g, '-')}\`\n`;
      catProps += `**Title:** ${c.replace(/_/g, ' ')}\n`;
      catProps += `**Subcategory Tabs:**\n`;
      const subs = subcats[c];
      const sortedSubs = Object.entries(subs).sort((a,b) => b[1].count - a[1].count);
      sortedSubs.forEach(([sName, data]) => {
          if (data.count >= 5) catProps += `- ${sName} (${data.count} items)\n`;
      });
      catProps += `\n`;
  });

  fs.writeFileSync(path.join(ARTIFACT_DIR, 'fresh_category_page_proposal.md'), catProps);

  // 5. NAVBAR REDESIGN PROPOSAL
  let navProps = `# Fresh Navbar Redesign Proposal\n\n`;
  navProps += `## Phase 6: Premium Navbar Redesign\n\n`;
  navProps += `The new navbar will visually resemble the premium Amazon Fresh quality standard. It will feature glassmorphism, sticky behavior, and smooth hover/active animations.\n\n`;
  navProps += `### Desktop Design Specifications\n`;
  navProps += `- **Container**: Sticky top, z-index 50, glassmorphic background (\`bg-white/95 backdrop-blur-sm\`), subtle bottom shadow (\`border-b border-gray-200 shadow-sm\`).\n`;
  navProps += `- **Logo**: Positioned left, "LifeGraph Fresh" with Amazon Fresh green accents (\`text-[#008296]\` or similar).\n`;
  navProps += `- **Main Navigation Tabs (Center)**:\n`;
  eligibleCategories.forEach(c => {
      navProps += `  - ${c.replace(/_/g, ' ')}\n`;
  });
  navProps += `- **Tab Interactions**:\n`;
  navProps += `  - Unselected: \`text-gray-600 hover:text-[#008296] hover:bg-gray-50\`\n`;
  navProps += `  - Active: \`text-[#008296] font-semibold\` with an animated bottom underline (\`border-b-2 border-[#008296]\`).\n`;
  navProps += `  - Spacing: generous padding (\`px-4 py-3\`) to ensure clickability.\n\n`;
  
  navProps += `### Mobile Design Specifications\n`;
  navProps += `- **Container**: Horizontal scrollable container (\`overflow-x-auto no-scrollbar\`) with snap scrolling (\`snap-x snap-mandatory\`).\n`;
  navProps += `- **Chips/Pills**: Replace text tabs with pill-shaped chips.\n`;
  navProps += `  - Unselected: \`bg-gray-100 text-gray-700 rounded-full px-4 py-2 border border-transparent\`\n`;
  navProps += `  - Active: \`bg-[#008296]/10 text-[#008296] rounded-full px-4 py-2 border border-[#008296]\`\n`;

  fs.writeFileSync(path.join(ARTIFACT_DIR, 'fresh_navbar_redesign_proposal.md'), navProps);

  console.log('All 5 reports generated successfully based strictly on the live DynamoDB inventory.');
});
