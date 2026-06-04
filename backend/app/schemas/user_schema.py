from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel

from app.schemas.base_schema import FindBase, ModelBaseInfo, SearchOptions
from app.core.enums.user import UserRole


class BaseUser(BaseModel):
    phone_number: Optional[str]
    email: Optional[str]
    name: str
    avatar: str
    is_active: bool
    role: UserRole

    class Config:
        from_attributes = True


class BaseUserWithPassword(BaseUser):
    password: str


class User(ModelBaseInfo, BaseUser): ...


class FindUserAuth(BaseModel):
    username: str


class FindUser(FindBase): ...


class UpdateUser(BaseModel):
    is_active: Optional[bool] = None
    password: Optional[str] = None


class UserResponse(BaseUser):
    id: UUID
    username: str
    orders: Optional[List[Any]] = None
