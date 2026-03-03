export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Room {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  user: User;
}
