"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Room } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

export default function Dashboard() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (isReady && !token) {
      router.push("/");
    }
  }, [isReady, token, router]);

  if (!isReady) return null;
  if (!token) return null;

  return (
    <div className="h-screen bg-gray-900 flex">
      <Sidebar activeRoom={activeRoom} onRoomSelect={setActiveRoom} />

      <div className="flex-1 flex flex-col">
        {activeRoom ? (
          <ChatWindow room={activeRoom} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-lg">
              Select a room to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
