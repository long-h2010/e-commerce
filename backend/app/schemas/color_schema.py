from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.base_schema import FindBase


class BaseColor(BaseModel):
    id: Optional[UUID] = None
    name: str
    hex: str

    model_config = ConfigDict(from_attributes=True)


class FindColor(FindBase):
    name: Optional[str] = None
    hex: Optional[str] = None
