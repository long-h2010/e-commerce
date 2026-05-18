import redis.asyncio as redis
from app.core.config import configs

client = redis.from_url(configs.REDIS_URL, decode_responses=True)
