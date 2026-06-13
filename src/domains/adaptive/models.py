from typing import Dict, Any

class AdaptiveModel:
    def __init__(self, user_id: str):
        self.user_id = user_id

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AdaptiveModel':
        return cls(user_id=data.get('user_id', ''))

    def to_dict(self) -> Dict[str, Any]:
        return {
            'PK': f"USER#{self.user_id}",
            'SK': "ADAPTIVE_PROFILE",
            'user_id': self.user_id
        }
