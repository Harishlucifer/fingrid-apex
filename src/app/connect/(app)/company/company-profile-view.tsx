"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import {
  Building2,
  Wallet,
  Users,
  Handshake,
  Settings,
  ShieldCheck,
  Pencil,
  Check,
  Circle,
  Globe,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Card, Alert } from "@/components/connect/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectLookupsStore } from "@/stores/use-connect-lookups-store";
import { getProfile } from "@/lib/connect/connect-api";

// Read-only presentation of GET /connect/{channelId}/profile — the page as a lender sees it.
// Editing lives in the wizard at /connect/company/edit; every Edit affordance here routes there.

type Row = Record<string, unknown>;

interface ProfileData {
  legal?: {
    legal_name?: string;
    pan?: string;
    cin?: string;
    incorporation_year?: string | number;
    registered_state?: string;
    website?: string;
  };
  operations?: {
    aum?: string | number;
    monthly_disbursal?: string | number;
    loan_mix?: Row[];
    products?: string[];
    branches?: Row[];
    geography?: { states?: string[] }[];
  };
  staff?: {
    total_staff?: string | number;
    field_staff_count?: string | number;
    staff_by_role?: Row[];
  };
  empanelments?: Row[];
  credentials?: Row[];
  capabilities?: Record<string, { enabled?: boolean }>;
  entity_type?: string;
  primary_role?: string;
  caller_name?: string;
  profile_status?: string;
  verification_tier?: string;
  completion?: { percent?: number; stages?: { name: string; done: boolean }[] };
}

// Values arrive from a Go API where numbers really are numbers — never assume string here.
const text = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return s.trim();
};
const orDash = (v: unknown) => text(v) || "—";

function Section({
  icon: Icon,
  title,
  desc,
  children,
  className,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  desc?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="border-n100 mb-4 flex items-start gap-3 border-b pb-3.5">
        <span className="bg-n100 text-navy-900 grid size-9 shrink-0 place-items-center rounded-xl">
          <Icon size={17} strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-navy-900 text-[15px] font-semibold tracking-[-0.015em]">
            {title}
          </h2>
          {desc && <p className="text-n500 mt-0.5 text-[11.5px]">{desc}</p>}
        </div>
      </div>
      {children}
    </Card>
  );
}

