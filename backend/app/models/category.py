from typing import TYPE_CHECKING, List, Optional
from uuid import UUID

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel
from app.core.enums.category import CategoryLevel

if TYPE_CHECKING:
    from app.models.product import Product


class Category(BaseModel, table=True):
    __tablename__ = "categories"

    category: str = Field()
    slug: str = Field(unique=True)
    parent_id: Optional[UUID] = Field(default=None, foreign_key="categories.id")
    level: CategoryLevel = Field(default=CategoryLevel.LEAF)

    parent: Optional["Category"] = Relationship(
        back_populates="children", sa_relationship_kwargs={"remote_side": "Category.id"}
    )

    children: List["Category"] = Relationship(
        back_populates="parent", sa_relationship_kwargs={"lazy": "selectin"}
    )

    products: List["Product"] = Relationship(back_populates="category")
