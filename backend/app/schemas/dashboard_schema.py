from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel

from app.schemas.base_schema import OverviewGrowthResponse


class OverviewDashboard(BaseModel):
    revenue_overview: OverviewGrowthResponse
    customer_overview: OverviewGrowthResponse
    order_overview: OverviewGrowthResponse
    total_discount_active: int
    monthly_revenue: Any
    weekly_revenue: Any
    product_count: Any


class TopProductSchema(BaseModel):
    product_id: UUID
    name: str
    thumbnail: Optional[str] = None
    total_sold: int
    total_revenue: int
    order_count: int
