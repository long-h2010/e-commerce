from fastapi import FastAPI

from app.utils.class_object import singleton
from app.api.v1.routes import routers as v1_routers


@singleton
class AppCreator:
    def __init__(self):
        self.app = FastAPI()

        @self.app.get("/")
        def health_check():
            return "Welcome to the E-commerce API"

        self.app.include_router(v1_routers, prefix="/api/v1")


app_creator = AppCreator()
app = app_creator.app
