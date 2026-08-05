"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Plus,
  Building2,
  ClipboardList,
  Target,
  Inbox,
  Handshake,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Check,
  Circle,
  Compass,
  Rocket,
} from "lucide-react";
import { Card, Alert } from "@/components/connect/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectTenantStore } from "@/stores/use-connect-tenant-store";
import { getProfile, listRequirements, listRequests, listPartners, listMatches, listDirectory } from "@/lib/connect/connect-api";

// Circular completion gauge for the company-status hero.
function ProgressRing({ percent, size = 104, stroke = 9 }: { percent: number; size?: number; stroke?: number }) {
  const pct = Math.min(100, Math.max(0, percent || 0));
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#32ea94"
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="font-display text-[26px] leading-none font-bold tracking-[-0.03em]">{pct}%</span>
        <span className="mt-1 text-[9.5px] font-semibold tracking-[0.06em] uppercase opacity-70">complete</span>
      </div>
    </div>
  );
}

const avatarInitial = (s?: string) => (s || "?").trim().charAt(0).toUpperCase();

// ---- small building blocks -------------------------------------------------

const TONE: Record<string, { wrap: string; icon: string; value: string }> = {
  blue: { wrap: "border-blue-500/25 bg-blue-500/[.06]", icon: "bg-white text-blue-600", value: "text-blue-600" },
  warning: { wrap: "border-warning/30 bg-warning-bg", icon: "bg-white text-warning-ink", value: "text-warning-ink" },
  success: { wrap: "border-success/25 bg-success-bg", icon: "bg-white text-success-ink", value: "text-success-ink" },
  neutral: { wrap: "border-n200 bg-white", icon: "bg-n100 text-navy-900", value: "text-navy-900" },
};

function StatTile({
  href,
  icon: Icon,
  value,
  label,
  hint,
  tone = "neutral",
}: {
  href: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  value: number;
  label: string;
  hint: string;
  tone?: keyof typeof TONE;
}) {
  // A zero count shouldn't shout in colour — it earns its accent once there's something there.
  const t = TONE[value > 0 ? tone : "neutral"];
  return (
    <Link
      href={href}
      className={cn(
        "group/tile flex items-center gap-3 rounded-2xl border p-3.5 transition-shadow hover:shadow-[0_12px_30px_rgb(1_39_86_/_0.08)]",
        t.wrap,
      )}
    >
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", t.icon)}>
        <Icon size={18} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("font-display block text-[22px] leading-none font-bold tracking-[-0.03em]", t.value)}>
          {value}
        </span>
        <span className="text-n700 mt-1 block truncate text-[12px] font-semibold">{label}</span>
        <span className="text-n400 mt-0.5 block truncate text-[10.5px]">{hint}</span>
      </span>
      <ChevronRight
        size={15}
        strokeWidth={2}
        className="text-n300 shrink-0 transition-transform group-hover/tile:translate-x-0.5"
      />
    </Link>
  );
}

function SectionCard({
  icon: Icon,
  title,
  action,
  children,
  className,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="font-display text-navy-900 flex items-center gap-1.5 text-[14px] font-semibold tracking-[-0.01em]">
          <Icon size={15} strokeWidth={2.2} /> {title}
        </div>
        {action && (
          <Link
            href={action.href}
            className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-blue-600 hover:underline"
          >
            {action.label} <ChevronRight size={13} strokeWidth={2.2} />
          </Link>
        )}
      </div>
      {children}
    </Card>
  );
}

// Empty states carry an icon, a reason and a way out — the old dashboard left a bare sentence
// floating in a large box, which read as "broken" rather than "nothing here yet".
function EmptyState({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="border-n200 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center">
      <span className="bg-n100 text-n400 mb-2.5 grid size-9 place-items-center rounded-xl">
        <Icon size={17} strokeWidth={2} />
      </span>
      <div className="text-navy-900 text-[13px] font-semibold">{title}</div>
      <p className="text-n500 mt-1 max-w-[42ch] text-[11.5px] leading-[1.5]">{body}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:underline"
        >
          {cta.label} <ArrowRight size={13} strokeWidth={2.2} />
        </Link>
      )}
    </div>
  );
}

interface Stage {
  name: string;
  done: boolean;
}
interface ProfileSummary {
  completion?: { percent?: number; stages?: Stage[] };
  profile_status?: string;
  verification_tier?: string;
}
interface RequirementItem {
  requirement_id: string | number;
  listing_status?: string;
}
interface RequestItem {
  direction: string;
  request_status: string;
}
interface PartnerItem {
  relationship_id: string | number;
  counterparty?: { name?: string };
}
interface MatchGroup {
  matches?: MatchItem[];
}
interface MatchItem {
  match_id: string | number;
  name?: string;
  entity_type?: string;
  state?: string;
  score?: number;
}
interface DirectoryItem {
  channel_id: string | number;
  name?: string;
  entity_type?: string;
  state?: string;
  aum?: number;
  verification_tier?: string;
}

