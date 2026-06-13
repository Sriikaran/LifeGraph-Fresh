from typing import Dict, Any

class SimulatorModel:
    def __init__(self, user_id: str, simulation_id: str):
        self.user_id = user_id
        self.simulation_id = simulation_id

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'SimulatorModel':
        return cls(
            user_id=data.get('user_id', ''),
            simulation_id=data.get('simulation_id', '')
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            'PK': f"USER#{self.user_id}",
            'SK': f"SIMULATION#{self.simulation_id}",
            'user_id': self.user_id,
            'simulation_id': self.simulation_id
        }
