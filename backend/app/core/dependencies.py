from dependency_injector.wiring import Provide, inject
from fastapi import Depends
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
    token: str = Depends(JWTBearer()),
    service: UserService = Depends(Provide[Container.user_service]),
):
    try:
        payload = jwt.decode(token, configs.SECRET_KEY, algorithms=ALGORITHM)
        token_data = payload
    except (jwt.PyJWTError, ValidationError):
        raise AuthError(detail="Could not validate credentials")
    current_user: User = service.get_by_id(token_data.sub)
    if not current_user:
        raise AuthError(detail="User not found")
    return current_user
