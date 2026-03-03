"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "@/lib/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export function useWebSocket(roomId: string | null, token: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId || !token) return;

    setMessages([]);
    const ws = new WebSocket(`${WS_URL}/ws/${roomId}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);

    ws.onmessage = (event) => {
      const msg: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    return () => {
      ws.close();
      wsRef.current = null;
      setIsConnected(false);
    };
  }, [roomId, token]);

  const sendMessage = useCallback(
    (content: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ content }));
      }
    },
    []
  );

  return { messages, sendMessage, isConnected };
}
