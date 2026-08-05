"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  Lock,
  Link2,
  MapPin,
  UserRound,
  Wallet,
  Users,
  Building2,
  ShieldCheck,
  ClipboardList,
  Inbox,
  Handshake,
  CalendarDays,
  Target,
} from "lucide-react";
import { Card, Alert } from "@/components/connect/card";
import { cn } from "@/lib/utils";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectLookupsStore } from "@/stores/use-connect-lookups-store";
import {
  getDirectoryEntry,
  listPartners,
  listRequirements,
  listRequests,
} from "@/lib/connect/connect-api";

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
  channel_id?: string | number;
  name?: string;
  entity_type?: string;
  primary_role?: string;
  state?: string;
  aum?: number;
  verification_tier?: string;
  vetted?: boolean;
  staff?: number;
  branches?: number;
  contact?: DirectoryContact;
  contact_pending_connect?: boolean;
  contact_locked_reason?: string;
  can_connect?: boolean;
}
interface RelationshipItem {
  relationship_id?: string | number;
  relationship_status?: string;
  relationship_type?: string;
  connected_at?: string;
  counterparty?: { channel_id?: string | number };
}
interface RequirementItem {
  requirement_id: string | number;
  partnership_type?: string;
  context?: string;
  listing_status: string;
  products?: string[];
  need?: {
    geography?: { states?: string[] };
    target_volume?: string;
    ticket_min?: number | string;
    ticket_max?: number | string;
    expected_tat?: string;
  };
}
interface RequestItem {
  request_id: string | number;
  direction: string;
  request_status: string;
  created_at?: string;
  message?: string;
  counterparty?: { channel_id?: string | number };
}

const REQ_STATUS_STYLE: Record<string, string> = {
  LIVE: "bg-success-bg text-success-ink",
  MATCHED: "bg-blue-500/10 text-blue-600",
  DRAFT: "bg-n100 text-n500",
  CLOSED: "bg-n100 text-n400",
  PENDING: "bg-warning-bg text-warning-ink",
  ACCEPTED: "bg-success-bg text-success-ink",
  REJECTED: "bg-danger-bg text-danger-ink",
};

function Metric({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="border-n200 rounded-2xl border bg-white p-3.5">
      <div className="text-n400 mb-2 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase">
        <Icon size={12} strokeWidth={2.2} /> {label}
      </div>
      <div className="font-display text-navy-900 text-[19px] leading-none font-bold tracking-[-0.025em]">
        {value}
      </div>
      {hint && <div className="text-n400 mt-1 text-[10.5px]">{hint}</div>}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  desc,
  count,
  children,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  desc?: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="border-n100 mb-4 flex items-start gap-3 border-b pb-3.5">
        <span className="bg-n100 text-navy-900 grid size-9 shrink-0 place-items-center rounded-xl">
          <Icon size={17} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-navy-900 flex items-center gap-2 text-[15px] font-semibold tracking-[-0.015em]">
            {title}
            {count != null && (
              <span className="bg-n100 text-n500 rounded-full px-2 py-0.5 text-[10.5px] font-bold">
                {count}
              </span>
            )}
          </h2>
          {desc && <p className="text-n500 mt-0.5 text-[11.5px]">{desc}</p>}
        </div>
      </div>
      {children}
    </Card>
  );
}

const dash = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return s.trim() || "—";
};
const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

