from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.discount import Discount
    from app.models.product_variant import ProductVariant


class OrderItem(BaseModel, table=True):
    __tablename__ = "order_items"

    order_id: UUID = Field(foreign_key="orders.id", index=True)
    variant_id: UUID = Field(foreign_key="product_variants.id", index=True)

    discount_id: Optional[UUID] = Field(default=None, foreign_key="discounts.id")
    discount_amount: int = Field(default=0)

    quantity: int
    price_at_time: int
    subtotal: int

    order: Optional["Order"] = Relationship(
        back_populates="items", sa_relationship_kwargs={"lazy": "selectin"}
    )

    discount: Optional["Discount"] = Relationship(
        back_populates="order_items", sa_relationship_kwargs={"lazy": "selectin"}
    )

    variant: Optional["ProductVariant"] = Relationship(
        back_populates="order_items", sa_relationship_kwargs={"lazy": "selectin"}
    )
