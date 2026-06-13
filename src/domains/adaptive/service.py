from domains.adaptive.repository import AdaptiveRepository

class AdaptiveService:
    def __init__(self):
        self.repository = AdaptiveRepository()
    
    def analyze(self):
        raise NotImplementedError("analyze not implemented")
