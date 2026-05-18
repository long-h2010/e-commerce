from abc import ABC, abstractmethod
from app.models.order import Order

class BasePaymentService(ABC):

    @abstractmethod
    async def create_payment_link(
        self, order: Order, order_code_int: int
    ) -> tuple[str, str]:
        """Return (checkout_url, qr_code)"""
        ...

    @abstractmethod
    def validate_webhook(self, payload: dict) -> bool:
        """Verify signature + Return True if paid"""
        ...
