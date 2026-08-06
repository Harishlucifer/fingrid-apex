"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, Plus, Target, Radio, Users, MapPin } from "lucide-react";
import { Card, Alert, PageHeader, StatStrip } from "@/components/connect/card";
import { Button } from "@/components/ui/button";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectLookupsStore } from "@/stores/use-connect-lookups-store";
import { Pagination } from "@/components/connect/pagination";
import { listRequirements, closeRequirement } from "@/lib/connect/connect-api";

const REQ_PAGE_SIZE = 10;

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-n50 text-n500",
  LIVE: "bg-success-bg text-success-ink",
  MATCHED: "bg-n100 text-navy-900",
  CLOSED: "bg-n50 text-n500",
};

interface RequirementItem {
  requirement_id: string | number;
  partnership_type?: string;
  context?: string;
  listing_status: string;
  match_count?: number;
  products?: string[];
  need?: { geography?: { states?: string[] } };
}

const typeLabel = (key: string | undefined, partnershipTypes: { key: string; label: string }[]) =>
  partnershipTypes.find((t) => t.key === key)?.label || key || "Requirement";

export function MyRequirementsView() {
  const channelId = useConnectStore((s) => s.channelId);
  const partnershipTypes = useConnectLookupsStore((s) => s.partnershipTypes);
  const [items, setItems] = useState<RequirementItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!channelId) return;
    listRequirements({ channel_id: channelId, page: String(page), limit: String(REQ_PAGE_SIZE) })
      .then((raw) => {
        const res = raw as { items?: RequirementItem[]; pagination?: { total?: number } };
        setItems(res.items || []);
        setTotal(res.pagination?.total ?? (res.items || []).length);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load requirements"));
  }, [channelId, page]);

  useEffect(() => {
    load();
  }, [load]);

  const doClose = async (id: string | number) => {
    try {
      await closeRequirement(channelId as string, id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to close requirement");
    }
  };

  const liveCount = items.filter((r) => r.listing_status === "LIVE" || r.listing_status === "MATCHED").length;
  const totalMatches = items.reduce((sum, r) => sum + (r.match_count || 0), 0);

  return (
    <div>
      <PageHeader
        icon={ClipboardList}
        tint="bg-blue-500/10"
        color="text-blue-600"
        title="My Requirements"
        subtitle="Partnership needs you've posted to the network"
        action={
          <Button asChild variant="fgBlue" size="sm" className="gap-1.5">
            <Link href="/connect/requirements/new">
              <Plus size={14} strokeWidth={2} /> New Requirement
            </Link>
          </Button>
        }
      />
      {error && <Alert tone="warning">{error}</Alert>}

      {items.length > 0 && (
        <StatStrip
          items={[
            { label: "Total posted", value: items.length, icon: ClipboardList, tint: "bg-blue-500/10", color: "text-blue-600" },
            { label: "Live", value: liveCount, icon: Radio, tint: "bg-success-bg", color: "text-success-ink" },
            { label: "Total matches", value: totalMatches, icon: Target, tint: "bg-n100", color: "text-navy-900" },
          ]}
        />
      )}

      {items.length === 0 && !error ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <ClipboardList size={26} strokeWidth={1.5} className="text-n300" />
          <div className="text-sm font-semibold text-n700">No requirements yet</div>
          <div className="max-w-xs text-xs text-n500">
            Post what kind of partner you&apos;re looking for — auto-match runs the moment it goes live.
          </div>
          <Button asChild variant="fgBlue" size="sm" className="mt-1 gap-1.5">
            <Link href="/connect/requirements/new">
              <Plus size={14} strokeWidth={2} /> Post a Requirement
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((r) => {
            const statusClass = STATUS_STYLE[r.listing_status] || STATUS_STYLE.DRAFT;
            const states = r.need?.geography?.states || [];
            const canEdit = r.listing_status === "DRAFT";
            const canViewMatches = (r.match_count || 0) > 0;
            const canClose = r.listing_status === "LIVE" || r.listing_status === "MATCHED";
            const hasActions = canEdit || canViewMatches || canClose;
            return (
              <Card key={r.requirement_id} className="flex h-full flex-col">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                      <ClipboardList size={18} strokeWidth={2} />
                    </span>
                    {/* Two reserved lines: without the fallback, a requirement with no context
                        sits a line higher than its neighbour and the chip rows stop aligning. */}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold">{typeLabel(r.partnership_type, partnershipTypes)}</div>
                      <div className={`truncate text-[11px] ${r.context ? "text-n500" : "text-n300"}`}>
                        {r.context || "No description added"}
                      </div>
                    </div>
                  </div>
                  <span className={`flex-shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${statusClass}`}>
                    {r.listing_status}
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap items-start gap-2">
                  <span className="flex items-center gap-1 rounded-lg bg-n100 px-2 py-1 text-[11px] font-semibold text-navy-900">
                    <Target size={11} strokeWidth={2} /> {r.match_count || 0} match{(r.match_count || 0) === 1 ? "" : "es"}
                  </span>
                  {states.length > 0 && (
                    <span className="flex items-center gap-1 rounded-lg bg-n50 px-2 py-1 text-[11px] font-semibold text-n700">
                      <MapPin size={11} strokeWidth={2} /> {states.slice(0, 2).join(", ")}
                      {states.length > 2 ? ` +${states.length - 2}` : ""}
                    </span>
                  )}
                  {(r.products || []).length > 0 && (
                    <span className="flex items-center gap-1 rounded-lg bg-n50 px-2 py-1 text-[11px] font-semibold text-n700">
                      <Users size={11} strokeWidth={2} /> {r.products!.slice(0, 2).join(", ")}
                      {r.products!.length > 2 ? ` +${r.products!.length - 2}` : ""}
                    </span>
                  )}
                </div>

                {/* Rendered only when there is something to do — a closed requirement with no
                    matches was drawing a divider over an empty strip. */}
                {hasActions && (
                  <div className="border-n200 mt-auto flex min-h-[45px] items-center gap-2 border-t pt-3">
                    {canEdit && (
                      <Button asChild variant="outline" size="sm" className="px-3 py-1.5 text-xs">
                        <Link href={`/connect/requirements/${r.requirement_id}`}>Continue editing</Link>
                      </Button>
                    )}
                    {canViewMatches && (
                      <Button asChild variant="outline" size="sm" className="px-3 py-1.5 text-xs">
                        <Link href="/connect/matches">View matches</Link>
                      </Button>
                    )}
                    {canClose && (
                      <button
                        type="button"
                        onClick={() => doClose(r.requirement_id)}
                        className="text-danger-ink hover:text-danger ml-auto text-xs font-semibold transition-colors"
                      >
                        Close
                      </button>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Pagination
        page={page}
        pageSize={REQ_PAGE_SIZE}
        total={total}
        onPageChange={(n) => {
          setPage(n);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
