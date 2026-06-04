from app.repositories.user_repository import UserRepository
from app.services.base_service import BaseService
from app.schemas.user_schema import UserResponse
from app.schemas.base_schema import FindResult, OverviewGrowthResponse


class UserService(BaseService):
    def __init__(self, repository: UserRepository):
        self._repository = repository
        super().__init__(repository)

    def get_list(self, schema, eagers = ["orders"]):
        result = self._repository.read_by_options(schema, eagers)

        users = []
        for u in result["founds"]:
            users.append(UserResponse(**u.model_dump(), orders=u.orders))
            
        return FindResult(
            founds=users,
            search_options=result["search_options"]
        )
    
    def get_customer_overview(self):
        result = self._repository.get_total_user_growth()
        growth = self.calculate_growth(result["total_in_month"], result["total_prev_month"])
        return OverviewGrowthResponse(total=result["total"], growth=growth)
