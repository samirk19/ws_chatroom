"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";

export default function Home() {
  const { token, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && token) {
      router.push("/dashboard");
    }
  }, [isReady, token, router]);

  if (!isReady) return null;
  if (token) return null;

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <AuthForm />
    </main>
  );
}
