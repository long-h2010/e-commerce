from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from payos.types import Webhook

from app.core.enums.order import (
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
    ShippingMethod,
)
from app.repositories.order_repository import OrderRepository
from app.services.base_service import BaseService
from app.services.order_item_service import OrderItemService
from app.services.payment_service.factory import get_payment_service
from app.services.discount_service import DiscountService
from app.services.product_variant_service import ProductVariantService
from app.schemas.order_schema import (
    CreateOrder,
    CreateOrderResponse,
    OrderResponse,
    OrderStatusResponse,
)
from app.schemas.order_item_schema import CreateOrderItem
from app.models.order import Order

SHIPPING_FEE = {
    ShippingMethod.STANDARD: 1000,
    ShippingMethod.EXPRESS: 50_000,
}


class OrderService(BaseService):
    def __init__(
        self,
        repository: OrderRepository,
        item_service: OrderItemService,
        variant_service: ProductVariantService,
        discount_service: DiscountService,
    ):
        self._repository = repository
        self._item_service = item_service
        self._variant_service = variant_service
        self._discount_service = discount_service
        super().__init__(repository)

    async def create(self, user_id: UUID, payload: CreateOrder):
        variant_ids = [item.variant_id for item in payload.items]
        variants = self._variant_service.get_by_ids(variant_ids)
        variant_map = {v.id: v for v in variants}

        discount_map = await self._discount_service.build_discount_map()

        order_items = []
        subtotal = 0

        for item_in in payload.items:
            variant = variant_map.get(item_in.variant_id)
            if not variant:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Variant {item_in.variant_id} not found",
                )
            if variant.stock < item_in.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Variant out of stock (available: {variant.stock})",
                )

            # Apply discount
            result = self._discount_service.apply_discount(
                {
                    "id": variant.product_id,
                    "category_id": variant.product.category_id,
                    "price": variant.price,
                },
                discount_map,
            )

            discount_amount = 0
            discount_id = None
            if result:
                d = result["discount"]
                discount_id = UUID(d["id"]) if isinstance(d, dict) else d.id
                sale_value = result["sale_value"]
                if sale_value <= 1:
                    discount_amount = int(variant.price * sale_value)
                else:
                    discount_amount = int(sale_value)

            line_subtotal = (
                variant.price * item_in.quantity - discount_amount * item_in.quantity
            )
            subtotal += line_subtotal

            order_items.append(
                CreateOrderItem(
                    variant_id=variant.id,
                    quantity=item_in.quantity,
                    price_at_time=variant.price,
                    discount_id=discount_id,
                    discount_amount=discount_amount * item_in.quantity,
                    subtotal=line_subtotal,
                )
            )

        shipping_fee = SHIPPING_FEE[payload.shipping_method]

        # 3. Discount toàn đơn
        order_discount_amount = 0
        if payload.discount_id:
            discount = self._discount_service.get_by_id(payload.discount_id)
            order_discount_amount = self._discount_service.calculate_discount_amount(
                subtotal, discount
            )
            print(f"Order discount amount: {order_discount_amount}")

        # 4. Tổng tiền — tính, không tin frontend
        total_amount = subtotal + shipping_fee - order_discount_amount

        # 5. Sinh order_code_int cho PayOS (cần là số nguyên, max 9_999_999)
        order_code_int = int(datetime.now(timezone.utc).timestamp() * 1000) % 9_999_999

        order = Order(
            order_code=order_code_int,
            user_id=user_id,
            name=payload.name,
            email=payload.email,
            phone=payload.phone,
            address=payload.address,
            city=payload.city,
            district=payload.district,
            ward=payload.ward,
            notes=payload.notes,
            shipping_method=payload.shipping_method,
            shipping_fee=shipping_fee,
            payment_method=payload.payment_method,
            discount_id=payload.discount_id,
            discount_amount=order_discount_amount,
            total_amount=total_amount,
        )

        order_created = self._repository.create(order)

        self._item_service.bulk_create(order_created.id, order_items)

        # 7. Tạo payment link nếu không phải COD
        checkout_url = None
        qr_code = None
        description = None

        if payload.payment_method != PaymentMethod.COD:
            payment_svc = get_payment_service(payload.payment_method)
            checkout_url, qr_code, description = await payment_svc.create_payment_link(
                order=order_created,
                order_code_int=order_code_int,
            )

        return CreateOrderResponse(
            order=OrderResponse.model_validate(order_created),
            checkout_url=checkout_url,
            qr_code=qr_code,
            description=description,
        )

    async def handle_payos_webhook(self, payload: Webhook) -> dict:
        payment_svc = get_payment_service(PaymentMethod.BANKING)
        is_paid = payment_svc.validate_webhook(payload)

        if not is_paid:
            return {"message": "Payment not successful, ignored"}

        # Tìm order theo order_code (int) — không phải UUID
        order = self._repository.read_by_field("order_code", payload.data.order_code)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )

        # Idempotency
        if order.payment_status == PaymentStatus.PAID:
            return {"message": "Already processed"}

        self._repository.update_attr(order.id, "payment_status", PaymentStatus.PAID)
        self._repository.update_attr(order.id, "order_status", OrderStatus.CONFIRMED)

        return {"message": "OK"}

    def get_order_status(self, order_id: UUID) -> OrderStatusResponse:
        order = self._repository.read_by_field("id", order_id)
        
        return OrderStatusResponse(
            order_id=order.id,
            order_status=order.order_status,
            payment_status=order.payment_status,
        )
