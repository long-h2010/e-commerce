from typing import TYPE_CHECKING, List, Optional
from uuid import UUID

from sqlmodel import Field, Relationship

from app.core.enums.product import ProductStatus, ProductVisibility
from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.product_image import ProductImage
    from app.models.product_variant import ProductVariant
    from app.models.review import Review


class Product(BaseModel, table=True):
    __tablename__ = "products"

    name: str = Field(unique=True)
    description: str
    materials: str
    care: str
    slug: str = Field(unique=True)

    status: ProductStatus = Field(default=ProductStatus.DRAFT)
    visible: ProductVisibility = Field(default=ProductVisibility.PRIVATE)

    avg_rating: float = Field(default=0.0, ge=0, le=5)
    views: int = Field(default=0, ge=0)

    category_id: Optional[UUID] = Field(default=None, foreign_key="categories.id")

    category: Optional["Category"] = Relationship(
        back_populates="products", sa_relationship_kwargs={"lazy": "selectin"}
    )

    images: List["ProductImage"] = Relationship(
        back_populates="product", sa_relationship_kwargs={"lazy": "selectin"}
    )

    thumbnail: Optional["ProductImage"] = Relationship(
        sa_relationship_kwargs={
            "primaryjoin": "and_(Product.id==ProductImage.product_id, ProductImage.is_thumbnail==True)",
            "uselist": False,
            "viewonly": True,
        }
    )

    variants: List["ProductVariant"] = Relationship(
        back_populates="product", sa_relationship_kwargs={"lazy": "selectin"}
    )

    reviews: List["Review"] = Relationship(
        back_populates="product", sa_relationship_kwargs={"lazy": "selectin"}
    )
