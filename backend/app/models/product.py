from sqlmodel import Field

from app.models.base_model import BaseModel


class Product(BaseModel, table=True):
    name: str = Field(unique=True)
    description: str
    ratting: float = Field(default=0.0)
