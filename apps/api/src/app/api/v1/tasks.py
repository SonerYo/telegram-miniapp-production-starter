from __future__ import annotations

from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Query, Response, status

from app.api.dependencies import CurrentUser, MutationRateLimit
from app.api.errors import ApiError
from app.db.session import SessionDependency
from app.repositories import tasks as task_repository
from app.schemas.task import TaskCreate, TaskListResponse, TaskResponse, TaskUpdate

router = APIRouter(tags=["tasks"])


@router.get("/tasks", response_model=TaskListResponse)
async def get_tasks(
    session: SessionDependency,
    current: CurrentUser,
    status_filter: Literal["all", "open", "done"] = Query(default="all", alias="status"),
) -> TaskListResponse:
    completion = None if status_filter == "all" else status_filter == "done"
    items, total = await task_repository.list_tasks(session, current.user.id, completion)
    return TaskListResponse(
        items=[TaskResponse.model_validate(item) for item in items], total=total
    )


@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def post_task(
    payload: TaskCreate,
    session: SessionDependency,
    current: CurrentUser,
    _rate_limit: MutationRateLimit,
) -> TaskResponse:
    task = await task_repository.create_task(session, current.user.id, payload.text)
    return TaskResponse.model_validate(task)


@router.patch("/tasks/{task_id}", response_model=TaskResponse)
async def patch_task(
    task_id: UUID,
    payload: TaskUpdate,
    session: SessionDependency,
    current: CurrentUser,
    _rate_limit: MutationRateLimit,
) -> TaskResponse:
    task = await task_repository.get_owned_task(session, task_id, current.user.id)
    if task is None:
        raise ApiError(404, "task_not_found", "Task not found.")
    updated = await task_repository.update_task(
        session,
        task,
        text=payload.text,
        is_completed=payload.is_completed,
    )
    return TaskResponse.model_validate(updated)


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_task(
    task_id: UUID,
    session: SessionDependency,
    current: CurrentUser,
    _rate_limit: MutationRateLimit,
) -> Response:
    task = await task_repository.get_owned_task(session, task_id, current.user.id)
    if task is None:
        raise ApiError(404, "task_not_found", "Task not found.")
    await task_repository.delete_task(session, task)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
