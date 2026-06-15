import fs from 'fs';
import { checkDemoMode } from './src/services/demoInterceptor.ts';

const queries = [
  'movie night',
  'weight loss',
  'healthy breakfast',
  'study session',
  'train journey',
  'festival',
  'chicken biryani'
];

const pool = new Set();
queries.forEach(q => {
  const res = checkDemoMode(q);
  if (res) {
    if (res.verification?.missing_items) res.verification.missing_items.forEach(id => pool.add(id));
    if (res.verification?.recommended_products) res.verification.recommended_products.forEach(id => pool.add(id));
    if (res.simulation?.recommended_additions) res.simulation.recommended_additions.forEach(id => pool.add(id));
  }
});

fs.writeFileSync('frontend/src/services/demoPool.ts', `export const DEMO_CURATED_POOL = ${JSON.stringify(Array.from(pool), null, 2)};\n`);
console.log('Created demoPool.ts with', pool.size, 'items');
