from typing import Annotated, List
from uuid import UUID

from dependency_injector.wiring import Provide
from fastapi import (
    APIRouter,
    Depends,
    File,
    Query,
    UploadFile,
)

from app.core.container import Container
from app.core.dependencies import SuperAdminRequired, get_current_user
from app.core.middleware import inject
from app.models.user import User
from app.services.product_service import ProductService
from app.schemas.product_schema import (
    DetailResponse,
    FindProduct,
    FormProduct,
)
from app.core.enums.user import UserRole
from app.core.enums.product import ProductStatus, ProductVisibility


router = APIRouter(prefix="/products", tags=["product"])


@router.get("/overview")
@inject
def get_product_overview(
    service: ProductService = Depends(Provide[Container.product_service]),
):
    return service.overview()


@router.get("/")
@inject
async def get_list_product(
    find_product: FindProduct = Query(),
    current_user: User | None = Depends(get_current_user),
    service: ProductService = Depends(Provide[Container.product_service]),
):
    if current_user is None or getattr(current_user, "role", None) == UserRole.CUSTOMER:
        find_product.status != ProductStatus.DRAFT
        find_product.visible = ProductVisibility.PUBLIC

    return await service.get_list(find_product)


@router.post("/")
@inject
async def create_product(
    user: Annotated[User, Depends(SuperAdminRequired)],
    create_product: FormProduct = Depends(FormProduct.as_form),
    images: List[UploadFile] = File(None),
    service: ProductService = Depends(Provide[Container.product_service]),
):
    return await service.create(create_product, images)


@router.get("/{product_id}", response_model=DetailResponse)
@inject
async def get_product(
    product_id: UUID,
    service: ProductService = Depends(Provide[Container.product_service]),
):
    return await service.get_by_id(product_id)


@router.put("/{product_id}")
@inject
async def update_product(
    product_id: UUID,
    update_product: FormProduct = Depends(FormProduct.as_form),
    images: List[UploadFile] = File(None),
    service: ProductService = Depends(Provide[Container.product_service]),
):
    return await service.update(product_id, update_product, images)


@router.delete("/{product_id}")
@inject
def delete_color(
    product_id: UUID,
    user: Annotated[User, Depends(SuperAdminRequired)],
    service: ProductService = Depends(Provide[Container.product_service]),
):
    return service.delete_by_id(product_id)
