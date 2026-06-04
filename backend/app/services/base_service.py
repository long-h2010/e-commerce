from typing import Any, List, Protocol
from uuid import UUID


class RepositoryProtocol(Protocol):
    def create(self, schema: Any) -> Any: ...
    def read_by_field(
        self, field_name: str, value: Any, eagers: List[str] = []
    ) -> Any: ...
    def read_by_options(self, schema: Any, eagers: List[str] = []) -> Any: ...
    def update(self, id: UUID, schema: Any) -> Any: ...
    def update_attr(self, id: UUID, attr: str, value: Any) -> Any: ...
    def delete_by_id(self, id: UUID) -> Any: ...
    def delete_by_options(
        self,
        allow_multiple: bool = False,
        logical_deletion: bool = False,
        deleted_flag_column: str = "del_flag",
        flush: bool = False,
        commit: bool = False,
        **kwargs,
    ) -> Any: ...


class BaseService:
    def __init__(self, repository: RepositoryProtocol) -> None:
        self._repository = repository

    def create(self, schema: Any) -> Any:
        return self._repository.create(schema)

    def get_by_id(self, id: UUID, eagers: List[str] = []) -> Any:
        return self._repository.read_by_field("id", id, eagers)

    def get_by_field(self, field: str, value: Any, eagers: List[str] = []) -> Any:
        return self._repository.read_by_field(field, value, eagers)

    def get_list(self, schema: Any, eagers: List[str] = []) -> Any:
        return self._repository.read_by_options(schema, eagers)

    def update(self, id: UUID, schema: Any) -> Any:
        return self._repository.update(id, schema)

    def update_attr(self, id: UUID, attr: str, value: Any) -> Any:
        return self._repository.update_attr(id, attr, value)

    def delete_by_id(self, id: UUID) -> Any:
        return self._repository.delete_by_id(id)

    def delete_by_options(
        self,
        allow_multiple: bool = False,
        logical_deletion: bool = False,
        deleted_flag_column: str = "del_flag",
        flush: bool = False,
        commit: bool = False,
        **kwargs,
    ) -> Any:
        return self._repository.delete_by_options(
            allow_multiple,
            logical_deletion,
            deleted_flag_column,
            flush,
            commit,
            **kwargs,
        )
    
    def calculate_growth(self, current: float, previous: float):
        if previous == 0:
            return 100 if current > 0 else 0

        return round(((current - previous) / previous) * 100, 2)

    def close_scoped_session(self):
        self._repository.close_scoped_session()
