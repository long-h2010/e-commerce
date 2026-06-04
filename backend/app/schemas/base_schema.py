from datetime import datetime
from typing import List, Optional
from uuid import UUID

from fastapi import Query
from pydantic import BaseModel, field_validator


class BaseResponse(BaseModel): ...


class ModelBaseInfo(BaseModel):
    id: Optional[UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class FindBase(BaseModel):
    sort: Optional[List[str]] = None
    page: Optional[int] = None
    limit: Optional[int] = None
    keyword: Optional[str] = None

    @field_validator("sort", mode="before")
    def validate_sort_columns(cls, value: Optional[str]) -> Optional[List[str]]:
        if not value:
            return None

        if isinstance(value, str):
            return value.split(",")

        if isinstance(value, list):
            return value

        return None


class SearchOptions(FindBase):
    total_count: Optional[int] = None


class FindResult(BaseModel):
    founds: Optional[List] = None
    search_options: Optional[SearchOptions] = None


class Blank(BaseResponse): ...


class OverviewGrowthResponse(BaseModel):
    total: int
    growth: float
