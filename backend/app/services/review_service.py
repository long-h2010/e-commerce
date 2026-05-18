from app.repositories.review_repository import ReviewRepository
from app.services.base_service import BaseService


class ReviewService(BaseService):
    def __init__(self, repository: ReviewRepository):
        self._repository = repository
        super().__init__(repository)
