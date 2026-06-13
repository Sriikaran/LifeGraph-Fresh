from domains.prevention.repository import PreventionRepository
from domains.prevention.schemas import PreventionRequest, PreventionResponseData

from domains.verification.service import VerificationService
from domains.verification.schemas import VerificationRequest
from domains.risk.service import RiskService
from domains.risk.schemas import RiskRequest

class PreventionService:
    def __init__(self):
        self.repository = PreventionRepository()
        self.verification_service = VerificationService()
        self.risk_service = RiskService()

    def evaluate(self, data: PreventionRequest) -> PreventionResponseData:
        """
        Business Logic:
        * Decide allowCheckout based on verification and risk.
        * Return reason / warnings.
        """
        # Call VerificationService
        # Pass the dynamic missionId from the request
        verification_req = VerificationRequest(missionId=data.missionId, cartId=data.cartId)
        verification_res = self.verification_service.verify(verification_req)
        
        # Call RiskService
        risk_req = RiskRequest(
            verification_score=verification_res.verification_score,
            missing_items=verification_res.missing_items
        )
        risk_res = self.risk_service.analyze(risk_req)
        
        actual_verification_score = verification_res.verification_score
        actual_risk_score = risk_res.risk_score
        
        allow_checkout = True
        reason = ""
        
        if actual_risk_score >= 70 or actual_verification_score < 30:
            allow_checkout = False
            reason = "High risk or low verification score detected. Checkout blocked."
        elif actual_risk_score >= 30:
            reason = "Medium risk detected. Please review your cart."
            
        return PreventionResponseData(
            allow_checkout=allow_checkout,
            reason=reason
        )
