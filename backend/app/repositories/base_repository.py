from contextlib import AbstractContextManager
from datetime import datetime, timezone
from typing import Any, Callable, List, Type, TypeVar, Union
from uuid import UUID

from sqlalchemy import asc, delete, desc, func, or_, text, update
from sqlalchemy.dialects import postgresql
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Query, Session, aliased, joinedload
from sqlalchemy.sql.expression import ColumnElement
from sqlmodel import select


from app.core.config import configs
from app.core.database import BaseModel
from app.core.exceptions import DuplicatedError, NotFoundError, ValidationError
from app.utils.query_builder import apply_sorting, dict_to_sqlalchemy_filter_options

T = TypeVar("T", bound=BaseModel)


class BaseRepository:
    def __init__(
        self,
        session_factory: Callable[..., AbstractContextManager[Session]],
        model: Type[T],
    ) -> None:
        self._session_factory = session_factory
        self._model = model

    def create(self, schema: T):
        with self.session_factory() as session:
            query = self._model(**schema.model_dump())

            try:
                session.add(query)
                session.commit()
                session.refresh(query)
            except IntegrityError as e:
                raise DuplicatedError(detail=str(e.orig))

            return query

    def read_by_field(
        self,
        field_name: str,
        value: Any,
        eager: bool = False,
        raise_not_found: bool = True,
        include_del: bool = False,
    ):
        with self._session_factory() as session:
            query = session.query(self._model)

            if eager:
                for eager_field in getattr(self._model, "eager", []):
                    query = query.options(joinedload(getattr(self._model, eager_field)))

            field = getattr(self._model, field_name, None)
            if field is None:
                raise ValueError(
                    f"{field_name} is not valid field of {self._model.__name__}"
                )

            filters = [field == value]

            if not include_del and hasattr(self._model, "deleted_at"):
                filters.append(self._model.deleted_at.is_(None))

            result = query.filter(*filters).first()
            if not result and raise_not_found:
                raise NotFoundError(
                    detail=f"{self._model.__name__} not found with {field_name}: {value}",
                    error_code="ERR_BASE_001",
                )

        return result

    def read_by_options(
        self,
        schema: T,
        eager: bool = False,
        select_columns: List[str] | None = None,
        keyword_columns: List[str] | None = None,
        **kwargs,
    ) -> dict:
        with self.session_factory() as session:
            data = schema.model_dump(exclude_none=True)

            page = data.get("page", configs.PAGE)
            page_size = data.get("page_size", configs.PAGE_SIZE)
            sort_str = data.get("sort_str", configs.SORT_BY)

            sort_fields: List[tuple[str, bool]] = []
            if sort_str:
                for field in sort_str.split(","):
                    field = field.strip()
                    if not field:
                        continue

                    if field.starstWith("-"):
                        column_name = field[1:].strip()
                        is_desc = True
                    else:
                        column_name = field
                        is_desc = False

                    if column_name:
                        sort_fields.append((column_name, is_desc))
            if not sort_fields:
                sort_fields = [(sort_str, False)]

            query: Query = session.query(self._model)

            if select_columns:
                query = query.with_entities(
                    *[
                        getattr(self._model, col)
                        for col in select_columns
                        if hasattr(self._model, col)
                    ]
                )

            child_aliases = []
            if eager:
                for relation in getattr(self._model, "eagers", []):
                    child_alias = aliased(getattr(self._model, relation).mapper.class_)
                    child_aliases.append(child_alias)
                    query = query.options(
                        joinedload(getattr(self._model, relation).of_type(child_alias))
                    )

            filter_options = dict_to_sqlalchemy_filter_options(
                model=self._model,
                child_aliases=child_aliases,
                **data,
                **kwargs,
            )

            if keyword := getattr(schema, "keyword", None):
                if keyword_columns:
                    keyword_filters = [
                        getattr(self._model, col).ilike(f"%{keyword}%")
                        for col in keyword_columns
                        if hasattr(self._model, col)
                    ]
                    if keyword_filters:
                        filter_options.append(or_(*keyword_filters))

            if filter_options:
                query = query.where(*filter_options)

            total_count = query.count()

            order_by_clauses = []
            for col_name, is_desc in sort_fields:
                if not hasattr(self._model, col_name):
                    continue

                col = getattr(self._model, col_name)
                order_by_clauses.append(desc(col) if is_desc else asc(col))

            if order_by_clauses:
                query = query.order_by(*order_by_clauses)

            if page_size in (0, "all", "0"):
                results = query.all()
            else:
                results = query.offset((page - 1) * page_size).limit(page_size).all()

            sort_display = ",".join(
                f"{'-' if is_desc else ''}{col}" for col, is_desc in sort_fields
            )

            return {
                "founds": results,
                "search_options": {
                    "page": page,
                    "page_size": page_size if page_size not in (0, "0") else "all",
                    "sort": sort_display,
                    "total_count": total_count,
                },
            }

    def update(self, id: UUID, schema: T):
        with self.session_factory() as session:
            session.query(self._model).filter(self._model.id == id).update(
                schema.model_dump(exclude_none=True)
            )
            session.commit()
            return self.read_by_id(id, include_deleted=True)

    def update_attr(self, id: UUID, column: str, value: Any):
        with self.session_factory() as session:
            session.query(self._model).filter(self._model.id == id).update(
                {column: value}
            )
            session.commit()
            return self.read_by_id(id)

    def delete_by_id(self, id: UUID):
        with self.session_factory() as session:
            query = session.query(self._model).filter(self._model.id == id).first()

            if not query:
                raise NotFoundError(
                    detail=f"not found id : {id}", error_code="ERR_BASE_001"
                )

            session.delete(query)
            session.commit()

    def delete_by_options(
        self,
        allow_multiple: bool = False,
        logical_deletion: bool = False,
        deleted_flag_column: str = "del_flag",
        flush: bool = False,
        commit: bool = False,
        **kwargs,
    ) -> int:
        with self.session_factory() as session:
            filters = dict_to_sqlalchemy_filter_options(self._model, **kwargs)

            total_count = self.count(filters)
            if not allow_multiple and total_count > 1:
                raise ValidationError(
                    f"Only one record is expected to be delete, found {total_count} records."
                )

            if logical_deletion:
                deleted_flag = {
                    deleted_flag_column: True,
                    "deleted_at": datetime.now(timezone.utc),
                }
                stmt = update(self._model).where(*filters).values(**deleted_flag)
            else:
                stmt = delete(self._model).where(*filters)

            result = session.execute(stmt)

            if flush:
                session.flush()
            if commit:
                session.commit()

            return result.rowcount

    def count(
        self,
        filters: list[ColumnElement],
    ) -> int:
        with self.session_factory() as session:
            stmt = select(func.count()).select_from(self._model)

            if filters:
                stmt = stmt.where(*filters)

            query = session.execute(stmt)
            total_count = query.scalar()

            return total_count if total_count is not None else 0

    def close_scoped_session(self):
        with self.session_factory() as session:
            return session.close()
