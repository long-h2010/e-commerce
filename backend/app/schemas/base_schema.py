from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, field_validator

from app.core.exceptions import ValidationError


class BaseResponse(BaseModel): ...


class ModelBaseInfo(BaseModel):
    id: Optional[UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class FindBase(BaseModel):
    sort_columns: Optional[list[str]] = None
    sort_orders: Optional[list[str]] = None
    page: Optional[int] = None
    page_size: Optional[int] = None

    @field_validator("sort_columns", mode="before")
    def validate_sort_columns(cls, value: Optional[str]) -> Optional[List[str]]:
        if value:
            return value.split(",") if isinstance(value, str) else value
        return None

    @field_validator("sort_orders", mode="before")
    def convert_to_list(cls, value: Optional[str]) -> Optional[List[str]]:
        if value:
            sort_list = value.split(",") if isinstance(value, str) else value
            for item in sort_list:
                if item not in ["asc", "desc"]:
                    raise ValidationError(
                        error_code="ERR_BASE_002",
                        detail=f"Invalid sort order: {item}. Must be 'asc' or 'desc'.",
                    )
            return sort_list
        return None


class SearchOptions(FindBase):
    total_count: Optional[int] = None


class FindResult(BaseModel):
    founds: Optional[List] = None
    search_options: Optional[SearchOptions] = None


class Blank(BaseResponse): ...
