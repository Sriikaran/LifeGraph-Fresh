export interface MissionResult {
  detected_mission: string;
  parameters: any;
  confidence: number;
}

export interface VerificationResult {
  readiness_score: number;
  readiness_breakdown: any;
  required_items: string[];
  missing_items: string[];
  critical_missing: string[];
  important_missing: string[];
  optional_missing: string[];
  recommended_products: string[];
}

export interface RiskResult {
  risk_score: number;
  risk_level: string;
  risks: Array<{
    type: string;
    severity: string;
    reason: string;
  }>;
}

export interface SimulationResult {
  current_success: number;
  optimized_success: number;
  improvement: number;
  recommended_additions: string[];
}

export interface OutcomeResponse {
  status?: string;
  action?: string;
  message?: string;
  mission?: MissionResult;
  cart?: any;
  verification?: VerificationResult;
  risk?: RiskResult;
  regret_prevention?: any;
  simulation?: SimulationResult;
  final_recommendation?: any;
  reasoning?: string[];
  mission_coherence_score?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function analyzeOutcome(query: string): Promise<OutcomeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/orchestrator/outcome-intelligence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data: OutcomeResponse = await response.json();
    return data;
  } catch (error) {
    console.error("[Outcome API] Error:", error);
    throw error;
  }
}
