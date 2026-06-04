from typing import List

from fastapi import APIRouter, Depends

from dependency_injector.wiring import Provide

from app.core.middleware import inject
from app.core.container import Container
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard_schema import TopProductSchema

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/")
@inject
def overview(service: DashboardService = Depends(Provide[Container.dashboard_service])):
    return service.get_overview()


@router.get("/top-products", response_model=List[TopProductSchema])
@inject
def get_top_products(service: DashboardService = Depends(Provide[Container.dashboard_service])):
    return service.get_top_products()
