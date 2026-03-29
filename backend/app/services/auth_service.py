from app.services.base_service import BaseService
from app.schemas.auth_schema import LoginRequest, RegisterRequest
from app.core.exceptions import AuthError
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.core.security import (
    create_jwt_token,
    hash_password,
    verify_jwt_token,
    verify_password,
)


class AuthService(BaseService):
    def __init__(self, repository: UserRepository):
        self._repository = repository
        super().__init__(repository)

    def login(self, data: LoginRequest):
        user: User = self._repository.read_by_field("phone_number", data.phone_number)

        if not user:
            raise AuthError(detail="Invalid credentials")

        if not user.is_active:
            raise AuthError(detail="Account is not active")

        if not verify_password(data.password, user.password):
            raise AuthError(detail="Phone number or password is incorrect")

        delattr(user, "password")

        payload = {"sub": str(user.id)}
        access_token = create_jwt_token(payload, type="access")
        refresh_token = create_jwt_token(payload, type="refresh")

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user,
        }

    def register(self, data: RegisterRequest):
        user_check: User = self._repository.read_by_field(
            "phone_number", data.phone_number, raise_not_found=False
        )
        if user_check:
            raise AuthError(detail="Phone number is already in use")

        data.password = hash_password(data.password)

        return self._repository.create(User(**data.dict(exclude_none=True)))

    def refresh_token(self, refresh_token: str):
        payload = verify_jwt_token(refresh_token, "refresh")
        user_id = payload.get("sub")

        new_access_token = create_jwt_token({"sub": user_id}, "access")

        return {"access_token": new_access_token}
