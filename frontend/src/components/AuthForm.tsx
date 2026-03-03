"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import * as api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (mode === "signup") {
        result = await api.register(username, email, password);
      } else {
        result = await api.login(email, password);
      }
      login(result.access_token, result.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none placeholder-gray-400"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none placeholder-gray-400"
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? "Loading..." : mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
