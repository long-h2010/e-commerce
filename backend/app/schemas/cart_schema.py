from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.base_schema import FindBase
from app.schemas.color_schema import BaseColor


class BaseCart(BaseModel):
    id: Optional[UUID] = None
    user_id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)


class FindCart(FindBase): ...


class CreateCart(BaseModel):
    user_id: UUID


class AddItem(BaseModel):
    variant_id: UUID
    quantity: Optional[int] = 1


class UpdateQuantity(BaseModel):
    variant_id: UUID
    quantity: int
