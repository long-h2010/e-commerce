from fastapi import APIRouter, Depends

from app.core.middleware import inject
from backend.app.core.dependencies import get_current_user


router = APIRouter(prefix="/users", tags=["user"])

@router.get("/")
@inject
def test(current_user= Depends(get_current_user)):
    return current_user
