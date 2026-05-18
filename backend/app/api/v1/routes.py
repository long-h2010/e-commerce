from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.categories import router as category_router
from app.api.v1.endpoints.colors import router as color_router
from app.api.v1.endpoints.users import router as user_router
from app.api.v1.endpoints.products import router as product_router
from app.api.v1.endpoints.variants import router as variant_router
from app.api.v1.endpoints.reviews import router as review_router
from app.api.v1.endpoints.discounts import router as discount_router
from app.api.v1.endpoints.carts import router as cart_router
from app.api.v1.endpoints.orders import router as order_router

routers = APIRouter(prefix="/v1")
router_list = [
    auth_router,
    user_router,
    color_router,
    category_router,
    product_router,
    variant_router,
    review_router,
    discount_router,
    cart_router,
    order_router,
]

for route in router_list:
    routers.include_router(route)
