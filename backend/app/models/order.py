from typing import TYPE_CHECKING, List, Optional
from uuid import UUID

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel
from app.core.enums.order import (
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
    ShippingMethod,
)

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.order_item import OrderItem


class Order(BaseModel, table=True):
    __tablename__ = "orders"

    order_code: int = Field(index=True, unique=True)

    user_id: UUID = Field(index=True, foreign_key="users.id")

    name: str
    email: str
    phone: str
    address: str
    city: str
    district: str
    ward: str

    notes: Optional[str] = Field(default=None)

    shipping_method: ShippingMethod
    shipping_fee: int

    payment_method: PaymentMethod
    payment_status: PaymentStatus = Field(default=PaymentStatus.UNPAID)

    discount_id: Optional[UUID] = Field(default=None, foreign_key="discounts.id")
    discount_amount: int = Field(default=0)

    order_status: OrderStatus = Field(default=OrderStatus.PENDING)
    total_amount: int

    user: Optional["User"] = Relationship(
        back_populates="orders", sa_relationship_kwargs={"lazy": "selectin"}
    )

    items: List["OrderItem"] = Relationship(
        back_populates="order", sa_relationship_kwargs={"lazy": "selectin"}
    )
