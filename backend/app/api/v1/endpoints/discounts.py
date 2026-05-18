from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query

from dependency_injector.wiring import Provide

from app.core.container import Container
from app.core.middleware import inject
from app.services.discount_service import DiscountService
from app.schemas.discount_schema import CreateDiscount, FindDiscount
from app.core.dependencies import AdminRequired
from app.models.user import User


router = APIRouter(prefix="/discounts", tags=["discount"])


@router.get("/")
@inject
def get_list_discount(
    find_discount: FindDiscount = Query(),
    service: DiscountService = Depends(Provide[Container.discount_service]),
):
    return service.get_list(find_discount)


@router.post("/")
@inject
async def create_discount(
    create_discount: CreateDiscount,
    user: Annotated[User, Depends(AdminRequired)],
    service: DiscountService = Depends(Provide[Container.discount_service]),
):
    return await service.create_and_invalidate(create_discount)


@router.get("/code/{code}")
@inject
def get_discount_for_order(
    code: str,
    service: DiscountService = Depends(Provide[Container.discount_service]),
):
    return service.get_discount_by_code(code)


@router.get("/{id}")
@inject
def get_discount(
    id: UUID,
    service: DiscountService = Depends(Provide[Container.discount_service]),
):
    return service.get_by_field("id", id)
