from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.base_schema import FindBase


class BaseReview(BaseModel):
    id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)


class FindReview(FindBase):
    product_id: UUID
