from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import TIMESTAMP, text
from sqlmodel import Field, SQLModel


class BaseModel(SQLModel):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(
        sa_type=TIMESTAMP(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP")},
        nullable=False
    )
    updated_at: datetime = Field(
        sa_type=TIMESTAMP(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": text("CURRENT_TIMESTAMP")},
    )
    deleted_at: Optional[datetime] = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True),
    )
