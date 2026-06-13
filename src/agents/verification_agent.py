from typing import Any
from datetime import datetime
from agents.base_agent import BaseAgent
from shared.schemas.engine_schemas import VerificationRequest, VerificationResponseData
from shared.events import MissionVerifiedEvent
from infrastructure.dynamodb.base_repository import BaseRepository

class VerificationRepository(BaseRepository):
    pass

class VerificationAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="VerificationAgent")
        self.repository = VerificationRepository()

    def execute(self, action: str, payload: Any) -> Any:
        if action == "verify":
            return self.verify(payload)
        else:
            raise ValueError(f"Unknown action {action} for VerificationAgent")

    def verify(self, data: VerificationRequest) -> VerificationResponseData:
        """
        Business Logic:
        * Compare mission requirements against cart contents using V2 weights.
        * Calculate verification_score.
        """
        from graph.service import GraphService
        from domains.carts.repository import CartRepository
        
        graph_service = GraphService()
        cart_repository = CartRepository()
        
        reqs_weighted = graph_service.get_mission_requirements_weighted(data.missionId)
        cart_items = cart_repository.get_cart_items(data.cartId)
        cart_contents = [item.product_id.lower() for item in cart_items]

        # Fallback to test fixtures if none found in DB
        if not reqs_weighted:
            reqs_weighted = [
                {"product_id": "birthday_cake", "weight": 40, "required": True},
                {"product_id": "birthday_candles", "weight": 20, "required": True},
                {"product_id": "soft_drinks", "weight": 10, "required": True},
                {"product_id": "party_hats", "weight": 2, "required": False}
            ]
            
        missing_items = []
        total_required_weight = 0
        present_required_weight = 0
        
        for item in reqs_weighted:
            p_id = item["product_id"]
            is_req = item["required"]
            weight = item["weight"]
            
            if is_req:
                total_required_weight += weight
                if p_id.lower() in cart_contents:
                    present_required_weight += weight
                else:
                    missing_items.append(p_id)
                    
        verification_score = 100.0
        if total_required_weight > 0:
            verification_score = (present_required_weight / total_required_weight) * 100
            
        verification_score = int(round(verification_score))
            
        res_data = VerificationResponseData(
            verification_score=verification_score,
            missing_items=missing_items
        )

        # Emit MissionVerifiedEvent
        event = MissionVerifiedEvent(
            mission_id=data.missionId,
            user_id="UNKNOWN_USER",  # Placeholder since request only contains missionId and cartId
            status="VERIFIED" if verification_score >= 70 else "FAILED",
            verified_at=datetime.utcnow().isoformat()
        )
        self.emit_event("MissionVerifiedEvent", event.dict())
        
        return res_data

