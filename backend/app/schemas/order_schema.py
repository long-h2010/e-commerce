from datetime import datetime
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from app.schemas.base_schema import FindBase
from app.core.enums.order import (
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
    ShippingMethod,
)
from app.schemas.order_item_schema import CreateOrderItem
from app.schemas.user_schema import UserResponse


class BaseOrder(BaseModel):
    id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)


class FindOrder(FindBase):
    user_id: Optional[UUID] = None
    order_code: Optional[int] = None
    order_status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None

    order_status__ne: Optional[OrderStatus] = None

    created_at__ge: Optional[datetime] = None
    created_at__le: Optional[datetime] = None


class CreateOrder(BaseModel):
    user_id: Optional[UUID] = None

    name: str
    email: EmailStr
    phone: str
    address: str
    city: str
    district: str
    ward: str
    notes: Optional[str] = None

    items: List[CreateOrderItem]

    shipping_method: ShippingMethod
    payment_method: PaymentMethod

    discount_id: Optional[UUID] = None
    discount_amount: Optional[int] = None

    total_amount: Optional[int] = None


class UpdateOrder(BaseModel):
    payment_status: Optional[PaymentStatus] = None
    order_status: Optional[OrderStatus] = None


class PayOSWebhookData(BaseModel):
    orderCode: int
    amount: int
    description: str
    accountNumber: str
    reference: str
    transactionDateTime: str
    currency: str
    paymentLinkId: str
    code: str
    desc: str
    counterAccountBankId: Optional[str] = None
    counterAccountBankName: Optional[str] = None
    counterAccountName: Optional[str] = None
    counterAccountNumber: Optional[str] = None
    virtualAccountName: Optional[str] = None
    virtualAccountNumber: Optional[str] = None


class PayOSWebhookRequest(BaseModel):
    code: str
    desc: str
    success: bool
    data: PayOSWebhookData
    signature: str


class OrderResponse(BaseModel):
    id: UUID
    order_code: int

    user_id: UUID
    user: Any

    name: str
    email: str
    phone: str
    address: str
    city: str
    district: str
    ward: str
    notes: Optional[str]

    shipping_method: ShippingMethod
    shipping_fee: int

    payment_method: PaymentMethod
    payment_status: PaymentStatus

    discount_id: Optional[UUID]
    discount_amount: int

    order_status: OrderStatus
    total_amount: int

    items: List[Any]

    class Config:
        from_attributes = True


class OrderOverviewResponse(BaseModel):
    total_orders: int
    revenue: int
    pending_count: int
    cancelled_count: int


class OrderHistoryResponse(BaseModel):
    id: UUID
    order_code: int
    user_id: UUID
    order_status: OrderStatus
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    city: str
    total_amount: int
    created_at: datetime

    items: List[Any]

    class Config:
        from_attributes = True


class CreateOrderResponse(BaseModel):
    order: OrderResponse
    checkout_url: Optional[str] = None
    qr_code: Optional[str] = None
    description: Optional[str] = None


class OrderStatusResponse(BaseModel):
    order_id: UUID
    order_status: OrderStatus
    payment_status: PaymentStatus
