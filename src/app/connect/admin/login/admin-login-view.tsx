"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, getAdminToken } from "@/lib/connect/connect-admin-api";

// Employee login for the Fingrid Connect admin view — the same POST /auth/login-with-password
// (X-Platform: EMPLOYEE_PORTAL) any internal Fingrid tool would use.
export function AdminLoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alreadyIn, setAlreadyIn] = useState(false);

  useEffect(() => {
    if (getAdminToken()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs from localStorage, an external system
      setAlreadyIn(true);
      router.replace("/connect/admin/partners");
    }
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminLogin({ email, password });
      router.push("/connect/admin/partners");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (alreadyIn) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a]">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-[#1f2937] bg-[#0b1220] p-7">
        <div className="mb-1 text-lg font-extrabold text-white">Fingrid Connect</div>
        <div className="mb-6 text-[13px] text-[#94a3b8]">Internal admin sign-in</div>

        {error && (
          <div className="mb-4 rounded-md border border-[#7f1d1d] bg-[#3f1d1d] px-3 py-2 text-[12.5px] text-[#fca5a5]">
            {error}
          </div>
        )}

        <label className="mb-1 block text-[11px] font-bold tracking-wide text-[#94a3b8] uppercase">Work Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border-[1.5px] border-[#334155] bg-transparent px-3 py-2.5 text-sm text-white"
        />

        <label className="mb-1 block text-[11px] font-bold tracking-wide text-[#94a3b8] uppercase">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 w-full rounded-lg border-[1.5px] border-[#334155] bg-transparent px-3 py-2.5 text-sm text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
