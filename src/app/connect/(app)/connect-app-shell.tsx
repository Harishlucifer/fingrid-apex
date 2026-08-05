"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
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
  Compass,
  ArrowRight,
  ChevronRight,
  Menu as MenuIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/brand/logo-mark";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectTenantStore } from "@/stores/use-connect-tenant-store";
import {
  logout,
  hasConnectSession,
  getProfile,
  listRequirements,
  listRequests,
  listPartners,
  listMatches,
} from "@/lib/connect/connect-api";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Which slice of `NavStatus` drives this row's badge and sub-items. */
  key?: "company" | "requirements" | "matches" | "requests" | "partners";
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

// The left navigation is grouped the way the work is grouped — your own organisation first,
// then the network — with each row carrying its live status and, where the data exists, its
// sub-items underneath.
const NAV_GROUPS: NavGroup[] = [
  {
    heading: "Overview",
    items: [{ href: "/connect/dashboard", label: "Dashboard", icon: Home }],
  },
  {
    heading: "Your organisation",
    items: [
      { href: "/connect/company", label: "Company profile", icon: Building2, key: "company" },
      { href: "/connect/requirements", label: "Requirements", icon: ClipboardList, key: "requirements" },
    ],
  },
  {
    heading: "Network",
    items: [
      { href: "/connect/directory", label: "Directory", icon: Compass },
      { href: "/connect/matches", label: "Matches", icon: Target, key: "matches" },
      { href: "/connect/requests", label: "Requests", icon: Inbox, key: "requests" },
      { href: "/connect/partners", label: "Partners", icon: Handshake, key: "partners" },
    ],
  },
];

// Bottom tab bar below md — the rail's equivalent where a sidebar doesn't fit.
const MOBILE_TABS: NavItem[] = [
  { href: "/connect/dashboard", label: "Home", icon: Home },
  { href: "/connect/directory", label: "Directory", icon: Compass },
  { href: "/connect/matches", label: "Matches", icon: Target, key: "matches" },
  { href: "/connect/requests", label: "Requests", icon: Inbox, key: "requests" },
  { href: "/connect/partners", label: "Partners", icon: Handshake, key: "partners" },
];

interface Badge {
  label: string;
  tone: "success" | "warning" | "blue" | "neutral";
}

// Menu rows only — a row carries a status badge, never a nested sub-list.
interface NavStatus {
  badge?: Badge;
}

