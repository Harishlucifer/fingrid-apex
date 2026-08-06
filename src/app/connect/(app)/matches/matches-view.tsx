"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Target, ShieldCheck, MapPin, Wallet, ArrowRight } from "lucide-react";
import { Card, Alert, PageHeader, InitialAvatar } from "@/components/connect/card";
import { Pagination } from "@/components/connect/pagination";
import { usePaged } from "@/hooks/use-paged";
import { Button } from "@/components/ui/button";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectLookupsStore } from "@/stores/use-connect-lookups-store";
import { listMatches, sendConnectRequest, listRequests, listPartners } from "@/lib/connect/connect-api";

interface MatchItem {
  match_id: string | number;
  channel_id: string | number;
  name?: string;
  entity_type?: string;
  state?: string;
  score?: number;
  breakdown?: Record<string, number>;
  verification_tier?: string;
  vetted?: boolean;
  can_connect?: boolean;
  aum?: number;
  match_status?: string;
  generated_at?: string;
}
interface MatchGroup {
  requirement_id: string | number;
  partnership_type?: string;
  matches?: MatchItem[];
}
interface RequestItem {
  direction: string;
  request_status: string;
  request_id: string | number;
  counterparty?: { channel_id?: string | number };
}
interface PartnerItem {
  counterparty?: { channel_id?: string | number };
}

const typeLabel = (key: string | undefined, partnershipTypes: { key: string; label: string }[]) =>
  partnershipTypes.find((t) => t.key === key)?.label || key || "Requirement";
// The engine's own weights — shown as "24/30" so a low bar reads as "partial credit on a
// heavily-weighted dimension" rather than an unexplained short line.
const BREAKDOWN = [
  { key: "geo", label: "Geography", max: 30, bar: "bg-blue-500" },
  { key: "product", label: "Product", max: 25, bar: "bg-mint" },
  { key: "ticket", label: "Ticket", max: 25, bar: "bg-blue-300" },
  { key: "tier", label: "Tier", max: 20, bar: "bg-navy-800" },
];

// One band drives the score colour, the wording and the ring, so they can't disagree.
function fitBand(score: number) {
  if (score >= 70) return { label: "Strong fit", text: "text-success", ring: "#0e9a5e", chip: "bg-success-bg text-success-ink" };
  if (score >= 40) return { label: "Good fit", text: "text-blue-600", chip: "bg-blue-500/10 text-blue-600", ring: "#3185ff" };
  return { label: "Partial fit", text: "text-n500", chip: "bg-n100 text-n500", ring: "#c4cbd8" };
}

function ScoreRing({ score }: { score: number }) {
  const band = fitBand(score);
  const r = 20, c = 2 * Math.PI * r;
  return (
    <div className="relative size-12 shrink-0">
      <svg width={48} height={48} className="-rotate-90">
        <circle cx={24} cy={24} r={r} fill="none" stroke="#eef1f6" strokeWidth={4} />
        <circle
          cx={24} cy={24} r={r} fill="none" stroke={band.ring} strokeWidth={4}
          strokeDasharray={c} strokeDashoffset={c - (Math.min(100, score) / 100) * c}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset .5s ease" }}
        />
      </svg>
      <span className={`font-display absolute inset-0 grid place-items-center text-[13px] font-bold ${band.text}`}>
        {score}%
      </span>
    </div>
  );
}

