import re

from app.core.config import configs


class PasswordStrengthChecker:
    def __init__(self):
        pass

    def check(self, password: str) -> bool:
        if not configs.PASSWORD_STRENGTH_CHECKER_ENABLED:
            return True
        # Combination of alphanumeric characters, uppercase letters, lowercase letters, numbers, and symbols,
        # - min: 8
        # - max: 255
        return re.match(r"^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w\d!@#$%^&*]{8,255}$", password)
