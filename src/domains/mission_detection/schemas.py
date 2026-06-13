from pydantic import BaseModel
from typing import List

class MissionDetectionRequest(BaseModel):
    text: str

class MissionDetectionResponse(BaseModel):
    detected_mission: str
    confidence: float
    matched_keywords: List[str]
