from app.repositories.order_item_repository import OrderItemRepository
from app.services.base_service import BaseService
from app.models.order_item import OrderItem


class OrderItemService(BaseService):
    def __init__(self, repository: OrderItemRepository):
        self._repository = repository
        super().__init__(repository)

    def bulk_create(self, order_id, items):
        order_items = [
            OrderItem(
                order_id=order_id,
                variant_id=item.variant_id,
                quantity=item.quantity,
                price_at_time=item.price_at_time,
                discount_id=item.discount_id,
                discount_amount=item.discount_amount,
                subtotal=item.subtotal,
            )
            for item in items
        ]

        self._repository.bulk_create(order_items)
