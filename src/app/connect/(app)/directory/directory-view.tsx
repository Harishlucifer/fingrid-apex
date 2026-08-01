"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Phone, Mail, Lock, Handshake, CheckCircle2, ShieldCheck, Wallet, Link2, MapPin, UserRound } from "lucide-react";
import { Card, Alert, PageHeader, InitialAvatar } from "@/components/connect/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConnectStore } from "@/stores/use-connect-store";
import { listDirectory, sendConnectRequest, cancelRequest, listRequests, listPartners } from "@/lib/connect/connect-api";

interface DirectoryContact {
  person_name?: string;
  designation?: string;
  department?: string;
  mobile?: string;
  email?: string;
  linkedin?: string;
  territory?: string;
}

interface DirectoryEntry {
  channel_id: string | number;
  name?: string;
  entity_type?: string;
  state?: string;
  aum?: number;
  verification_tier?: string;
  contact?: DirectoryContact;
  contact_pending_connect?: boolean;
  contact_locked_reason?: string;
  can_connect?: boolean;
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

// BR-11 contact gate + BR-12 send-request. "Already requested"/"already partners" state is
// cross-referenced client-side from the caller's own sent requests + active partnerships,
// since the directory/matches endpoints don't filter those out server-side.
export function DirectoryView() {
  const channelId = useConnectStore((s) => s.channelId);
  const router = useRouter();
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingByTarget, setPendingByTarget] = useState<Record<string, string | number>>({});
  const [partneredIds, setPartneredIds] = useState<Set<string | number>>(new Set());
  const [actingId, setActingId] = useState<string | number | null>(null);

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
    listDirectory(channelId, query ? { q: query } : {})
      .then((raw) => setEntries(((raw as { items?: DirectoryEntry[] }).items) || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load directory"));
  }, [channelId, query]);

  useEffect(() => {
    loadRequests();
    loadPartners();
  }, [loadRequests, loadPartners]);

  const connect = async (targetChannelId: string | number) => {
    setActionError(null);
    setActingId(targetChannelId);
    try {
      const result = (await sendConnectRequest(channelId as string, { toChannelId: targetChannelId })) as {
        request_id: string | number;
      };
      setPendingByTarget((prev) => ({ ...prev, [targetChannelId]: result.request_id }));
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to send request");
      loadRequests();
    } finally {
      setActingId(null);
    }
  };

  const cancel = async (targetChannelId: string | number) => {
    const requestId = pendingByTarget[targetChannelId];
    if (!requestId) return;
    setActionError(null);
    setActingId(targetChannelId);
    try {
      await cancelRequest(channelId as string, requestId);
      setPendingByTarget((prev) => {
        const next = { ...prev };
        delete next[targetChannelId];
        return next;
      });
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to cancel request");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        icon={Search}
        title="Partner Directory"
        subtitle="Browse and connect with organisations on the network"
        action={
          <div className="relative w-52">
            <Search size={15} strokeWidth={2} className="absolute top-1/2 left-3 -translate-y-1/2 text-n500" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="pl-9" />
          </div>
        }
      />
      {error && <Alert tone="warning">{error}</Alert>}
      {actionError && <Alert tone="error">{actionError}</Alert>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => {
          const isPartnered = partneredIds.has(e.channel_id);
          const isPending = !!pendingByTarget[e.channel_id];
          const busy = actingId === e.channel_id;
          return (
            <Card key={e.channel_id} className="flex flex-col">
              <div className="mb-3 flex items-center gap-3">
                <InitialAvatar name={e.name} size="lg" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold">{e.name}</div>
                  <div className="truncate text-[11px] text-n500">
                    {e.entity_type} · {e.state || "—"}
                  </div>
                </div>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-lg bg-n100 px-2 py-1 text-[11px] font-semibold text-navy-900">
                  <Wallet size={11} strokeWidth={2} /> {e.aum && e.aum > 0 ? `₹${e.aum} Cr` : "AUM N/A"}
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-blue-500/10 px-2 py-1 text-[11px] font-semibold text-blue-600">
                  <ShieldCheck size={11} strokeWidth={2} /> {e.verification_tier}
                </span>
              </div>
              <div className="mb-3 flex-1">
                {e.contact ? (
                  <div className="space-y-1 rounded-lg bg-n50 p-2.5 text-xs">
                    {(e.contact.person_name || e.contact.designation) && (
                      <div className="flex items-center gap-1.5 truncate">
                        <UserRound size={12} strokeWidth={2} className="text-n500" />
                        {[e.contact.person_name, e.contact.designation].filter(Boolean).join(" · ")}
                        {e.contact.department ? <span className="text-n500"> · {e.contact.department}</span> : null}
                      </div>
                    )}
                    {e.contact.mobile && (
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} strokeWidth={2} className="text-n500" /> {e.contact.mobile}
                      </div>
                    )}
                    {e.contact.email && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail size={12} strokeWidth={2} className="text-n500" /> {e.contact.email}
                      </div>
                    )}
                    {e.contact.linkedin && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Link2 size={12} strokeWidth={2} className="text-n500" /> {e.contact.linkedin}
                      </div>
                    )}
                    {e.contact.territory && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin size={12} strokeWidth={2} className="text-n500" /> {e.contact.territory}
                      </div>
                    )}
                    {e.contact_pending_connect && (
                      <div className="mt-1 flex items-start gap-1.5 border-t border-n200 pt-1 text-n500">
                        <Lock size={11} strokeWidth={2} className="mt-0.5 flex-shrink-0" /> More contact details unlock once you
                        connect.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-1.5 rounded-lg bg-warning-bg p-2.5 text-[11px] text-warning-ink">
                    <Lock size={12} strokeWidth={2} className="mt-0.5 flex-shrink-0" /> {e.contact_locked_reason}
                  </div>
                )}
              </div>
              {isPartnered ? (
                <Button
                  type="button"
                  onClick={() => router.push(`/connect/partners/${e.channel_id}`)}
                  className="w-full gap-1.5 bg-success-bg py-2.5 text-xs font-bold text-success-ink hover:bg-success-bg/80"
                >
                  <Handshake size={14} strokeWidth={2} /> Already Partners — View
                </Button>
              ) : isPending ? (
                <div className="flex gap-2">
                  <span className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-warning-bg py-2.5 text-xs font-bold text-warning-ink">
                    <CheckCircle2 size={13} strokeWidth={2} /> Requested
                  </span>
                  <Button type="button" variant="outline" disabled={busy} onClick={() => cancel(e.channel_id)} className="px-3 py-2.5 text-xs">
                    {busy ? "…" : "Cancel"}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="fgBlue"
                  disabled={!e.can_connect || busy}
                  onClick={() => connect(e.channel_id)}
                  className="w-full py-2.5 text-xs"
                >
                  {busy ? "Sending…" : e.can_connect ? "Send Connect Request" : "Restricted"}
                </Button>
              )}
            </Card>
          );
        })}
        {entries.length === 0 && !error && (
          <Card className="flex flex-col items-center gap-2 py-10 text-center sm:col-span-2 lg:col-span-3">
            <Search size={24} strokeWidth={1.5} className="text-n300" />
            <div className="text-sm text-n500">No organisations found{query ? ` for "${query}"` : ""}.</div>
          </Card>
        )}
      </div>
    </div>
  );
}
