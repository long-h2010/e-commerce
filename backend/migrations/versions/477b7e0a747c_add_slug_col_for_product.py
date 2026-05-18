"""add slug col for product

Revision ID: 477b7e0a747c
Revises: e426ce0f15b0
Create Date: 2026-04-13 22:47:37.255247

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = '477b7e0a747c'
down_revision: Union[str, Sequence[str], None] = 'e426ce0f15b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('products', sa.Column('slug', sqlmodel.sql.sqltypes.AutoString(), nullable=False))
    op.create_unique_constraint(None, 'products', ['slug'])
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
