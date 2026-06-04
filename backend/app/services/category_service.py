from typing import Any, Dict, List
from uuid import UUID

from fastapi import HTTPException, status

from app.repositories.category_repository import CategoryRepository
from app.services.base_service import BaseService
from app.core.enums.category import CategoryLevel
from app.schemas.category_chema import (
    BaseCategory,
    FindCategory,
    ProductCount,
    UpdateCategory,
)

LEVEL_ORDER = {
    CategoryLevel.ROOT: 0,
    CategoryLevel.CHILD: 1,
    CategoryLevel.LEAF: 2,
}


class CategoryService(BaseService):
    def __init__(self, repository: CategoryRepository):
        self._repository = repository
        super().__init__(repository)

    def get_list(self, schema: Any):
        return self._repository.get_categories_with_product_count(schema)

    def create(self, schema: BaseCategory):
        check_category = self._repository.read_by_field(
            "parent_id", schema.parent_id, raise_not_found=False
        )
        if check_category and schema.category == check_category.category:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Category name already exists in this parent",
            )

        if schema.parent_id:
            parent_level = self._repository.get_category_level(schema.parent_id)
            parent_level_index = LEVEL_ORDER[parent_level]

            if parent_level_index >= 2:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot create child for LEAF category",
                )

            schema.level = list(LEVEL_ORDER.keys())[parent_level_index + 1]
        else:
            schema.level = CategoryLevel.ROOT

        return self._repository.create(schema)

    def update(self, id, schema: UpdateCategory):
        check_category = self._repository.read_by_field("parent_id", schema.parent_id)
        if schema.category == check_category.category:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Category name already exists in this parent",
            )

        if schema.parent_id:
            parent_level = self._repository.get_category_level(schema.parent_id)
            parent_level_index = LEVEL_ORDER[parent_level]

            if parent_level_index >= 2:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot create child for LEAF category",
                )

            schema.level = list(LEVEL_ORDER.keys())[parent_level_index + 1]
        else:
            schema.level = CategoryLevel.ROOT

        return self._repository.update(id, schema)

    def get_list_parent(self, category):
        category_with_parent = self.get_by_id(category.id, eagers=["parent"])

        if not category_with_parent.parent:
            return [BaseCategory.model_validate(category_with_parent)]

        return self.get_list_parent(category_with_parent.parent) + [
            BaseCategory.model_validate(category)
        ]

    def get_list_leaf_id(self, category_id: UUID) -> List[UUID]:
        category_with_child = self.get_by_id(category_id, eagers=["children"])

        children = []
        if category_with_child.level == CategoryLevel.LEAF:
            return [category_id]
        else:
            for child in category_with_child.children:
                if child.level == CategoryLevel.LEAF:
                    children.append(child.id)
                else:
                    children += self.get_list_leaf_id(child.id)

        return children

    def _load_all_descendants(self, root_ids: List[UUID]) -> List:
        all_categories = []
        visited_ids: set[UUID] = set()
        current_ids = list(root_ids)

        roots = self._repository.read_by_options(
            schema=FindCategory(id__in=current_ids, limit=0),
        )["founds"]

        for cat in roots:
            if cat.id not in visited_ids:
                visited_ids.add(cat.id)
                all_categories.append(cat)

        while current_ids:
            non_leaf_ids = [
                cat.id
                for cat in all_categories
                if cat.id in current_ids and cat.level != CategoryLevel.LEAF
            ]

            if not non_leaf_ids:
                break

            children = self._repository.read_by_options(
                schema=FindCategory(parent_id__in=non_leaf_ids, limit=0)
            )["founds"]

            if not children:
                break

            current_ids = []
            for cat in children:
                if cat.id not in visited_ids:
                    visited_ids.add(cat.id)
                    all_categories.append(cat)
                    current_ids.append(cat.id)

        return all_categories

    def get_batch_leaf_ids(self, category_ids: List[UUID]):
        all_categories = self._load_all_descendants(category_ids)

        category_map: Dict[UUID, Any] = {cat.id: cat for cat in all_categories}
        children_map: Dict[UUID, List] = {}
        for cat in all_categories:
            if cat.parent_id is not None:
                children_map.setdefault(cat.parent_id, []).append(cat)

        def collect_leaves(cat_id: UUID) -> List[UUID]:
            cat = category_map.get(cat_id)
            if cat is None:
                return []

            if cat.level == CategoryLevel.LEAF:
                return [cat_id]

            return [
                leaf
                for child in children_map.get(cat_id, [])
                for leaf in collect_leaves(child.id)
            ]

        return {cat_id: collect_leaves(cat_id) for cat_id in category_ids}

    def count_product_in_roots_category(self):
        count = []
        result = self._repository.get_categories_with_product_count()

        for r in result["founds"]:
            if r["level"] == CategoryLevel.ROOT:
                count.append(
                    ProductCount(
                        category=r["category"], product_count=r["product_count"]
                    )
                )

        return count
