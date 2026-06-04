from contextlib import AbstractContextManager
from typing import Callable

from sqlalchemy.orm import Session

from app.repositories.base_repository import BaseRepository
from app.models.discount import Discount
from app.core.enums.discount import DiscountStatus


class DiscountRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, Discount)

    def get_total_discount_active(self):
        return self.count([Discount.status == DiscountStatus.ACTIVE])
