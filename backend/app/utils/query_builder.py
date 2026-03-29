from typing import Any, Type, TypeVar

from sqlalchemy import BigInteger, ColumnElement, FromClause, String
from sqlalchemy.orm import InstrumentedAttribute, Query
from sqlalchemy.orm.util import AliasedClass
from sqlmodel import asc, cast, desc, or_

Model = TypeVar("Model")

SQLALCHEMY_QUERY_MAPPER = {
    "gt": lambda column: column.__gt__,
    "lt": lambda column: column.__lt__,
    "ge": lambda column: column.__ge__,
    "le": lambda column: column.__le__,
    "eq": lambda column: column.__eq__,
    "ne": lambda column: column.__ne__,
    "between": lambda column: column.between,
    "in": lambda column: column.in_,
    "not_in": lambda column: column.not_in,
    "is": lambda column: column.is_,
    "is_not": lambda column: column.is_not,
    "is_distinct_from": lambda column: column.is_distinct_from,
    "is_not_distinct_from": lambda column: column.is_not_distinct_from,
    "like": lambda column: column.like,
    "not_like": lambda column: column.not_like,
    "ilike": lambda column: column.ilike,
    "not_ilike": lambda column: column.not_ilike,
    "startswith": lambda column: column.startswith,
    "endswith": lambda column: column.endswith,
    "contains": lambda column: column.contains,
    "icontains": lambda column: column.icontains,
    "match": lambda column: column.match,
    "concat": lambda column: column.concat,
    "cast_icontains": lambda column: column.icontains,
}


def get_column(model: Type[Model] | AliasedClass, field_name: str) -> InstrumentedAttribute | None:
    column = getattr(model, field_name, None)
    if column is None and field_name not in [
        "keyword",
        "keyword_columns",
        "page",
        "page_size",
        "select_columns",
        "sort_columns",
        "sort_orders",
    ]:
        raise ValueError(f"Column {field_name} is not found in {model}")
    return column


def _create_or_filters(column: str, op: str, value: Any) -> list[ColumnElement | None]:
    or_filters = []
    if op == "or":
        for or_op, or_value in value.items():
            sqlalchemy_filter = SQLALCHEMY_QUERY_MAPPER.get(or_op)
            if sqlalchemy_filter is not None:
                if or_op == "cast_icontains" or isinstance(column.type, BigInteger):
                    or_filters.append(cast(column, String).ilike(or_value))
                else:
                    or_filters.append(sqlalchemy_filter(column)(or_value))
    elif op == "mor":
        for or_op, or_values in value.items():
            for or_value in or_values:
                sqlalchemy_filter = SQLALCHEMY_QUERY_MAPPER.get(or_op)
                if sqlalchemy_filter is not None:
                    or_filters.append(sqlalchemy_filter(column)(or_value))
    return or_filters


def _create_and_filters(column: str, op: str, value: Any) -> list[ColumnElement | None]:
    and_filters = []
    sqlalchemy_filter = SQLALCHEMY_QUERY_MAPPER.get(op)
    if sqlalchemy_filter is not None:
        if op == "cast_icontains":
            and_filters.append(cast(column, String).ilike(value))
        else:
            if op == "is" and not value:
                and_filters.append(column.is_(value))
            else:
                and_filters.append(
                    sqlalchemy_filter(column)(value) if op != "between" else sqlalchemy_filter(column)(*value)
                )
    return and_filters


