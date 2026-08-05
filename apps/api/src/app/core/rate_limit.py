from __future__ import annotations

import asyncio
from collections import defaultdict, deque
from time import monotonic


class ProcessLocalRateLimiter:
    """Small single-process limiter; production replicas need a shared backend."""

    def __init__(self, requests_per_minute: int) -> None:
        self.requests_per_minute = requests_per_minute
        self._events: dict[str, deque[float]] = defaultdict(deque)
        self._lock = asyncio.Lock()

    async def allow(self, key: str) -> bool:
        cutoff = monotonic() - 60
        async with self._lock:
            events = self._events[key]
            while events and events[0] < cutoff:
                events.popleft()
            if len(events) >= self.requests_per_minute:
                return False
            events.append(monotonic())
            return True
