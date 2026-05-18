from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from app.schemas.base_schema import FindBase
from app.schemas.color_schema import BaseColor


class BaseVariant(BaseModel):
    id: Optional[UUID] = None
    sku: Optional[str] = None
    size: Optional[str] = None
    color_id: Optional[UUID] = None
    product_id: Optional[UUID] = None
    cost: Optional[int] = 0
    price: Optional[int] = 0
    stock: Optional[int] = 0

    class Config:
        from_attributes = True


class CreateVariant(BaseVariant):
    sizes: List[str]

class UpdateVariant(BaseVariant): ...


class FindVariant(FindBase):
    product_id: UUID


class VariantResponse(BaseVariant):
    color: BaseColor
