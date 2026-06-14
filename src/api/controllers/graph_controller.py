import json
from graph.service import GraphService

class GraphController:
    def __init__(self):
        self.service = GraphService()

    def get_mission_debug(self, event: dict) -> dict:
        """Return comprehensive mission inspection data.
        Includes metadata, weighted requirements, priorities, simulation rules,
        intent count, synonym count, and total relationship count.
        """
        mission_id = event['pathParameters']['id']
        # Fetch raw mission item directly via repository (metadata)
        from graph.repository import GraphRepository
        repo = GraphRepository()
        mission_item = repo.get_item(f"MISSION#{mission_id}")  # assumes BaseRepository get_item
        # Weighted requirements (with priority & weight)
        weighted_reqs = self.service.get_mission_requirements_weighted(mission_id)
        # Extract priorities mapping
        priorities = {r['product_id']: r.get('priority', 'IMPORTANT') for r in weighted_reqs}
        # Simulation rules placeholder (could be stored under a specific SK prefix)
        simulation_rules = []  # TODO: replace with actual retrieval when schema is defined
        # Intent and synonym counts
        intent_count = len(mission_item.get('intent_examples', []))
        synonym_count = len(mission_item.get('synonyms', []))
        # Relationship count
        total_relationships = self.service.get_mission_requirements(mission_id)  # reuse for count of relationships
        relationship_count = len(total_relationships)
        response_data = {
            "mission_metadata": mission_item,
            "weighted_requirements": weighted_reqs,
            "product_priorities": priorities,
            "simulation_rules": simulation_rules,
            "intent_count": intent_count,
            "synonym_count": synonym_count,
            "relationship_count": relationship_count,
        }
        return {
            "statusCode": 200,
            "body": json.dumps({"success": True, "data": response_data})
        }

    def __init__(self):
        self.service = GraphService()

    def get_mission_requirements(self, event: dict) -> dict:
        mission_id = event['pathParameters']['id']
        requirements = self.service.get_mission_requirements(mission_id)
        return {
            "statusCode": 200,
            "body": json.dumps({"success": True, "data": requirements})
        }

    def get_product_dependencies(self, event: dict) -> dict:
        product_id = event['pathParameters']['id']
        dependencies = self.service.get_product_dependencies(product_id)
        return {
            "statusCode": 200,
            "body": json.dumps({"success": True, "data": dependencies})
        }

    def get_product_substitutes(self, event: dict) -> dict:
        product_id = event['pathParameters']['id']
        substitutes = self.service.get_product_substitutes(product_id)
        return {
            "statusCode": 200,
            "body": json.dumps({"success": True, "data": substitutes})
        }
