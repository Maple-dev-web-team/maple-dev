"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapleLogo } from "@/components/ui/MapleLogo";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Authentication failed. Check your credentials.");
      }

      // Login successful!
      window.location.href = "/admin/dashboard";
    } catch (err: unknown) {
      const authErr = err as Error;
      setError(authErr.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white flex flex-col justify-center items-center px-6 py-12">
      {/* Background Architectural Grid Accent */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-block">
            <MapleLogo variant="light" size="md" isLink={false} />
          </div>
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/50">
            Administrative Portal
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#121418] border border-white/10 p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h1 className="text-xl font-serif text-white tracking-wide">
              Admin Sign In
            </h1>
            <p className="text-xs text-white/50 font-light mt-1">
              Enter your administrative credentials to continue
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-950/60 border border-red-500/30 text-red-200 text-xs flex items-start gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maple.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/15 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/15 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white hover:bg-white/90 text-black text-xs font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
