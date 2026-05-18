from typing import Any

from app.repositories.color_repository import ColorRepository
from app.services.base_service import BaseService


class ColorService(BaseService):
    def __init__(self, repository: ColorRepository):
        self._repository = repository
        super().__init__(repository)

    def get_list(self, schema: Any, keyword_columns: list[str] = ["name", "hex"]):
        return self._repository.read_by_options(schema, keyword_columns=keyword_columns)
