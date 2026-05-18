from uuid import UUID

from dependency_injector.wiring import Provide
from fastapi import APIRouter, Depends, Query

from app.core.container import Container
from app.core.middleware import inject
from app.models.user import User
from app.services.cart_service import CartService
from app.schemas.cart_schema import AddItem, FindCart, UpdateQuantity
from app.core.dependencies import get_current_user


router = APIRouter(prefix="/carts", tags=["cart"])


@router.get("/")
@inject
async def get_cart(
    find_cart: FindCart = Query(),
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(Provide[Container.cart_service]),
):
    return await service.get_list_item(current_user.id, find_cart)


@router.post("/")
@inject
def add_item(
    item: AddItem,
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(Provide[Container.cart_service]),
):
    return service.add_item(current_user.id, item)


@router.put("/")
@inject
def update_quantity(
    update_quantity: UpdateQuantity,
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(Provide[Container.cart_service]),
):
    return service.update_quantity(current_user.id, update_quantity)

@router.delete("/{id}")
@inject

def update_quantity(
    id: UUID,
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(Provide[Container.cart_service]),
):
    return service.delete_item_by_id(id)
