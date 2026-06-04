from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

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


class VariantDetailResponse(BaseModel):
    id: Optional[UUID] = None
    variant_id: Optional[UUID] = None
    quantity: int

    sku: Optional[str] = None
    size: Optional[str] = None
    product_id: Optional[UUID] = None
    cost: Optional[int] = 0
    price: Optional[int] = 0
    stock: Optional[int] = 0

    color: Optional[BaseColor] = None

    name: Optional[str] = None
    thumbnail: Optional[str] = None

    sale_value: Optional[float] = 0

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        if not isinstance(obj, dict):
            variant = obj.variant
            product = variant.product if variant else None

            data = {
                "id": obj.id,
                "quantity": obj.quantity,
                "variant_id": obj.variant_id,
                "sku": variant.sku if variant else None,
                "size": variant.size if variant else None,
                "product_id": variant.product_id if variant else None,
                "cost": variant.cost if variant else None,
                "price": variant.price if variant else None,
                "stock": variant.stock if variant else None,
                "color": variant.color if variant else None,
                "name": product.name if product else None,
                "thumbnail": (
                    product.thumbnail.url if product and product.thumbnail else None
                ),
            }
            return super().model_validate(data)

        return super().model_validate(obj)
