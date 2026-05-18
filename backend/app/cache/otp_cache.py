from app.core.redis import client

OTP_PREFIX = "otp:"
OTP_EXPIRE = 300


async def set_otp(email: str, otp: str):
    await client.setex(f"{OTP_PREFIX}{email}", OTP_EXPIRE, otp)


async def get_otp(email: str) -> str | None:
    return await client.get(f"{OTP_PREFIX}{email}")


async def delete_otp(email: str):
    await client.delete(f"{OTP_PREFIX}{email}")
