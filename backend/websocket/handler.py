from datetime import datetime, timezone

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from auth import decode_token
from database import SessionLocal
from models import Message, User
from websocket.manager import manager

router = APIRouter()


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, token: str = ""):
    user_id = decode_token(token)
    if not user_id:
        await websocket.close(code=4001, reason="Invalid token")
        return

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            await websocket.close(code=4001, reason="User not found")
            return
        username = user.username
    finally:
        db.close()

    await manager.connect(room_id, websocket)

    try:
        while True:
            data = await websocket.receive_json()
            content = data.get("content", "").strip()
            if not content:
                continue

            now = datetime.now(timezone.utc)

            db = SessionLocal()
            try:
                msg = Message(
                    room_id=room_id,
                    user_id=user_id,
                    content=content,
                    created_at=now,
                )
                db.add(msg)
                db.commit()
                db.refresh(msg)
                msg_id = msg.id
            finally:
                db.close()

            await manager.broadcast(room_id, {
                "id": msg_id,
                "room_id": room_id,
                "user_id": user_id,
                "username": username,
                "content": content,
                "created_at": now.isoformat(),
            })
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
    except Exception:
        manager.disconnect(room_id, websocket)
