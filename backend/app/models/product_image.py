from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlalchemy import text
from sqlmodel import Field, Index, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.product import Product


class ProductImage(BaseModel, table=True):
    __tablename__ = "product_images"

    __table_args__ = (
        Index(
            "idx_unique_thumbnail_per_product",
            "product_id",
            unique=True,
            postgresql_where=text("is_thumbnail = true"),
        ),
    )

    url: str
    is_thumbnail: bool = Field(default=False)
    product_id: UUID = Field(foreign_key="products.id", index=True)

    product: Optional["Product"] = Relationship(
        back_populates="images", sa_relationship_kwargs={"lazy": "selectin"}
    )
