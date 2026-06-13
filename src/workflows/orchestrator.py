from typing import Any, Dict
from agents.base_agent import BaseAgent
from domains.verification.service import VerificationService
from domains.risk.service import RiskService
from domains.prevention.service import PreventionService
from agents.memory_agent import MemoryAgent
from agents.adaptive_agent import AdaptiveAgent
from agents.simulator_agent import SimulatorAgent
from shared.schemas.engine_schemas import VerificationRequest, RiskRequest, PreventionRequest

class OrchestratorAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="OrchestratorAgent")
        self.verification_service = VerificationService()
        self.risk_service = RiskService()
        self.prevention_service = PreventionService()
        self.memory_agent = MemoryAgent()
        self.adaptive_agent = AdaptiveAgent()
        self.simulator_agent = SimulatorAgent()

    def execute(self, action: str, payload: Any) -> Any:
        if action == "run_checkout_workflow":
            return self.run_checkout_workflow(payload)
        else:
            raise ValueError(f"Unknown action {action} for OrchestratorAgent")

    def run_checkout_workflow(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Coordinates the entire verification, risk analysis, prevention check, outcome simulation,
        and adaptive planning for a user's checkout request.
        """
        user_id = payload.get("user_id", "anonymous")
        cart_id = payload.get("cart_id")
        mission_id = payload.get("mission_id", "BIRTHDAY")
        
        # 1. Adapt rules based on user
        adaptation = self.adaptive_agent.execute("adapt", {"user_id": user_id})
        
        # 2. Verification check
        verification_req = VerificationRequest(missionId=mission_id, cartId=cart_id)
        verification_res = self.verification_service.verify(verification_req)
        
        # 3. Risk check
        risk_req = RiskRequest(
            verification_score=verification_res.verification_score,
            missing_items=verification_res.missing_items
        )
        risk_res = self.risk_service.analyze(risk_req)
        
        # 4. Prevention check
        prevention_req = PreventionRequest(missionId=mission_id, cartId=cart_id)
        prevention_res = self.prevention_service.evaluate(prevention_req)
        
        # 5. Outcome simulation
        sim_scenario = "high_risk" if risk_res.risk_score >= 70 else "normal"
        sim_res = self.simulator_agent.execute("simulate", {"user_id": user_id, "scenario": sim_scenario})
        
        # 6. Store memory of interaction
        memory_content = {
            "verification": verification_res.dict(),
            "risk": risk_res.dict(),
            "prevention": prevention_res.dict(),
            "simulation": sim_res
        }
        self.memory_agent.execute("store", {
            "user_id": user_id,
            "memory_type": "last_checkout_workflow",
            "content": memory_content
        })
        
        return {
            "success": True,
            "data": {
                "user_id": user_id,
                "cart_id": cart_id,
                "mission_id": mission_id,
                "verification": verification_res,
                "risk": risk_res,
                "prevention": prevention_res,
                "simulation": sim_res,
                "adapted_rules": adaptation.get("adapted_rules", {})
            }
        }
