from contextlib import AbstractContextManager
from typing import Callable

from sqlalchemy import func, literal_column, text
from sqlalchemy.orm import Query, Session
from sqlmodel import select

from app.repositories.base_repository import BaseRepository
from app.models.product import Product
from app.core.enums.product import ProductStatus
from app.schemas.product_schema import ProductResponse


class ProductRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, Product)

    def overview(self):
        with self.session_factory() as session:
            query = select(
                func.count(Product.id).label("total"),
                func.count(Product.id)
                .filter(Product.status == ProductStatus.ACTIVE)
                .label("active"),
                func.count(Product.id)
                .filter(Product.status == ProductStatus.DRAFT)
                .label("draft"),
                func.count(Product.id)
                .filter(Product.status == ProductStatus.OUTSTOCK)
                .label("out"),
            ).where(Product.deleted_at.is_(None))

            result = session.execute(query).mappings().one()

        return result

    def min_price_modifier(self, session, query: Query) -> Query:
        min_price_sub = (
            select(
                literal_column("product_id"),
                func.min(literal_column("price")).label("min_price"),
            )
            .select_from(text("product_variants"))
            .group_by(literal_column("product_id"))
            .subquery()
        )

        return query.add_columns(min_price_sub.c.min_price).outerjoin(
            min_price_sub,
            self._model.id == min_price_sub.c.product_id,
        )

    def get_list_products(
        self,
        schema,
        **kwargs
    ):
        results = self.read_by_options(
            schema,
            query_modifier=self.min_price_modifier,
            **kwargs
        )

        founds = []
        for product, min_price in results["founds"]:
            data = {
                c.name: getattr(product, c.name)
                for c in product.__table__.columns
            }
            if hasattr(product, "thumbnail") and product.thumbnail:
                data["thumbnail"] = product.thumbnail

            data["price"] = min_price
            founds.append(data)

        results["founds"] = founds
        return results

    def get_product_by_id_with_price(self, id, **kwargs):
        result = self.read_by_field("id", id, query_modifier=self.min_price_modifier)
        product, min_price = result[0], result[1]

        return product, min_price
