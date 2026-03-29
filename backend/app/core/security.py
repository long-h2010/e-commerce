from datetime import datetime, timedelta
from typing import Literal, Tuple

import bcrypt
import jwt

from fastapi import Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import configs
from app.core.exceptions import AuthError

ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    pw_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(pw_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    pw_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(pw_bytes, hashed_bytes)


def create_jwt_token(
    subject: dict, type: Literal["access", "refresh"]
) -> Tuple[str, str]:
    data = subject.copy()

    expire_minutes = (
        configs.ACCESS_TOKEN_EXPIRE_MINUTES
        if type == "access"
        else configs.REFRESH_TOKEN_EXPIRE_MINUTES
    )
    expire = datetime.utcnow() + timedelta(minutes=expire_minutes)

    payload = {**data, "exp": expire, "type": type}
    token = jwt.encode(payload, configs.SECRET_KEY, algorithm=ALGORITHM)

    return token

def verify_jwt_token(token: str, type: Literal["access", "refresh"]):
    try:
        payload = jwt.decode(token, configs.SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != type:
            raise Exception("Invalid token type")
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise AuthError(detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise AuthError(detail="Invalid token or expired token.")
            return credentials.credentials
        else:
            raise AuthError(detail="Invalid authorization code.")

    def verify_jwt(self, jwt_token: str) -> bool:
        is_token_valid: bool = False
        try:
            payload = verify_jwt_token(jwt_token)
        except Exception:
            payload = None
        if payload:
            is_token_valid = True
        return is_token_valid
