"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Handshake, CheckCircle2, Phone, Mail, Lock, Link2, MapPin, UserRound } from "lucide-react";
import { Card, CardHeader, Alert } from "@/components/connect/card";
import { useConnectStore } from "@/stores/use-connect-store";
import { getDirectoryEntry, listPartners } from "@/lib/connect/connect-api";

interface DirectoryContact {
  person_name?: string;
  designation?: string;
  department?: string;
  mobile?: string;
  email?: string;
  linkedin?: string;
  territory?: string;
}
interface DirectoryEntryDetail {
  name?: string;
  entity_type?: string;
  state?: string;
  aum?: number;
  verification_tier?: string;
  vetted?: boolean;
  staff?: number;
  branches?: number;
  contact?: DirectoryContact;
  contact_pending_connect?: boolean;
  contact_locked_reason?: string;
}
interface RelationshipItem {
  relationship_status?: string;
  relationship_type?: string;
  connected_at?: string;
  counterparty?: { channel_id?: string | number };
}

// GET /connect/directory/:channelId gives the same channel-detail read used by Directory —
// there's no separate "relationship detail" endpoint, so relationship-specific fields
// (type/status/connected_at) come from a listPartners() lookup keyed by the target channel.
export function PartnerDetailView() {
  const params = useParams<{ channelId: string }>();
  const targetChannelId = params.channelId;
  const router = useRouter();
  const channelId = useConnectStore((s) => s.channelId);
  const [entry, setEntry] = useState<DirectoryEntryDetail | null>(null);
  const [relationship, setRelationship] = useState<RelationshipItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channelId || !targetChannelId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetches the partner detail from the server on mount
    setLoading(true);
    getDirectoryEntry(targetChannelId, channelId)
      .then((raw) => setEntry(raw as DirectoryEntryDetail))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load partner"))
      .finally(() => setLoading(false));
  }, [channelId, targetChannelId]);

  useEffect(() => {
    if (!channelId || !targetChannelId) return;
    listPartners(channelId)
      .then((raw) => {
        const items = ((raw as { items?: RelationshipItem[] }).items) || [];
        const match = items.find((p) => String(p.counterparty?.channel_id) === String(targetChannelId));
        if (match) setRelationship(match);
      })
      .catch(() => {});
  }, [channelId, targetChannelId]);

  if (loading) return <Card className="py-8 text-center text-sm">Loading partner…</Card>;

  return (
    <div>
      <button type="button" onClick={() => router.back()} className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-n700">
        <ArrowLeft size={14} strokeWidth={2} /> Back
      </button>
      {error && <Alert tone="warning">{error}</Alert>}
      {entry && (
        <Card>
          <CardHeader
            icon={<Handshake size={18} strokeWidth={2} className="text-success" />}
            iconBg="bg-success-bg"
            title={entry.name}
            desc={`${entry.entity_type} · ${entry.state || "—"}`}
          />
          {relationship && (
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded bg-success-bg px-2 py-1 text-[10px] font-bold text-success-ink">
                {relationship.relationship_status}
              </span>
              <span className="text-xs text-n500">
                {relationship.relationship_type} · partners since {relationship.connected_at?.slice(0, 10)}
              </span>
            </div>
          )}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1 text-[11px] font-bold tracking-wide text-n700 uppercase">AUM</div>
              <div className="text-sm font-semibold">{entry.aum && entry.aum > 0 ? `₹${entry.aum} Cr` : "N/A"}</div>
            </div>
            <div>
              <div className="mb-1 text-[11px] font-bold tracking-wide text-n700 uppercase">Verification tier</div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                {entry.verification_tier} {entry.vetted && <CheckCircle2 size={14} strokeWidth={2} className="text-success" />}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[11px] font-bold tracking-wide text-n700 uppercase">Staff</div>
              <div className="text-sm font-semibold">{entry.staff ?? "—"}</div>
            </div>
            <div>
              <div className="mb-1 text-[11px] font-bold tracking-wide text-n700 uppercase">Branches</div>
              <div className="text-sm font-semibold">{entry.branches ?? "—"}</div>
            </div>
          </div>
          <div className="border-t border-n200 pt-3">
            <div className="mb-1 text-[11px] font-bold tracking-wide text-n700 uppercase">Contact</div>
            {entry.contact ? (
              <div className="space-y-1 text-sm">
                {(entry.contact.person_name || entry.contact.designation) && (
                  <div className="flex items-center gap-1.5">
                    <UserRound size={13} strokeWidth={2} />
                    {[entry.contact.person_name, entry.contact.designation, entry.contact.department].filter(Boolean).join(" · ")}
                  </div>
                )}
                {entry.contact.mobile && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} strokeWidth={2} /> {entry.contact.mobile}
                  </div>
                )}
                {entry.contact.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail size={13} strokeWidth={2} /> {entry.contact.email}
                  </div>
                )}
                {entry.contact.linkedin && (
                  <div className="flex items-center gap-1.5">
                    <Link2 size={13} strokeWidth={2} /> {entry.contact.linkedin}
                  </div>
                )}
                {entry.contact.territory && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} strokeWidth={2} /> {entry.contact.territory}
                  </div>
                )}
                {entry.contact_pending_connect && (
                  <div className="flex items-center gap-1.5 text-xs text-n500">
                    <Lock size={12} strokeWidth={2} /> Some details are set to unlock only for connected partners.
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-warning-ink">
                <Lock size={13} strokeWidth={2} /> {entry.contact_locked_reason}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
