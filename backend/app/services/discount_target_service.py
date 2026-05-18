from typing import List
from uuid import UUID

from app.repositories.discount_target_repository import DiscountTargetRepository
from app.services.base_service import BaseService
from app.core.enums.discount import DiscountTargetType
from app.schemas.discount_target_schema import CreateDiscountTarget


class DiscountTargetService(BaseService):
    def __init__(self, repository: DiscountTargetRepository):
        self._repository = repository
        super().__init__(repository)

    def create(self, discount_id: UUID, target_type: DiscountTargetType, target_ids: List[UUID]):
        data = [
            CreateDiscountTarget(
                discount_id=discount_id,
                target_type=target_type,
                target_id=id,
            )
            for id in target_ids
        ]

        return self._repository.bulk_create(data)
