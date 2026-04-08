from fastapi import APIRouter, Depends

from app.core.middleware import inject


router = APIRouter(prefix="/products", tags=["product"])
