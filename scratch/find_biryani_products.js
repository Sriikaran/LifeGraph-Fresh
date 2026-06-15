const fs = require('fs');

const content = fs.readFileSync('frontend/src/lib/products.ts', 'utf8');
const regex = /\{[^}]*\}/g;
let match;
let found = [];

while ((match = regex.exec(content)) !== null) {
  const text = match[0].toLowerCase();
  if (text.includes('biryani') || text.includes('rice') || text.includes('masala') || 
      text.includes('saffron') || text.includes('ghee') || text.includes('coriander') || 
      text.includes('mint') || text.includes('chicken') || text.includes('spice') ||
      text.includes('onion')) {
      
      const idMatch = match[0].match(/id:\s*"([^"]+)"/);
      if (idMatch) found.push({ id: idMatch[1], text: match[0] });
  }
}

console.log("Found products:", found.map(f => f.id));
