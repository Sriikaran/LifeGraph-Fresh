from domains.verification.repository import VerificationRepository
from domains.verification.schemas import VerificationRequest, VerificationResponseData

class Person1IntegrationAdapter:
    """TODO: Integration adapter where Person 1 APIs will be consumed."""
    
    def get_mission(self, mission_id: str) -> dict:
        # TODO: Consume Person 1 Mission API here
        # Returning placeholder data to keep API contracts unchanged
        return {"mission_id": mission_id, "requirements": ["Cake", "Candles", "Drinks", "Snacks"]}
        
    def get_cart(self, cart_id: str) -> dict:
        # TODO: Consume Person 1 Cart API here
        # Returning placeholder data to keep API contracts unchanged
        return {"cart_id": cart_id, "contents": ["Cake", "Balloons", "Drinks"]}
        
    def get_relationships(self, mission_id: str) -> dict:
        # TODO: Consume Person 1 Relationship API and Graph API here
        return {"mission_id": mission_id, "dependencies": []}

class VerificationService:
    def __init__(self):
        self.repository = VerificationRepository()
        self.integration = Person1IntegrationAdapter()

    def verify(self, data: VerificationRequest) -> VerificationResponseData:
        """
        Business Logic:
        * Compare mission requirements against cart contents.
        * Calculate verification_score.
        """
        # Fetch from integration adapters
        mission = self.integration.get_mission(data.missionId)
        cart = self.integration.get_cart(data.cartId)
        relationships = self.integration.get_relationships(data.missionId)
        
        mission_requirements = mission.get("requirements", [])
        cart_contents = cart.get("contents", [])
        
        missing_items = []
        verification_score = 100
        
        for req in mission_requirements:
            if req not in cart_contents:
                missing_items.append(req)
                verification_score -= 25 # deduct 25 for each missing item
                
        # Prevent negative score
        verification_score = max(0, verification_score)
            
        return VerificationResponseData(
            verification_score=verification_score,
            missing_items=missing_items
        )
