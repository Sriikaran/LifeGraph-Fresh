from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class MissionVerifiedEvent(BaseModel):
    mission_id: str
    user_id: str
    status: str
    verified_at: str

class RiskCalculatedEvent(BaseModel):
    user_id: str
    cart_id: str
    score: float
    status: str
    calculated_at: str

class CheckoutBlockedEvent(BaseModel):
    user_id: str
    cart_id: str
    reason: str
    blocked_at: str

class SimulationCompletedEvent(BaseModel):
    user_id: str
    scenario: str
    outcome: str
    details: Dict[str, Any]
    completed_at: str
