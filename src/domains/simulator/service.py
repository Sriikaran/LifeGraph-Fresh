from domains.simulator.repository import SimulatorRepository

class SimulatorService:
    def __init__(self):
        self.repository = SimulatorRepository()
        
    def simulate(self):
        raise NotImplementedError("simulate not implemented")
