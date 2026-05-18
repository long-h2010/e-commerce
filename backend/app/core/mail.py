from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.core.config import configs

conf = ConnectionConfig(
    MAIL_USERNAME=configs.MAIL_USERNAME,
    MAIL_PASSWORD=configs.MAIL_PASSWORD,
    MAIL_FROM=configs.MAIL_FROM,
    MAIL_PORT=configs.MAIL_PORT,
    MAIL_SERVER=configs.MAIL_SERVER,
    MAIL_FROM_NAME=configs.MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    MAIL_DEBUG=1,
)


async def send_otp_email(email: str, otp: str):
    message = MessageSchema(
        subject="Your OTP Code",
        recipients=[email],
        body=f"Your OTP code is: <b>{otp}</b>. It will expire in 5 minutes.",
        subtype="html",
    )

    fm = FastMail(conf)
    await fm.send_message(message)
