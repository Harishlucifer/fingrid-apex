"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Card, Alert } from "@/components/connect/card";
import { Button } from "@/components/ui/button";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectTenantStore } from "@/stores/use-connect-tenant-store";
import { getProfile, listRequirements, listRequests, listPartners, listMatches, listDirectory } from "@/lib/connect/connect-api";

// Circular completion gauge for the feature tile.
function ProgressRing({ percent, size = 108, stroke = 10 }: { percent: number; size?: number; stroke?: number }) {
  const pct = Math.min(100, Math.max(0, percent || 0));
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#fff"
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-2xl font-extrabold">{pct}%</span>
        <span className="text-[10px] font-semibold opacity-80">complete</span>
      </div>
    </div>
  );
}

const avatarInitial = (s?: string) => (s || "?").trim().charAt(0).toUpperCase();

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
        setTopMatches(flat.slice(0, 2));
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
  const ringPct = isPublished ? 100 : completionPct;
  const stages = profile?.completion?.stages || [];
  const companyCta = isPublished ? "View company page" : completionPct > 0 ? "Continue setup" : "Start setup";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            {greeting}, {firstName}
          </h1>
          {businessName && <div className="mt-0.5 text-sm font-semibold text-n500">{businessName}</div>}
        </div>
        <span className="hidden text-sm font-semibold text-n500 sm:block">
          {(tenant?.TENANT_NAME as string | undefined) || "Fingrid Connect"}
        </span>
      </div>
      {error && <Alert tone="warning">{error} — showing what&apos;s available locally.</Alert>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[172px] lg:grid-cols-4 lg:[grid-auto-flow:dense]">
        {/* Feature tile — company status. Spans 2×2 on desktop. */}
        <div className="flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 to-blue-600 p-5 text-white sm:col-span-2 lg:col-span-2 lg:row-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase opacity-90">
              <Building2 size={15} strokeWidth={2.5} /> Company Status
            </div>
            <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold">
              {isPublished ? "PUBLISHED" : "DRAFT"}
            </span>
          </div>

          <div className="my-auto flex items-center gap-5 py-4">
            <ProgressRing percent={ringPct} />
            <div className="min-w-0">
              <div className="truncate text-lg font-extrabold">{businessName || displayName}</div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {(entityType || primaryRole) && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">{entityType || primaryRole}</span>
                )}
                {profile?.verification_tier && (
                  <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">
                    <ShieldCheck size={11} strokeWidth={2.5} /> {profile.verification_tier}
                  </span>
                )}
              </div>
              {stages.length > 0 && (
                <div className="mt-3 flex items-center gap-1.5">
                  {stages.map((s) => (
                    <span
                      key={s.name}
                      title={s.name}
                      className={`h-2.5 w-2.5 rounded-full ${s.done ? "bg-white" : "bg-white/35"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link
            href="/connect/company"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-sm font-bold text-navy-900 transition-colors"
          >
            {companyCta} <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Matches stat */}
        <Link
          href="/connect/matches"
          className="flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
              <Target size={19} strokeWidth={2} />
            </span>
            <ChevronRight size={16} strokeWidth={2} className="text-blue-600" />
          </div>
          <div>
            <div className="text-3xl leading-none font-extrabold text-blue-600">{matchCount}</div>
            <div className="mt-1 text-xs font-semibold text-n700">Matches</div>
          </div>
        </Link>

        {/* Requests stat */}
        <Link
          href="/connect/requests"
          className="flex flex-col justify-between overflow-hidden rounded-2xl border border-warning/40 bg-warning-bg p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-warning-ink">
              <Inbox size={19} strokeWidth={2} />
            </span>
            <ChevronRight size={16} strokeWidth={2} className="text-warning-ink" />
          </div>
          <div>
            <div className="text-3xl leading-none font-extrabold text-warning-ink">{pendingCount}</div>
            <div className="mt-1 text-xs font-semibold text-n700">Pending requests</div>
          </div>
        </Link>

        {/* Partners strip */}
        <Link href="/connect/partners" className="transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-2">
          <Card className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <Handshake size={15} strokeWidth={2} /> Your partners
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                View all <ChevronRight size={13} strokeWidth={2} />
              </span>
            </div>
            {partners.length === 0 ? (
              <div className="text-xs text-n500">No partners yet — accept a connect request to build your network.</div>
            ) : (
              <div className="flex items-center gap-2">
                {partners.slice(0, 6).map((p) => (
                  <span
                    key={p.relationship_id}
                    title={p.counterparty?.name}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-white bg-success-bg text-xs font-bold text-success-ink shadow-sm"
                  >
                    {avatarInitial(p.counterparty?.name)}
                  </span>
                ))}
                {partners.length > 6 && <span className="text-xs font-bold text-n500">+{partners.length - 6}</span>}
                <span className="ml-1 text-xs font-semibold text-n700">{partners.length} active</span>
              </div>
            )}
          </Card>
        </Link>

        {/* Requirements */}
        <div className="sm:col-span-2 lg:col-span-2">
          <Card className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <ClipboardList size={15} strokeWidth={2} /> Requirements
              </div>
              <Link href="/connect/requirements" className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                View all <ChevronRight size={13} strokeWidth={2} />
              </Link>
            </div>
            {requirements.length === 0 ? (
              <div className="text-xs text-n500">No requirements yet — post one to get auto-matched.</div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-3xl font-extrabold text-navy-900">{requirements.length}</div>
                <div className="text-xs text-n500">
                  partnership requirement{requirements.length > 1 ? "s" : ""} posted
                </div>
              </div>
            )}
            <Button asChild variant="outline" className="justify-center gap-1.5 py-2 text-sm">
              <Link href="/connect/requirements/new">
                <Plus size={14} strokeWidth={2} /> Post a Requirement
              </Link>
            </Button>
          </Card>
        </div>

        {/* Top matches */}
        <div className="sm:col-span-2 lg:col-span-2">
          <Card className="flex h-full flex-col">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <TrendingUp size={15} strokeWidth={2} /> Top matches
              </div>
              <Link href="/connect/matches" className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                View all <ChevronRight size={13} strokeWidth={2} />
              </Link>
            </div>
            {topMatches.length === 0 ? (
              <div className="flex flex-1 items-center text-xs text-n500">
                {requirements.length === 0
                  ? "Post a requirement and candidates ranked by fit will appear here."
                  : "No matches yet — check back shortly."}
              </div>
            ) : (
              <div className="flex flex-1 flex-col justify-center">
                {topMatches.map((m) => (
                  <div key={m.match_id} className="flex items-center justify-between border-t border-n200 py-1.5">
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold">{m.name}</div>
                      <div className="text-[10px] text-n500">
                        {m.entity_type} · {m.state || "—"}
                      </div>
                    </div>
                    <span className="ml-2 flex-shrink-0 text-sm font-extrabold text-blue-600">{m.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Discover — full-width horizontal scroller */}
        <div className="sm:col-span-2 lg:col-span-4 lg:row-auto">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <Sparkles size={15} strokeWidth={2} /> Discover partners
              </div>
              <Link href="/connect/directory" className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                Browse directory <ChevronRight size={13} strokeWidth={2} />
              </Link>
            </div>
            {discover.length === 0 ? (
              <div className="py-2 text-xs text-n500">
                No organisations to show yet — published partners across the network will appear here.
              </div>
            ) : (
              <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                {discover.map((d) => (
                  <Link
                    key={d.channel_id}
                    href="/connect/directory"
                    className="w-44 flex-shrink-0 rounded-xl border border-n200 bg-n50 p-3.5 transition-colors"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-n100 text-xs font-bold text-navy-900">
                        {avatarInitial(d.name)}
                      </span>
                      <div className="truncate text-xs font-bold">{d.name}</div>
                    </div>
                    <div className="mb-1 truncate text-[10px] text-n500">
                      {d.entity_type} · {d.state || "—"}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-n500">{d.aum && d.aum > 0 ? `₹${d.aum} Cr` : "AUM N/A"}</span>
                      <span className="rounded bg-n100 px-1.5 py-0.5 text-[10px] font-bold text-navy-900">
                        {d.verification_tier}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
