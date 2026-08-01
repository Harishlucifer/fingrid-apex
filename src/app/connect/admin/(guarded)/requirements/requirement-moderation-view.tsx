"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, Alert } from "@/components/connect/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { adminListRequirements, adminSetRequirementStatus } from "@/lib/connect/connect-admin-api";

interface RequirementRow {
  requirement_id: string | number;
  channel_id?: string | number;
  channel?: { name?: string };
  partnership_type?: string;
  context?: string;
  listing_status: string;
  match_count?: number;
}

// Moderate listings — every requirement regardless of listing_status/visibility. Force Draft /
// Force Close bypass the owner-only checks the partner-facing Close action has.
export function RequirementModerationView() {
  const [items, setItems] = useState<RequirementRow[]>([]);
  const [total, setTotal] = useState(0);
  const [listingStatus, setListingStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | number | null>(null);

  const load = useCallback(() => {
    setError(null);
    const filters: Record<string, string> = { limit: "50" };
    if (listingStatus) filters.listing_status = listingStatus;
    adminListRequirements(filters)
      .then((raw) => {
        const r = raw as { items?: RequirementRow[]; pagination?: { total?: number } };
        setItems(r.items || []);
        setTotal(r.pagination?.total || 0);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load requirements"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetches requirements from the server on mount
    load();
  }, [load]);

  const act = async (requirementId: string | number, status: string) => {
    setActionError(null);
    setBusyId(requirementId);
    try {
      await adminSetRequirementStatus(requirementId, { status, reason: "admin moderation" });
      load();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to update requirement");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-slate-900">Requirement Moderation</h1>
      <p className="mb-4 text-sm text-slate-500">
        Every listing platform-wide, any status. Force Draft unpublishes; Force Close is terminal.
      </p>

      <div className="mb-4 flex gap-2">
        <select
          value={listingStatus}
          onChange={(e) => setListingStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="LIVE">Live</option>
          <option value="MATCHED">Matched</option>
          <option value="CLOSED">Closed</option>
        </select>
        <Button type="button" variant="fgBlue" onClick={load}>
          Filter
        </Button>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {actionError && <Alert tone="error">{actionError}</Alert>}

      <Card className="overflow-hidden !p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Context</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Matches</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((r) => (
              <TableRow key={r.requirement_id}>
                <TableCell className="font-medium text-slate-800">{r.channel?.name || r.channel_id}</TableCell>
                <TableCell className="text-slate-500">{r.partnership_type}</TableCell>
                <TableCell className="max-w-xs truncate text-slate-500" title={r.context}>
                  {r.context}
                </TableCell>
                <TableCell>{r.listing_status}</TableCell>
                <TableCell>{r.match_count}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {r.listing_status !== "DRAFT" && r.listing_status !== "CLOSED" && (
                    <button
                      type="button"
                      disabled={busyId === r.requirement_id}
                      onClick={() => act(r.requirement_id, "DRAFT")}
                      className="mr-3 text-[11px] font-semibold text-slate-500 underline"
                    >
                      Force Draft
                    </button>
                  )}
                  {r.listing_status !== "CLOSED" && (
                    <button
                      type="button"
                      disabled={busyId === r.requirement_id}
                      onClick={() => act(r.requirement_id, "CLOSED")}
                      className="rounded bg-danger-bg px-2.5 py-1 text-[11px] font-bold text-danger-ink"
                    >
                      Force Close
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-slate-400">
                  No requirements match this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">{total} total</div>
      </Card>
    </div>
  );
}
