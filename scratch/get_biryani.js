const fs = require('fs');

const content = fs.readFileSync('frontend/src/lib/products.ts', 'utf8');
const regex = /id:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g;
let match;
let missingIds = [];
let recIds = [];

while ((match = regex.exec(content)) !== null) {
  const id = match[1];
  const title = match[2].toLowerCase();
  
  if (title.includes('rice') || title.includes('masala') || title.includes('ghee') || title.includes('saffron') || title.includes('coriander')) {
      if (missingIds.length < 8) missingIds.push(id);
      else if (recIds.length < 12) recIds.push(id);
  }
}

console.log("Missing:", JSON.stringify(missingIds));
console.log("Recommended:", JSON.stringify(recIds));
