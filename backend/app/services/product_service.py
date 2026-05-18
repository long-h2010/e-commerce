from typing import Any, Dict, List
from uuid import UUID

from fastapi import HTTPException, UploadFile, status

from app.repositories.product_repository import ProductRepository
from app.services.base_service import BaseService
from app.schemas.product_schema import (
    CreateProduct,
    DetailResponse,
    ProductResponse,
    UpdateProduct,
)
from app.services.product_image_service import ProductImageService
from app.schemas.base_schema import FindResult
from app.services.category_service import CategoryService
from app.core.enums.category import CategoryLevel
from app.services.discount_service import DiscountService
from app.core.enums.discount import DiscountType


class ProductService(BaseService):
    def __init__(
        self,
        repository: ProductRepository,
        image_service: ProductImageService,
        category_service: CategoryService,
        discount_service: DiscountService,
    ):
        self._repository = repository
        self._image_service = image_service
        self._category_service = category_service
        self._discount_service = discount_service
        super().__init__(repository)

    def overview(self):
        return self._repository.overview()

    async def create(self, schema: CreateProduct, images: List[UploadFile]):
        check_category = self._category_service.get_by_id(schema.category_id)
        if check_category.level != CategoryLevel.LEAF:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category is only LEAF node",
            )

        product = self._repository.create(
            CreateProduct(**schema.model_dump(exclude_none=True))
        )
        await self._image_service.create_images(product.id, images)

        return product

    async def get_list(
        self, schema: Any, eagers=["thumbnail"], keyword_columns: list[str] = ["name"]
    ):
        if getattr(schema, "category_id", None):
            category_id__in = self._category_service.get_list_leaf_id(
                schema.category_id
            )
            schema.category_id__in = category_id__in
            schema.category_id = None

        result = self._repository.get_list_products(
            schema,
            eagers=eagers,
            keyword_columns=keyword_columns,
        )
        
        discount_map = await self._discount_service.build_discount_map()

        for p in result["founds"]:
            apply_discount = self._discount_service.apply_discount(p, discount_map)
            if apply_discount:
                p["sale_value"] = apply_discount["sale_value"] 

        return FindResult(
            founds=[ProductResponse.model_validate(r) for r in result["founds"]],
            search_options=result["search_options"],
        )

    async def get_by_id(self, product_id: UUID):
        product, price = self._repository.get_product_by_id_with_price(product_id)
        categories = self._category_service.get_list_parent(product.category)

        product_dict = product.model_dump()
        product_dict["price"] = price 
        
        discount_map = await self._discount_service.build_discount_map()

        apply_discount = self._discount_service.apply_discount(product_dict, discount_map)
        sale_value = None
        if apply_discount:
            sale_value = apply_discount["sale_value"]

        colors = list(
            {v.color.id: v.color for v in product.variants if v.color}.values()
        )
        sizes = list({v.size: v.size for v in product.variants if v.size}.values())

        return DetailResponse(
            **product.model_dump(),
            images=product.images,
            categories=categories,
            price=price,
            sale_value=sale_value,
            sizes=sizes,
            colors=colors,
        )

    async def update(
        self, product_id: UUID, schema: UpdateProduct, images: List[UploadFile] = []
    ):
        if schema.change_thumbnail:
            await self._image_service.change_product_thumbnail(
                product_id, image=images[0]
            )
            images.pop(0)

        delete_images = schema.delete_images or []
        if len(delete_images) > 0:
            for img_id in delete_images:
                self._image_service.delete_by_id(img_id)

        if images:
            await self._image_service.create_images(
                product_id, images, has_thumbnail=False
            )

        return self._repository.update(
            product_id, UpdateProduct(**schema.model_dump(exclude_none=True))
        )

    def delete_by_id(self, id):
        return self._repository.soft_delete(id)
