from re import sub
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.base_schema import FindBase


class BaseOrderItem(BaseModel):
    id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)


class FindOrderItem(FindBase): ...


class CreateOrderItem(BaseModel):
    variant_id: UUID
    quantity: int
    price_at_time: Optional[int] = None
    discount_id: Optional[UUID] = None
    discount_amount: Optional[int] = None
    subtotal: Optional[int] = None


class OrderItemResponse(BaseModel):
    id: UUID
    variant_id: UUID
    quantity: int
    price_at_time: int
    discount_id: Optional[UUID]
    discount_amount: int
    subtotal: int

    class Config:
        from_attributes = True