def dict_to_sqlalchemy_filter_options(
    model: Type[Model] | AliasedClass, child_aliases: list[AliasedClass | FromClause] | None = None, **kwargs
) -> list[ColumnElement]:
    filters = []

    def process_filters(target_column: str, target_op: str, target_value: Any):
        # OR / MOR
        or_filters = _create_or_filters(target_column, target_op, target_value)
        if or_filters:
            filters.append(or_(*or_filters))

        # AND
        and_filters = _create_and_filters(target_column, target_op, target_value)
        if and_filters:
            filters.append(*and_filters)

    for key, value in kwargs.items():
        if "__" in key:
            field_name, op = key.rsplit("__", 1)

            # OR GROUP
            if field_name == "__gor" and op == "":
                or_filters = []
                for field_or in value:
                    for _key, _value in field_or.items():
                        if _value is None:
                            continue
                        _field_name, _op = _key.rsplit("__", 1)
                        _column = resolve_property_column(
                            _field_name,
                            get_column(model, _field_name),
                            getattr(model, "property_sorts", []),
                            child_aliases,
                        )
                        if _column:
                            sqlalchemy_filter = SQLALCHEMY_QUERY_MAPPER.get(_op)
                            if sqlalchemy_filter is not None:
                                if _op == "cast_icontains" or isinstance(_column.type, BigInteger):
                                    or_filters.append(cast(_column, String).ilike(_value))
                                else:
                                    or_filters.append(sqlalchemy_filter(_column)(_value))
                if or_filters:
                    filters.append(or_(*or_filters))
            else:
                column = resolve_property_column(
                    field_name, get_column(model, field_name), getattr(model, "property_sorts", []), child_aliases
                )
                if column and value is not None:
                    process_filters(column, op, value)
                if column and value is None and op in ["is", "is_not", "is_distinct_from", "is_not_distinct_from"]:
                    process_filters(column, op, value)
        else:
            # NON FILTER
            column = resolve_property_column(
                key, get_column(model, key), getattr(model, "property_sorts", []), child_aliases
            )
            if column:
                filters.append(column == value)

    return filters


def apply_sorting(
    model: Type[Model] | AliasedClass,
    stmt: Query,
    sort_columns: str | list[str] | None = None,
    sort_orders: str | list[str] | None = None,
    child_aliases: list | None = None,
) -> Query:
    if sort_orders and not sort_columns:
        raise ValueError("Sort orders provided without corresponding sort columns.")

    if sort_columns:
        if not isinstance(sort_columns, list):
            sort_columns = [sort_columns]

        if sort_orders:
            if not isinstance(sort_orders, list):
                sort_orders = [sort_orders] * len(sort_columns)

            if len(sort_columns) != len(sort_orders):
                raise ValueError("The length of sort_columns and sort_orders must match.")

            for order in sort_orders:
                if order not in ["asc", "desc"]:
                    raise ValueError(f"Select sort operator {order} is not supported, only supports `asc`, `desc`")

        validated_sort_orders = ["asc"] * len(sort_columns) if not sort_orders else sort_orders
        property_sorts = getattr(model, "property_sorts", [])

        for idx, column_name in enumerate(sort_columns):
            column = get_column(model, column_name)
            # Resolve the column if it's a property
            column = resolve_property_column(column_name, column, property_sorts, child_aliases)
            order = validated_sort_orders[idx]
            stmt = stmt.order_by(asc(column) if order == "asc" else desc(column))

    return stmt


def find_alias_for_relation(table_name, column_name, aliases):
    for alias in aliases:
        if alias.__tablename__ == table_name:
            column_attr = getattr(alias, column_name, None) or getattr(
                alias, column_name.replace(table_name + "_", ""), None
            )
            if isinstance(column_attr, property):
                related_table = ""
                for alias in aliases:
                    if alias.__tablename__ in column_name:
                        related_table = alias.__tablename__
                        break
                column_key = column_name.replace(related_table + "_", "")
                for alias in aliases:
                    if alias.__tablename__ == related_table:
                        return getattr(alias, column_key, None)
            return column_attr
    return next((getattr(alias, column_name, None) for alias in aliases if alias.__tablename__ == table_name), None)


def resolve_property_column(column_name, column, property_sorts, child_aliases):
    if isinstance(column, property):
        # Search for the matching property and resolve its alias
        return next(
            (
                find_alias_for_relation(relation_table, column_name, child_aliases)
                for relation_table, property_name in property_sorts
                if property_name == column_name
            ),
            column,
        )
    return column
