from typing import Any, List, Optional
from uuid import UUID

from fastapi import Form
from pydantic import BaseModel, ConfigDict, field_validator

from app.core.enums.product import ProductStatus, ProductVisibility
from app.schemas.base_schema import FindBase
from app.schemas.product_image_schema import ProductImageResponse
from app.schemas.color_schema import BaseColor
from app.schemas.category_chema import BaseCategory


class BaseProduct(BaseModel):
    id: Optional[UUID] = None
    name: str
    description: str
    materials: str
    care: str
    slug: str
    category_id: Optional[UUID] = None
    avg_rating: Optional[float] = 0.0
    status: Optional[ProductStatus] = None
    visible: Optional[ProductVisibility] = None
    views: Optional[int] = 0
    purchases: Optional[int] = 0
    price: Optional[int] = 0
    sale_value: Optional[float] = None
    colors: Optional[List[BaseColor]] = None
    sizes: Optional[List[str]] = None

    class Config:
        from_attributes = True


class FormProduct(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    materials: Optional[str] = None
    care: Optional[str] = None
    slug: Optional[str] = None
    status: Optional[ProductStatus] = None
    category_id: Optional[UUID] = None
    change_thumbnail: Optional[bool] = False
    delete_images: Optional[List[UUID]] = None

    @field_validator("slug")
    @classmethod
    def to_lower(cls, value: Optional[str]) -> Optional[str]:
        return value.lower() if value else value

    @classmethod
    def as_form(
        cls,
        name: Optional[str] = Form(None),
        description: Optional[str] = Form(None),
        materials: Optional[str] = Form(None),
        care: Optional[str] = Form(None),
        slug: Optional[str] = Form(None),
        status: Optional[ProductStatus] = Form(None),
        category_id: Optional[UUID] = Form(None),
        change_thumbnail: Optional[bool] = Form(None),
        delete_images: Optional[List[UUID]] = Form(None),
    ):
        return cls(
            name=name,
            description=description,
            materials=materials,
            care=care,
            slug=slug,
            status=status,
            category_id=category_id,
            change_thumbnail=change_thumbnail,
            delete_images=delete_images,
        )


class CreateProduct(BaseModel):
    name: str
    description: str
    materials: str
    care: str
    slug: str
    category_id: UUID


class UpdateProduct(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    materials: Optional[str] = None
    care: Optional[str] = None
    slug: Optional[str] = None
    status: Optional[ProductStatus] = None
    category_id: Optional[UUID] = None
    price: Optional[int] = None


class FindProduct(FindBase):
    name: Optional[str] = None
    status: Optional[ProductStatus] = None
    visible: Optional[ProductVisibility] = None
    category_id: Optional[UUID] = None

    category_id__in: Optional[List[UUID]] = None


class ProductResponse(BaseProduct):
    thumbnail: Any

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def model_validate(cls, obj):
        if isinstance(obj, dict):
            data = obj
            thumbnail = data.get("thumbnail")
            if thumbnail and not isinstance(thumbnail, str):
                data["thumbnail"] = thumbnail.url
        else:
            data = obj.__dict__.copy()
            if obj.thumbnail:
                data["thumbnail"] = obj.thumbnail.url
            else:
                data["thumbnail"] = None

        return super().model_validate(data)


class DetailResponse(BaseProduct):
    images: List[ProductImageResponse]
    total_reviews: Optional[int] = 0
    colors: Optional[List[BaseColor]] = []
    categories: Optional[List[BaseCategory]] = []

    model_config = ConfigDict(from_attributes=True)
