from typing import TYPE_CHECKING, List, Optional
from uuid import UUID

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel
from app.core.enums.discount import DiscountTargetType

if TYPE_CHECKING:
    from app.models.discount import Discount


class DiscountTarget(BaseModel, table=True):
    __tablename__ = "discount_targets"

    discount_id: UUID = Field(default=None, foreign_key="discounts.id", index=True)
    target_type: DiscountTargetType
    target_id: UUID

    discount: Optional["Discount"] = Relationship(
        back_populates="targets", sa_relationship_kwargs={"lazy": "selectin"}
    )
