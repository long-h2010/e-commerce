from typing import Any

from app.repositories.product_image_repository import ProductImageRepository
from app.services.base_service import BaseService
from app.schemas.product_image_schema import (
    CreateProductImage,
    FilterProductImage,
    UpdateProductThumbnail,
)
from app.services.cloudinary_service import CloudinaryService


class ProductImageService(BaseService):
    def __init__(
        self, repository: ProductImageRepository, cloud_service: CloudinaryService
    ):
        self._repository = repository
        self.cloud_service = cloud_service
        super().__init__(repository)

    async def create_images(self, product_id, images, has_thumbnail: bool = True):
        uploads = await self.cloud_service.upload_many(images)

        images_data = [
            CreateProductImage(
                product_id=product_id,
                url=u["url"],
                is_thumbnail=(has_thumbnail and i == 0),
            )
            for i, u in enumerate(uploads)
        ]

        return self._repository.bulk_create(images_data)

    async def change_product_thumbnail(self, product_id, image):
        upload = await self.cloud_service.upload_one(image)
        url = upload["url"]

        filters = FilterProductImage(product_id=product_id, is_thumbnail=True)
        update_data = UpdateProductThumbnail(url=url)

        return self._repository.update_by_field(
            filter_schema=filters, data_schema=update_data
        )
