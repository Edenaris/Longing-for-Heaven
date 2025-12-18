"""Add order number

Revision ID: 2ecd3c1c314e
Revises: 061eed8a8a3f
Create Date: 2025-07-25 20:08:39.102330

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2ecd3c1c314e'
down_revision: Union[str, None] = '061eed8a8a3f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Создаём sequence ПЕРЕД добавлением колонки
    op.execute("CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1")
    
    # Теперь добавляем колонку
    op.add_column('orders', sa.Column('number', sa.Integer(), 
        server_default=sa.text("nextval('order_number_seq')"), nullable=False))


def downgrade() -> None:
    """Downgrade schema."""
    # Удаляем колонку
    op.drop_column('orders', 'number')
    
    # Удаляем sequence
    op.execute("DROP SEQUENCE IF EXISTS order_number_seq")