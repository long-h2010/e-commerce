from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product


class Review(BaseModel, table=True):
    __tablename__ = "reviews"

    user_id: UUID = Field(foreign_key="users.id", index=True)
    product_id: UUID = Field(foreign_key="products.id", index=True)

    comment: str
    rating: float

    user: Optional["User"] = Relationship(
        back_populates="reviews", sa_relationship_kwargs={"lazy": "selectin"}
    )

    product: Optional["Product"] = Relationship(
        back_populates="reviews", sa_relationship_kwargs={"lazy": "selectin"}
    )
