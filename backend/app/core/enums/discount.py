from enum import Enum


class DiscountType(str, Enum):
    PERCENTAGE: str = "percentage"
    FIXED: str = "fixed"


class DiscountApplyType(str, Enum):
    PRODUCT: str = "product"
    ORDER: str = "order"
    SHIPPING: str = "shipping"


class DiscountStatus(str, Enum):
    ACTIVE: str = "active"
    SCHEDULED: str = "scheduled"
    PAUSED: str = "paused"
    ENDED: str = "ended"


class DiscountTargetType(str, Enum):
    CATEGORY: str = "category"
    PRODUCT: str = "product"
