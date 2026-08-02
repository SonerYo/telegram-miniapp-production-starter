from fastapi import APIRouter, Request

from app.schemas.common import MetaResponse

router = APIRouter(tags=["meta"])


@router.get("/meta", response_model=MetaResponse)
async def get_meta(request: Request) -> MetaResponse:
    settings = request.app.state.settings
    return MetaResponse(
        name="telegram-miniapp-production-starter",
        version=settings.app_version,
        environment=settings.app_env.value,
        mock_auth_enabled=settings.dev_mock_auth and not settings.is_production,
    )
