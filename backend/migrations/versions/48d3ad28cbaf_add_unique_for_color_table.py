"""add unique for color table

Revision ID: 48d3ad28cbaf
Revises: 070d484347fa
Create Date: 2026-04-10 22:18:21.973002

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = '48d3ad28cbaf'
down_revision: Union[str, Sequence[str], None] = '070d484347fa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_unique_constraint(
        "uq_colors_name",
        "colors",
        ["name"]
    )
    op.create_unique_constraint(
        "uq_colors_hex",
        "colors",
        ["hex"]
    )
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
