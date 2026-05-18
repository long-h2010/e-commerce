from typing import TYPE_CHECKING, List, Optional
from uuid import UUID

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.cart_item import CartItem


class Cart(BaseModel, table=True):
    __tablename__ = "carts"

    user_id: UUID = Field(unique=True, index=True, foreign_key="users.id")

    user: Optional["User"] = Relationship(
        back_populates="cart", sa_relationship_kwargs={"lazy": "selectin"}
    )

    items: List["CartItem"] = Relationship(
        back_populates="cart", sa_relationship_kwargs={"lazy": "selectin"}
    )
