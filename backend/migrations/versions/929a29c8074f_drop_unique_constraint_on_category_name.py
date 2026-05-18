"""drop unique constraint on category name

Revision ID: 929a29c8074f
Revises: ca03972d9918
Create Date: 2026-04-14 22:06:20.073531

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = '929a29c8074f'
down_revision: Union[str, Sequence[str], None] = 'ca03972d9918'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint("categories_category_key", "categories", type_="unique")
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("uq_category_parent", "categories", type_="unique")
    op.create_unique_constraint(
        "categories_category_key",
        "categories",
        ["category"]
    )
    pass