// Already-partnered/already-pending candidates are cross-referenced client-side (see
// Directory's own note on the same gap) — an already-partnered candidate is dropped from the
// list entirely: "My Matches" surfaces who's still worth reaching out to.
export function MatchesView() {
  const channelId = useConnectStore((s) => s.channelId);
  const partnershipTypes = useConnectLookupsStore((s) => s.partnershipTypes);
  const entityByKey = useConnectLookupsStore((s) => s.entityByKey);
  const [groups, setGroups] = useState<MatchGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | number | null>(null);
  const [pendingByTarget, setPendingByTarget] = useState<Record<string, string | number>>({});
  const [partneredIds, setPartneredIds] = useState<Set<string | number>>(new Set());

  const loadRequests = useCallback(() => {
    if (!channelId) return;
    listRequests(channelId)
      .then((raw) => {
        const items = ((raw as { items?: RequestItem[] }).items) || [];
        const map: Record<string, string | number> = {};
        items.forEach((req) => {
          if (req.direction === "sent" && req.request_status === "PENDING" && req.counterparty?.channel_id) {
            map[req.counterparty.channel_id] = req.request_id;
          }
        });
        setPendingByTarget(map);
      })
      .catch(() => {});
  }, [channelId]);

  const loadPartners = useCallback(() => {
    if (!channelId) return;
    listPartners(channelId)
      .then((raw) => {
        const items = ((raw as { items?: PartnerItem[] }).items) || [];
        const ids = new Set(items.filter((p) => p.counterparty?.channel_id).map((p) => p.counterparty!.channel_id!));
        setPartneredIds(ids);
      })
      .catch(() => {});
  }, [channelId]);

  useEffect(() => {
    if (!channelId) return;
    listMatches(channelId)
      .then((raw) => setGroups(((raw as { items?: MatchGroup[] }).items) || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load matches"));
  }, [channelId]);

  useEffect(() => {
    loadRequests();
    loadPartners();
  }, [loadRequests, loadPartners]);

  const connect = async (toChannelId: string | number, requirementId: string | number) => {
    setActingId(toChannelId);
    try {
      const result = (await sendConnectRequest(channelId as string, { toChannelId, requirementId })) as {
        request_id: string | number;
      };
      setPendingByTarget((prev) => ({ ...prev, [toChannelId]: result.request_id }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send request");
      loadRequests();
    } finally {
      setActingId(null);
    }
  };

  const visibleGroups = groups
    .map((g) => ({ ...g, matches: (g.matches || []).filter((m) => !partneredIds.has(m.channel_id)) }))
    .filter((g) => g.matches.length > 0);
  const totalMatches = visibleGroups.reduce((sum, g) => sum + g.matches.length, 0);
  // Paged by requirement group, not by candidate — splitting one requirement's candidates
  // across pages would break the "N candidates" count that heads each group.
  const { page, setPage, pageItems: pagedGroups, pageSize, total } = usePaged(visibleGroups, 3);

  return (
    <div>
      <PageHeader
        icon={Target}
        title="My Matches"
        subtitle={
          totalMatches > 0
            ? `${totalMatches} candidate${totalMatches > 1 ? "s" : ""} auto-matched to your requirements`
            : "Auto-matched candidates ranked by fit"
        }
      />
      {error && <Alert tone="warning">{error}</Alert>}
      {visibleGroups.length === 0 && !error && (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <Target size={26} strokeWidth={1.5} className="text-n300" />
          <div className="text-sm font-semibold text-n700">No matches yet</div>
          <div className="max-w-xs text-xs text-n500">
            {groups.length > 0
              ? "You're already partnered with every current candidate — check back after your next requirement matches."
              : "Post a requirement and candidates ranked by geography, product fit, ticket size and tier will appear here."}
          </div>
        </Card>
      )}
      {pagedGroups.map((g) => (
        <div key={g.requirement_id} className="mb-6">
          {/* Which requirement produced these, and how good the pool is — without this the
              groups were indistinguishable from one another. */}
          <div className="border-n200 mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border bg-white px-3.5 py-2.5">
            <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600">
              {typeLabel(g.partnership_type, partnershipTypes)}
            </span>
            <span className="text-n500 text-xs">
              {g.matches!.length} candidate{g.matches!.length > 1 ? "s" : ""}
            </span>
            {(() => {
              const scores = g.matches!.map((m) => m.score || 0);
              const best = Math.max(...scores);
              const strong = scores.filter((s2) => s2 >= 70).length;
              return (
                <>
                  <span className="text-n400 text-xs">
                    Best fit <b className={`font-semibold ${fitBand(best).text}`}>{best}%</b>
                  </span>
                  {strong > 0 && (
                    <span className="bg-success-bg text-success-ink rounded-full px-2 py-0.5 text-[10.5px] font-bold">
                      {strong} strong
                    </span>
                  )}
                </>
              );
            })()}
            <Link
              href={`/connect/requirements/${g.requirement_id}`}
              className="text-n500 hover:text-navy-900 ml-auto flex items-center gap-1 text-[11.5px] font-semibold transition-colors"
            >
              View requirement <ArrowRight size={11} strokeWidth={2.2} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.matches!.map((m) => {
              const isPending = !!pendingByTarget[m.channel_id];
              const busy = actingId === m.channel_id;
              const bd = m.breakdown || {};
              const band = fitBand(m.score || 0);
              const strongest = BREAKDOWN
                .map((b) => ({ ...b, val: bd[b.key] || 0, pct: (bd[b.key] || 0) / b.max }))
                .sort((a, z) => z.pct - a.pct)[0];
              return (
                <Card key={m.match_id} className="flex flex-col">
                  <div className="mb-3 flex items-start gap-3">
                    <InitialAvatar name={m.name} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold">{m.name}</div>
                      <div className="text-n500 truncate text-[11px]">
                        {entityByKey(m.entity_type ?? "").label || m.entity_type}
                      </div>
                    </div>
                    <ScoreRing score={m.score || 0} />
                  </div>

                  {/* Facts a lender actually screens on, before the score breakdown. */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    <span className="bg-n100 text-navy-900 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold">
                      <MapPin size={10} strokeWidth={2.2} /> {m.state || "Location N/A"}
                    </span>
                    <span className="bg-n100 text-navy-900 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold">
                      <Wallet size={10} strokeWidth={2.2} />
                      {m.aum && m.aum > 0 ? `₹${m.aum} Cr` : "AUM N/A"}
                    </span>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                        m.vetted ? "bg-success-bg text-success-ink" : "bg-n100 text-n500"
                      }`}
                    >
                      <ShieldCheck size={10} strokeWidth={2.2} /> {m.verification_tier}
                      {m.vetted ? " · Vetted" : ""}
                    </span>
                  </div>

                  <div className={`mb-2.5 w-fit rounded-full px-2 py-0.5 text-[10.5px] font-bold ${band.chip}`}>
                    {band.label}
                    {strongest && strongest.pct > 0 ? ` · best on ${strongest.label.toLowerCase()}` : ""}
                  </div>

                  <div className="mb-3 space-y-1.5">
                    {BREAKDOWN.map((b) => {
                      const val = bd[b.key] || 0;
                      return (
                        <div key={b.key} className="flex items-center gap-2">
                          <span className="text-n500 w-[52px] flex-shrink-0 text-[10px]">{b.label}</span>
                          <div className="bg-n100 h-1.5 flex-1 overflow-hidden rounded-full">
                            <div
                              className={`h-full rounded-full ${b.bar}`}
                              style={{ width: `${Math.min(100, (val / b.max) * 100)}%` }}
                            />
                          </div>
                          <span className="text-n400 w-9 shrink-0 text-right font-mono text-[9.5px]">
                            {val}/{b.max}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {m.generated_at && (
                    <div className="text-n400 mb-3 text-[10px]">
                      Matched {new Date(m.generated_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </div>
                  )}

                  <div className="mt-auto grid gap-2">
                    <Link
                      href={`/connect/partners/${m.channel_id}`}
                      className="border-n200 text-navy-900 hover:border-n300 hover:bg-n50 flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[12px] font-semibold transition-colors"
                    >
                      View profile <ArrowRight size={12} strokeWidth={2.2} className="text-blue-500" />
                    </Link>
                    <Button
                      type="button"
                      variant="fgBlue"
                      disabled={!m.can_connect || isPending || busy}
                      onClick={() => connect(m.channel_id, g.requirement_id)}
                      className="w-full gap-1.5 py-2.5 text-xs"
                    >
                      {isPending ? (
                        <>
                          <CheckCircle2 size={13} strokeWidth={2} /> Requested
                        </>
                      ) : busy ? (
                        "Sending…"
                      ) : m.can_connect ? (
                        "Connect"
                      ) : (
                        "Restricted"
                      )}
                    </Button>
                    {!m.can_connect && (
                      <div className="mt-1.5 text-center text-[10px] text-n500">
                        Connect requests currently require Lender status with AUM ≥ ₹100 Cr.
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(n) => {
          setPage(n);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
