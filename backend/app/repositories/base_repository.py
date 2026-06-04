from contextlib import AbstractContextManager
from datetime import datetime, timezone
from typing import Any, Callable, List, Type, TypeVar
from uuid import UUID

from sqlalchemy import asc, delete, desc, func, or_, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Query, Session, aliased, joinedload
from sqlalchemy.sql.expression import ColumnElement
from sqlmodel import select


from app.core.config import configs
from app.core.database import BaseModel
from app.core.exceptions import DuplicatedError, NotFoundError, ValidationError
from app.utils.query_builder import dict_to_sqlalchemy_filter_options

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
        with self._session_factory() as session:
            query = self._model(**schema.model_dump())

            try:
                session.add(query)
                session.commit()
                session.refresh(query)
            except IntegrityError as e:
                raise DuplicatedError(detail=str(e.orig))

            return query

    def bulk_create(self, schemas: List[T]):
        with self._session_factory() as session:
            try:
                objs = [self._model(**schema.model_dump()) for schema in schemas]

                session.add_all(objs)
                session.commit()

                for obj in objs:
                    session.refresh(obj)

                return objs
            except IntegrityError as e:
                session.rollback()
                raise DuplicatedError(detail=str(e.orig))

    def read_by_field(
        self,
        field_name: str,
        value: Any,
        eagers: bool = False,
        raise_not_found: bool = True,
        include_del: bool = False,
        query_modifier = None
    ):
        with self._session_factory() as session:
            query = session.query(self._model)

            if eagers:
                for eager_field in eagers:
                    query = query.options(joinedload(getattr(self._model, eager_field)))

            field = getattr(self._model, field_name, None)
            if field is None:
                raise ValueError(
                    f"{field_name} is not valid field of {self._model.__name__}"
                )

            filters = [field == value]

            if not include_del and hasattr(self._model, "deleted_at"):
                filters.append(self._model.deleted_at.is_(None))

            query = query.filter(*filters)

            if query_modifier:
                query = query_modifier(session, query)

            result = query.first()

            if not result and raise_not_found:
                raise NotFoundError(
                    detail=f"{self._model.__name__} not found with {field_name}: {value}",
                    error_code="ERR_BASE_001",
                )

        return result

    def read_by_options(
        self,
        schema: T,
        eagers: list[str] = [],
        query_modifier=None,
        select_columns: List[str] | None = None,
        keyword_columns: List[str] | None = None,
        include_del: bool = False,
        **kwargs,
    ) -> dict:
        with self._session_factory() as session:
            data = schema.model_dump(exclude_none=True)

            page = data.get("page", configs.PAGE)
            limit = data.get("limit", configs.PAGE_SIZE)
            sort_str = data.get("sort", configs.SORT_BY)

            sort_fields: List[tuple[str, bool]] = []
            if sort_str:
                for field in sort_str:
                    field = field.strip()
                    if not field:
                        continue

                    if field.startswith("-"):
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

            if query_modifier:
                query = query_modifier(session, query)

            if not include_del:
                if hasattr(self._model, "deleted_at"):
                    query = query.filter(self._model.deleted_at.is_(None))

            if select_columns:
                query = query.with_entities(
                    *[
                        getattr(self._model, col)
                        for col in select_columns
                        if hasattr(self._model, col)
                    ]
                )

            child_aliases = []
            if eagers:
                for relation in eagers:
                    parts = relation.split(".")
                    
                    current_model = self._model
                    load_option = None
                    
                    for i, part in enumerate(parts):
                        relation_attr = getattr(current_model, part)
                        
                        try:
                            next_model = relation_attr.mapper.class_
                        except Exception:
                            next_model = current_model
                        
                        if load_option is None:
                            if i == len(parts) - 1:
                                child_alias = aliased(next_model)
                                child_aliases.append(child_alias)
                                load_option = joinedload(relation_attr.of_type(child_alias))
                            else:
                                load_option = joinedload(relation_attr)
                        else:
                            load_option = load_option.joinedload(relation_attr)
                        
                        current_model = next_model
                    
                    if load_option:
                        query = query.options(load_option)

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

            if limit in (0, "all", "0"):
                results = query.all()
            else:
                results = query.offset((page - 1) * limit).limit(limit).all()

            sort_display = ",".join(
                f"{'-' if is_desc else ''}{col}" for col, is_desc in sort_fields
            )

            return {
                "founds": results,
                "search_options": {
                    "page": page,
                    "limit": limit,
                    "sort": sort_display,
                    "total_count": total_count,
                },
            }

    def update(self, id: UUID, schema: T):
        with self._session_factory() as session:
            session.query(self._model).filter(self._model.id == id).update(
                schema.model_dump(exclude_none=True)
            )
            session.commit()
            return self.read_by_field("id", id, include_del=True)

    def update_attr(self, id: UUID, column: str, value: Any):
        with self._session_factory() as session:
            session.query(self._model).filter(self._model.id == id).update(
                {column: value}
            )
            session.commit()
            return self.read_by_field("id", id)

    def update_by_field(self, filter_schema: T, data_schema: T):
        with self._session_factory() as session:
            query = session.query(self._model)

            for field, value in filter_schema.model_dump(exclude_none=True).items():
                col = getattr(self._model, field)
                query = query.filter(col == value)

            update_data = {}
            for field, value in data_schema.model_dump(exclude_none=True).items():
                col = getattr(self._model, field)
                update_data[col] = value

            if not update_data:
                return None

            query.update(update_data)
            session.commit()

            return {"message": "Updated successful"}

    def delete_by_id(self, id: UUID):
        with self._session_factory() as session:
            query = session.query(self._model).filter(self._model.id == id).first()

            if not query:
                raise NotFoundError(
                    detail=f"not found id : {id}", error_code="ERR_BASE_001"
                )

            session.delete(query)
            session.commit()

            return {"message": "Deleted successful"}

    def delete_by_options(
        self,
        allow_multiple: bool = False,
        logical_deletion: bool = False,
        deleted_flag_column: str = "del_flag",
        flush: bool = False,
        commit: bool = False,
        **kwargs,
    ) -> int:
        with self._session_factory() as session:
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
        with self._session_factory() as session:
            stmt = select(func.count()).select_from(self._model)

            if filters:
                stmt = stmt.where(*filters)

            query = session.execute(stmt)
            total_count = query.scalar()

            return total_count if total_count is not None else 0

    def close_scoped_session(self):
        with self._session_factory() as session:
            return session.close()
