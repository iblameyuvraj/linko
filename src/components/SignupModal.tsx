"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { getSupabaseClient } from "@/lib/supabase";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password, name: name.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        const code: string | undefined = json?.error?.code;
        const msg: string | undefined = json?.error?.message;
        if (code === "USERNAME_TAKEN") {
          setError("this username is already occupied");
        } else if (code === "INVALID_CREDENTIALS") {
          setError("username and password is wrong please try again");
        } else {
          setError(msg || "please refresh the website");
        }
        return;
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
      setError("please refresh the website");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create your account">
      <form className="space-y-4" onSubmit={handleSignup}>
        <div className="space-y-2">
          <label className="block text-sm text-white/70">Name</label>
          <input
            type="text"
            required
            className="w-full rounded-lg border border-white/15 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-white/30"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
            autoComplete="new-password"
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
              onSwitchToLogin();
            }}
          >
            Already have an account?
          </button>
          <Button variant="primary" className="px-4 py-2" disabled={loading}>
            {loading ? "Creating..." : "Sign up"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
