"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, Alert } from "@/components/connect/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { adminListPartners, adminGetPartnerProfile, adminSetVetting } from "@/lib/connect/connect-admin-api";

interface PartnerRow {
  channel_id: string | number;
  name?: string;
  entity_type?: string;
  profile_status?: string;
  verification_tier?: string;
  pending_vetting_count?: number;
}
interface VettingClaim {
  claim: string;
  document_id?: string;
  vet_status?: string;
}
interface PartnerProfile {
  legal?: { legal_name?: string };
  verification_tier?: string;
  vetting?: VettingClaim[];
}

// Read-only oversight (every partner channel, any profile_status) + the vetting queue.
// Approving a claim recomputes and persists verification_tier immediately.
export function PartnerOversightView() {
  const [items, setItems] = useState<PartnerRow[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [profileStatus, setProfileStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | number | null>(null);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    const filters: Record<string, string> = { limit: "50" };
    if (query) filters.q = query;
    if (profileStatus) filters.profile_status = profileStatus;
    adminListPartners(filters)
      .then((raw) => {
        const r = raw as { items?: PartnerRow[]; pagination?: { total?: number } };
        setItems(r.items || []);
        setTotal(r.pagination?.total || 0);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load partners"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetches partners from the server on mount
    load();
  }, [load]);

  const openPartner = (channelId: string | number) => {
    setSelected(channelId);
    setProfile(null);
    setActionError(null);
    adminGetPartnerProfile(channelId)
      .then((raw) => setProfile(raw as PartnerProfile))
      .catch((e) => setActionError(e instanceof Error ? e.message : "Failed to load partner"));
  };

  const setClaim = async (claim: string, status: string) => {
    setActionError(null);
    try {
      const updated = (await adminSetVetting(selected as string | number, { claim, status })) as PartnerProfile;
      setProfile(updated);
      load();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to update vetting");
    }
  };

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-slate-900">Partners & Vetting</h1>
      <p className="mb-4 text-sm text-slate-500">
        Every partner channel, any profile status. Click a row to review and approve vetting claims.
      </p>

      <div className="mb-4 flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search by name…"
          className="max-w-xs flex-1"
        />
        <select
          value={profileStatus}
          onChange={(e) => setProfileStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <Button type="button" variant="fgBlue" onClick={load}>
          Filter
        </Button>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
        <Card className="overflow-hidden !p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Pending vetting</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow
                  key={p.channel_id}
                  onClick={() => openPartner(p.channel_id)}
                  className={`cursor-pointer ${selected === p.channel_id ? "bg-slate-50" : ""}`}
                >
                  <TableCell className="font-medium text-slate-800">{p.name || "—"}</TableCell>
                  <TableCell className="text-slate-500">{p.entity_type || "—"}</TableCell>
                  <TableCell>{p.profile_status}</TableCell>
                  <TableCell>{p.verification_tier}</TableCell>
                  <TableCell>
                    {(p.pending_vetting_count || 0) > 0 ? (
                      <span className="font-bold text-warning-ink">{p.pending_vetting_count}</span>
                    ) : (
                      <span className="text-slate-300">0</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!loading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-slate-400">
                    No partners match this filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">{total} total</div>
        </Card>

        <Card>
          {!selected && <div className="py-6 text-center text-sm text-slate-400">Select a partner to review vetting claims.</div>}
          {selected && !profile && !actionError && <div className="text-sm text-slate-400">Loading…</div>}
          {actionError && <Alert tone="error">{actionError}</Alert>}
          {profile && (
            <div>
              <div className="mb-1 font-bold text-slate-800">{profile.legal?.legal_name || "Profile"}</div>
              <div className="mb-4 text-[12px] text-slate-500">
                Tier: <b>{profile.verification_tier}</b>
              </div>
              {(profile.vetting || []).length === 0 && <div className="text-sm text-slate-400">No vetting claims submitted.</div>}
              {(profile.vetting || []).map((v) => (
                <div key={v.claim} className="flex items-center justify-between border-b border-slate-50 py-2 last:border-0">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">{v.claim}</div>
                    <div className="text-[11px] text-slate-400">{v.document_id}</div>
                  </div>
                  {v.vet_status === "VETTED" ? (
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-success-bg px-2 py-1 text-[11px] font-bold text-success-ink">VETTED</span>
                      <button type="button" onClick={() => setClaim(v.claim, "PENDING")} className="text-[11px] font-semibold text-slate-400 underline">
                        revert
                      </button>
                    </div>
                  ) : (
                    <Button type="button" variant="fgBlue" size="sm" onClick={() => setClaim(v.claim, "VETTED")} className="text-[12px] font-bold">
                      Approve
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
