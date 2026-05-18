from typing import TYPE_CHECKING, List

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.product_variant import ProductVariant


class Color(BaseModel, table=True):
    __tablename__ = "colors"

    name: str = Field(unique=True)
    hex: str = Field(unique=True)

    variants: List["ProductVariant"] = Relationship(
        back_populates="color", sa_relationship_kwargs={"lazy": "selectin"}
    )
