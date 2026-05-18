from contextlib import AbstractContextManager
from typing import Any, Callable

from sqlalchemy.orm import Session, selectinload
from sqlmodel import select

from app.repositories.base_repository import BaseRepository
from app.models.product_variant import ProductVariant


class ProductVariantRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, ProductVariant)

    def read_by_ids(self, ids: list[Any]):
        with self._session_factory() as session:
            result = session.execute(
                select(ProductVariant)
                .where(ProductVariant.id.in_(ids))
                .options(selectinload(ProductVariant.product))
            )
            return list(result.scalars().all())
