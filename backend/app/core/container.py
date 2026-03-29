from dependency_injector import containers, providers

from app.core.config import configs
from app.core.database import Database
from app.helpers.password_checker import PasswordStrengthChecker
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService

endpoint_path = "app.api.v1.endpoints."


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(modules=[
        endpoint_path + "auth",
        endpoint_path + "users"
    ])

    db = providers.Singleton(Database, db_url=configs.DB_URI)

    password_checker = providers.Singleton(PasswordStrengthChecker)

    user_repository = providers.Factory(UserRepository, session_factory=db.provided.session)

    auth_service = providers.Factory(AuthService, repository=user_repository)
    user_service = providers.Factory(AuthService, repository=user_repository)
