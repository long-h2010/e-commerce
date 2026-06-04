from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator

from app.schemas.base_schema import FindBase
from app.core.enums.category import CategoryLevel


class BaseCategory(BaseModel):
    id: Optional[UUID] = None
    category: str
    slug: str
    parent_id: Optional[UUID] = None
    level: Optional[CategoryLevel] = None

    model_config = ConfigDict(from_attributes=True)


class FindCategory(FindBase):
    id__in: Optional[List[UUID]] = None
    parent_id__in: Optional[List[UUID]] = None


class CreateCategory(BaseCategory):
    @field_validator("category", "slug")
    @classmethod
    def to_lower(cls, value: str) -> str:
        return value.lower()


class UpdateCategory(CreateCategory):
    category: Optional[str] = None
    slug: Optional[str] = None
    parent_id: Optional[UUID] = None

    @field_validator("category", "slug")
    @classmethod
    def to_lower(cls, value: Optional[str]) -> Optional[str]:
        return value.lower() if value else value


class ProductCount(BaseModel):
    category: str
    product_count: int
