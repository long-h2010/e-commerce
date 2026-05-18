import asyncio
from typing import List

import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

from app.core.config import configs


cloudinary.config(
    cloud_name=configs.CLOUD_NAME,
    api_key=configs.CLOUD_API_KEY,
    api_secret=configs.CLOUD_API_SECRET,
)


class CloudinaryService:
    def __init__(self):
        pass

    async def upload_one(self, file: UploadFile):
        loop = asyncio.get_event_loop()

        result = await loop.run_in_executor(
            None, lambda: cloudinary.uploader.upload(file.file, folder="e-commerce")
        )

        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
        }

    async def upload_many(self, files: List[UploadFile]):
        tasks = [self.upload_one(file) for file in files]
        return await asyncio.gather(*tasks)
