"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { getSupabaseClient } from "@/lib/supabase";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const json = await res.json();
      if (!res.ok || json?.error) {
        throw new Error(json?.error || "Login failed");
      }
      const access_token: string | undefined = json?.data?.session?.access_token;
      const refresh_token: string | undefined = json?.data?.session?.refresh_token;
      if (access_token && refresh_token) {
        const supa = getSupabaseClient();
        await supa.auth.setSession({ access_token, refresh_token });
      }
      setPassword("");
      onClose();
      router.push("/edit");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log in to your account">
      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-2">
          <label className="block text-sm text-white/70">Username</label>
          <input
            type="text"
            required
            className="w-full rounded-lg border border-white/15 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-white/30"
            placeholder="yourusername"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-white/70">Password</label>
          <input
            type="password"
            required
            className="w-full rounded-lg border border-white/15 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-white/30"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-xs text-white/60 hover:text-white"
            onClick={() => {
              onClose();
              onSwitchToSignup();
            }}
          >
            Create an account
          </button>
          <Button variant="primary" className="px-4 py-2" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
