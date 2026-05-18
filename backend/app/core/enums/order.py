from enum import Enum


class ShippingMethod(str, Enum):
    STANDARD = "standard"
    EXPRESS = "express"


class PaymentMethod(str, Enum):
    COD = "cod"
    BANKING = "banking"
    MOMO = "momo"


class PaymentStatus(str, Enum):
    UNPAID = "unpaid"
    PAID = "paid"
    REFUNDED = "refunded"


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPING = "shipping"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
