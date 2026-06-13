import json
from shared.services.graph_seeder_service import GraphSeederService
from shared.schemas.graph_seeder_schemas import MissionSeedRequest, BulkMissionSeedRequest

class GraphSeederController:
    def __init__(self):
        self.service = GraphSeederService()

    def seed_mission(self, event: dict) -> dict:
        body = json.loads(event.get('body', '{}'))
        request = MissionSeedRequest(**body)
        result = self.service.seed_mission(request)
        return {
            "statusCode": 200,
            "body": json.dumps({"success": True, "data": result})
        }

    def seed_bulk(self, event: dict) -> dict:
        body = json.loads(event.get('body', '{}'))
        request = BulkMissionSeedRequest(**body)
        result = self.service.seed_bulk(request.missions)
        return {
            "statusCode": 200,
            "body": json.dumps({"success": True, "data": result})
        }
