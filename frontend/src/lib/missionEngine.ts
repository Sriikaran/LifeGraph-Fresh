import { PRODUCTS } from "./products";

export type MissionGraphItem = {
  name: string;
  acquired: boolean;
};

export type MissionResult = {
  mission: string;
  probability: number;
  status:
    | "Not Started"
    | "In Progress"
    | "At Risk"
    | "Nearly Complete"
    | "Completed";
  riskScore: string;
  missingItems: string[];
  graph: MissionGraphItem[];
  risks: {
    compatibility: number;
    completion: number;
    budget: number;
    timing: number;
  };
  outcomeAfterCompletion: number;
} | null;

const MISSIONS = [
  {
    name: "New Phone Setup",
    coreKeywords: ["phone", "iphone", "samsung", "pixel"],
    components: [
      { name: "Phone", keywords: ["phone", "iphone", "samsung", "pixel"] },
      { name: "Case", keywords: ["case", "cover"] },
      { name: "Charger", keywords: ["charger", "adapter"] },
      { name: "Screen Protector", keywords: ["protector", "glass"] },
      { name: "Power Bank", keywords: ["power bank", "battery"] }
    ]
  },
  {
    name: "Home Office Setup",
    coreKeywords: ["laptop", "macbook", "notebook", "monitor"],
    components: [
      { name: "Computer", keywords: ["laptop", "macbook", "notebook", "desktop"] },
      { name: "Monitor", keywords: ["monitor", "display"] },
      { name: "Keyboard", keywords: ["keyboard"] },
      { name: "Mouse", keywords: ["mouse"] },
      { name: "Desk Mat", keywords: ["desk mat", "pad"] }
    ]
  },
  {
    name: "Gaming Setup",
    coreKeywords: ["playstation", "xbox", "controller", "gaming", "nintendo"],
    components: [
      { name: "Console/PC", keywords: ["playstation", "xbox", "console", "pc"] },
      { name: "Controller", keywords: ["controller", "gamepad"] },
      { name: "Headset", keywords: ["headset", "headphones"] },
      { name: "Gaming Mouse", keywords: ["gaming mouse"] }
    ]
  },
  {
    name: "Fitness Journey",
    coreKeywords: ["protein", "dumbbell", "yoga", "fitness", "weights"],
    components: [
      { name: "Equipment", keywords: ["dumbbell", "yoga", "mat", "weights"] },
      { name: "Nutrition", keywords: ["protein", "whey", "creatine"] },
      { name: "Shaker", keywords: ["shaker", "bottle", "shaker"] },
      { name: "Tracker", keywords: ["tracker", "watch", "band"] }
    ]
  },
  {
    name: "Travel Kit",
    coreKeywords: ["luggage", "backpack", "travel", "suitcase"],
    components: [
      { name: "Bag", keywords: ["luggage", "backpack", "suitcase"] },
      { name: "Power Bank", keywords: ["power bank", "charger"] },
      { name: "Neck Pillow", keywords: ["pillow", "neck"] },
      { name: "Adapter", keywords: ["adapter", "universal"] }
    ]
  },
  {
    name: "Home Entertainment Setup",
    coreKeywords: ["television", "tv", "smart tv"],
    components: [
      { name: "TV", keywords: ["television", "tv", "smart tv"] },
      { name: "Soundbar", keywords: ["soundbar", "speaker", "audio"] },
      { name: "HDMI Cable", keywords: ["hdmi", "cable"] },
      { name: "Wall Mount", keywords: ["mount", "bracket"] }
    ]
  }
];

export function detectMission(cartItems: any[]): MissionResult {
  if (!cartItems || cartItems.length === 0) return null;

  // Enhance cart items with product titles if they aren't fully populated
  const items = cartItems.map(it => {
    const p = PRODUCTS.find(prod => prod.id === it.productId);
    return { ...it, title: p?.title || it.title || "" };
  });

  // Find the highest confidence mission
  let detectedMission = null;
  for (const mission of MISSIONS) {
    const hasCore = items.some(item => 
      mission.coreKeywords.some(kw => item.title.toLowerCase().includes(kw.toLowerCase()))
    );
    if (hasCore) {
      detectedMission = mission;
      break; // First match wins
    }
  }

  if (!detectedMission) {
    return null;
  }

  // Calculate graph
  const graph: MissionGraphItem[] = detectedMission.components.map(comp => {
    const acquired = items.some(item => 
      comp.keywords.some(kw => item.title.toLowerCase().includes(kw.toLowerCase()))
    );
    return {
      name: comp.name,
      acquired
    };
  });

  const missingItems = graph.filter(g => !g.acquired).map(g => g.name);
  const acquiredCount = graph.filter(g => g.acquired).length;
  const missingCount = missingItems.length;

  // Generate probability
  let probability = 50 + (acquiredCount * 15) - (missingCount * 10);
  probability = Math.max(0, Math.min(100, probability));

  let status: MissionResult["status"] = "Not Started";
  if (probability <= 20) status = "Not Started";
  else if (probability <= 50) status = "At Risk";
  else if (probability <= 75) status = "In Progress";
  else if (probability <= 94) status = "Nearly Complete";
  else status = "Completed";

  // Risk based on inverse of probability
  const riskValue = 100 - probability;
  let riskScore = "Low";
  if (riskValue > 60) riskScore = "High";
  else if (riskValue > 30) riskScore = "Medium";

  // Mock deterministic risks
  const compatibilityRisk = Math.max(5, 40 - acquiredCount * 5);
  const completionRisk = Math.max(0, missingCount * 20);
  const budgetRisk = Math.max(10, 30 - acquiredCount * 2);
  const timingRisk = missingCount > 0 ? 45 : 5;

  const outcomeAfterCompletion = 100;

  return {
    mission: detectedMission.name,
    probability,
    status,
    riskScore,
    missingItems,
    graph,
    risks: {
      compatibility: compatibilityRisk,
      completion: completionRisk,
      budget: budgetRisk,
      timing: timingRisk
    },
    outcomeAfterCompletion
  };
}
