from contextlib import AbstractContextManager, contextmanager
from typing import Any, Generator

import inflection
from sqlalchemy import create_engine, orm
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import Session, as_declarative


@as_declarative()
class BaseModel:
    id: Any
    __name__: str

    @declared_attr
    def __tablename__(cls) -> str:
        return inflection.pluralize(inflection.underscore(cls.__name__))


class Database:
    def __init__(self, db_url: str) -> None:
        self._engine = create_engine(db_url, echo=False)
        self._session_factory = orm.scoped_session(
            orm.sessionmaker(autocommit=False, autoflush=False, bind=self._engine)
        )

    def create_database(self) -> None:
        BaseModel.metadata.create_all(self._engine)

    @contextmanager
    def session(self) -> Generator[Any, Any, AbstractContextManager[Session]]:
        session: Session = self._session_factory()
        try:
            yield session
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()
