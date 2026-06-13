import json
from .service import MissionDetectionService
from .schemas import MissionDetectionRequest

class MissionDetectionController:
    def __init__(self):
        self.service = MissionDetectionService()

    def detect_mission(self, event: dict) -> dict:
        body = json.loads(event.get('body', '{}'))
        req = MissionDetectionRequest(**body)
        res = self.service.detect(req)
        
        return {
            "statusCode": 200,
            "body": json.dumps({"success": True, "data": res.model_dump()})
        }
