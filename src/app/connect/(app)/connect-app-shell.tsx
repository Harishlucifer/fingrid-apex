"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  User,
  LogOut,
  Home,
  Building2,
  ClipboardList,
  Target,
  Inbox,
  Handshake,
  Mail,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectTenantStore } from "@/stores/use-connect-tenant-store";
import { logout, hasConnectSession } from "@/lib/connect/connect-api";

const NAV = [
  { href: "/connect/dashboard", label: "Dashboard", icon: Home },
  { href: "/connect/directory", label: "Directory", icon: Building2 },
  { href: "/connect/requirements", label: "Requirements", icon: ClipboardList },
  { href: "/connect/matches", label: "Matches", icon: Target },
  { href: "/connect/requests", label: "Requests", icon: Inbox },
  { href: "/connect/partners", label: "Partners", icon: Handshake },
];

// Topbar + rail app-home shell — used only for the logged-in Dashboard/Directory/Matches/
// Requests/Partners area, where a persistent nav is a legitimate pattern. Guards the whole
// logged-in area: without a session, this redirects home instead of rendering an empty shell.
export function ConnectAppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const name = useConnectStore((s) => s.name);
  const businessName = useConnectStore((s) => s.businessName);
  const email = useConnectStore((s) => s.email);
  const mobile = useConnectStore((s) => s.mobile);
  const domain = useConnectStore((s) => s.domain);
  const entityType = useConnectStore((s) => s.entityType);
  const primaryRole = useConnectStore((s) => s.primaryRole);
  const tenant = useConnectTenantStore((s) => s.tenant);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sessionOk, setSessionOk] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = hasConnectSession();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs from localStorage, an external system
    setSessionOk(ok);
    if (!ok) router.replace("/");
  }, [router]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  if (!sessionOk) return null;

  const displayName = name || businessName || email || "Signed in";
  const initial = (name || businessName || email || "?").trim().charAt(0).toUpperCase();
  const brandName = (tenant?.TENANT_NAME as string | undefined) || "";
  const brandLogo = tenant?.TENANT_LOGO as string | undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-n200 bg-white px-5">
        {brandLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brandLogo} alt={brandName || "Fingrid Connect"} className="h-6 max-w-[160px] object-contain" />
        ) : brandName ? (
          <span className="text-[15px] font-extrabold text-navy-900">{brandName}</span>
        ) : (
          <span className="text-[15px] font-extrabold text-navy-900">
            Fingrid<i className="font-normal text-blue-600 not-italic">Connect</i>
          </span>
        )}
        <span className="flex-1" />
        <span
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-n700"
          title="Notifications"
        >
          <Bell size={18} strokeWidth={2} />
        </span>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-n200 bg-n50 text-n700"
          >
            <User size={18} strokeWidth={2} />
          </button>
          {menuOpen && (
            <div className="absolute top-11 right-0 z-10 w-64 overflow-hidden rounded-lg border border-n200 bg-white shadow-lg">
              <div className="flex items-center gap-2.5 border-b border-n200 px-3.5 py-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-600">
                  {initial}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-bold">{displayName}</div>
                  {businessName && name && (
                    <div className="truncate text-[11px] text-n500">{businessName}</div>
                  )}
                </div>
              </div>
              <div className="space-y-1 border-b border-n200 px-3.5 py-2.5 text-[11px] text-n500">
                {email && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail size={11} strokeWidth={2} /> {email}
                  </div>
                )}
                {mobile && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone size={11} strokeWidth={2} /> {mobile}
                  </div>
                )}
                {(entityType || primaryRole) && (
                  <div className="truncate">
                    {entityType || primaryRole}
                    {domain ? ` · ${domain}` : ""}
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={loggingOut}
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs font-semibold text-danger-ink"
              >
                <LogOut size={14} strokeWidth={2} />
                {loggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        {/* Desktop/tablet rail — hidden below md, replaced by the fixed bottom tab bar. */}
        <nav className="hidden w-[92px] flex-shrink-0 flex-col gap-0.5 border-r border-n200 bg-white py-3 md:flex">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 border-l-[3px] px-1 py-3 text-[10.5px] font-semibold transition-colors",
                  isActive
                    ? "border-blue-500 bg-blue-500/[.08] text-blue-500"
                    : "border-transparent text-n700",
                )}
              >
                <item.icon size={20} strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <div className="flex-1 p-4 pb-20 sm:p-6 md:pb-6">{children}</div>
          <footer className="hidden flex-shrink-0 items-center justify-between border-t border-n200 px-6 py-3.5 text-[11px] text-n500 md:flex">
            <span>
              © {new Date().getFullYear()} {brandName || "Fingrid Connect"}
            </span>
            <span>Powered by Fingrid.ai</span>
          </footer>
        </main>
      </div>

      {/* Mobile bottom tab bar — the rail's equivalent below md. */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-n200 bg-white shadow-lg md:hidden">
        {NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2",
                isActive ? "text-blue-500" : "text-n700",
              )}
            >
              <item.icon size={19} strokeWidth={2} />
              <span className="max-w-full truncate px-0.5 text-[9px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
