from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.base_schema import FindBase
from app.core.enums.discount import DiscountApplyType, DiscountStatus, DiscountTargetType, DiscountType


class BaseDiscount(BaseModel):
    id: Optional[UUID] = None
    name: Optional[str] = None
    code: Optional[str] = None
    type: Optional[DiscountType] = None
    value: Optional[int] = None
    status: Optional[DiscountStatus] = None
    apply_to: Optional[DiscountApplyType] = None
    min_order: Optional[int] = None
    usage_limit: Optional[int] = None
    usage_per_user: Optional[int] = None
    usage_count: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class FindDiscount(FindBase):
    name: Optional[str] = None
    code: Optional[str] = None


class FindActiveDiscount(BaseModel):
    apply_to: Optional[DiscountApplyType] = None 
    status: DiscountStatus = DiscountStatus.ACTIVE
    limit: int = 0


class CreateDiscount(BaseDiscount):
    target: Optional[DiscountTargetType] = None
    target_ids: Optional[List[UUID]] = None


class BaseResponseDiscount(BaseModel):
    id: UUID
    name: str
    code: str
    type: DiscountType
    value: int
