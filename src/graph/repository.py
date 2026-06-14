from typing import List, Dict, Any, Optional
from infrastructure.dynamodb.base_repository import BaseRepository

class GraphRepository(BaseRepository):
    def get_mission_requirements(self, mission_id: str) -> List[str]:
        items = self.query_by_pk(f"MISSION#{mission_id}", "REQUIRES#")
        
        target_ids = []
        for item in items:
            sk = item.get('SK', '')
            parts = sk.split('#')
            if len(parts) >= 3:
                target_ids.append(parts[2])
        return target_ids

    def get_product_dependencies(self, product_id: str) -> List[str]:
        items = self.query_by_pk(f"PRODUCT#{product_id}", "DEPENDS_ON#")
        target_ids = []
        for item in items:
            sk = item.get('SK', '')
            parts = sk.split('#')
            if len(parts) >= 3:
                target_ids.append(parts[2])
        return target_ids

    def get_product_substitutes(self, product_id: str) -> List[str]:
        items = self.query_by_pk(f"PRODUCT#{product_id}", "SUBSTITUTES_FOR#")
        target_ids = []
        for item in items:
            sk = item.get('SK', '')
            parts = sk.split('#')
            if len(parts) >= 3:
                target_ids.append(parts[2])
        return target_ids

    def get_mission_requirements_weighted(self, mission_id: str) -> List[dict]:
        requires_items = self.query_by_pk(f"MISSION#{mission_id}", "REQUIRES#")
        optional_items = self.query_by_pk(f"MISSION#{mission_id}", "OPTIONAL#")
        
        result = []
        for item in requires_items + optional_items:
            sk = item.get('SK', '')
            parts = sk.split('#')
            if len(parts) >= 3:
                product_id = parts[2]
                result.append({
                    "product_id": product_id,
                    "priority": item.get("priority", "IMPORTANT"),
                    "weight": int(item.get("weight", 10)),
                    "required": sk.startswith("REQUIRES#")
                })
        return result

    def get_mission_metadata(self, mission_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves the METADATA record for a mission."""
        return self.get_item(f"MISSION#{mission_id}", "METADATA")

    def get_mission_rules(self, mission_id: str) -> List[Dict[str, Any]]:
        """Retrieves consumption/simulation rules (RULE# prefix) for a mission."""
        items = self.query_by_pk(f"MISSION#{mission_id}", "RULE#")
        rules = []
        for item in items:
            rules.append({
                "product": item.get("product", ""),
                "unit": item.get("unit", "unit"),
                "serves_per_unit": float(item.get("serves_per_unit", 1.0)),
            })
        return rules

    def get_mission_parameters(self, mission_id: str) -> List[str]:
        """Retrieves expected parameter names (PARAM# prefix) for a mission."""
        items = self.query_by_pk(f"MISSION#{mission_id}", "PARAM#")
        params = []
        for item in items:
            sk = item.get('SK', '')
            parts = sk.split('#')
            if len(parts) >= 2:
                params.append(parts[1])
        return params

    def get_mission_intents(self, mission_id: str) -> List[str]:
        """Retrieves intent example texts (INTENT# prefix) for a mission."""
        items = self.query_by_pk(f"MISSION#{mission_id}", "INTENT#")
        return [item.get("text", "") for item in items if item.get("text")]

    def get_mission_synonyms(self, mission_id: str) -> List[str]:
        """Retrieves synonym entries (SYNONYM# prefix) for a mission."""
        items = self.query_by_pk(f"MISSION#{mission_id}", "SYNONYM#")
        synonyms = []
        for item in items:
            sk = item.get('SK', '')
            parts = sk.split('#')
            if len(parts) >= 2:
                synonyms.append(parts[1])
        return synonyms

    def get_product_compatibility(self, product_id: str) -> List[str]:
        """Retrieves products compatible with the given product (COMPATIBLE_WITH# prefix)."""
        items = self.query_by_pk(f"PRODUCT#{product_id}", "COMPATIBLE_WITH#")
        target_ids = []
        for item in items:
            sk = item.get('SK', '')
            parts = sk.split('#')
            if len(parts) >= 3:
                target_ids.append(parts[2])
        return target_ids
