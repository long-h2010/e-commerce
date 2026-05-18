import json
from typing import Any, Dict, List
from uuid import UUID

from app.core.redis import client

DISCOUNT_MAP_KEY = "discount:map"


class DiscountCache:
    async def get_discount_map(self) -> Dict[UUID, List[dict]] | None:
        raw = await client.get(DISCOUNT_MAP_KEY)
        if not raw:
            return None
        data: dict = json.loads(raw)
        return {UUID(k): v for k, v in data.items()}

    async def set_discount_map(self, discount_map: Dict[UUID, List[Any]]) -> None:
        serializable = {
            str(k): [self._serialize_discount(d) for d in v]
            for k, v in discount_map.items()
        }
        await client.set(DISCOUNT_MAP_KEY, json.dumps(serializable))

    async def invalidate(self) -> None:
        await client.delete(DISCOUNT_MAP_KEY)

    def _serialize_discount(self, discount: Any) -> dict:
        print(discount)
        return {
            "id": str(discount.id),
            "code": discount.code,
            "type": discount.type.value,
            "value": discount.value,
            "apply_to": discount.apply_to.value,
        }
