from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task


async def list_tasks(
    session: AsyncSession, owner_id: UUID, completion: bool | None
) -> tuple[list[Task], int]:
    filters = [Task.owner_id == owner_id]
    if completion is not None:
        filters.append(Task.is_completed.is_(completion))
    statement = select(Task).where(*filters).order_by(Task.created_at.desc()).limit(100)
    count_statement = select(func.count(Task.id)).where(*filters)
    items = list((await session.scalars(statement)).all())
    total = int((await session.scalar(count_statement)) or 0)
    return items, total


async def get_owned_task(session: AsyncSession, task_id: UUID, owner_id: UUID) -> Task | None:
    return await session.scalar(select(Task).where(Task.id == task_id, Task.owner_id == owner_id))


async def create_task(session: AsyncSession, owner_id: UUID, text: str) -> Task:
    task = Task(owner_id=owner_id, text=text.strip())
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def update_task(
    session: AsyncSession,
    task: Task,
    *,
    text: str | None,
    is_completed: bool | None,
) -> Task:
    if text is not None:
        task.text = text.strip()
    if is_completed is not None and is_completed != task.is_completed:
        task.is_completed = is_completed
        task.completed_at = datetime.now(UTC) if is_completed else None
    task.updated_at = datetime.now(UTC)
    await session.commit()
    await session.refresh(task)
    return task


async def delete_task(session: AsyncSession, task: Task) -> None:
    await session.delete(task)
    await session.commit()


async def delete_all_owned_tasks(session: AsyncSession, owner_id: UUID) -> None:
    tasks, _ = await list_tasks(session, owner_id, None)
    for task in tasks:
        await session.delete(task)
    await session.commit()
