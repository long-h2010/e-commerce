from app.core.enums.order import PaymentMethod
from app.services.payment_service.base import BasePaymentService
from app.services.payment_service.payos import PayOSService

def get_payment_service(method: PaymentMethod) -> BasePaymentService:
    mapping = {
        PaymentMethod.BANKING: PayOSService,
    }
    cls = mapping.get(method)
    if not cls:
        raise ValueError(f"Unsupported payment method: {method}")
    return cls()
