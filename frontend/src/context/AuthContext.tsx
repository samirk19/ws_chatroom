"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@/lib/types";

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthState>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  isReady: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsReady(true);
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
