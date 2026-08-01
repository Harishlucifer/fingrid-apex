"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getAdminToken, adminLogout } from "@/lib/connect/connect-admin-api";

const NAV = [
  { href: "/connect/admin/partners", label: "Partners & Vetting" },
  { href: "/connect/admin/requirements", label: "Requirement Moderation" },
];

// Internal-staff shell — deliberately styled different from ConnectAppShell's partner-facing
// system (dark bar, plain type) so nobody mistakes this for a partner-facing screen. Gated on
// the presence of an admin token; the real authorization check is server-side.
export function ConnectAdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [tokenOk, setTokenOk] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = !!getAdminToken();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs from localStorage, an external system
    setTokenOk(ok);
    if (!ok) router.replace("/connect/admin/login");
  }, [router]);

  if (!tokenOk) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#0f172a]">
      <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-[#1f2937] bg-[#0b1220] px-5">
        <span className="text-[15px] font-extrabold text-white">
          Fingrid Connect <span className="font-medium text-[#94a3b8]">— Internal</span>
        </span>
        <nav className="ml-4 flex gap-1">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-[13px] font-semibold transition-colors",
                  isActive ? "bg-blue-500/20 text-white" : "text-[#94a3b8]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <span className="flex-1" />
        <button
          type="button"
          onClick={() => {
            adminLogout();
            router.replace("/connect/admin/login");
          }}
          className="rounded-md border border-[#334155] px-3 py-1.5 text-[12px] font-semibold text-[#e2e8f0]"
        >
          Log out
        </button>
      </header>
      <main className="min-w-0 flex-1 overflow-y-auto bg-[#f1f5f9] p-6">{children}</main>
    </div>
  );
}