function Facts({ items }: { items: [string, unknown][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-n400 text-[10px] font-semibold tracking-[0.06em] uppercase">{label}</dt>
          <dd className="text-navy-900 mt-0.5 truncate text-[13.5px] font-medium">{orDash(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function Chips({ values, empty }: { values: string[]; empty: string }) {
  if (!values.length) return <span className="text-n400 text-[12.5px]">{empty}</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v) => (
        <span
          key={v}
          className="border-n200 text-navy-900 rounded-full border bg-white px-2.5 py-1 text-[11.5px] font-medium"
        >
          {v}
        </span>
      ))}
    </div>
  );
}

function MiniTable({
  columns,
  rows,
  empty,
}: {
  columns: [string, string][];
  rows: Row[];
  empty: string;
}) {
  const filled = rows.filter((r) => columns.some(([key]) => text(r[key])));
  if (!filled.length) {
    return (
      <div className="border-n200 text-n400 rounded-xl border border-dashed px-3 py-4 text-center text-[12px]">
        {empty}
      </div>
    );
  }
  return (
    <div className="border-n200 overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[380px] text-left">
        <thead>
          <tr className="bg-n50 text-n500">
            {columns.map(([key, label]) => (
              <th
                key={key}
                className="px-3 py-2 text-[10px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-n100 divide-y">
          {filled.map((r, i) => (
            <tr key={i}>
              {columns.map(([key]) => (
                <td key={key} className="text-navy-900 px-3 py-2 text-[12.5px]">
                  {orDash(r[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditLink({ label = "Edit" }: { label?: string }) {
  return (
    <Link
      href="/connect/company/edit"
      className="text-n500 hover:text-navy-900 flex shrink-0 items-center gap-1 text-[12px] font-semibold transition-colors"
    >
      <Pencil size={12} strokeWidth={2.2} /> {label}
    </Link>
  );
}

export function CompanyProfileView() {
  const channelId = useConnectStore((s) => s.channelId);
  const storedEntityType = useConnectStore((s) => s.entityType);
  const businessName = useConnectStore((s) => s.businessName);
  const entityByKey = useConnectLookupsStore((s) => s.entityByKey);
  const credentialLabels = useConnectLookupsStore((s) => s.credentialLabels);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!channelId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- nothing to fetch without a channel
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getProfile(channelId)
      .then((p) => {
        if (!cancelled) setProfile(p as ProfileData);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load company profile");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
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

  if (loading) return <Card className="py-12 text-center text-sm">Loading company profile…</Card>;

  const entityType = profile?.entity_type || storedEntityType;
  const entity = entityByKey(entityType);
  const isLSP = !!entity.isLSP;
  const legal = profile?.legal || {};
  const ops = profile?.operations || {};
  const staff = profile?.staff || {};
  const stages = profile?.completion?.stages || [];
  const percent = profile?.completion?.percent ?? 0;
  const isPublished = profile?.profile_status === "PUBLISHED";
  const states = (ops.geography || []).flatMap((g) => g.states || []);
  const capabilities = profile?.capabilities || {};
  const enabledCapabilities = Object.entries(capabilities)
    .filter(([, v]) => v?.enabled)
    .map(([k]) => k);
  const displayName = text(legal.legal_name) || businessName || "Your company";

  return (
    <div className="space-y-4">
      {error && <Alert tone="warning">{error} — showing what&apos;s available.</Alert>}

      {/* Identity header */}
      <div className="ring-navy-900/5 overflow-hidden rounded-2xl border border-white bg-white shadow-[0_12px_34px_rgb(1_39_86_/_0.06)] ring-1">
        <div className="from-navy-900 relative overflow-hidden bg-gradient-to-br to-blue-600 px-5 py-5 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_-20%,rgb(50_234_148_/_0.25),transparent_48%)]"
          />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3.5">
              <span className="font-display grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-[22px] font-bold ring-1 ring-white/20">
                {displayName.trim().charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <h1 className="font-display truncate text-[clamp(19px,2.4vw,24px)] font-bold tracking-[-0.03em]">
                  {displayName}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10.5px] font-bold tracking-[0.03em]",
                      isPublished ? "bg-mint text-navy-900" : "bg-white/20 text-white",
                    )}
                  >
                    {isPublished ? "PUBLISHED" : "DRAFT"}
                  </span>
                  {(entity.label || entityType) && (
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold">
                      {entity.label || entityType}
                    </span>
                  )}
                  {profile?.verification_tier && (
                    <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold">
                      <ShieldCheck size={11} strokeWidth={2.5} /> {profile.verification_tier}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              asChild
              className="text-navy-900 h-auto shrink-0 gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold hover:bg-white/90"
            >
              <Link href="/connect/company/edit">
                <Pencil size={14} strokeWidth={2.2} /> Edit profile
              </Link>
            </Button>
          </div>
        </div>

        {/* Completion strip */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-3.5">
          <div className="flex min-w-[180px] flex-1 items-center gap-2.5">
            <div className="bg-n100 h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-blue-500),var(--color-mint))] transition-[width] duration-500"
                style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
              />
            </div>
            <span className="text-n500 shrink-0 text-[11.5px] font-bold">{percent}% complete</span>
          </div>
          {stages.length > 0 && (
            <ul className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
              {stages.map((s) => (
                <li key={s.name} className="flex items-center gap-1.5 text-[11.5px]">
                  {s.done ? (
                    <Check size={12} strokeWidth={3} className="text-success shrink-0" />
                  ) : (
                    <Circle size={9} strokeWidth={2.5} className="text-n300 shrink-0" />
                  )}
                  <span className={s.done ? "text-n700" : "text-n400"}>{s.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section icon={Building2} title="Legal identity" desc="As per MCA / PAN records.">
          <Facts
            items={[
              ["Registered legal name", legal.legal_name],
              ["PAN", legal.pan],
              ["CIN", legal.cin],
              ["Year of incorporation", legal.incorporation_year],
              ["Registered state", legal.registered_state],
              ["Website", legal.website],
            ]}
          />
          {text(legal.website) && (
            <a
              href={text(legal.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 hover:underline"
            >
              <Globe size={13} strokeWidth={2.2} /> Visit website
              <ArrowRight size={12} strokeWidth={2.2} />
            </a>
          )}
        </Section>

        <Section icon={Users} title="Staff" desc="Self-declared headcount by role and location.">
          <Facts
            items={[
              ["Total staff", staff.total_staff],
              ["Field staff", staff.field_staff_count],
            ]}
          />
          <div className="mt-4">
            <MiniTable
              columns={[
                ["role", "Role"],
                ["count", "Count"],
                ["locations", "Locations"],
              ]}
              rows={staff.staff_by_role || []}
              empty="No role breakdown added yet."
            />
          </div>
        </Section>
      </div>

      <Section
        icon={Wallet}
        title="Financial & operational scale"
        desc="AUM, monthly disbursal, geography and product mix."
      >
        <Facts
          items={[
            ["Overall AUM", text(ops.aum) ? `₹${text(ops.aum)} Cr` : ""],
            ["Monthly disbursal", text(ops.monthly_disbursal) ? `₹${text(ops.monthly_disbursal)} Cr` : ""],
          ]}
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-n400 mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase">
              <MapPin size={11} strokeWidth={2.2} /> Primary states
            </div>
            <Chips values={states} empty="No geography set." />
          </div>
          <div>
            <div className="text-n400 mb-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase">
              Products offered
            </div>
            <Chips values={ops.products || []} empty="No products set." />
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <div className="text-n400 mb-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase">
              Branches
            </div>
            <MiniTable
              columns={[
                ["location", "Location"],
                ["address", "Address"],
              ]}
              rows={ops.branches || []}
              empty="No branches added yet."
            />
          </div>
          <div>
            <div className="text-n400 mb-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase">
              Loan mix (monthly)
            </div>
            <MiniTable
              columns={[
                ["loan_type", "Loan type"],
                ["monthly_amount", "₹ Cr / month"],
              ]}
              rows={ops.loan_mix || []}
              empty="No loan mix added yet."
            />
          </div>
        </div>
      </Section>

      <Section
        icon={Handshake}
        title="Empanelments & credentials"
        desc="Lender tie-ups and regulatory registrations."
      >
        {entity.mandatoryCredential && !(profile?.credentials || []).length && (
          <Alert tone="warning">
            <b>{credentialLabels[entity.mandatoryCredential]}</b> is mandatory for entity type{" "}
            <b>{entity.label}</b> before publishing.
          </Alert>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <div className="text-n400 mb-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase">
              Lender empanelments
            </div>
            <MiniTable
              columns={[
                ["client_name", "Lender"],
                ["product_segment", "Product"],
                ["active_since", "Since"],
              ]}
              rows={profile?.empanelments || []}
              empty="No empanelments added yet."
            />
          </div>
          <div>
            <div className="text-n400 mb-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase">
              Regulatory credentials
            </div>
            <MiniTable
              columns={[
                ["type", "Type"],
                ["registration_no", "Registration no."],
              ]}
              rows={profile?.credentials || []}
              empty="No credentials added yet."
            />
          </div>
        </div>
      </Section>

      {isLSP && (
        <Section
          icon={Settings}
          title="Digital capabilities"
          desc="App, website and API readiness — LSP / aggregator only."
        >
          <div className="flex flex-wrap gap-2">
            {["app", "website", "api"].map((k) => {
              const on = !!capabilities[k]?.enabled;
              return (
                <span
                  key={k}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold capitalize",
                    on
                      ? "border-success/30 bg-success-bg text-success-ink"
                      : "border-n200 bg-white text-n400",
                  )}
                >
                  {on ? (
                    <Check size={12} strokeWidth={3} />
                  ) : (
                    <Circle size={9} strokeWidth={2.5} />
                  )}
                  {k} ready
                </span>
              );
            })}
          </div>
          {enabledCapabilities.length === 0 && (
            <p className="text-n400 mt-3 text-[11.5px]">
              None declared yet — add these in the profile workflow.
            </p>
          )}
        </Section>
      )}

      <div className="border-n200 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed px-4 py-3.5">
        <p className="text-n500 text-[12.5px]">
          {isPublished
            ? "This is the page lenders see in the directory and in requirement matches."
            : "This page is a draft — publish it from the profile workflow to appear in the directory."}
        </p>
        <EditLink label={isPublished ? "Edit in workflow" : "Continue in workflow"} />
      </div>
    </div>
  );
}
