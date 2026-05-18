from enum import Enum


class UserRole(str, Enum):
    SUPER_ADMIN = "super admin"
    ADMIN = "admin"
    CUSTOMER = "customer"
