from typing import Annotated
from uuid import UUID

from dependency_injector.wiring import Provide
from fastapi import APIRouter, Depends, Query

from app.core.container import Container
from app.core.dependencies import AdminRequired, SuperAdminRequired
from app.core.middleware import inject
from app.models.user import User
from app.services.product_variant_service import ProductVariantService
from app.schemas.product_variant_schema import CreateVariant, FindVariant, UpdateVariant


router = APIRouter(prefix="/variants", tags=["variant"])


@router.get("/")
@inject
def get_list_variant_by_product(
    find_variant: FindVariant = Query(),
    service: ProductVariantService = Depends(Provide[Container.product_variant_service]),
):
    return service.get_list(find_variant)


@router.post("/")
@inject
def create_variant(
    create_variant: CreateVariant,
    user: Annotated[User, Depends(AdminRequired)],
    service: ProductVariantService = Depends(Provide[Container.product_variant_service]),
):
    return service.create(create_variant)


@router.put("/{variant_id}")
@inject
def update_variant(
    variant_id: UUID,
    update_variant: UpdateVariant,
    user: Annotated[User, Depends(AdminRequired)],
    service: ProductVariantService = Depends(Provide[Container.product_variant_service]),
):
    print(update_variant)
    return service.update(variant_id, update_variant)


@router.delete("/{variant_id}")
@inject
def delete_variant(
    variant_id: UUID,
    user: Annotated[User, Depends(SuperAdminRequired)],
    service: ProductVariantService = Depends(Provide[Container.product_variant_service]),
):
    return service.delete_by_id(variant_id)
