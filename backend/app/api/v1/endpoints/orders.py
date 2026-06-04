from typing import Annotated
from uuid import UUID
from payos.types import Webhook

from fastapi import APIRouter, Depends, Query

from dependency_injector.wiring import Provide

from app.core.container import Container
from app.core.middleware import inject
from app.core.dependencies import AdminRequired, get_current_user
from app.models.user import User
from app.services.order_service import OrderService
from app.schemas.order_schema import CreateOrder, FindOrder, UpdateOrder
from app.core.enums.order import OrderStatus

router = APIRouter(prefix="/orders", tags=["order"])


@router.get("/")
@inject
def get_list_order(
    user: Annotated[User, Depends(AdminRequired)],
    find_order: FindOrder = Query(),
    service: OrderService = Depends(Provide[Container.order_service]),
):
    find_order.order_status__ne = OrderStatus.PENDING
    return service.get_list(find_order)


@router.get("/overview")
@inject
def get_overview(
    user: Annotated[User, Depends(AdminRequired)],
    service: OrderService = Depends(Provide[Container.order_service]),
):
    return service.overview()


@router.get("/user-orders")
@inject
def get_list_user_order(
    current_user: User = Depends(get_current_user),
    find_order: FindOrder = Query(),
    service: OrderService = Depends(Provide[Container.order_service]),
):
    find_order.user_id = current_user.id
    return service.get_list(find_order)


@router.post("/")
@inject
async def create_order(
    create_order: CreateOrder,
    current_user: User = Depends(get_current_user),
    service: OrderService = Depends(Provide[Container.order_service]),
):
    return await service.create(user_id=current_user.id, payload=create_order)


@router.get("/status/{order_id}")
@inject
def get_order_status(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    service: OrderService = Depends(Provide[Container.order_service]),
):
    return service.get_order_status(order_id)


@router.post("/webhook/payos", include_in_schema=False)
@inject
async def payos_webhook(
    payload: Webhook,
    service: OrderService = Depends(Provide[Container.order_service]),
):
    return await service.handle_payos_webhook(payload)


@router.get("/{order_id}")
@inject
def get_order(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    service: OrderService = Depends(Provide[Container.order_service]),
):
    return service.get_by_id(order_id)


@router.put("/{order_id}")
@inject
def update_order(
    order_id: UUID,
    update_order: UpdateOrder,
    user: Annotated[User, Depends(AdminRequired)],
    service: OrderService = Depends(Provide[Container.order_service]),
):
    return service.update(order_id, update_order)
