from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class RoomCreate(BaseModel):
    name: str


class RoomOut(BaseModel):
    id: str
    name: str
    created_by: str
    created_at: datetime

    model_config = {"from_attributes": True}


class MessageOut(BaseModel):
    id: str
    room_id: str
    user_id: str
    username: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class WSMessage(BaseModel):
    content: str
    room_id: str
    user_id: str
    username: str
    created_at: str
