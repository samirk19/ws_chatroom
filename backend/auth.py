import os
from datetime import datetime, timedelta, timezone

import bcrypt
from dotenv import load_dotenv
from jose import JWTError, jwt

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
TOKEN_EXPIRY_DAYS = 7


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=TOKEN_EXPIRY_DAYS)
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None
