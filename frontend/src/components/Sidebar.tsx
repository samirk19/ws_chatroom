"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Room } from "@/lib/types";
import * as api from "@/lib/api";
import RoomList from "./RoomList";
import RoomCreator from "./RoomCreator";
import { useRouter } from "next/navigation";

interface Props {
  activeRoom: Room | null;
  onRoomSelect: (room: Room) => void;
}

export default function Sidebar({ activeRoom, onRoomSelect }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { user, logout } = useAuth();
  const router = useRouter();

  const fetchRooms = useCallback(async () => {
    try {
      const data = await api.getRooms();
      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="w-64 bg-gray-800 flex flex-col h-full border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold text-white">ChatApp</h1>
        <p className="text-gray-400 text-sm truncate">{user?.username}</p>
      </div>

      <RoomList
        rooms={rooms}
        activeRoomId={activeRoom?.id ?? null}
        onRoomSelect={onRoomSelect}
        onRoomsChange={fetchRooms}
      />

      <RoomCreator onRoomCreated={fetchRooms} />

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
