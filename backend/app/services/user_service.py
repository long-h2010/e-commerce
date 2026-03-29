from app.repositories.user_repository import UserRepository
from app.services.base_service import BaseService


class UserService(BaseService):
    def __init__(self, repository: UserRepository):
        self._repository = repository
        super().__init__(repository)
