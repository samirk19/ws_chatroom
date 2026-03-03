from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_current_user, get_db
from models import Room, User
from schemas import RoomCreate, RoomOut

router = APIRouter(prefix="/api", tags=["rooms"])


@router.get("/rooms", response_model=list[RoomOut])
def list_rooms(db: Session = Depends(get_db)):
    return db.query(Room).order_by(Room.created_at).all()


@router.post("/rooms", response_model=RoomOut)
def create_room(
    body: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if db.query(Room).filter(Room.name == body.name).first():
        raise HTTPException(status_code=400, detail="Room name already exists")

    room = Room(name=body.name, created_by=current_user.id)
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


@router.delete("/rooms/{room_id}")
def delete_room(
    room_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Only the room creator can delete this room")

    db.delete(room)
    db.commit()
    return {"detail": "Room deleted"}
