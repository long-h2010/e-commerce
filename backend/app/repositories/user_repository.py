from contextlib import AbstractContextManager
from datetime import datetime
from dateutil.relativedelta import relativedelta
from typing import Callable

from sqlalchemy.orm import Session

from app.repositories.base_repository import BaseRepository
from app.models.user import User
from app.core.enums.user import UserRole


class UserRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, User)

    def get_total_user_growth(self):
        now = datetime.utcnow()
        current_month = datetime(now.year, now.month, 1)
        previous_month = current_month - relativedelta(months=1)

        total = self.count([User.role == UserRole.CUSTOMER])
        total_in_month = self.count(
            [
                User.role == UserRole.CUSTOMER,
                User.created_at >= current_month,
            ]
        )
        total_prev_month = self.count(
            [
                User.role == UserRole.CUSTOMER,
                User.created_at >= previous_month,
                User.created_at < current_month,
            ]
        )

        return {
            "total": total,
            "total_in_month": total_in_month,
            "total_prev_month": total_prev_month,
        }
