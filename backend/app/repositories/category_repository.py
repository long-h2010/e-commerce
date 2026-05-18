from contextlib import AbstractContextManager
from typing import Any, Callable, List, Tuple
from uuid import UUID

from sqlalchemy import column, table
from sqlalchemy.orm import Session
from sqlmodel import func, select

from app.repositories.base_repository import BaseRepository
from app.models.category import Category
from app.core.enums.category import CategoryLevel


class CategoryRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, Category)

    def get_categories_with_product_count(self, schema: Any) -> dict:
        products = table(
            "products",
            column("id"),
            column("category_id"),
        )

        with self.session_factory() as session:
            product_count_subq = (
                select(
                    products.c.category_id,
                    func.count(products.c.id).label("product_count"),
                )
                .group_by(products.c.category_id)
                .subquery()
            )

            query = select(
                Category,
                func.coalesce(product_count_subq.c.product_count, 0).label(
                    "product_count"
                ),
            ).outerjoin(
                product_count_subq, Category.id == product_count_subq.c.category_id
            )

            total_count = session.scalar(
                select(func.count()).select_from(query.subquery())
            )

            results: List[Tuple[Category, int]] = session.execute(query).all()

            founds = [
                {
                    **category.model_dump(),
                    "product_count": product_count,
                }
                for category, product_count in results
            ]

            return {
                "founds": founds,
                "search_options": {
                    "total_count": total_count or 0,
                },
            }

    def get_category_level(self, id: UUID) -> CategoryLevel:
        with self.session_factory() as session:
            category = session.get(Category, id)
            if not category:
                raise ValueError("Category not found")
            return category.level
