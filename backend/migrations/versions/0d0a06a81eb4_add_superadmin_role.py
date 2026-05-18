"""add superadmin role

Revision ID: 0d0a06a81eb4
Revises: d41eef56edc4
Create Date: 2026-04-10 13:56:02.433113

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = '0d0a06a81eb4'
down_revision: Union[str, Sequence[str], None] = 'd41eef56edc4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TYPE userrole ADD VALUE 'SUPER_ADMIN'")


def downgrade() -> None:
    """Downgrade schema."""
    pass
