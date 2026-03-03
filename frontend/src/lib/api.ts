import { Message, Room, Token } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function register(
  username: string,
  email: string,
  password: string
): Promise<Token> {
  return request<Token>("/api/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export function login(
  email: string,
  password: string
): Promise<Token> {
  return request<Token>("/api/login", {
    method: "POST",
    body: JSON.stringify({ username: "", email, password }),
  });
}

export function getRooms(): Promise<Room[]> {
  return request<Room[]>("/api/rooms");
}

export function createRoom(name: string, token: string): Promise<Room> {
  return request<Room>(
    "/api/rooms",
    { method: "POST", body: JSON.stringify({ name }) },
    token
  );
}

export function deleteRoom(roomId: string, token: string): Promise<void> {
  return request<void>(
    `/api/rooms/${roomId}`,
    { method: "DELETE" },
    token
  );
}

export function getMessageHistory(
  roomId: string,
  token?: string
): Promise<Message[]> {
  return request<Message[]>(`/api/rooms/${roomId}/messages`, {}, token);
}
