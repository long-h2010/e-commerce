import os

from typing import List

from dotenv import load_dotenv
from pydantic import PostgresDsn, computed_field
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings

load_dotenv()

ENV: str = ""


class Configs(BaseSettings):
    # base
    ENV: str = os.getenv("ENV", "dev")
    API: str = "/api"
    API_V1_STR: str = "/api/v1"
    API_V2_STR: str = "/api/v2"
    PROJECT_NAME: str = "e-commerce-api"
    ENV_DATABASE_MAPPER: dict = {
        "prod": "e-commerce",
        "stage": "stage-e-commerce",
        "dev": "dev-e-commerce",
        "test": "test-e-commerce",
    }
    DB_ENGINE_MAPPER: dict = {
        "postgresql": "postgresql",
        "mysql": "mysql+pymysql",
    }

    PROJECT_ROOT: str = os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    )

    # date
    DATETIME_FORMAT: str = "%Y-%m-%dT%H:%M:%S"
    DATE_FORMAT: str = "%Y-%m-%d"

    # auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 15*24*60

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # database
    DB: str = os.getenv("DB", "postgresql")
    DB_USER: str = os.getenv("DB_USER")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD")
    DB_HOST: str = os.getenv("DB_HOST")
    DB_PORT: int = os.getenv("DB_PORT", 5432)
    DB_ENGINE: str = DB_ENGINE_MAPPER.get(DB, "postgresql+psycopg2")

    @computed_field
    @property
    def DB_URI(self) -> PostgresDsn:
        return str(
            MultiHostUrl.build(
                scheme="postgresql+psycopg2",
                username=self.DB_USER,
                password=self.DB_PASSWORD,
                host=self.DB_HOST,
                port=self.DB_PORT,
                path=self.ENV_DATABASE_MAPPER[self.ENV],
            )
        )

    # find query
    PAGE: int = 1
    PAGE_SIZE: int = 20
    SORT_BY: str = "updated_at"

    class Config:
        case_sensitive = True


class TestConfigs(Configs):
    ENV: str = "test"


configs = Configs()

if ENV == "prod" or ENV == "stage":
    pass
elif ENV == "test":
    setting = TestConfigs()
