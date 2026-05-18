from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.base_schema import FindBase
from app.core.enums.discount import DiscountTargetType


class BaseDiscountTarget(BaseModel):
    id: Optional[UUID] = None
    discount_id: Optional[UUID] = None
    target_type: Optional[DiscountTargetType] = None
    target_id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)


class FindDiscountTarget(FindBase):
    discount_id: Optional[UUID] = None


class CreateDiscountTarget(BaseDiscountTarget): ...
