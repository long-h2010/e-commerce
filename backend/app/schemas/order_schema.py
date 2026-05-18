from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from app.schemas.base_schema import FindBase
from app.core.enums.order import (
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
    ShippingMethod,
)
from app.schemas.order_item_schema import CreateOrderItem, OrderItemResponse


class BaseOrder(BaseModel):
    id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)


class FindOrder(FindBase): ...


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

    items: List[OrderItemResponse]

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
