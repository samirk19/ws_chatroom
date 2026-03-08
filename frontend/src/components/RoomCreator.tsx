"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import * as api from "@/lib/api";

interface Props {
  onRoomCreated: () => void;
}

export default function RoomCreator({ onRoomCreated }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const [error, setError] = useState<String | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !token) return;

    setLoading(true);
    try {
      await api.createRoom(name.trim(), token);
      setName("");
      onRoomCreated();
    } catch (err) {
      console.error("Failed to create room:", err);
      setError(
        err instanceof Error ? err.message : "Unknown Error With Room Creation",
      );
      setTimeout(() => setError(null), 2500); // hide error message after 2.5 seconds
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700">
      <div className="p-3 border-t border-gray-700">
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New room..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-indigo-500 focus:outline-none placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm rounded transition-colors"
        >
          +
        </button>
      </div>
    </form>
  );
}
