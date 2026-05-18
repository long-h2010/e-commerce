from typing import Annotated
from uuid import UUID

from dependency_injector.wiring import Provide
from fastapi import APIRouter, Depends, Query

from app.core.container import Container
from app.core.dependencies import AdminRequired, SuperAdminRequired
from app.core.middleware import inject
from app.models.user import User
from app.schemas.color_schema import BaseColor, FindColor
from app.services.color_service import ColorService


router = APIRouter(prefix="/colors", tags=["color"])


@router.get("/")
@inject
def get_list_color(
    find_color: FindColor = Query(),
    service: ColorService = Depends(Provide[Container.color_service]),
):
    return service.get_list(find_color)


@router.post("/")
@inject
def create_color(
    create_color: BaseColor,
    user: Annotated[User, Depends(AdminRequired)],
    service: ColorService = Depends(Provide[Container.color_service]),
):
    return service.create(create_color)


@router.put("/{color_id}")
@inject
def update_color(
    color_id: UUID,
    update_color: BaseColor,
    user: Annotated[User, Depends(AdminRequired)],
    service: ColorService = Depends(Provide[Container.color_service]),
):
    return service.update(color_id, update_color)


@router.delete("/{color_id}")
@inject
def delete_color(
    color_id: UUID,
    user: Annotated[User, Depends(SuperAdminRequired)],
    service: ColorService = Depends(Provide[Container.color_service]),
):
    return service.delete_by_id(color_id)
