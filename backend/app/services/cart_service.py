from typing import Any, List
from uuid import UUID

from app.repositories.cart_repository import CartRepository
from app.services.base_service import BaseService
from app.services.cart_item_service import CartItemService
from app.schemas.cart_item_schema import CreateCartItem, DeleteCartItem, FindCartItem
from app.schemas.cart_schema import AddItem, CreateCart, UpdateQuantity
from app.schemas.product_variant_schema import VariantDetailResponse


class CartService(BaseService):
    def __init__(
        self,
        repository: CartRepository,
        item_service: CartItemService,
        discount_service,
    ):
        self._repository = repository
        self._item_service = item_service
        self._discount_service = discount_service
        super().__init__(repository)

    def get_cart_by_user(self, user_id: UUID):
        cart = self._repository.read_by_field("user_id", user_id, raise_not_found=False)

        if not cart:
            cart = self.create(CreateCart(user_id=user_id))

        return cart

    async def get_list_item(self, user_id: UUID, find_schema: FindCartItem):
        cart = self.get_cart_by_user(user_id)
        find_schema.limit = 0
        items = self._item_service.get_list(
            FindCartItem(cart_id=cart.id, **find_schema.model_dump())
        )

        discount_map = await self._discount_service.build_discount_map()

        results = []
        for item in items["founds"]:
            cart_item = VariantDetailResponse.model_validate(item)
            product = item.variant.product

            discount_info = self._discount_service.apply_discount(
                {
                    "id": product.id,
                    "category_id": product.category_id,
                    "price": cart_item.price,
                },
                discount_map,
            )

            cart_item.sale_value = discount_info["sale_value"] if discount_info else 0
            results.append(cart_item)

        items["founds"] = results
        return items

    def add_item(self, user_id: UUID, create_schema: AddItem):
        cart = self.get_cart_by_user(user_id)
        return self._item_service.create(
            CreateCartItem(cart_id=cart.id, **create_schema.model_dump())
        )

    def update_quantity(self, user_id: UUID, update_schema: UpdateQuantity):
        cart = self.get_cart_by_user(user_id)

        if update_schema.quantity == 0:
            return self._item_service.delete_by_options(
                DeleteCartItem(cart_id=cart.id, variant_id=update_schema.variant_id)
            )

        item = self._item_service.get_list(
            FindCartItem(cart_id=cart.id, variant_id=update_schema.variant_id)
        )["founds"][0]

        return self._item_service.update(item.id, update_schema)

    def delete_item_by_id(self, id):
        return self._item_service.delete_by_id(id)

    def delete_by_options(self, user_id: UUID, items: List[UUID]):
        cart = self.get_cart_by_user(user_id)

        return self._item_service.delete_by_options(
            cart_id=cart.id,
            variant_id__in=items,
            allow_multiple=True,
            commit=True,
        )
