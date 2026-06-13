from typing import List, Dict, Any, Set
from decimal import Decimal
from infrastructure.dynamodb.client import get_table
from shared.repositories.product_repository import ProductRepository
from shared.models.product_model import ProductModel
from shared.schemas.graph_seeder_schemas import MissionSeedRequest

class GraphSeederService:
    def __init__(self):
        self.table = get_table()
        self.product_repository = ProductRepository()

    def seed_mission(self, request: MissionSeedRequest) -> Dict[str, Any]:
        """Seeds a single mission and its related entities into the graph."""
        self.seed_bulk([request])
        return {"success": True, "message": f"Successfully seeded mission '{request.mission_id}'"}

    def seed_bulk(self, missions: List[MissionSeedRequest]) -> Dict[str, Any]:
        """Seeds multiple missions, products, and relationship edges using DynamoDB BatchWriteItem."""
        # Pre-cache all existing products to ensure idempotency in memory
        existing_products = self.product_repository.list_products()
        existing_product_ids: Set[str] = {p.id for p in existing_products}
        
        products_to_create: Dict[str, ProductModel] = {}
        items_to_write: List[Dict[str, Any]] = []

        for req in missions:
            # 1. Mission Metadata Node
            items_to_write.append({
                "PK": f"MISSION#{req.mission_id}",
                "SK": "METADATA",
                "mission_id": req.mission_id,
                "name": req.name,
                "description": req.description,
                "category": req.category,
                "keywords": req.keywords or [],
                "synonyms": req.synonyms or [],
                "intent_examples": req.intent_examples or []
            })

            # Gather all products referenced in this mission
            referenced_products = set()
            referenced_products.update(req.required)
            if req.optional:
                referenced_products.update(req.optional)
            if req.dependencies:
                for dep in req.dependencies:
                    referenced_products.add(dep.source)
                    referenced_products.add(dep.target)
            if req.compatibility:
                for comp in req.compatibility:
                    referenced_products.add(comp.source)
                    referenced_products.add(comp.target)
            if req.substitutions:
                for sub in req.substitutions:
                    referenced_products.add(sub.source)
                    referenced_products.add(sub.target)

            # Create default product models for referenced products that don't exist yet
            for p_id in referenced_products:
                if p_id not in existing_product_ids and p_id not in products_to_create:
                    products_to_create[p_id] = ProductModel(
                        id=p_id,
                        name=p_id.replace("_", " ").capitalize(),
                        price=15.0,
                        stock=100,
                        category=req.category
                    )

            # 2. Mission -> Product Relationships (Required & Optional)
            for req_p in req.required:
                items_to_write.append({
                    "PK": f"MISSION#{req.mission_id}",
                    "SK": f"REQUIRES#PRODUCT#{req_p}"
                })
            if req.optional:
                for opt_p in req.optional:
                    items_to_write.append({
                        "PK": f"MISSION#{req.mission_id}",
                        "SK": f"OPTIONAL#PRODUCT#{opt_p}"
                    })

            # 3. Product Dependencies
            if req.dependencies:
                for dep in req.dependencies:
                    items_to_write.append({
                        "PK": f"PRODUCT#{dep.source}",
                        "SK": f"DEPENDS_ON#PRODUCT#{dep.target}"
                    })

            # 4. Product Compatibility
            if req.compatibility:
                for comp in req.compatibility:
                    items_to_write.append({
                        "PK": f"PRODUCT#{comp.source}",
                        "SK": f"COMPATIBLE_WITH#PRODUCT#{comp.target}"
                    })

            # 5. Product Substitution
            if req.substitutions:
                for sub in req.substitutions:
                    items_to_write.append({
                        "PK": f"PRODUCT#{sub.source}",
                        "SK": f"SUBSTITUTES_FOR#PRODUCT#{sub.target}"
                    })

            # 6. Keywords Node
            if req.keywords:
                items_to_write.append({
                    "PK": f"MISSION#{req.mission_id}",
                    "SK": "KEYWORDS",
                    "keywords": req.keywords
                })

            # 7. Outcome Simulator Consumption Rules
            if req.consumption_rules:
                for rule in req.consumption_rules:
                    items_to_write.append({
                        "PK": f"MISSION#{req.mission_id}",
                        "SK": f"RULE#{rule.product}",
                        "product": rule.product,
                        "unit": rule.unit,
                        "serves_per_unit": Decimal(str(rule.serves_per_unit))
                    })

        # Add products to the list of items to write
        for p_model in products_to_create.values():
            items_to_write.append(p_model.to_dict())

        # Write items to DynamoDB in batches of 25 using batch_writer
        print(f"Seeding {len(items_to_write)} items into the graph...")
        written_count = 0
        with self.table.batch_writer() as batch:
            for item in items_to_write:
                batch.put_item(Item=item)
                written_count += 1

        return {
            "success": True, 
            "message": f"Bulk seeding complete. Wrote {written_count} items."
        }
