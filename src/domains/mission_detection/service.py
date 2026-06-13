import re
from .schemas import MissionDetectionRequest, MissionDetectionResponse

class MissionDetectionService:
    def __init__(self):
        self.rules = {
            "BIRTHDAY": ["friend", "birthday", r"turns\s+\d+", "turns", "celebration", "party"],
            "CAMPING": ["camping", "tent", "trek", "hiking"],
            "ROAD_TRIP": ["road trip", "travel", "highway", "drive"],
            "FITNESS": ["gym", "workout", "fitness", "muscle"],
            "PHONE_SETUP": ["phone", "iphone", "android", "charger"]
        }

    def detect(self, request: MissionDetectionRequest) -> MissionDetectionResponse:
        text = request.text.lower()
        
        best_mission = "UNKNOWN"
        best_confidence = 0.0
        best_matches = []
        
        for mission, keywords in self.rules.items():
            matches = []
            for kw in keywords:
                # Use regex search to capture dynamic matches like "turns 20"
                pattern = kw
                if kw == r"turns\s+\d+":
                    match = re.search(pattern, text)
                    if match:
                        matches.append(match.group(0))
                else:
                    if kw in text:
                        matches.append(kw)
            
            if matches:
                # Rule-based confidence scoring
                if len(matches) == 1:
                    confidence = 0.60
                elif len(matches) == 2:
                    confidence = 0.85
                else:
                    confidence = 0.94
                
                if confidence > best_confidence:
                    best_confidence = confidence
                    best_mission = mission
                    best_matches = matches
                    
        return MissionDetectionResponse(
            detected_mission=best_mission,
            confidence=best_confidence,
            matched_keywords=best_matches
        )
