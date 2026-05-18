from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import UUID

from fastapi import HTTPException, status

from app.repositories.discount_repository import DiscountRepository
from app.services.base_service import BaseService
from app.services.discount_target_service import DiscountTargetService
from app.schemas.discount_schema import BaseDiscount, CreateDiscount, FindActiveDiscount
from app.core.enums.discount import (
    DiscountApplyType,
    DiscountStatus,
    DiscountTargetType,
    DiscountType,
)
from app.services.category_service import CategoryService
from app.cache.discount_cache import DiscountCache


class DiscountService(BaseService):
    def __init__(
        self,
        repository: DiscountRepository,
        target_service: DiscountTargetService,
        category_service: CategoryService,
        cache: DiscountCache = None,
    ):
        self._repository = repository
        self._target_service = target_service
        self._category_service = category_service
        self._cache = cache or DiscountCache()
        super().__init__(repository)

    def validate_discount(self, discount: Any, price: Optional[int] = None):
        if not discount or discount.status != DiscountStatus.ACTIVE:
            print("Invalid discount or price")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid discount or price",
            )

        if price:
            if discount.min_order and price < discount.min_order:
                print(f"Minimum order amount for this discount is {discount.min_order}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Minimum order amount for this discount is {discount.min_order}",
                )

        if discount.usage_limit and discount.usage_count >= discount.usage_limit:
            print("This discount has reached its usage limit")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This discount has reached its usage limit",
            )

        if discount.end_time and discount.end_time < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This discount has expired",
            )

    def get_list(
        self, schema: Any, keyword_columns: list[str] = ["name", "code"], **kwargs: Any
    ):
        return self._repository.read_by_options(
            schema, keyword_columns=keyword_columns, **kwargs
        )

    def create(self, schema: CreateDiscount):
        discount = self._repository.create(
            BaseDiscount(**schema.model_dump(exclude_none=True))
        )
        if schema.apply_to == DiscountApplyType.PRODUCT:
            if schema.target_ids:
                self._target_service.create(
                    discount.id, schema.target, schema.target_ids
                )
        return discount

    async def create_and_invalidate(self, schema: CreateDiscount):
        discount = self.create(schema)
        await self._cache.invalidate()
        return discount

    async def update_and_invalidate(self, id: UUID, schema: Any) -> Any:
        result = super().update(id, schema)
        await self._cache.invalidate()
        return result

    async def delete_and_invalidate(self, id: UUID) -> Any:
        result = super().delete_by_id(id)
        await self._cache.invalidate()
        return result

    def get_discount_by_code(self, code: str):
        discount = self._repository.read_by_field("code", code)
        if discount.apply_to == DiscountApplyType.PRODUCT:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return discount

    async def build_discount_map(self) -> Dict[UUID, List[dict]]:
        cached = await self._cache.get_discount_map()
        if cached is not None:
            return cached

        discount_map = self._build_discount_map_from_db()

        await self._cache.set_discount_map(discount_map)

        return discount_map

    def _build_discount_map_from_db(self) -> Dict[UUID, List[Any]]:
        discounts = self.get_list(
            FindActiveDiscount(apply_to=DiscountApplyType.PRODUCT), eagers=["targets"]
        )["founds"]

        category_target_ids: set[UUID] = set()
        for d in discounts:
            for t in d.targets:
                if t.target_type == DiscountTargetType.CATEGORY:
                    category_target_ids.add(t.target_id)

        category_leaf_map = self._category_service.get_batch_leaf_ids(
            category_target_ids
        )

        discount_map: Dict[UUID, List[Any]] = {}
        for d in discounts:
            for t in d.targets:
                if t.target_type == DiscountTargetType.CATEGORY:
                    for leaf_id in category_leaf_map.get(t.target_id, []):
                        discount_map.setdefault(leaf_id, []).append(d)
                else:
                    discount_map.setdefault(t.target_id, []).append(d)

        return discount_map

    def apply_discount(self, product: Dict, discount_map):
        if not discount_map or not product["price"]:
            return None

        sale_price = product["price"]
        sale_value = 0
        discount = None

        for key in (product["id"], product["category_id"]):
            discounts = discount_map.get(key)
            if not discounts:
                continue

            for d in discounts:
                d_value = d["value"] if isinstance(d, dict) else d.value
                d_type = d["type"] if isinstance(d, dict) else d.type.value

                if d_type == DiscountType.PERCENTAGE.value:
                    d_value /= 100
                    new_price = sale_price * (1 - d_value)
                else:
                    new_price = sale_price - d_value

                if new_price < sale_price:
                    sale_price = new_price
                    sale_value = d_value
                    discount = d

        return {"sale_value": sale_value, "discount": discount}

    def calculate_discount_amount(self, price: int, discount: Any):
        print(price, discount.value)
        self.validate_discount(discount, price)

        if discount.type == DiscountType.PERCENTAGE:
            return int(price * discount.value / 100)
        else:
            return int(discount.value)
