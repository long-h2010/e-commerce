from app.repositories.order_item_repository import OrderItemRepository
from app.services.base_service import BaseService
from app.models.order_item import OrderItem
from app.schemas.product_variant_schema import VariantDetailResponse
from app.schemas.order_item_schema import FindOrderItem, OrderItemResponse


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

    def get_list(
        self,
        schema: FindOrderItem,
        eagers=["variant", "variant.product", "variant.product.thumbnail"],
    ):
        schema.limit = 0
        items = self._repository.read_by_options(schema=schema, eagers=eagers)

        result = []
        for item in items["founds"]:
            result.append(
                OrderItemResponse(
                    **item.model_dump(),
                    variant=VariantDetailResponse.model_validate(item)
                )
            )

        return result

    def get_list_variant_id(self, schema: FindOrderItem):
        schema.limit = 0
        items = self._repository.read_by_options(schema)

        result = []
        for item in items["founds"]:
            result.append(item.variant_id)

        return result
