from fastapi import APIRouter, Depends, Query

from dependency_injector.wiring import Provide

from app.core.container import Container
from app.core.middleware import inject
from app.services.review_service import ReviewService
from app.schemas.review_schema import FindReview


router = APIRouter(prefix="/reviews", tags=["review"])


@router.get("")
@inject
def get_list_review(
    find_review: FindReview = Query(),
    service: ReviewService = Depends(Provide[Container.review_service]),
):
    return service.get_list(find_review)
