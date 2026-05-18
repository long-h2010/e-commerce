from typing import Annotated, List
from uuid import UUID

from dependency_injector.wiring import Provide, inject
from fastapi import Depends, HTTPException, status
import jwt
from pydantic import ValidationError

from app.core.config import configs
from app.core.container import Container
from app.core.security import ALGORITHM, JWTBearer
from app.services.user_service import UserService
from app.core.exceptions import AuthError
from app.models.user import User


@inject
def get_current_user(
    token: str | None = Depends(JWTBearer()),
    service: UserService = Depends(Provide[Container.user_service]),
):
    if token is None:
        return None 
        
    try:
        payload = jwt.decode(token, configs.SECRET_KEY, algorithms=ALGORITHM)
    except (jwt.PyJWTError, ValidationError):
        raise AuthError(detail="Could not validate credentials")
    
    current_user: User = service.get_by_id(UUID(payload.get("sub")))

    if not current_user:
        raise AuthError(detail="User not found")
    
    if not current_user.is_active:
        raise AuthError(detail="Inactive user")

    return current_user


class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: Annotated[User, Depends(get_current_user)]):
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient access",
            )
        return user

SuperAdminRequired = RoleChecker(["super admin"])
AdminRequired = RoleChecker(["super admin", "admin"])
