
import { checkDemoMode } from '../../src/services/demoInterceptor';

const queries = [
  "movie night",
  "weight loss",
  "healthy breakfast",
  "study session",
  "train journey",
  "immunity",
  "festival preparation",
  "baking"
];

const reportLines = [
  "# Hardcoded Mission Count Audit",
  "",
  "This report validates that the expansion and duplicate-removal logic for curated demo missions results in the exact requested counts.",
  ""
];

queries.forEach(q => {
  const res = checkDemoMode(q);
  if (!res) return;
  
  const currentMissing = new Set(res.verification.missing_items || []);
  let missingIds = Array.from(currentMissing);
  
  const currentRecommended = new Set(res.verification.optional_missing || []);
  let recommendedIds: string[] = [];
  
  for (const rId of Array.from(currentRecommended)) {
    if (!currentMissing.has(rId)) {
      recommendedIds.push(rId);
    } else {
      currentRecommended.delete(rId);
    }
  }
  
  const curatedPool = [
    ...(res.verification.recommended_products || []),
    ...(res.simulation?.recommended_additions || [])
  ];
  
  let i = 0;
  while (recommendedIds.length < 12 && i < curatedPool.length) {
    const id = curatedPool[i];
    if (!currentMissing.has(id) && !currentRecommended.has(id)) {
      recommendedIds.push(id);
      currentRecommended.add(id);
    }
    i++;
  }
  
  const duplicates = missingIds.filter(id => recommendedIds.includes(id)).length;
  
  reportLines.push(`## Mission: ${res.mission.detected_mission}`);
  reportLines.push(`- Missing Essentials Count: **${missingIds.length}** (Expected: 8)`);
  reportLines.push(`- Recommended Additions Count: **${recommendedIds.length}** (Expected: 12)`);
  reportLines.push(`- Duplicate Count: **${duplicates}** (Expected: 0)`);
  
  if (missingIds.length !== 8 || recommendedIds.length !== 12 || duplicates !== 0) {
     reportLines.push(`  ⚠️ **WARNING:** Mission did not meet exact constraints.`);
  } else {
     reportLines.push(`  ✅ **PASS:** Perfect counts.`);
  }
  reportLines.push("");
});

import * as fs from 'fs';
fs.writeFileSync('C:/Users/srika/.gemini/antigravity-ide/brain/6122a41d-195e-48af-8c3c-d5f5a2eba867/hardcoded_mission_count_audit.md', reportLines.join('\n'));
console.log("Audit report generated successfully.");
