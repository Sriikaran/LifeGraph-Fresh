const fs = require('fs');

fetch('http://127.0.0.1:8000/products').then(r=>r.json()).then(d=>{
  const products = d.data || [];

  const BANNED_FRUIT_TERMS = [
    'biscuit', 'cookie', 'powder', 'masala', 'pickle', 'candy', 'muesli', 'nuts', 'almond', 'cashew', 
    'pistachio', 'raisin', 'seed', 'dates', 'choco', 'tutti', 'broth', 'dog food', 'cat food', 'dry fruit', 
    'syrup', 'crush', 'jam', 'yogurt', 'yoghurt', 'smoothie', 'juice', 'drink', 'gum', 'cereal', 'puree', 
    'spread', 'jelly', 'preserve', 'bar', 'supplement', 'bite', 'snack', 'mix', 'dried', 'dry', 'toothpaste', 
    'brush', 'mouthwash', 'tea', 'coffee', 'vinegar', 'cider', 'shampoo', 'wash', 'lotion', 'cream', 'soap',
    'emulsion', 'tablet', 'lollipop', 'power', 'nutrition', 'growth', 'development', 'squash', 'toffee', 'flavor', 'flavour', 'oil', 'extract'
  ];
  
  const BANNED_VEG_TERMS = [
    'biscuit', 'cookie', 'powder', 'masala', 'pickle', 'candy', 'muesli', 'nuts', 'almond', 'cashew', 
    'pistachio', 'raisin', 'seed', 'dates', 'choco', 'tutti', 'broth', 'dog food', 'cat food', 'dry fruit', 
    'syrup', 'crush', 'jam', 'coffee', 'tea', 'pasta', 'seasoning', 'spice', 'pepper', 'pulse', 'dalia', 
    'sauce', 'ketchup', 'paste', 'soup', 'noodle', 'maggi', 'yippee', 'snack', 'mix', 'extract', 'puree', 
    'oil', 'mayonnaise', 'mayo', 'dip', 'frozen', 'bites', 'fry', 'fries', 'drink', 'beverage', 'water', 
    'freshener', 'sugar free', 'spray', 'makhana', 'chips', 'crisps', 'namkeen', 'bhujia', 'sev', 'peanuts',
    'squash', 'vinegar', 'cider', 'flavor', 'flavour'
  ];

  function hasWord(str, word) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(str);
  }

  function isActualFruit(title, category, subcategory) {
    const t = title.toLowerCase();
    if (BANNED_FRUIT_TERMS.some(b => t.includes(b))) return false;
    const fruits = ['apple', 'banana', 'mango', 'orange', 'grapes', 'papaya', 'guava', 'watermelon', 'melon', 'kiwi', 'pineapple', 'pomegranate', 'strawberry', 'blueberry', 'peach', 'plum', 'pear', 'cherry', 'fig', 'avocado'];
    return fruits.some(f => hasWord(t, f) && !t.includes(f + ' flavor') && !t.includes(f + ' essence'));
  }

  function isActualVegetable(title, category, subcategory) {
    const t = title.toLowerCase();
    if (BANNED_VEG_TERMS.some(b => t.includes(b))) return false;
    const veg = ['onion', 'potato', 'tomato', 'cabbage', 'carrot', 'spinach', 'broccoli', 'cauliflower', 'capsicum', 'garlic', 'ginger', 'beans', 'peas', 'brinjal', 'eggplant', 'lady finger', 'okra', 'cucumber', 'pumpkin', 'gourd', 'mushroom', 'celery', 'lettuce', 'coriander'];
    if (t.includes('coffee') || t.includes('black pepper') || t.includes('white pepper') || t.includes('soya')) return false;
    return veg.some(v => hasWord(t, v) && !t.includes(v + ' powder') && !t.includes(v + ' paste'));
  }

  function isBeverage(title, category, subcategory) {
    if (category === 'BEVERAGES') return true;
    if (subcategory === 'Tea' || subcategory === 'Coffee') return true;
    const t = title.toLowerCase();
    if (t.includes('juice') && !t.includes('powder') && !t.includes('candy')) return true;
    if (hasWord(t, 'drink') || t.includes('soda') || t.includes('water')) return true;
    return false;
  }

  function isHousehold(title, category, subcategory) {
    return ['CLEANING_&_HOUSEHOLD', 'HOME'].includes(category);
  }

  function isOilOrGhee(title, category, subcategory) {
    const t = title.toLowerCase();
    const s = subcategory.toLowerCase();
    if (hasWord(t, 'oil') || hasWord(t, 'ghee') || s.includes('oil') || s.includes('ghee')) {
        if (t.includes('hair') || t.includes('massage') || t.includes('body') || t.includes('skin') || t.includes('essential')) return false;
        return true;
    }
    return false;
  }

  const sections = {
    "Season's Special": [],
    "Fresh Fruits": [],
    "Fresh Vegetables": [],
    "Drinks & Juices": [],
    "Atta & Flours": [],
    "Household Essentials": [],
    "Oil & Ghee": [],
    "Popular Near You": [],
    "Trending Near You": []
  };

  products.forEach(p => {
    if (!p.image || p.image.startsWith('/assets/')) return; 
    
    const t = (p.title || '');
    const c = p.category || '';
    const s = p.subcategory || '';
    
    if (isActualFruit(t, c, s)) sections["Fresh Fruits"].push({ p, reason: 'Strict regex match for raw fruit' });
    else if (isActualVegetable(t, c, s)) sections["Fresh Vegetables"].push({ p, reason: 'Strict regex match for raw vegetable' });
    
    if (isBeverage(t, c, s)) sections["Drinks & Juices"].push({ p, reason: `Beverage logic match` });
    if (s === 'Flour & Atta') sections["Atta & Flours"].push({ p, reason: `Subcategory: ${s}` });
    if (isHousehold(t, c, s)) sections["Household Essentials"].push({ p, reason: `Category match` });
    if (isOilOrGhee(t, c, s)) sections["Oil & Ghee"].push({ p, reason: `Oil/Ghee strict match` });
    
    if (p.reviews > 1000) sections["Popular Near You"].push({ p, reason: `Reviews > 1000` });
    if (p.rating === 5) sections["Season's Special"].push({ p, reason: `Rating is 5` });
  });

  products.filter(p => !p.image.startsWith('/assets/')).sort((a,b) => (b.reviews||0) - (a.reviews||0)).slice(0, 20).forEach(p => {
      sections["Trending Near You"].push({ p, reason: `Top sorted by reviews` });
  });

  let md = `# Fresh Classification Validation v4\n\n`;

  for (const [sec, items] of Object.entries(sections)) {
      md += `## ${sec} (${items.length} valid products found)\n`;
      const selected = items.slice(0, 8);
      if (selected.length === 0) {
          md += `*Warning: 0 products matched this strict criteria in the dataset.*\n\n`;
      } else {
          selected.forEach((item, idx) => {
              const p = item.p;
              md += `${idx+1}. **${p.title}**\n`;
              md += `   - Original Category: \`${p.category}\`\n`;
              md += `   - Original Subcategory: \`${p.subcategory}\`\n`;
              md += `   - Why included: ${item.reason}\n`;
          });
          md += `\n`;
      }
  }

  fs.writeFileSync('C:/Users/srika/.gemini/antigravity-ide/brain/6122a41d-195e-48af-8c3c-d5f5a2eba867/fresh_classification_validation.md', md);
  console.log('fresh_classification_validation.md generated successfully.');
});
