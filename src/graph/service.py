from typing import List, Dict, Any, Optional
from graph.repository import GraphRepository

class GraphService:
    def __init__(self):
        self.repository = GraphRepository()

    def get_mission_requirements(self, mission_id: str) -> List[str]:
        return self.repository.get_mission_requirements(mission_id)

    def get_product_dependencies(self, product_id: str) -> List[str]:
        return self.repository.get_product_dependencies(product_id)

    def get_product_substitutes(self, product_id: str) -> List[str]:
        return self.repository.get_product_substitutes(product_id)

    def get_mission_requirements_weighted(self, mission_id: str) -> List[dict]:
        return self.repository.get_mission_requirements_weighted(mission_id)

    def get_mission_metadata(self, mission_id: str) -> Optional[Dict[str, Any]]:
        return self.repository.get_mission_metadata(mission_id)

    def get_mission_rules(self, mission_id: str) -> List[Dict[str, Any]]:
        return self.repository.get_mission_rules(mission_id)

    def get_mission_parameters(self, mission_id: str) -> List[str]:
        return self.repository.get_mission_parameters(mission_id)

    def get_mission_intents(self, mission_id: str) -> List[str]:
        return self.repository.get_mission_intents(mission_id)

    def get_mission_synonyms(self, mission_id: str) -> List[str]:
        return self.repository.get_mission_synonyms(mission_id)

    def get_product_compatibility(self, product_id: str) -> List[str]:
        return self.repository.get_product_compatibility(product_id)
