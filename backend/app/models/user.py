from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship

from app.core.enums.user import UserRole
from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from backend.app.models.cart import Cart
    from app.models.review import Review
    from app.models.order import Order


class User(BaseModel, table=True):
    __tablename__ = "users"

    username: str
    email: Optional[str] = Field(default=None, unique=True, index=True)
    phone_number: Optional[str] = Field(default=None, unique=True, index=True)
    password: Optional[str]

    name: str
    avatar: Optional[str] = Field(default="/default-avatar.png")

    role: UserRole = Field(default=UserRole.CUSTOMER)
    is_active: bool = Field(default=True)

    cart: Optional["Cart"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"lazy": "selectin"}
    )

    reviews: List["Review"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"lazy": "selectin"}
    )

    orders: List["Order"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"lazy": "selectin"}
    )
