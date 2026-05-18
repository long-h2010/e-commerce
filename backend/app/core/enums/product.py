from enum import Enum


class ProductStatus(str, Enum):
    ACTIVE = "active"
    DRAFT = "draft"
    OUTSTOCK = "out of stock"
    

class ProductVisibility(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"
