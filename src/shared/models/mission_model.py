from typing import Dict, Any, List

class MissionModel:
    def __init__(self, mission_id: str, name: str, description: str, category: str, 
                 keywords: List[str] = None, synonyms: List[str] = None, intent_examples: List[str] = None,
                 embedding: List[float] = None):
        self.mission_id = mission_id
        self.name = name
        self.description = description
        self.category = category
        self.keywords = keywords or []
        self.synonyms = synonyms or []
        self.intent_examples = intent_examples or []
        self.embedding = embedding or []

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'MissionModel':
        # Safely convert embedding elements to float if present
        raw_emb = data.get('embedding') or []
        embedding = [float(x) for x in raw_emb]
        return cls(
            mission_id=data.get('missionId') or data.get('mission_id') or '',
            name=data.get('name', ''),
            description=data.get('description', ''),
            category=data.get('category', ''),
            keywords=data.get('keywords', []),
            synonyms=data.get('synonyms', []),
            intent_examples=data.get('intent_examples', []),
            embedding=embedding
        )

    def to_dict(self) -> Dict[str, Any]:
        from decimal import Decimal
        # Convert floats to Decimals for DynamoDB serialization compatibility
        db_embedding = [Decimal(str(x)) for x in self.embedding]
        return {
            'PK': f"MISSION#{self.mission_id}",
            'SK': "METADATA",
            'missionId': self.mission_id,
            'mission_id': self.mission_id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'keywords': self.keywords,
            'synonyms': self.synonyms,
            'intent_examples': self.intent_examples,
            'embedding': db_embedding
        }

