import json
from domains.adaptive.service import AdaptiveService

class AdaptiveController:
    def __init__(self):
        self.service = AdaptiveService()

    def handle(self, event: dict) -> dict:
        return {"statusCode": 200, "body": json.dumps({"success": True})}
