"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Message, Room } from "@/lib/types";
import * as api from "@/lib/api";
import MessageInput from "./MessageInput";

interface Props {
  room: Room;
}

export default function ChatWindow({ room }: Props) {
  const { token, user } = useAuth();
  const [history, setHistory] = useState<Message[]>([]);
  const { messages: liveMessages, sendMessage, isConnected } = useWebSocket(
    room.id,
    token
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  useEffect(() => {
    let cancelled = false;
    setHistory([]);

    api.getMessageHistory(room.id, token ?? undefined).then((msgs) => {
      if (!cancelled) setHistory(msgs);
    });

    return () => {
      cancelled = true;
    };
  }, [room.id, token]);

  const allMessages = useMemo(() => {
    const historyIds = new Set(history.map((m) => m.id));
    const newLive = liveMessages.filter((m) => !historyIds.has(m.id));
    return [...history, ...newLive];
  }, [history, liveMessages]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScroll.current = distFromBottom < 100;
  };

  useEffect(() => {
    if (shouldAutoScroll.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-700 shrink-0">
        <h2 className="text-white font-semibold"># {room.name}</h2>
        <span
          className={`text-xs ${isConnected ? "text-green-400" : "text-red-400"}`}
        >
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {allMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.user_id === user?.id ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm font-semibold text-indigo-400">
                {msg.username}
              </span>
              <span className="text-xs text-gray-500">
                {formatTime(msg.created_at)}
              </span>
            </div>
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg whitespace-pre-wrap break-words ${
                msg.user_id === user?.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={sendMessage} disabled={!isConnected} />
    </div>
  );
}
