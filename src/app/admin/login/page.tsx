"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Key, Sparkles, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-100 text-zinc-950 flex flex-col justify-center items-center px-6 py-12 overflow-hidden font-sans">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-550 hover:text-zinc-850 uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>

      <div className="w-full max-w-md rounded-3xl border border-zinc-250 bg-white p-8 md:p-10 shadow-xl relative">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-[30px] pointer-events-none" />

        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-amber-400/5 border border-amber-400/20 text-amber-600 mb-4">
            <Key className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-zinc-950 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500/65" /> Admin Portal
          </h1>
          <p className="text-xs text-zinc-550 uppercase font-semibold tracking-wider mt-2">
            Glenda Royale Events
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 text-xs flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@glendas.events"
              className="w-full h-11 bg-white border border-zinc-200 rounded-xl px-4 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 bg-white border border-zinc-200 rounded-xl px-4 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/5 active:scale-[0.98] mt-2 disabled:opacity-50 uppercase tracking-wider"
          >
            {loading ? "Verifying..." : "Login to Dashboard"}
          </button>
        </form>
      </div>

      <footer className="mt-12 text-center text-[10px] text-zinc-500 tracking-wider">
        Kyle Adrianna Sayas • Glenda&apos;s Event Place Batangas
      </footer>
    </div>
  );
}
