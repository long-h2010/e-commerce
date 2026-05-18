from typing import TYPE_CHECKING, List, Optional
from uuid import UUID

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.product import Product
    from app.models.color import Color
    from app.models.cart_item import CartItem
    from app.models.order_item import OrderItem


class ProductVariant(BaseModel, table=True):
    __tablename__ = "product_variants"

    sku: str
    size: str

    product_id: UUID = Field(foreign_key="products.id", index=True)
    color_id: UUID = Field(foreign_key="colors.id")

    cost: int = Field(ge=0)
    price: int = Field(ge=0)
    stock: int = Field(ge=0)

    product: Optional["Product"] = Relationship(
        back_populates="variants", sa_relationship_kwargs={"lazy": "selectin"}
    )

    color: Optional["Color"] = Relationship(
        back_populates="variants", sa_relationship_kwargs={"lazy": "selectin"}
    )

    carts: List["CartItem"] = Relationship(
        back_populates="variant", sa_relationship_kwargs={"lazy": "selectin"}
    )

    order_items: List["OrderItem"] = Relationship(
        back_populates="variant", sa_relationship_kwargs={"lazy": "selectin"}
    )
