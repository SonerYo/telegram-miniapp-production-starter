from fastapi import APIRouter

from app.api.v1 import meta, tasks, users

router = APIRouter(prefix="/api/v1")
router.include_router(meta.router)
router.include_router(users.router)
router.include_router(tasks.router)
