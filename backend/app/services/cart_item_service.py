from typing import Any

from app.repositories.cart_item_repository import CartItemRepository
from app.services.base_service import BaseService


class CartItemService(BaseService):
    def __init__(self, repository: CartItemRepository):
        self._repository = repository
        super().__init__(repository)

    def get_list(self, schema: Any, eagers=["variant", "variant.product", "variant.product.thumbnail"]):
        return self._repository.read_by_options(schema, eagers)
