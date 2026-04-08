from typing import Optional

from sqlmodel import Field

from app.models.base_model import BaseModel

from app.core.enums.user_role import UserRole


class User(BaseModel, table=True):
    __tablename__ = "users"

    username: str
    email: Optional[str] = Field(default=None, unique=True, index=True)
    phone_number: Optional[str] = Field(default=None, unique=True, index=True)
    password: Optional[str]

    name: str
    avatar: Optional[str] = Field(default="/default-avatar.png")

    role: UserRole = Field(default=UserRole.CUSTOMER)
    is_active: bool = Field(default=True)
