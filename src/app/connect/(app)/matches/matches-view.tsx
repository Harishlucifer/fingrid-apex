"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Target, ShieldCheck } from "lucide-react";
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
const scoreColor = (s: number) => (s >= 70 ? "text-success" : s >= 40 ? "text-blue-600" : "text-n500");
const BREAKDOWN = [
  { key: "geo", label: "Geography", max: 30 },
  { key: "product", label: "Product", max: 25 },
  { key: "ticket", label: "Ticket", max: 25 },
  { key: "tier", label: "Tier", max: 20 },
];

// Already-partnered/already-pending candidates are cross-referenced client-side (see
// Directory's own note on the same gap) — an already-partnered candidate is dropped from the
// list entirely: "My Matches" surfaces who's still worth reaching out to.
export function MatchesView() {
  const channelId = useConnectStore((s) => s.channelId);
  const partnershipTypes = useConnectLookupsStore((s) => s.partnershipTypes);
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
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600">
              {typeLabel(g.partnership_type, partnershipTypes)}
            </span>
            <span className="text-xs text-n500">
              {g.matches!.length} candidate{g.matches!.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.matches!.map((m) => {
              const isPending = !!pendingByTarget[m.channel_id];
              const busy = actingId === m.channel_id;
              const bd = m.breakdown || {};
              return (
                <Card key={m.match_id} className="flex flex-col">
                  <div className="mb-3 flex items-start gap-3">
                    <InitialAvatar name={m.name} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold">{m.name}</div>
                      <div className="truncate text-[11px] text-n500">
                        {m.entity_type} · {m.state || "—"}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className={`text-xl leading-none font-extrabold ${scoreColor(m.score || 0)}`}>{m.score}%</div>
                      <div className="text-[9px] font-semibold tracking-wide text-n500 uppercase">fit</div>
                    </div>
                  </div>

                  <div className="mb-3 space-y-1.5">
                    {BREAKDOWN.map((b) => {
                      const val = bd[b.key] || 0;
                      return (
                        <div key={b.key} className="flex items-center gap-2">
                          <span className="w-14 flex-shrink-0 text-[10px] text-n500">{b.label}</span>
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-n200">
                            <div className="h-full rounded-full bg-blue-500" style={{ width: `${(val / b.max) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mb-3 flex items-center gap-1 text-[11px] text-n500">
                    <ShieldCheck size={12} strokeWidth={2} /> {m.verification_tier}
                    {m.vetted ? " · Vetted" : ""}
                  </div>

                  <div className="mt-auto">
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
