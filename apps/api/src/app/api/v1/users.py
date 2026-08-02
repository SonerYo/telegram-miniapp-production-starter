from fastapi import APIRouter

from app.api.dependencies import CurrentUser
from app.schemas.user import UserResponse

router = APIRouter(tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_me(current: CurrentUser) -> UserResponse:
    response = UserResponse.model_validate(current.user)
    return response.model_copy(update={"authentication_mode": current.mode})
