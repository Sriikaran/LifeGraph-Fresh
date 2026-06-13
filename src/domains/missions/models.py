from typing import Dict, Any, List

class MissionModel:
    def __init__(self, mission_id: str, name: str, description: str, category: str, 
                 keywords: List[str] = None, synonyms: List[str] = None, intent_examples: List[str] = None):
        self.mission_id = mission_id
        self.name = name
        self.description = description
        self.category = category
        self.keywords = keywords or []
        self.synonyms = synonyms or []
        self.intent_examples = intent_examples or []

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'MissionModel':
        return cls(
            mission_id=data.get('missionId') or data.get('mission_id') or '',
            name=data.get('name', ''),
            description=data.get('description', ''),
            category=data.get('category', ''),
            keywords=data.get('keywords', []),
            synonyms=data.get('synonyms', []),
            intent_examples=data.get('intent_examples', [])
        )

    def to_dict(self) -> Dict[str, Any]:
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
            'intent_examples': self.intent_examples
        }

