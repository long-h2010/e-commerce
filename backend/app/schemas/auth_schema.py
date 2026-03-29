import re

from pydantic import BaseModel, Field, field_validator

from app.schemas.user_schema import User


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    phone_number: str
    password: str
    confirm_password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) < 6:
            raise ValueError("Password must be at least 6 characters")
        if not re.search(r"[0-9]", value):
            raise ValueError("Password must contain number")
        return value

    @field_validator("confirm_password")
    @classmethod
    def validate_confirm_password(cls, value, info):
        password = info.data.get("password")
        if password != value:
            raise ValueError("Passwords do not match")
        return value


class LoginRequest(BaseModel):
    phone_number: str
    password: str


class Token(BaseModel):
    access_token: str


class LoginResponse(Token):
    user: User
