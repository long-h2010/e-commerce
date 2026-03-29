from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.v1.routes import routers as v1_routers
from app.core.config import configs
from app.utils.class_object import singleton
from app.core.container import Container


@singleton
class AppCreator:
    def __init__(self):
        self.app = FastAPI(
            title=configs.PROJECT_NAME,
            openapi_url=f"{configs.API}/openapi.json",
            version="0.0.1",
            docs_url="/docs",
        )

        self.container = Container()
        self.db = self.container.db()

        if configs.BACKEND_CORS_ORIGINS:
            self.app.add_middleware(
                CORSMiddleware,
                allow_origins=[str(origin) for origin in configs.BACKEND_CORS_ORIGINS],
                allow_credentials=True,
                allow_methods=["*"],
                allow_headers=["*"],
            )

        @self.app.get("/")
        async def health_check():
            check_db = ""
            try:
                with self.db.session() as session:
                    session.execute(text("SELECT 1"))
                check_db = "DB connected!"
            except Exception as e:
                check_db = "Error when connect DB"
                print("DB connection error:", e)

            return check_db + " - Welcome to the E-commerce API"

        self.app.include_router(v1_routers, prefix="/api")


app_creator = AppCreator()
app = app_creator.app
