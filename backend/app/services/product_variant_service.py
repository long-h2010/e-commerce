from typing import Any

from app.repositories.product_variant_repository import ProductVariantRepository
from app.services.base_service import BaseService
from app.schemas.product_variant_schema import BaseVariant, VariantResponse
from app.schemas.base_schema import FindResult


class ProductVariantService(BaseService):
    def __init__(self, repository: ProductVariantRepository):
        self._repository = repository
        super().__init__(repository)

    def get_list(
        self, schema: Any, eagers=["color"], keyword_columns: list[str] = ["sku"]
    ):
        result = self._repository.read_by_options(
            schema,
            eagers=eagers,
            keyword_columns=keyword_columns,
        )

        return FindResult(
            founds=[VariantResponse.model_validate(r) for r in result["founds"]],
            search_options=result["search_options"],
        )

    def create(self, schema: Any):
        variants_data = [
            BaseVariant(
                sku=schema.sku,
                size=size,
                color_id=schema.color_id,
                product_id=schema.product_id,
                cost=schema.cost,
                price=schema.price,
                stock=schema.stock,
            )
            for size in schema.sizes
        ]

        return self._repository.bulk_create(variants_data)

    def get_by_ids(self, ids: list[Any]):
        return self._repository.read_by_ids(ids)