export function DashboardView() {
  const channelId = useConnectStore((s) => s.channelId);
  const entityType = useConnectStore((s) => s.entityType);
  const primaryRole = useConnectStore((s) => s.primaryRole);
  const name = useConnectStore((s) => s.name);
  const businessName = useConnectStore((s) => s.businessName);
  const tenant = useConnectTenantStore((s) => s.tenant);

  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [requirements, setRequirements] = useState<RequirementItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [topMatches, setTopMatches] = useState<MatchItem[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [discover, setDiscover] = useState<DirectoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!channelId) return;
    getProfile(channelId)
      .then((p) => setProfile(p as ProfileSummary))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load profile"));
    listRequirements({ channel_id: channelId })
      .then((r) => setRequirements(((r as { items?: RequirementItem[] }).items) || []))
      .catch(() => {});
    listRequests(channelId)
      .then((r) =>
        setPendingCount(
          (((r as { items?: RequestItem[] }).items) || []).filter(
            (i) => i.direction === "received" && i.request_status === "PENDING",
          ).length,
        ),
      )
      .catch(() => {});
    listPartners(channelId)
      .then((r) => setPartners(((r as { items?: PartnerItem[] }).items) || []))
      .catch(() => {});
    listMatches(channelId)
      .then((r) => {
        const flat = (((r as { items?: MatchGroup[] }).items) || []).flatMap((g) => g.matches || []);
        flat.sort((a, b) => (b.score || 0) - (a.score || 0));
        setMatchCount(flat.length);
        setTopMatches(flat.slice(0, 4));
      })
      .catch(() => {});
    listDirectory(channelId, {})
      .then((r) => setDiscover((((r as { items?: DirectoryItem[] }).items) || []).slice(0, 8)))
      .catch(() => {});
  }, [channelId]);

  if (!channelId) {
    return (
      <Alert tone="warning">
        No channel identity yet —{" "}
        <Link href="/connect/join" className="font-semibold underline">
          complete onboarding
        </Link>{" "}
        first.
      </Alert>
    );
  }

  const displayName = name || businessName || "Your account";
  const firstName = displayName.split(" ")[0];
  const completionPct = profile?.completion?.percent ?? 0;
  const isPublished = profile?.profile_status === "PUBLISHED";
  const stages = profile?.completion?.stages || [];
  const stagesDone = stages.filter((s) => s.done).length;
  const liveRequirements = requirements.filter(
    (r) => r.listing_status === "LIVE" || r.listing_status === "MATCHED",
  ).length;
  const companyCta = isPublished ? "View company page" : completionPct > 0 ? "Continue setup" : "Start setup";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // The activation path, in order. Everything on this dashboard is zero until these are done,
  // so on a fresh account this — not the empty stat tiles — is the useful thing to show.
  const nextSteps = [
    {
      label: "Publish your company page",
      body: "Lenders can only find and shortlist a published page.",
      done: isPublished,
      href: "/connect/company/edit",
      cta: "Complete profile",
    },
    {
      label: "Post a partnership requirement",
      body: "Describe what you need — matching runs against the whole network.",
      done: requirements.length > 0,
      href: "/connect/requirements/new",
      cta: "Post a requirement",
    },
    {
      label: "Review your matches",
      body: "Candidates ranked by geography, product fit and scale.",
      done: matchCount > 0,
      href: "/connect/matches",
      cta: "View matches",
    },
    {
      label: "Build your partner network",
      body: "Send or accept a connect request to open a working relationship.",
      done: partners.length > 0,
      href: "/connect/directory",
      cta: "Browse directory",
    },
  ];
  const nextUp = nextSteps.find((s) => !s.done);
  const stepsDone = nextSteps.filter((s) => s.done).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-navy-900 text-[clamp(22px,2.6vw,28px)] font-bold tracking-[-0.035em]">
            {greeting}, {firstName}
          </h1>
          <div className="text-n500 mt-0.5 text-sm font-semibold">
            {businessName || (tenant?.TENANT_NAME as string | undefined) || "Fingrid Connect"}
          </div>
        </div>
        <Button asChild variant="fgPrimary" className="h-auto gap-1.5 rounded-xl px-4 py-2.5 text-[13px]">
          <Link href="/connect/requirements/new">
            <Plus size={14} strokeWidth={2.5} /> Post a requirement
          </Link>
        </Button>
      </div>

      {error && <Alert tone="warning">{error} — showing what&apos;s available locally.</Alert>}

      {/* Company status + activation checklist */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="from-navy-900 relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br to-blue-600 p-5 text-white shadow-[0_18px_46px_rgb(1_39_86_/_0.22)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_-15%,rgb(50_234_148_/_0.25),transparent_46%)]"
          />
          <div className="relative flex flex-1 flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.08em] uppercase opacity-85">
                <Building2 size={14} strokeWidth={2.5} /> Company status
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.04em]",
                  isPublished ? "bg-mint text-navy-900" : "bg-white/20 text-white",
                )}
              >
                {isPublished ? "PUBLISHED" : "DRAFT"}
              </span>
            </div>

            <div className="my-5 flex items-center gap-5">
              <ProgressRing percent={completionPct} />
              <div className="min-w-0">
                <div className="font-display truncate text-[19px] font-bold tracking-[-0.025em]">
                  {businessName || displayName}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {(entityType || primaryRole) && (
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold">
                      {entityType || primaryRole}
                    </span>
                  )}
                  {profile?.verification_tier && (
                    <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold">
                      <ShieldCheck size={11} strokeWidth={2.5} /> {profile.verification_tier}
                    </span>
                  )}
                </div>
                {stages.length > 0 && (
                  <div className="mt-2.5 text-[11.5px] font-medium text-white/70">
                    {stagesDone} of {stages.length} profile sections complete
                  </div>
                )}
              </div>
            </div>

            {/* Named sections, not anonymous dots — a dot you can't read tells you nothing. */}
            {stages.length > 0 && (
              <ul className="mb-5 grid gap-x-4 gap-y-1 sm:grid-cols-2">
                {stages.map((s) => (
                  <li key={s.name} className="flex items-center gap-1.5 text-[11.5px]">
                    {s.done ? (
                      <Check size={12} strokeWidth={3} className="text-mint shrink-0" />
                    ) : (
                      <Circle size={9} strokeWidth={2.5} className="shrink-0 text-white/35" />
                    )}
                    <span className={s.done ? "text-white/90" : "text-white/50"}>{s.name}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Published pages open the read-only view; an unfinished one goes straight to the
                workflow, which is what "Continue setup" promises. */}
            <Link
              href={isPublished ? "/connect/company" : "/connect/company/edit"}
              className="text-navy-900 mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-[13.5px] font-bold transition-colors hover:bg-white/90"
            >
              {companyCta} <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        <SectionCard icon={Rocket} title="Next steps">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="bg-n100 h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-blue-500),var(--color-mint))] transition-[width] duration-500"
                style={{ width: `${(stepsDone / nextSteps.length) * 100}%` }}
              />
            </div>
            <span className="text-n500 shrink-0 text-[11px] font-bold">
              {stepsDone}/{nextSteps.length}
            </span>
          </div>

          <ol className="flex-1 space-y-1">
            {nextSteps.map((step) => {
              const isNext = step === nextUp;
              return (
                <li key={step.label}>
                  <Link
                    href={step.href}
                    className={cn(
                      "flex items-start gap-2.5 rounded-xl px-2.5 py-2 transition-colors",
                      isNext ? "bg-blue-500/[.07]" : "hover:bg-n50",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-[1px] grid size-5 shrink-0 place-items-center rounded-full ring-1",
                        step.done
                          ? "bg-success-bg text-success-ink ring-success/30"
                          : isNext
                            ? "bg-blue-500 text-white ring-blue-500/30"
                            : "text-n400 ring-n200 bg-white",
                      )}
                    >
                      {step.done ? <Check size={11} strokeWidth={3} /> : <Circle size={7} strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-[12.5px] font-semibold",
                          step.done ? "text-n400 line-through" : isNext ? "text-blue-600" : "text-navy-900",
                        )}
                      >
                        {step.label}
                      </span>
                      {!step.done && (
                        <span className="text-n500 mt-0.5 block text-[11px] leading-[1.45]">{step.body}</span>
                      )}
                    </span>
                    {!step.done && (
                      <ChevronRight size={14} strokeWidth={2} className="text-n300 mt-0.5 shrink-0" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>

          {nextUp ? (
            <Button asChild variant="fgBlue" className="mt-3 h-auto w-full gap-1.5 rounded-xl py-2.5 text-[13px]">
              <Link href={nextUp.href}>
                {nextUp.cta} <ArrowRight size={14} strokeWidth={2.2} />
              </Link>
            </Button>
          ) : (
            <div className="border-success/25 bg-success-bg text-success-ink mt-3 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12.5px] font-semibold">
              <Check size={14} strokeWidth={3} /> You&apos;re fully set up on Connect
            </div>
          )}
        </SectionCard>
      </div>

      {/* Compact stat strip — one row instead of two oversized tiles */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          href="/connect/matches"
          icon={Target}
          value={matchCount}
          label="Matches"
          hint={matchCount ? "Ranked by fit" : "Post a requirement first"}
          tone="blue"
        />
        <StatTile
          href="/connect/requests"
          icon={Inbox}
          value={pendingCount}
          label="Pending requests"
          hint={pendingCount ? "Awaiting your action" : "Nothing to action"}
          tone="warning"
        />
        <StatTile
          href="/connect/partners"
          icon={Handshake}
          value={partners.length}
          label="Partners"
          hint={partners.length ? "Active relationships" : "No partners yet"}
          tone="success"
        />
        <StatTile
          href="/connect/requirements"
          icon={ClipboardList}
          value={requirements.length}
          label="Requirements"
          hint={requirements.length ? `${liveRequirements} live` : "None posted"}
          tone="blue"
        />
      </div>

      {/* Matches + partners */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          icon={TrendingUp}
          title="Top matches"
          action={topMatches.length ? { label: "View all", href: "/connect/matches" } : undefined}
          className="min-h-[236px]"
        >
          {topMatches.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No matches yet"
              body={
                requirements.length === 0
                  ? "Matching starts once you post a requirement — candidates are then ranked by fit."
                  : "Your requirement is live. Ranked candidates appear here as matching runs."
              }
              cta={
                requirements.length === 0
                  ? { label: "Post a requirement", href: "/connect/requirements/new" }
                  : undefined
              }
            />
          ) : (
            <ul className="divide-n100 flex-1 divide-y">
              {topMatches.map((m) => (
                <li key={m.match_id} className="flex items-center gap-3 py-2.5">
                  <span className="bg-n100 text-navy-900 grid size-9 shrink-0 place-items-center rounded-xl text-[12px] font-bold">
                    {avatarInitial(m.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-navy-900 block truncate text-[12.5px] font-semibold">{m.name}</span>
                    <span className="text-n500 block truncate text-[11px]">
                      {m.entity_type} · {m.state || "—"}
                    </span>
                  </span>
                  <span className="font-display shrink-0 text-[15px] font-bold text-blue-600">{m.score}%</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          icon={Handshake}
          title="Your partners"
          action={partners.length ? { label: "View all", href: "/connect/partners" } : undefined}
          className="min-h-[236px]"
        >
          {partners.length === 0 ? (
            <EmptyState
              icon={Handshake}
              title="No partners yet"
              body="Send a connect request from the directory, or accept one that comes in, to start a relationship."
              cta={{ label: "Browse directory", href: "/connect/directory" }}
            />
          ) : (
            <div className="flex flex-1 flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                {partners.slice(0, 8).map((p) => (
                  <span
                    key={p.relationship_id}
                    title={p.counterparty?.name}
                    className="bg-success-bg text-success-ink flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-white text-[13px] font-bold shadow-sm"
                  >
                    {avatarInitial(p.counterparty?.name)}
                  </span>
                ))}
                {partners.length > 8 && (
                  <span className="text-n500 text-[12px] font-bold">+{partners.length - 8}</span>
                )}
              </div>
              <div className="text-n500 mt-3 text-[12px]">
                <b className="text-navy-900 font-semibold">{partners.length}</b> active relationship
                {partners.length > 1 ? "s" : ""}
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Discover */}
      <SectionCard
        icon={Sparkles}
        title="Discover partners"
        action={{ label: "Browse directory", href: "/connect/directory" }}
      >
        {discover.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="Nothing to show yet"
            body="Published organisations across the network appear here — the directory fills up as partners go live."
          />
        ) : (
          <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
            {discover.map((d) => (
              <Link
                key={d.channel_id}
                href="/connect/directory"
                className="border-n200 bg-n50 hover:border-n300 w-48 flex-shrink-0 rounded-xl border p-3.5 transition-colors hover:bg-white"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="bg-n100 text-navy-900 flex size-8 flex-shrink-0 items-center justify-center rounded-lg text-[12px] font-bold">
                    {avatarInitial(d.name)}
                  </span>
                  <div className="text-navy-900 truncate text-[12.5px] font-semibold">{d.name}</div>
                </div>
                <div className="text-n500 mb-1.5 truncate text-[11px]">
                  {d.entity_type} · {d.state || "—"}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-n400 text-[10.5px]">
                    {d.aum && d.aum > 0 ? `₹${d.aum} Cr` : "AUM N/A"}
                  </span>
                  <span className="bg-n100 text-navy-900 rounded px-1.5 py-0.5 text-[10px] font-bold">
                    {d.verification_tier}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
