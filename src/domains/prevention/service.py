from domains.prevention.repository import PreventionRepository
from domains.prevention.schemas import PreventionRequest, PreventionResponseData

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

class PreventionService:
    def __init__(self):
        self.repository = PreventionRepository()
        self.integration = Person1IntegrationAdapter()

    def evaluate(self, data: PreventionRequest) -> PreventionResponseData:
        """
        Business Logic:
        * Decide allowCheckout based on verification and risk.
        * Return reason / warnings.
        """
        # Fetch cart details to understand the context
        cart = self.integration.get_cart(data.cartId)
        
        # TODO: Integrate with actual Verification APIs and Risk APIs
        
        # Mocking downstream responses for now
        mock_verification_score = 60 # Assume MEDIUM risk from this
        mock_risk_score = 35 # Assume MEDIUM risk
        
        allow_checkout = True
        reason = ""
        
        if mock_risk_score >= 70 or mock_verification_score < 30:
            allow_checkout = False
            reason = "High risk or low verification score detected. Checkout blocked."
        elif mock_risk_score >= 30:
            reason = "Medium risk detected. Please review your cart."
            
        return PreventionResponseData(
            allow_checkout=allow_checkout,
            reason=reason
        )