// GET /connect/directory/:channelId gives the channel-detail read. Relationship fields come from
// listPartners(), the partner's own live requirements from listRequirements({channel_id}), and the
// connect-request history from listRequests() filtered to this counterparty — there is no single
// "partner detail" endpoint that bundles them.
export function PartnerDetailView() {
  const params = useParams<{ channelId: string }>();
  const targetChannelId = params.channelId;
  const router = useRouter();
  const channelId = useConnectStore((s) => s.channelId);
  const partnershipTypes = useConnectLookupsStore((s) => s.partnershipTypes);
  const entityByKey = useConnectLookupsStore((s) => s.entityByKey);

  const [entry, setEntry] = useState<DirectoryEntryDetail | null>(null);
  const [relationship, setRelationship] = useState<RelationshipItem | null>(null);
  const [requirements, setRequirements] = useState<RequirementItem[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);
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

    // The partner's own listings. Filtered to what they've actually put on the network —
    // passing channel_id bypasses the server's public/live filter, so DRAFT stays private here.
    listRequirements({ channel_id: targetChannelId })
      .then((raw) => {
        const items = ((raw as { items?: RequirementItem[] }).items) || [];
        setRequirements(
          items.filter((r) => r.listing_status === "LIVE" || r.listing_status === "MATCHED"),
        );
      })
      .catch(() => {});

    listRequests(channelId)
      .then((raw) => {
        const items = ((raw as { items?: RequestItem[] }).items) || [];
        setRequests(items.filter((r) => String(r.counterparty?.channel_id) === String(targetChannelId)));
      })
      .catch(() => {});
  }, [channelId, targetChannelId]);

  if (loading) return <Card className="py-12 text-center text-sm">Loading partner…</Card>;

  const entity = entityByKey(entry?.entity_type ?? "");
  const contact = entry?.contact;
  const typeLabel = (key?: string) =>
    partnershipTypes.find((t) => t.key === key)?.label || key || "Requirement";
  const initial = (entry?.name || "?").trim().charAt(0).toUpperCase();
  const isPartner = !!relationship;

  return (
    <div className="mx-auto w-full max-w-[980px] space-y-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-n500 hover:text-navy-900 flex items-center gap-1.5 text-xs font-semibold transition-colors"
      >
        <ArrowLeft size={14} strokeWidth={2.2} /> Back
      </button>

      {error && <Alert tone="warning">{error}</Alert>}

      {entry && (
        <>
          {/* Identity header */}
          <div className="ring-navy-900/5 overflow-hidden rounded-2xl border border-white bg-white shadow-[0_12px_34px_rgb(1_39_86_/_0.06)] ring-1">
            <div className="from-navy-900 relative overflow-hidden bg-gradient-to-br to-blue-600 px-5 py-5 text-white">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_-20%,rgb(50_234_148_/_0.25),transparent_48%)]"
              />
              <div className="relative flex flex-wrap items-start gap-4">
                <span className="font-display grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-[22px] font-bold ring-1 ring-white/20">
                  {initial}
                </span>
                <div className="min-w-0 flex-1">
                  <h1 className="font-display truncate text-[clamp(19px,2.4vw,24px)] font-bold tracking-[-0.03em]">
                    {entry.name}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {isPartner && (
                      <span className="bg-mint text-navy-900 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold tracking-[0.03em]">
                        {relationship?.relationship_status || "ACTIVE"} PARTNER
                      </span>
                    )}
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold">
                      {entity.label || entry.entity_type}
                    </span>
                    {entry.primary_role && (
                      <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold">
                        {entry.primary_role}
                      </span>
                    )}
                    {entry.verification_tier && (
                      <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold">
                        <ShieldCheck size={11} strokeWidth={2.5} /> {entry.verification_tier}
                        {entry.vetted ? " · Vetted" : ""}
                      </span>
                    )}
                    {entry.state && (
                      <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold">
                        <MapPin size={11} strokeWidth={2.5} /> {entry.state}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {relationship && (
              <div className="text-n500 flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 text-[12px]">
                <span className="flex items-center gap-1.5">
                  <Handshake size={13} strokeWidth={2.2} className="text-success" />
                  {relationship.relationship_type?.replace(/_/g, " ") || "Partnership"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} strokeWidth={2.2} />
                  Partners since {fmtDate(relationship.connected_at)}
                </span>
                {relationship.relationship_id && (
                  <span className="text-n400 font-mono text-[11px]">
                    REL-{relationship.relationship_id}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Scale */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Metric
              icon={Wallet}
              label="AUM"
              value={entry.aum && entry.aum > 0 ? `₹${entry.aum} Cr` : "N/A"}
              hint={entry.aum && entry.aum >= 100 ? "Lender-scale" : undefined}
            />
            <Metric icon={Users} label="Staff" value={dash(entry.staff)} hint="Self-declared" />
            <Metric icon={Building2} label="Branches" value={dash(entry.branches)} />
            <Metric
              icon={ShieldCheck}
              label="Verification"
              value={entry.verification_tier || "TIER_0"}
              hint={entry.vetted ? "Vetted by Fingrid" : "Not yet vetted"}
            />
          </div>

          {/* Contact */}
          <Section
            icon={UserRound}
            title="Primary contact"
            desc="The partner's page admin, subject to their own visibility settings."
          >
            {contact ? (
              <>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {[
                    ["Name", contact.person_name, UserRound],
                    ["Designation", [contact.designation, contact.department].filter(Boolean).join(" · "), ClipboardList],
                    ["Mobile", contact.mobile, Phone],
                    ["Email", contact.email, Mail],
                    ["Territory", contact.territory, MapPin],
                    ["LinkedIn", contact.linkedin, Link2],
                  ].map(([label, value, Icon]) => {
                    const I = Icon as ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
                    return (
                      <div key={label as string} className="min-w-0">
                        <dt className="text-n400 mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase">
                          <I size={11} strokeWidth={2.2} /> {label as string}
                        </dt>
                        <dd className="text-navy-900 truncate text-[13.5px] font-medium">
                          {dash(value)}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
                {entry.contact_pending_connect && (
                  <div className="text-n500 border-n100 mt-4 flex items-start gap-2 border-t pt-3 text-[11.5px]">
                    <Lock size={13} strokeWidth={2.2} className="text-n400 mt-[1px] shrink-0" />
                    Some fields are set to unlock only for connected partners.
                  </div>
                )}
              </>
            ) : (
              <div className="border-warning/40 bg-warning-bg flex items-start gap-2.5 rounded-xl border p-3.5">
                <Lock size={15} strokeWidth={2.2} className="text-warning-ink mt-[1px] shrink-0" />
                <div>
                  <div className="text-warning-ink text-[13px] font-semibold">Contact details locked</div>
                  <p className="text-n700 mt-0.5 text-[12px] leading-[1.5]">
                    {entry.contact_locked_reason ||
                      "This partner's contact details are not visible to your channel."}
                  </p>
                </div>
              </div>
            )}
          </Section>

          {/* What they're looking for */}
          <Section
            icon={Target}
            title="What they're looking for"
            desc="Live partnership requirements this organisation has published."
            count={requirements.length}
          >
            {requirements.length === 0 ? (
              <div className="border-n200 text-n400 rounded-xl border border-dashed px-4 py-6 text-center text-[12px]">
                No live requirements published by this partner.
              </div>
            ) : (
              <ul className="grid gap-2.5">
                {requirements.map((r) => {
                  const states = r.need?.geography?.states || [];
                  const ticket =
                    r.need?.ticket_min || r.need?.ticket_max
                      ? `₹${dash(r.need?.ticket_min)} – ₹${dash(r.need?.ticket_max)}`
                      : null;
                  return (
                    <li key={r.requirement_id} className="border-n200 rounded-xl border bg-white p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-display text-navy-900 text-[13.5px] font-semibold">
                          {typeLabel(r.partnership_type)}
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            REQ_STATUS_STYLE[r.listing_status] || "bg-n100 text-n500",
                          )}
                        >
                          {r.listing_status}
                        </span>
                      </div>
                      {r.context && (
                        <p className="text-n500 mt-1.5 text-[12px] leading-[1.5]">{r.context}</p>
                      )}
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {(r.products || []).map((prod) => (
                          <span
                            key={prod}
                            className="border-n200 text-navy-900 rounded-full border bg-white px-2 py-0.5 text-[11px] font-medium"
                          >
                            {prod}
                          </span>
                        ))}
                        {states.map((s) => (
                          <span
                            key={s}
                            className="text-n500 flex items-center gap-1 rounded-full bg-blue-500/[.07] px-2 py-0.5 text-[11px] font-medium"
                          >
                            <MapPin size={10} strokeWidth={2.2} /> {s}
                          </span>
                        ))}
                      </div>
                      {(ticket || r.need?.target_volume || r.need?.expected_tat) && (
                        <div className="text-n400 border-n100 mt-2.5 flex flex-wrap gap-x-4 gap-y-1 border-t pt-2.5 text-[11px]">
                          {ticket && <span>Ticket {ticket}</span>}
                          {r.need?.target_volume && <span>Volume {r.need.target_volume}</span>}
                          {r.need?.expected_tat && <span>TAT {r.need.expected_tat}</span>}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          {/* Connection history */}
          <Section
            icon={Inbox}
            title="Connection history"
            desc="Connect requests exchanged between you and this organisation."
            count={requests.length}
          >
            {requests.length === 0 ? (
              <div className="border-n200 text-n400 rounded-xl border border-dashed px-4 py-6 text-center text-[12px]">
                No connect requests on record with this organisation.
              </div>
            ) : (
              <ul className="divide-n100 divide-y">
                {requests.map((r) => (
                  <li key={r.request_id} className="flex items-start gap-3 py-2.5">
                    <span
                      className={cn(
                        "mt-[2px] rounded-full px-2 py-0.5 text-[10px] font-bold",
                        REQ_STATUS_STYLE[r.request_status] || "bg-n100 text-n500",
                      )}
                    >
                      {r.request_status}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-navy-900 text-[12.5px] font-semibold">
                        {r.direction === "sent" ? "You sent a connect request" : "They sent you a connect request"}
                      </div>
                      {r.message && <p className="text-n500 mt-0.5 text-[11.5px]">{r.message}</p>}
                    </div>
                    <span className="text-n400 shrink-0 text-[11px]">{fmtDate(r.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <div className="border-n200 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed px-4 py-3.5">
            <p className="text-n500 text-[12.5px]">
              {isPartner
                ? "You are connected — contact details follow this partner's visibility settings."
                : "Not yet connected. Send a request from the directory to unlock request-gated details."}
            </p>
            <Link
              href="/connect/directory"
              className="text-navy-900 hover:text-blue-600 flex shrink-0 items-center gap-1.5 text-[12px] font-semibold transition-colors"
            >
              Browse directory <ArrowLeft size={13} strokeWidth={2.2} className="rotate-180" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
