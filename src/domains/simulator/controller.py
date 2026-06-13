import json
from domains.simulator.service import SimulatorService

class SimulatorController:
    def __init__(self):
        self.service = SimulatorService()

    def run(self, event: dict) -> dict:
        return {"statusCode": 200, "body": json.dumps({"success": True})}
