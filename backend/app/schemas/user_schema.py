from typing import List, Optional

from pydantic import BaseModel

from app.schemas.base_schema import ModelBaseInfo, SearchOptions
from app.core.enums.user_role import UserRole


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
    phone_number: str


class FindUserResult(BaseModel):
    founds: Optional[List[User]]
    search_options: Optional[SearchOptions]
