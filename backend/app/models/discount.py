from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional

from pydantic import model_validator
from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel
from app.core.enums.discount import DiscountApplyType, DiscountStatus, DiscountType

if TYPE_CHECKING:
    from app.models.discount_target import DiscountTarget
    from app.models.order_item import OrderItem


class Discount(BaseModel, table=True):
    __tablename__ = "discounts"

    name: str = Field()
    code: str = Field(unique=True, index=True)
    type: DiscountType
    value: int = Field(ge=0)
    apply_to: DiscountApplyType = Field(default=DiscountApplyType.ORDER)

    min_order: int = Field(ge=0, default=0)
    usage_limit: Optional[int] = Field(ge=0, default=None)
    usage_per_user: int = Field(ge=1, default=1)
    usage_count: int = Field(ge=0, default=0)

    start_time: datetime = Field(default=datetime.now(timezone.utc))
    end_time: Optional[datetime] = Field(default=None)
    status: DiscountStatus = Field(default=DiscountStatus.SCHEDULED)

    @model_validator(mode="after")
    def validate_time(self):
        if self.end_time and self.end_time > self.start_time:
            raise ValueError("End time must be greater than start time")
        return self

    targets: List["DiscountTarget"] = Relationship(back_populates="discount")

    order_items: List["OrderItem"] = Relationship(
        back_populates="discount", sa_relationship_kwargs={"lazy": "selectin"}
    )
