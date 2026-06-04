from contextlib import AbstractContextManager
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from typing import Callable
from uuid import UUID

from sqlalchemy import case, desc, extract, func, select
from sqlalchemy.orm import Session

from app.repositories.base_repository import BaseRepository
from app.models.order import Order
from app.core.enums.order import OrderStatus, PaymentStatus
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.product_variant import ProductVariant
from app.schemas.dashboard_schema import TopProductSchema


class OrderRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, Order)

    def overview(self, user_id: UUID | None = None):
        with self._session_factory() as session:
            stmt = select(
                func.count(Order.id)
                .filter(Order.order_status != OrderStatus.PENDING)
                .label("total_orders"),
                func.coalesce(
                    func.sum(
                        case(
                            (
                                Order.payment_status == PaymentStatus.PAID,
                                Order.total_amount,
                            )
                        )
                    ),
                    0,
                ).label("revenue"),
                func.count(
                    case((Order.order_status == OrderStatus.DELIVERED, Order.id))
                ).label("complete_count"),
                func.count(
                    case((Order.order_status == OrderStatus.CANCELLED, Order.id))
                ).label("cancelled_count"),
            )

            if user_id:
                stmt = stmt.where(Order.user_id == user_id)

            result = session.execute(stmt)

            return result.mappings().one()

    def get_total_revenue(self):
        with self._session_factory() as session:
            stmt = select(func.coalesce(func.sum(Order.total_amount), 0)).where(
                Order.payment_status == PaymentStatus.PAID
            )

            return session.execute(stmt).scalar_one()

    def get_current_month_revenue(self):
        with self._session_factory() as session:
            now = datetime.utcnow()
            start = datetime(now.year, now.month, 1)

            stmt = select(func.coalesce(func.sum(Order.total_amount), 0)).where(
                Order.payment_status == PaymentStatus.PAID, Order.created_at >= start
            )

            return session.execute(stmt).scalar_one()

    def get_previous_month_revenue(self):
        with self._session_factory() as session:
            now = datetime.utcnow()
            current_month = datetime(now.year, now.month, 1)
            previous_month = current_month - relativedelta(months=1)

            stmt = select(func.coalesce(func.sum(Order.total_amount), 0)).where(
                Order.payment_status == PaymentStatus.PAID,
                Order.created_at >= previous_month,
                Order.created_at < current_month,
            )

            return session.execute(stmt).scalar_one()

    def get_total_order_growth(self):
        now = datetime.utcnow()
        current_month = datetime(now.year, now.month, 1)
        previous_month = current_month - relativedelta(months=1)

        total = self.count([Order.order_status != OrderStatus.PENDING])
        total_in_month = self.count(
            [
                Order.order_status != OrderStatus.PENDING,
                Order.created_at >= current_month,
            ]
        )
        total_prev_month = self.count(
            [
                Order.order_status != OrderStatus.PENDING,
                Order.created_at >= previous_month,
                Order.created_at < current_month,
            ]
        )

        return {
            "total": total,
            "total_in_month": total_in_month,
            "total_prev_month": total_prev_month,
        }

    def get_monthly_revenue(self):
        current_year = datetime.utcnow().year
        with self._session_factory() as session:
            stmt = (
                select(
                    extract("month", Order.created_at).label("month"),
                    func.coalesce(
                        func.sum(Order.total_amount),
                        0,
                    ).label("revenue"),
                    func.count(Order.id).label("orders"),
                )
                .where(
                    Order.payment_status == PaymentStatus.PAID,
                    extract("year", Order.created_at) == current_year,
                )
                .group_by("month")
                .order_by("month")
            )

            result = session.execute(stmt).all()

            month_map = {
                1: "Jan",
                2: "Feb",
                3: "Mar",
                4: "Apr",
                5: "May",
                6: "Jun",
                7: "Jul",
                8: "Aug",
                9: "Sep",
                10: "Oct",
                11: "Nov",
                12: "Dec",
            }

            revenue_map = {
                int(row.month): {
                    "revenue": float(row.revenue),
                    "orders": row.orders,
                }
                for row in result
            }

            response = []

            for month in range(1, 13):
                data = revenue_map.get(
                    month,
                    {
                        "revenue": 0,
                        "orders": 0,
                    },
                )

                response.append(
                    {
                        "month": month_map[month],
                        "revenue": data["revenue"],
                        "orders": data["orders"],
                    }
                )

            return response

    def get_weekly_revenue(self):
        today = datetime.utcnow()

        start_of_week = today - timedelta(days=today.weekday())

        with self._session_factory() as session:
            stmt = (
                select(
                    extract("dow", Order.created_at).label("day"),
                    func.coalesce(
                        func.sum(Order.total_amount),
                        0,
                    ).label("revenue"),
                    func.count(Order.id).label("orders"),
                )
                .where(
                    Order.payment_status == PaymentStatus.PAID,
                    Order.created_at >= start_of_week,
                )
                .group_by("day")
                .order_by("day")
            )

            result = session.execute(stmt).all()

            day_map = {
                0: "Sun",
                1: "Mon",
                2: "Tue",
                3: "Wed",
                4: "Thu",
                5: "Fri",
                6: "Sat",
            }

            revenue_map = {
                int(row.day): {
                    "revenue": float(row.revenue),
                    "orders": row.orders,
                }
                for row in result
            }

            response = []
            order = [1, 2, 3, 4, 5, 6, 0]

            for day in order:
                data = revenue_map.get(
                    day,
                    {
                        "revenue": 0,
                        "orders": 0,
                    },
                )

                response.append(
                    {
                        "day": day_map[day],
                        "revenue": data["revenue"],
                        "orders": data["orders"],
                    }
                )

            return response
        
    def get_top_products(self, limit: int = 10):
        with self._session_factory() as session:
            statement = (
                select(
                    Product.id.label("product_id"),
                    Product.name,
                    ProductImage.url.label("thumbnail"),
                    func.sum(OrderItem.quantity).label("total_sold"),
                    func.sum(OrderItem.subtotal).label("total_revenue"),
                    func.count(OrderItem.order_id.distinct()).label("order_count"),
                )
                .select_from(Order)
                .join(OrderItem, OrderItem.order_id == Order.id)
                .join(ProductVariant, ProductVariant.id == OrderItem.variant_id)
                .join(Product, Product.id == ProductVariant.product_id)
                .outerjoin(
                    ProductImage,
                    (ProductImage.product_id == Product.id) & (ProductImage.is_thumbnail == True),
                )
                .where(Order.payment_status != PaymentStatus.PAID)
                .group_by(Product.id, Product.name, ProductImage.url)
                .order_by(desc("total_sold"))
                .limit(limit)
            )

            result = session.execute(statement)
            rows = result.mappings().all()
            return [TopProductSchema(**row) for row in rows]
