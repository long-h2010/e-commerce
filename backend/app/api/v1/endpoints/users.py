from typing import Annotated
from uuid import UUID

from dependency_injector.wiring import Provide
from fastapi import APIRouter, Depends, Query

from app.core.container import Container
from app.core.middleware import inject
from app.core.dependencies import AdminRequired, get_current_user
from app.schemas.user_schema import FindUser, UpdateUser
from app.services.user_service import UserService
from app.models.user import User

router = APIRouter(prefix="/users", tags=["user"])


@router.get("/")
@inject
def get_list_user(
    user: Annotated[User, Depends(AdminRequired)],
    find_user: FindUser = Query(),
    service: UserService = Depends(Provide[Container.user_service]),
):
    return service.get_list(find_user)


@router.put("/{user_id}")
@inject
def update_user(
    user_id: UUID,
    update_user: UpdateUser,
    service: UserService = Depends(Provide[Container.user_service]),
):
    return service.update(user_id, update_user)
