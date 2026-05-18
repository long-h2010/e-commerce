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
from app.schemas.order_schema import CreateOrder, FindOrder

router = APIRouter(prefix="/orders", tags=["order"])


@router.get("/")
@inject
def get_list_order(
    find_order: FindOrder = Query(),
    service: OrderService = Depends(Provide[Container.order_service]),
):
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
