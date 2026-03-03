import json

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, set[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        self.rooms[room_id].add(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.rooms:
            self.rooms[room_id].discard(websocket)
            if not self.rooms[room_id]:
                del self.rooms[room_id]

    async def broadcast(self, room_id: str, message: dict):
        if room_id not in self.rooms:
            return
        payload = json.dumps(message, default=str)
        dead: list[WebSocket] = []
        for ws in self.rooms[room_id]:
            try:
                await ws.send_text(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.rooms[room_id].discard(ws)


manager = ConnectionManager()
