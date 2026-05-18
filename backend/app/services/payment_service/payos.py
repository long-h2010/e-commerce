from payos import AsyncPayOS
from payos.type import (
    PaymentData,
    ItemData,
)
from payos.types import Webhook
from fastapi import HTTPException, status

from app.core.config import configs
from app.models.order import Order
from app.services.payment_service.base import BasePaymentService

payos_client = AsyncPayOS(
    client_id=configs.PAYOS_CLIENT_ID,
    api_key=configs.PAYOS_API_KEY,
    checksum_key=configs.PAYOS_CHECKSUM_KEY,
)


class PayOSService(BasePaymentService):

    async def create_payment_link(
        self, order: Order, order_code_int: int
    ) -> tuple[str, str]:
        items = [
            ItemData(
                name=oi.variant.product.name,
                quantity=oi.quantity,
                price=oi.price_at_time,
            )
            for oi in order.items
        ]

        request = PaymentData(
            orderCode=order_code_int,
            amount=order.total_amount,
            description=f"Thanh toan {str(order.id)[:5]}",
            cancelUrl=f"{configs.FRONTEND_URL}/checkout/cancel",
            returnUrl=f"{configs.FRONTEND_URL}/checkout/success?orderId={order.id}",
            items=items,
            buyerName=order.name,
            buyerEmail=order.email,
            buyerPhone=order.phone,
            buyerAddress=order.address,
        )

        response = await payos_client.createPaymentLink(request)
        return response.checkoutUrl, response.qrCode, response.description

    def validate_webhook(self, payload: Webhook) -> bool:
        try:
            # SDK tự verify HMAC, raise InvalidSignatureError nếu sai
            payos_client.verifyPaymentWebhookData(payload)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid PayOS signature",
            )

        return payload.success is True and payload.code == "00"
