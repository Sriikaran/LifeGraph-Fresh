from infrastructure.dynamodb.base_repository import BaseRepository
from domains.simulator.models import SimulatorModel

class SimulatorRepository(BaseRepository):
    def save_simulation(self, sim: SimulatorModel):
        raise NotImplementedError("save_simulation not implemented")
