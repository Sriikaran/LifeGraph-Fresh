from domains.risk.repository import RiskRepository
from domains.risk.schemas import RiskRequest, RiskResponseData

class Person1IntegrationAdapter:
    """TODO: Integration adapter where Person 1 APIs will be consumed."""
    
    def get_mission(self, mission_id: str) -> dict:
        # TODO: Consume Person 1 Mission API here
        return {"mission_id": mission_id}
        
    def get_cart(self, cart_id: str) -> dict:
        # TODO: Consume Person 1 Cart API here
        return {"cart_id": cart_id}
        
    def get_relationships(self, mission_id: str) -> dict:
        # TODO: Consume Person 1 Relationship API and Graph API here
        return {"mission_id": mission_id, "dependencies": []}

class RiskService:
    def __init__(self):
        self.repository = RiskRepository()
        self.integration = Person1IntegrationAdapter()

    def analyze(self, data: RiskRequest) -> RiskResponseData:
        """
        Business Logic:
        * Calculate risk score.
        * Return LOW/MEDIUM/HIGH internally or as components.
        """
        # Fetch relationships to determine compatibility risk
        # Note: RiskRequest currently doesn't provide missionId, so we use a mock one 
        # to demonstrate the integration point.
        relationships = self.integration.get_relationships("MOCK_MISSION_ID")
        
        risk_score = 0
        compatibility_risk = "LOW"
        budget_risk = "LOW"
        quantity_risk = "LOW"
        timing_risk = "LOW"
        
        # Logic based on verification results and relationships
        if data.verification_score < 50:
            risk_score += 50
            compatibility_risk = "HIGH"
        elif data.verification_score < 80:
            risk_score += 20
            compatibility_risk = "MEDIUM"
            
        if len(data.missing_items) > 2:
            quantity_risk = "HIGH"
            risk_score += 15
            
        return RiskResponseData(
            compatibility_risk=compatibility_risk,
            budget_risk=budget_risk,
            quantity_risk=quantity_risk,
            timing_risk=timing_risk,
            risk_score=risk_score
        )
