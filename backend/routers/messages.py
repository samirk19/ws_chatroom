from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from dependencies import get_db
from models import Message
from schemas import MessageOut

router = APIRouter(prefix="/api", tags=["messages"])


@router.get("/rooms/{room_id}/messages", response_model=list[MessageOut])
def get_messages(room_id: str, db: Session = Depends(get_db)):
    rows = (
        db.query(Message)
        .filter(Message.room_id == room_id)
        .order_by(Message.created_at.desc())
        .limit(50)
        .all()
    )
    rows.reverse()

    return [
        MessageOut(
            id=msg.id,
            room_id=msg.room_id,
            user_id=msg.user_id,
            username=msg.user.username,
            content=msg.content,
            created_at=msg.created_at,
        )
        for msg in rows
    ]
