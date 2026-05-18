import random

from fastapi import HTTPException, status

from app.services.base_service import BaseService
from app.schemas.auth_schema import LoginRequest, RegisterRequest, SendOtpRequest
from app.core.exceptions import AuthError
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.core.security import (
    create_jwt_token,
    hash_password,
    verify_jwt_token,
    verify_password,
)
from app.core.mail import send_otp_email
from app.cache.otp_cache import delete_otp, get_otp, set_otp


class AuthService(BaseService):
    def __init__(self, repository: UserRepository):
        self._repository = repository
        super().__init__(repository)

    def login(self, data: LoginRequest):
        user: User = self._repository.read_by_field(
            "username", data.username, raise_not_found=False
        )

        if not user or not verify_password(data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials"
            )

        if not user.is_active:
            raise AuthError(detail="Account is not active")

        delattr(user, "password")

        payload = {"sub": str(user.id)}
        access_token = create_jwt_token(payload, type="access")
        refresh_token = create_jwt_token(payload, type="refresh")

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user,
        }

    async def send_otp(self, data: SendOtpRequest):
        existing = self._repository.read_by_field(
            "email", data.email, raise_not_found=False
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        otp = str(random.randint(100000, 999999))
        await set_otp(data.email, otp)
        await send_otp_email(data.email, otp)

        return {"message": "OTP sent successfully"}

    async def register(self, data: RegisterRequest):
        if self._repository.read_by_field(
            "username", data.username, raise_not_found=False
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists",
            )

        saved_otp = await get_otp(data.email)
        print(saved_otp)
        if not saved_otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP expired or not found. Please request a new one.",
            )

        if saved_otp != data.otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP"
            )

        await delete_otp(data.email)

        password_copy = data.password
        data.password = hash_password(data.password)

        user = self._repository.create(User(**data.dict(exclude_none=True)))

        if user:
            return self.login(
                LoginRequest(username=data.username, password=password_copy)
            )

    def refresh_token(self, refresh_token: str):
        payload = verify_jwt_token(refresh_token, "refresh")
        user_id = payload.get("sub")

        new_access_token = create_jwt_token({"sub": user_id}, "access")

        return {"access_token": new_access_token}
