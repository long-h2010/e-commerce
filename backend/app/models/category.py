from sqlmodel import Field

from app.models.base_model import BaseModel


class Category(BaseModel, table=True):
    name: str = Field(unique=True)
