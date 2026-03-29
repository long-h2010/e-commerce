from typing import Any, Dict, Optional

from fastapi import HTTPException, status


class BaseHTTPException(HTTPException):
    def __init__(
        self,
        error_code: Optional[str] = None,
        error_message: Any = None,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        headers: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(status_code, error_message, headers)

        self.error_code = error_code
        self.error_message = error_message

    def to_dict(self):
        return dict(error_code=self.error_code, error_message=self.error_message)


class AuthError(BaseHTTPException):
    def __init__(
        self,
        detail: Any = None,
        error_code: Optional[str] = None,
        headers: Optional[Dict[str, Any]] = None,
        failed_login_count: Optional[int] = None,
    ) -> None:
        super().__init__(error_code, detail, status.HTTP_403_FORBIDDEN, headers)
        self.failed_login_count = failed_login_count

    def to_dict(self):
        if self.failed_login_count is not None:
            return dict(**super().to_dict(), failed_login_count=self.failed_login_count)
        return super().to_dict()


class ConstraintError(BaseHTTPException):
    def __init__(
        self, detail: Any = None, error_code: Optional[str] = None, headers: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(error_code, detail, status.HTTP_400_BAD_REQUEST, headers)


class InvalidIdError(ConstraintError): ...


class EnumTypeError(ConstraintError): ...


class PasswordError(ConstraintError): ...


class DuplicatedError(BaseHTTPException):
    def __init__(
        self, detail: Any = None, error_code: Optional[str] = None, headers: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(error_code, detail, status.HTTP_400_BAD_REQUEST, headers)


class NotFoundError(BaseHTTPException):
    def __init__(
        self, detail: Any = None, error_code: Optional[str] = None, headers: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(error_code, detail, status.HTTP_404_NOT_FOUND, headers)


class ValidationError(BaseHTTPException):
    def __init__(
        self, detail: Any = None, error_code: Optional[str] = None, headers: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(error_code, detail, status.HTTP_422_UNPROCESSABLE_ENTITY, headers)
