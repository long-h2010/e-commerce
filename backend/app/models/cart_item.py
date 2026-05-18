from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlmodel import Field, Relationship, UniqueConstraint

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.cart import Cart
    from app.models.product_variant import ProductVariant


class CartItem(BaseModel, table=True):
    __tablename__ = "cart_items"

    __table_args__ = (UniqueConstraint("cart_id", "variant_id"),)

    cart_id: UUID = Field(foreign_key="carts.id", index=True)
    variant_id: UUID = Field(foreign_key="product_variants.id", index=True)
    quantity: int = Field(ge=1)

    cart: Optional["Cart"] = Relationship(
        back_populates="items", sa_relationship_kwargs={"lazy": "selectin"}
    )

    variant: Optional["ProductVariant"] = Relationship(
        back_populates="carts"
    )
