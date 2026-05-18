from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.base_schema import FindBase


class BaseCartItem(BaseModel):
    id: Optional[UUID] = None
    cart_id: Optional[UUID] = None
    variant_id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)


class FindCartItem(FindBase):
    cart_id: Optional[UUID] = None
    variant_id: Optional[UUID] = None


class CreateCartItem(BaseModel):
    cart_id: UUID
    variant_id: UUID
    quantity: Optional[int] = 1


class DeleteCartItem(BaseModel):
    cart_id: UUID
    variant_id: UUID
