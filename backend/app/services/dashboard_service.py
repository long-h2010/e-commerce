from app.services.order_service import OrderService
from app.services.product_service import ProductService
from app.services.user_service import UserService
from app.schemas.dashboard_schema import OverviewDashboard
from app.services.discount_service import DiscountService
from app.services.category_service import CategoryService
from app.core.enums.order import PaymentStatus
from app.schemas.order_schema import FindOrder


class DashboardService:
    def __init__(
        self,
        product_service: ProductService,
        order_service: OrderService,
        user_service: UserService,
        discount_service: DiscountService,
        category_service: CategoryService,
    ):
        self._product_service = product_service
        self._order_service = order_service
        self._user_service = user_service
        self._discount_service = discount_service
        self._category_service = category_service

    def get_overview(self):
        revenue_overview = self._order_service.get_revenue_overview()
        order_overview = self._order_service.get_order_overview()
        customer_overview = self._user_service.get_customer_overview()
        discount_active = self._discount_service.get_total_discount_active()

        monthly_revenue = self._order_service.get_monthly_revenue()
        weekly_revenue = self._order_service.get_weekly_revenue()

        product_count = self._category_service.count_product_in_roots_category()

        return OverviewDashboard(
            order_overview=order_overview,
            revenue_overview=revenue_overview,
            customer_overview=customer_overview,
            total_discount_active=discount_active,
            monthly_revenue=monthly_revenue,
            weekly_revenue=weekly_revenue,
            product_count=product_count,
        )

    def get_top_products(self):
        top_products = self._order_service.get_top_products()
        return top_products
