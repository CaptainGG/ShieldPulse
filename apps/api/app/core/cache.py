from __future__ import annotations

import json
from typing import Any

from redis import Redis
from redis.exceptions import RedisError

from app.core.config import get_settings


class CacheClient:
    def __init__(self) -> None:
        self._store: dict[str, str] = {}
        self._redis: Redis | None = None

        try:
            self._redis = Redis.from_url(get_settings().redis_url, decode_responses=True)
            self._redis.ping()
        except RedisError:
            self._redis = None

    def get_json(self, key: str) -> Any | None:
        if self._redis is not None:
            payload = self._redis.get(key)
            return json.loads(payload) if payload else None
        payload = self._store.get(key)
        return json.loads(payload) if payload else None

    def set_json(self, key: str, value: Any, ttl_seconds: int = 3600) -> None:
        payload = json.dumps(value, default=str)
        if self._redis is not None:
            self._redis.set(key, payload, ex=ttl_seconds)
            return
        self._store[key] = payload

    def delete(self, key: str) -> None:
        if self._redis is not None:
            self._redis.delete(key)
            return
        self._store.pop(key, None)


cache_client = CacheClient()
