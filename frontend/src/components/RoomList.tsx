"use client";

import { useAuth } from "@/context/AuthContext";
import { Room } from "@/lib/types";
import * as api from "@/lib/api";

interface Props {
  rooms: Room[];
  activeRoomId: string | null;
  onRoomSelect: (room: Room) => void;
  onRoomsChange: () => void;
}

export default function RoomList({
  rooms,
  activeRoomId,
  onRoomSelect,
  onRoomsChange,
}: Props) {
  const { user, token } = useAuth();

  const handleDelete = async (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    if (!token) return;
    try {
      await api.deleteRoom(roomId, token);
      onRoomsChange();
    } catch (err) {
      console.error("Failed to delete room:", err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => onRoomSelect(room)}
          className={`w-full text-left px-4 py-3 flex items-center justify-between group transition-colors ${
            activeRoomId === room.id
              ? "bg-gray-600 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
        >
          <span className="truncate"># {room.name}</span>
          {room.created_by === user?.id && (
            <span
              onClick={(e) => handleDelete(e, room.id)}
              className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0"
              title="Delete room"
            >
              ✕
            </span>
          )}
        </button>
      ))}
      {rooms.length === 0 && (
        <p className="text-gray-500 text-sm px-4 py-3">No rooms yet</p>
      )}
    </div>
  );
}
