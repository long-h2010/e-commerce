from enum import Enum


class CategoryLevel(str, Enum):
    ROOT: str = "root"
    CHILD: str = "child"
    LEAF: str = "leaf"
