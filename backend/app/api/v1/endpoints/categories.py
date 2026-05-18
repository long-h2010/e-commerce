from typing import Annotated
from uuid import UUID

from dependency_injector.wiring import Provide
from fastapi import APIRouter, Depends, Query

from app.core.container import Container
from app.core.dependencies import AdminRequired, SuperAdminRequired
from app.core.middleware import inject
from app.models.user import User
from app.schemas.category_chema import CreateCategory, FindCategory, UpdateCategory
from app.services.category_service import CategoryService


router = APIRouter(prefix="/categories", tags=["category"])


@router.get("/")
@inject
def get_list_category(
    find_category: FindCategory = Query(),
    service: CategoryService = Depends(Provide[Container.category_service]),
):
    return service.get_list(find_category)


@router.post("/")
@inject
def create_category(
    create_category: CreateCategory,
    user: Annotated[User, Depends(AdminRequired)],
    service: CategoryService = Depends(Provide[Container.category_service]),
):
    return service.create(create_category)


@router.put("/{category_id}")
@inject
def update_category(
    category_id: UUID,
    update_category: UpdateCategory,
    user: Annotated[User, Depends(AdminRequired)],
    service: CategoryService = Depends(Provide[Container.category_service]),
):
    return service.update(category_id, update_category)


@router.delete("/{category_id}")
@inject
def delete_category(
    category_id: UUID,
    user: Annotated[User, Depends(SuperAdminRequired)],
    service: CategoryService = Depends(Provide[Container.category_service]),
):
    return service.delete_by_id(category_id)
