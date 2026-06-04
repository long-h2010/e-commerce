from dependency_injector.wiring import Provide
from fastapi import APIRouter, Depends, HTTPException, Request, Response

from app.core.middleware import inject
from app.core.container import Container
from app.schemas.auth_schema import LoginRequest, LoginResponse, RegisterRequest, SendOtpRequest
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
@inject
def login(
    data: LoginRequest,
    response: Response,
    service: AuthService = Depends(Provide[Container.auth_service]),
):
    result = service.login(data)

    response.set_cookie(
        key="refresh_token",
        value=result["refresh_token"],
        httponly=True,
        secure=True,
        samesite=None,
        max_age=7 * 24 * 60 * 60,
    )

    return {"access_token": result["access_token"], "user": result["user"]}

@router.post("/send-otp")
@inject
async def send_otp(
    data: SendOtpRequest,
    service: AuthService = Depends(Provide[Container.auth_service]),
):
    return await service.send_otp(data)

@router.post("/register")
@inject
async def register(
    data: RegisterRequest,
    service: AuthService = Depends(Provide[Container.auth_service]),
):
    return await service.register(data)


@router.post("/refresh-token")
@inject
def refresh_token(
    request: Request, service: AuthService = Depends(Provide[Container.auth_service])
):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")

    return service.refresh_token(refresh_token)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("refresh_token")
    return
