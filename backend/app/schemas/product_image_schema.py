from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel

from app.schemas.base_schema import FindBase


class BaseProductImage(BaseModel):
    url: str
    is_thumbnail: bool

    class Config:
        from_attributes = True


class CreateProductImage(BaseProductImage):
    product_id: UUID


class UpdateProductThumbnail(BaseModel):
    url: str


class FilterProductImage(BaseModel):
    product_id: UUID
    is_thumbnail: Optional[bool] = False


class ProductImageResponse(BaseProductImage):
    id: UUID


class FindProductImage(FindBase):
    product_id: UUID
