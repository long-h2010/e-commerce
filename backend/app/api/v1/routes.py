from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.user import router as user_router


routers = APIRouter(prefix="/v1")
router_list = [
    auth_router,
    user_router
]

for route in router_list:
    routers.include_router(route)
