from infrastructure.dynamodb.base_repository import BaseRepository
from domains.adaptive.models import AdaptiveModel

class AdaptiveRepository(BaseRepository):
    def get_profile(self, user_id: str) -> AdaptiveModel:
        raise NotImplementedError("get_profile not implemented")
        
    def update_profile(self, profile: AdaptiveModel) -> AdaptiveModel:
        raise NotImplementedError("update_profile not implemented")
