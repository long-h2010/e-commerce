from dependency_injector import containers, providers

from app.core.config import configs
from app.core.database import Database
from app.helpers.password_checker import PasswordStrengthChecker
from app.repositories.category_repository import CategoryRepository
from app.repositories.color_repository import ColorRepository
from app.repositories.user_repository import UserRepository
from app.repositories.product_repository import ProductRepository
from app.repositories.product_image_repository import ProductImageRepository
from app.repositories.product_variant_repository import ProductVariantRepository
from app.repositories.review_repository import ReviewRepository
from app.repositories.discount_repository import DiscountRepository
from app.repositories.discount_target_repository import DiscountTargetRepository
from app.repositories.cart_repository import CartRepository
from app.repositories.cart_item_repository import CartItemRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.order_item_repository import OrderItemRepository
from app.services.auth_service import AuthService
from app.services.category_service import CategoryService
from app.services.color_service import ColorService
from app.services.user_service import UserService
from app.services.product_service import ProductService
from app.services.product_image_service import ProductImageService
from app.services.cloudinary_service import CloudinaryService
from app.services.product_variant_service import ProductVariantService
from app.services.review_service import ReviewService
from app.services.discount_service import DiscountService
from app.services.discount_target_service import DiscountTargetService
from app.services.cart_service import CartService
from app.services.cart_item_service import CartItemService
from app.services.order_service import OrderService
from app.services.order_item_service import OrderItemService
from app.services.dashboard_service import DashboardService

endpoint_path = "app.api.v1.endpoints."


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=[
            endpoint_path + "auth",
            endpoint_path + "users",
            endpoint_path + "colors",
            endpoint_path + "categories",
            endpoint_path + "products",
            endpoint_path + "variants",
            endpoint_path + "reviews",
            endpoint_path + "discounts",
            endpoint_path + "carts",
            endpoint_path + "orders",
            endpoint_path + "dashboard",
        ]
    )

    db = providers.Singleton(Database, db_url=configs.DB_URI)

    password_checker = providers.Singleton(PasswordStrengthChecker)

    user_repository = providers.Factory(
        UserRepository, session_factory=db.provided.session
    )
    color_repository = providers.Factory(
        ColorRepository, session_factory=db.provided.session
    )
    category_repository = providers.Factory(
        CategoryRepository, session_factory=db.provided.session
    )
    product_repository = providers.Factory(
        ProductRepository, session_factory=db.provided.session
    )
    product_image_repository = providers.Factory(
        ProductImageRepository, session_factory=db.provided.session
    )
    product_variant_repository = providers.Factory(
        ProductVariantRepository, session_factory=db.provided.session
    )
    review_repository = providers.Factory(
        ReviewRepository, session_factory=db.provided.session
    )
    discount_repository = providers.Factory(
        DiscountRepository, session_factory=db.provided.session
    )
    discount_target_repository = providers.Factory(
        DiscountTargetRepository, session_factory=db.provided.session
    )
    cart_repository = providers.Factory(
        CartRepository, session_factory=db.provided.session
    )
    cart_item_repository = providers.Factory(
        CartItemRepository, session_factory=db.provided.session
    )
    order_repository = providers.Factory(
        OrderRepository, session_factory=db.provided.session
    )
    order_item_repository = providers.Factory(
        OrderItemRepository, session_factory=db.provided.session
    )

    auth_service = providers.Factory(AuthService, repository=user_repository)
    user_service = providers.Factory(UserService, repository=user_repository)
    category_service = providers.Factory(
        CategoryService, repository=category_repository
    )
    color_service = providers.Factory(ColorService, repository=color_repository)
    cloud_service = providers.Factory(CloudinaryService)
    product_image_service = providers.Factory(
        ProductImageService,
        repository=product_image_repository,
        cloud_service=cloud_service,
    )
    product_variant_service = providers.Factory(
        ProductVariantService, repository=product_variant_repository
    )
    review_service = providers.Factory(ReviewService, repository=review_repository)
    discount_target_service = providers.Factory(
        DiscountTargetService, repository=discount_target_repository
    )
    discount_service = providers.Factory(
        DiscountService,
        repository=discount_repository,
        target_service=discount_target_service,
        category_service=category_service,
    )
    product_service = providers.Factory(
        ProductService,
        repository=product_repository,
        image_service=product_image_service,
        category_service=category_service,
        discount_service=discount_service,
    )
    cart_item_service = providers.Factory(
        CartItemService, repository=cart_item_repository
    )
    cart_service = providers.Factory(
        CartService,
        repository=cart_repository,
        item_service=cart_item_service,
        discount_service=discount_service,
    )
    order_item_service = providers.Factory(
        OrderItemService, repository=order_item_repository
    )
    order_service = providers.Factory(
        OrderService,
        repository=order_repository,
        item_service=order_item_service,
        variant_service=product_variant_service,
        discount_service=discount_service,
        cart_service=cart_service,
    )
    dashboard_service = providers.Factory(
        DashboardService,
        product_service=product_service,
        order_service=order_service,
        user_service=user_service,
        discount_service=discount_service,
        category_service=category_service,
    )