const BADGE_TONE: Record<Badge["tone"], string> = {
  success: "bg-success-bg text-success-ink",
  warning: "bg-warning-bg text-warning-ink",
  blue: "bg-blue-500/10 text-blue-600",
  neutral: "bg-n100 text-n500",
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Topbar + grouped left navigation shell for the logged-in Dashboard/Directory/Matches/
// Requests/Partners area. Guards the whole logged-in area: without a session, this redirects
// home instead of rendering an empty shell.
export function ConnectAppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const channelId = useConnectStore((s) => s.channelId);
  const name = useConnectStore((s) => s.name);
  const businessName = useConnectStore((s) => s.businessName);
  const email = useConnectStore((s) => s.email);
  const mobile = useConnectStore((s) => s.mobile);
  const domain = useConnectStore((s) => s.domain);
  const entityType = useConnectStore((s) => s.entityType);
  const primaryRole = useConnectStore((s) => s.primaryRole);
  const tenant = useConnectTenantStore((s) => s.tenant);

  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sessionOk, setSessionOk] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Partial<Record<NonNullable<NavItem["key"]>, NavStatus>>>({});

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

  // Statuses shown against each nav row. Best-effort and independent: any one call failing just
  // leaves that row without a badge rather than breaking navigation.
  const loadStatus = useCallback(async () => {
    if (!channelId) return;

    getProfile(channelId)
      .then((raw) => {
        const p = raw as { profile_status?: string; completion?: { percent?: number } };
        const published = p.profile_status === "PUBLISHED";
        const percent = p.completion?.percent ?? 0;
        setStatus((s) => ({
          ...s,
          company: {
            badge: published
              ? { label: "Published", tone: "success" }
              : { label: `${percent}%`, tone: percent > 0 ? "warning" : "neutral" },
          },
        }));
      })
      .catch(() => {});

    listRequirements({ channel_id: channelId })
      .then((raw) => {
        const count = (((raw as { items?: unknown[] }).items) || []).length;
        setStatus((s) => ({
          ...s,
          requirements: { badge: { label: String(count), tone: count ? "blue" : "neutral" } },
        }));
      })
      .catch(() => {});

    listRequests(channelId)
      .then((raw) => {
        const items =
          ((raw as { items?: { direction: string; request_status: string }[] }).items) || [];
        const pending = items.filter(
          (r) => r.direction === "received" && r.request_status === "PENDING",
        ).length;
        setStatus((s) => ({
          ...s,
          requests: {
            badge: pending
              ? { label: String(pending), tone: "warning" }
              : { label: String(items.length), tone: "neutral" },
          },
        }));
      })
      .catch(() => {});

    listPartners(channelId)
      .then((raw) => {
        const count = (((raw as { items?: unknown[] }).items) || []).length;
        setStatus((s) => ({
          ...s,
          partners: { badge: { label: String(count), tone: count ? "success" : "neutral" } },
        }));
      })
      .catch(() => {});

    listMatches(channelId)
      .then((raw) => {
        const count = (((raw as { items?: { matches?: unknown[] }[] }).items) || []).flatMap(
          (g) => g.matches || [],
        ).length;
        setStatus((s) => ({
          ...s,
          matches: { badge: { label: String(count), tone: count ? "blue" : "neutral" } },
        }));
      })
      .catch(() => {});
  }, [channelId]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

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
      {/* Sized to match SiteNav's lockup — 68px bar, 11px gap, 20px wordmark — so the app zone
          and the marketing site read as the same product. */}
      <header className="border-n200/80 sticky top-0 z-30 flex h-[68px] flex-shrink-0 items-center gap-3 border-b bg-white/92 px-4 shadow-[0_8px_30px_rgb(1_39_86_/_0.045)] backdrop-blur-[18px] sm:px-5">
        {/* Below md the sidebar is hidden and the bottom bar only holds five tabs — without
            this, Company profile and Requirements would be unreachable on a phone. */}
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="text-n700 hover:bg-n100 -ml-1 flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors md:hidden"
            >
              <MenuIcon size={20} strokeWidth={2} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[290px] p-0">
            <SheetHeader className="border-n200 border-b px-4 py-4">
              <SheetTitle className="flex items-center gap-2.5">
                <LogoMark />
                <span className="font-display text-navy-900 text-[17px] font-bold tracking-[-0.02em]">
                  {brandName || (
                    <>
                      Fingrid<span className="text-blue-500">Connect</span>
                    </>
                  )}
                </span>
              </SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 overflow-y-auto px-3 py-4">
              {NAV_GROUPS.map((group) => (
                <div key={group.heading}>
                  <div className="text-n400 mb-1 px-2.5 font-mono text-[9.5px] font-semibold tracking-[0.14em] uppercase">
                    {group.heading}
                  </div>
                  <div className="grid gap-0.5">
                    {group.items.map((item) => {
                      const active = isActive(pathname, item.href);
                      const meta = item.key ? status[item.key] : undefined;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setNavOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[14px] font-medium transition-colors",
                            active
                              ? "bg-blue-500/[.09] font-semibold text-blue-600"
                              : "text-n700 hover:bg-n50",
                          )}
                        >
                          <item.icon
                            size={17}
                            strokeWidth={2}
                            className={active ? "text-blue-600" : "text-n400"}
                          />
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {meta?.badge && (
                            <span
                              className={cn(
                                "rounded-full px-1.5 py-[2px] text-[10px] font-bold",
                                BADGE_TONE[meta.badge.tone],
                              )}
                            >
                              {meta.badge.label}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/connect/dashboard" className="flex shrink-0 items-center gap-[11px]">
          {brandLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brandLogo} alt={brandName || "Fingrid Connect"} className="h-8 max-w-[200px] object-contain" />
          ) : (
            <>
              <LogoMark />
              <span className="font-display text-navy-900 text-xl font-bold tracking-[-0.02em]">
                {brandName || (
                  <>
                    Fingrid<span className="text-blue-500">Connect</span>
                  </>
                )}
              </span>
            </>
          )}
        </Link>
        <span className="border-n200 text-n400 ml-1 hidden border-l pl-3 text-[9.5px] leading-[1.25] font-medium tracking-[0.04em] lg:block">
          PARTNERSHIP
          <br />
          MARKETPLACE
        </span>

        <span className="flex-1" />

        <Link
          href="/"
          className="text-n500 hover:text-navy-900 hidden items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors sm:flex"
        >
          fingrid.ai
          <ArrowRight size={13} strokeWidth={2.2} className="text-blue-500" />
        </Link>
        <span
          className="text-n700 hover:bg-n100 flex size-10 cursor-pointer items-center justify-center rounded-xl transition-colors"
          title="Notifications"
        >
          <Bell size={19} strokeWidth={2} />
        </span>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="border-n200 bg-n50 text-n700 hover:border-n300 flex size-10 items-center justify-center rounded-full border transition-colors"
          >
            <User size={19} strokeWidth={2} />
          </button>
          {menuOpen && (
            <div className="border-n200 absolute top-12 right-0 z-10 w-[288px] overflow-hidden rounded-2xl border bg-white shadow-[0_20px_56px_rgb(1_39_86_/_0.16)]">
              <div className="border-n200 flex items-center gap-3 border-b px-4 py-3.5">
                <span className="flex size-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[17px] font-bold text-blue-600">
                  {initial}
                </span>
                <div className="min-w-0">
                  <div className="text-navy-900 truncate text-[15px] font-bold">{displayName}</div>
                  {businessName && name && (
                    <div className="text-n500 truncate text-[12.5px]">{businessName}</div>
                  )}
                </div>
              </div>
              <div className="border-n200 text-n500 space-y-1.5 border-b px-4 py-3 text-[13px]">
                {email && (
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={14} strokeWidth={2} className="shrink-0" /> {email}
                  </div>
                )}
                {mobile && (
                  <div className="flex items-center gap-2 truncate">
                    <Phone size={14} strokeWidth={2} className="shrink-0" /> {mobile}
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
                className="text-danger-ink hover:bg-danger-bg flex w-full items-center gap-2.5 px-4 py-3 text-left text-[13.5px] font-semibold transition-colors"
              >
                <LogOut size={16} strokeWidth={2} />
                {loggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left navigation panel — menu, submenus and their statuses. Hidden below md. */}
        <nav
          aria-label="Fingrid Connect"
          // Sticky under the 68px topbar with its own scroll, so the menu stays reachable on a
          // long list page instead of scrolling away with the content.
          className="border-n200 sticky top-[68px] hidden h-[calc(100vh-68px)] w-[254px] flex-shrink-0 flex-col gap-4 overflow-y-auto border-r bg-white px-3 py-4 md:flex"
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.heading}>
              <div className="text-n400 mb-1 px-2.5 font-mono text-[9.5px] font-semibold tracking-[0.14em] uppercase">
                {group.heading}
              </div>
              <div className="grid gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  const meta = item.key ? status[item.key] : undefined;

                  return (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group/nav flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] font-medium transition-colors",
                          active
                            ? "bg-blue-500/[.09] font-semibold text-blue-600"
                            : "text-n700 hover:bg-n50 hover:text-navy-900",
                        )}
                      >
                        <item.icon
                          size={16}
                          strokeWidth={2}
                          className={active ? "text-blue-600" : "text-n400"}
                        />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {meta?.badge ? (
                          <span
                            className={cn(
                              "rounded-full px-1.5 py-[2px] text-[10px] font-bold",
                              BADGE_TONE[meta.badge.tone],
                            )}
                          >
                            {meta.badge.label}
                          </span>
                        ) : (
                          <ChevronRight
                            size={13}
                            strokeWidth={2}
                            className="text-n300 opacity-0 transition-opacity group-hover/nav:opacity-100"
                          />
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* No CTA here — the menu is for navigation. "Post a requirement" lives on the
              pages that own the action (dashboard header, requirements list). */}
          <div className="text-n400 mt-auto px-1 text-[10px]">
            © {new Date().getFullYear()} {brandName || "Fingrid Connect"} · Powered by Fingrid.ai
          </div>
        </nav>

        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <div className="mx-auto w-full max-w-[1160px] flex-1 p-4 pb-24 sm:p-6 md:pb-8">{children}</div>
        </main>
      </div>

      <nav className="border-n200 fixed inset-x-0 bottom-0 z-20 flex border-t bg-white/95 shadow-[0_-8px_30px_rgb(1_39_86_/_0.08)] backdrop-blur-[18px] md:hidden">
        {MOBILE_TABS.map((item) => {
          const active = isActive(pathname, item.href);
          const badge = item.key ? status[item.key]?.badge : undefined;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2",
                active ? "text-blue-500" : "text-n700",
              )}
            >
              <item.icon size={19} strokeWidth={2} />
              {badge && badge.tone !== "neutral" ? (
                <span className="bg-blue-500 absolute top-1 right-[22%] size-1.5 rounded-full" />
              ) : null}
              <span className="max-w-full truncate px-0.5 text-[9px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
