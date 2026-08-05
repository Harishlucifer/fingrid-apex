"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Wallet,
  Users,
  Handshake,
  Settings,
  ClipboardList,
  ArrowLeft,
  ArrowRight,
  Rocket,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { WorkflowSteps, type WorkflowStep } from "@/components/connect/workflow-steps";
import { Card, CardHeader, Field, Alert } from "@/components/connect/card";
import { DynamicTable } from "@/components/connect/dynamic-table";
import { PillSelect } from "@/components/connect/pill-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectLookupsStore } from "@/stores/use-connect-lookups-store";
import { NumericInput } from "@/components/connect/numeric-input";
import * as V from "@/lib/connect/validation";
import { useWorkflowStages, type WorkflowStage } from "@/hooks/use-workflow-stages";
import { getProfile, saveProfile, publishProfile } from "@/lib/connect/connect-api";

interface StageMeta {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
}

const STAGE_META: Record<string, StageMeta> = {
  "Legal Identity": { icon: Building2, iconBg: "bg-n100", iconColor: "text-navy-900", title: "Legal Identity", desc: "As per MCA / PAN — anchors your company page." },
  Operations: { icon: Wallet, iconBg: "bg-blue-500/10", iconColor: "text-blue-500", title: "Financial & Operational Scale", desc: "AUM, monthly disbursal, branches, loan-type volumes." },
  Staff: { icon: Users, iconBg: "bg-blue-500/10", iconColor: "text-blue-500", title: "Staff by Role & Location", desc: "Self-declared — vetting available at Verify & Publish." },
  Empanelments: { icon: Handshake, iconBg: "bg-n100", iconColor: "text-navy-900", title: "Empanelments & Credentials", desc: "Lender tie-ups and mandatory regulatory credentials." },
  Digital: { icon: Settings, iconBg: "bg-n100", iconColor: "text-navy-900", title: "Digital Capabilities", desc: "App, website, bureau integrations, API readiness — LSP only." },
  Verify: { icon: ClipboardList, iconBg: "bg-success-bg", iconColor: "text-success", title: "Verify & Publish", desc: "Review completion and publish your company page." },
};

// Fallback stage list — used only if the CONNECT_COMPANY_PROFILE workflow can't be built.
const COMPANY_STAGES: WorkflowStage[] = [
  { code: "legal", name: "Legal Identity", config: {}, taskStatus: null },
  { code: "operations", name: "Operations", config: {}, taskStatus: null },
  { code: "staff", name: "Staff", config: {}, taskStatus: null },
  { code: "empanelments", name: "Empanelments", config: {}, taskStatus: null },
  { code: "digital", name: "Digital", config: { lsp_only: true }, taskStatus: null },
  { code: "verify", name: "Verify", config: {}, taskStatus: null },
];

const inputSm = "w-full rounded-lg border-[1.5px] border-n200 px-3 py-2.5 text-sm";

type Row = Record<string, string>;

interface ProfileMeta {
  legal?: Record<string, unknown>;
  operations?: {
    aum?: string | number;
    monthly_disbursal?: string | number;
    loan_mix?: Row[];
    products?: string[];
    branches?: Row[];
    geography?: { states?: string[] }[];
  };
  staff?: { total_staff?: string | number; field_staff_count?: string | number; staff_by_role?: Row[] };
  empanelments?: Row[];
  credentials?: Row[];
  capabilities?: Record<string, { enabled?: boolean }>;
  profile_status?: string;
  verification_tier?: string;
  completion?: { stages: { name: string; done: boolean }[] };
}

export function CompanyProfileWizardView() {
  const channelId = useConnectStore((s) => s.channelId);
  const entityType = useConnectStore((s) => s.entityType);
  const router = useRouter();
  const entityByKey = useConnectLookupsStore((s) => s.entityByKey);
  const credentialLabels = useConnectLookupsStore((s) => s.credentialLabels);
  const entity = entityByKey(entityType);
  const isLSP = !!entity.isLSP;

  const { stages: allWfStages, executeStep, resumeIndex } = useWorkflowStages(
    "CONNECT_COMPANY_PROFILE",
    COMPANY_STAGES,
    { sourceId: channelId },
  );
  const stageObjs = allWfStages.filter((s) => !s.config?.lsp_only || isLSP);
  const stages = stageObjs.map((s) => s.name || "");

  const [stepIdx, setStepIdx] = useState(0);
  useEffect(() => {
    if (resumeIndex == null) return;
    const targetStepId = allWfStages[resumeIndex]?.stepId;
    const filteredIdx = stageObjs.findIndex((s) => s.stepId === targetStepId);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resumes the wizard from saved server progress, once per source
    if (filteredIdx > 0) setStepIdx(filteredIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeIndex]);
  const stageName = stages[stepIdx];
  const meta = STAGE_META[stageName];

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clears a stale error when the stage changes
    setValidationError(null);
    setFieldErrors({});
    setShowErrors(false);
  }, [stageName]);

  const [legal, setLegal] = useState({ legal_name: "", pan: "", cin: "", incorporation_year: "", registered_state: "", website: "" });
  const [operations, setOperations] = useState({ aum: "", monthly_disbursal: "" });
  const [branches, setBranches] = useState<Row[]>([]);
  const [loanMix, setLoanMix] = useState<Row[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [staff, setStaff] = useState({ total_staff: "", field_staff_count: "" });
  const [staffByRole, setStaffByRole] = useState<Row[]>([]);
  const [empanelments, setEmpanelments] = useState<Row[]>([]);
  const [credentials, setCredentials] = useState<Row[]>([]);
  const [capabilities, setCapabilities] = useState<Record<string, { enabled?: boolean }>>({});
  const [profileMeta, setProfileMeta] = useState<ProfileMeta | null>(null);

  // Loads the saved profile into the form. Inlined in the effect rather than memoised: the
  // React Compiler can't preserve a useCallback whose body sets this many pieces of state.
  useEffect(() => {
    if (!channelId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- nothing to fetch without a channel
      setLoading(false);
      setApiError("No channel — complete onboarding first.");
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const p = (await getProfile(channelId)) as ProfileMeta;
        if (cancelled) return;
        setProfileMeta(p);
        // Not a blind spread: the server's legal block is NOT all strings (incorporation_year
        // is a Go int), and everything downstream — the inputs, validateStage, the rail's
        // completeness checks — assumes strings. Coerce here, and only for keys we own, so a
        // new server field can't leak into this state shape either.
        if (p.legal) {
          const incoming = p.legal as Record<string, unknown>;
          setLegal((s) =>
            Object.fromEntries(
              Object.keys(s).map((k) => {
                const v = incoming[k];
                return [k, v == null ? s[k as keyof typeof s] : String(v)];
              }),
            ) as typeof s,
          );
        }
        if (p.operations) {
          setOperations({
            aum: String(p.operations.aum ?? ""),
            monthly_disbursal: String(p.operations.monthly_disbursal ?? ""),
          });
          setLoanMix(p.operations.loan_mix || []);
          setProducts(p.operations.products || []);
          setBranches(p.operations.branches || []);
          setStates((p.operations.geography || []).flatMap((g) => g.states || []));
        }
        if (p.staff) {
          setStaff({
            total_staff: String(p.staff.total_staff ?? ""),
            field_staff_count: String(p.staff.field_staff_count ?? ""),
          });
          setStaffByRole(p.staff.staff_by_role || []);
        }
        if (p.empanelments) setEmpanelments(p.empanelments);
        if (p.credentials) setCredentials(p.credentials);
        if (p.capabilities) setCapabilities(p.capabilities);
        setApiError(null);
      } catch (e) {
        if (cancelled) return;
        setApiError(e instanceof Error ? e.message : "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [channelId]);

  const saveStage = async (stage: string, payload: Record<string, unknown>) => {
    setSaving(true);
    setApiError(null);
    try {
      const p = (await saveProfile(channelId as string, { stage, ...payload })) as ProfileMeta;
      setProfileMeta(p);
      return true;
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "Failed to save");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ProfileRequest's numeric fields are real Go int/float64 — plain inputs only ever produce
  // strings, so this converts, dropping genuinely-empty values rather than sending 0/NaN.
  const num = (v: string) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  };

  // DynamicTable rows are all-string and can be "added but not yet filled in" — filter those
  // out before sending, and coerce this row-shape's own numeric field.
  const cleanRows = (rows: Row[], requiredKey: string, numericKey?: string) =>
    rows
      .filter((r) => (r[requiredKey] ?? "").toString().trim() !== "")
      .map((r) => (numericKey ? { ...r, [numericKey]: num(r[numericKey]) } : r));

  // Per-field rules, keyed the same as the inputs. Masking already stops letters reaching these
  // fields; the rules catch what a mask can't — required-but-empty, out-of-range, and the
  // cross-field relationships.
  const STAGE_RULES: Record<string, Record<string, V.Rule[]>> = {
    "Legal Identity": {
      legal_name: [V.required("Registered legal name")],
      pan: [V.required("PAN"), V.pan],
      cin: [V.cin],
      incorporation_year: [V.year],
      website: [V.url],
    },
    Operations: {
      aum: [V.decimal("AUM"), V.min("AUM", 0), V.max("AUM", 10_000_000)],
      monthly_disbursal: [
        V.decimal("Monthly disbursal"),
        V.min("Monthly disbursal", 0),
        V.max("Monthly disbursal", 10_000_000),
      ],
    },
    Staff: {
      total_staff: [V.integer("Total staff"), V.max("Total staff", 1_000_000)],
      field_staff_count: [V.integer("Field staff count"), V.max("Field staff count", 1_000_000)],
    },
  };

  const stageValues: Record<string, Record<string, string>> = {
    "Legal Identity": legal,
    Operations: operations,
    Staff: staff,
  };

  // Only surfaced after a failed Next, so a half-typed field isn't scolded mid-keystroke.
  const fieldError = (key: string) => (showErrors ? fieldErrors[key] : undefined);

  const validateStage = (): { errors: Record<string, string>; message: string | null } => {
    const rules = STAGE_RULES[stageName] || {};
    const errors = V.validateAll(stageValues[stageName] || {}, rules);

    // Cross-field rule — belongs to neither input alone, so it hangs off the narrower one.
    if (
      stageName === "Staff" &&
      !errors.field_staff_count &&
      staff.total_staff !== "" &&
      staff.field_staff_count !== "" &&
      Number(staff.field_staff_count) > Number(staff.total_staff)
    ) {
      errors.field_staff_count = "Field staff cannot exceed total staff.";
    }

    const count = Object.keys(errors).length;
    return {
      errors,
      message: count === 0 ? null : count === 1 ? Object.values(errors)[0] : `Fix ${count} fields to continue.`,
    };
  };

  const goNext = async () => {
    const { errors, message } = validateStage();
    setFieldErrors(errors);
    setShowErrors(true);
    if (message) {
      setValidationError(message);
      return;
    }
    setValidationError(null);

    let ok = true;
    if (stageName === "Legal Identity") {
      ok = await saveStage("LEGAL", { legal: { ...legal, incorporation_year: num(legal.incorporation_year) } });
    } else if (stageName === "Operations") {
      ok = await saveStage("OPERATIONS", {
        operations: {
          aum: num(operations.aum),
          monthly_disbursal: num(operations.monthly_disbursal),
          branches: branches.filter((r) => String(r.location ?? "").trim() !== ""),
          loan_mix: cleanRows(loanMix, "loan_type", "monthly_amount"),
          geography: states.length ? [{ states }] : undefined,
          products,
        },
      });
    } else if (stageName === "Staff") {
      ok = await saveStage("STAFF", {
        staff: {
          total_staff: num(staff.total_staff),
          field_staff_count: num(staff.field_staff_count),
          staff_by_role: cleanRows(staffByRole, "role", "count"),
        },
      });
    } else if (stageName === "Empanelments") {
      ok = await saveStage("EMPANELMENT", {
        empanelments: cleanRows(empanelments, "client_name", "active_since"),
        credentials: cleanRows(credentials, "type"),
      });
    } else if (stageName === "Digital") {
      ok = await saveStage("CAPABILITIES", { capabilities });
    }
    if (ok) {
      const stepId = stageObjs[stepIdx]?.stepId;
      if (stepId) executeStep(stepId);
      if (stepIdx < stages.length - 1) setStepIdx(stepIdx + 1);
    }
  };

  const doPublish = async () => {
    setPublishError(null);
    try {
      const p = (await publishProfile(channelId as string)) as ProfileMeta;
      setProfileMeta(p);
      const stepId = stageObjs[stepIdx]?.stepId;
      if (stepId) executeStep(stepId);
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : "Failed to publish");
    }
  };

  if (loading) return <Card className="py-10 text-center">Loading profile…</Card>;

  const isPublished = profileMeta?.profile_status === "PUBLISHED";

  const steps: WorkflowStep[] = stages.map((name, i) => ({
    label: name,
    status:
      name === "Verify" && isPublished
        ? "done"
        : i < stepIdx
          ? "done"
          : i === stepIdx
            ? "current"
            : "pending",
  }));

  // Runs inside ConnectAppShell (topbar + left menu), so no page shell of its own — and no
  // Advantages rail, which is signed-out marketing this partner is already past.
  return (
    <div className="mx-auto w-full max-w-[880px]">
      <button
        type="button"
        onClick={() => router.push("/connect/company")}
        className="text-n500 hover:text-navy-900 mb-3 flex items-center gap-1.5 text-xs font-semibold transition-colors"
      >
        <ArrowLeft size={14} strokeWidth={2.2} /> Back to company page
      </button>
      <h1 className="font-display text-navy-900 text-[clamp(23px,2.8vw,30px)] leading-[1.06] font-bold tracking-[-0.04em]">
        Build your <span className="text-grad">company page</span>.
      </h1>
      <p className="text-n500 mt-2 max-w-[58ch] text-[14px] leading-[1.6]">
        A complete, verified page is what lenders see when you appear in the directory or in a
        requirement match.
      </p>

      <WorkflowSteps
        workflowLabel="Company profile"
        steps={steps}
        currentIndex={stepIdx}
        // Any stage already reached can be revisited — each one saves independently.
        onSelect={(i) => setStepIdx(i)}
        canSelect={(i) => i <= stepIdx}
        className="mt-5 mb-4"
      />

      {apiError && <Alert tone="warning">{apiError} — form still works locally for review.</Alert>}
      {validationError && <Alert tone="error">{validationError}</Alert>}
      {meta && (
        <Card>
          <CardHeader
            icon={<meta.icon size={18} strokeWidth={2} className={meta.iconColor} />}
            iconBg={meta.iconBg}
            title={meta.title}
            desc={meta.desc}
          />

          {stageName === "Legal Identity" && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Registered legal name" required error={fieldError("legal_name")}>
                <Input
                  value={legal.legal_name}
                  aria-invalid={!!fieldError("legal_name") || undefined}
                  onChange={(e) => setLegal({ ...legal, legal_name: e.target.value })}
                  className={inputSm}
                />
              </Field>
              <Field label="PAN" required error={fieldError("pan")} hint="Format ABCDE1234F">
                <Input
                  value={legal.pan}
                  maxLength={10}
                  aria-invalid={!!fieldError("pan") || undefined}
                  onChange={(e) => setLegal({ ...legal, pan: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })}
                  placeholder="ABCDE1234F"
                  className={inputSm}
                />
              </Field>
              <Field label="CIN (if applicable)" error={fieldError("cin")} hint="21 characters">
                <Input
                  value={legal.cin}
                  maxLength={21}
                  aria-invalid={!!fieldError("cin") || undefined}
                  onChange={(e) => setLegal({ ...legal, cin: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })}
                  placeholder="U65999TN2019PTC123456"
                  className={inputSm}
                />
              </Field>
              <Field label="Year of incorporation" error={fieldError("incorporation_year")}>
                <NumericInput
                  mode="int"
                  maxLength={4}
                  value={legal.incorporation_year}
                  aria-invalid={!!fieldError("incorporation_year") || undefined}
                  onValueChange={(v) => setLegal({ ...legal, incorporation_year: v })}
                  placeholder="2019"
                  className={inputSm}
                />
              </Field>
              <Field label="Registered state">
                <Input value={legal.registered_state} onChange={(e) => setLegal({ ...legal, registered_state: e.target.value })} className={inputSm} />
              </Field>
              <Field label="Website" error={fieldError("website")}>
                <Input
                  value={legal.website}
                  aria-invalid={!!fieldError("website") || undefined}
                  onChange={(e) => setLegal({ ...legal, website: e.target.value })}
                  placeholder="https://example.com"
                  className={inputSm}
                />
              </Field>
            </div>
          )}

          {stageName === "Operations" && (
            <>
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Overall AUM" error={fieldError("aum")} hint="In ₹ crore">
                  <NumericInput
                    value={operations.aum}
                    prefix="₹"
                    suffix="Cr"
                    aria-invalid={!!fieldError("aum") || undefined}
                    onValueChange={(v) => setOperations({ ...operations, aum: v })}
                    placeholder="0"
                    className={inputSm}
                  />
                </Field>
                <Field label="Monthly disbursal" error={fieldError("monthly_disbursal")} hint="In ₹ crore per month">
                  <NumericInput
                    value={operations.monthly_disbursal}
                    prefix="₹"
                    suffix="Cr"
                    aria-invalid={!!fieldError("monthly_disbursal") || undefined}
                    onValueChange={(v) => setOperations({ ...operations, monthly_disbursal: v })}
                    placeholder="0"
                    className={inputSm}
                  />
                </Field>
              </div>
              <Field label="Primary states">
                <PillSelect multi options={["Tamil Nadu", "Karnataka", "Maharashtra", "Kerala", "Pan-India"]} value={states} onChange={(v) => setStates(v as string[])} />
              </Field>
              <Field label="Products offered">
                <PillSelect multi options={["Two-Wheeler", "Personal Loans", "MSME", "Home Loans", "Gold Loans"]} value={products} onChange={(v) => setProducts(v as string[])} />
              </Field>
              <Field label="Branches">
                <DynamicTable
                  columns={[
                    { key: "location", label: "Location", placeholder: "Coimbatore" },
                    { key: "address", label: "Address" },
                  ]}
                  rows={branches}
                  onChange={setBranches}
                  addLabel="Add branch"
                />
              </Field>
              <Field label="Loan mix (monthly)">
                <DynamicTable
                  columns={[
                    { key: "loan_type", label: "Loan Type", placeholder: "Two-Wheeler" },
                    {
                      key: "monthly_amount",
                      label: "₹ Cr / month",
                      type: "decimal" as const,
                      placeholder: "0",
                      validate: (v: string) => V.firstError(v, [V.decimal("Amount"), V.min("Amount", 0)]),
                    },
                  ]}
                  rows={loanMix}
                  onChange={setLoanMix}
                  addLabel="Add loan type"
                />
              </Field>
            </>
          )}

          {stageName === "Staff" && (
            <>
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Total staff" error={fieldError("total_staff")}>
                  <NumericInput
                    mode="int"
                    value={staff.total_staff}
                    aria-invalid={!!fieldError("total_staff") || undefined}
                    onValueChange={(v) => setStaff({ ...staff, total_staff: v })}
                    placeholder="0"
                    className={inputSm}
                  />
                </Field>
                <Field
                  label="Field staff count"
                  error={fieldError("field_staff_count")}
                  hint="Cannot exceed total staff"
                >
                  <NumericInput
                    mode="int"
                    value={staff.field_staff_count}
                    aria-invalid={!!fieldError("field_staff_count") || undefined}
                    onValueChange={(v) => setStaff({ ...staff, field_staff_count: v })}
                    placeholder="0"
                    className={inputSm}
                  />
                </Field>
              </div>
              <Field label="Staff by role">
                <DynamicTable
                  columns={[
                    { key: "role", label: "Role", placeholder: "Field Sales" },
                    {
                      key: "count",
                      label: "Count",
                      type: "int" as const,
                      placeholder: "0",
                      validate: (v: string) => V.integer("Count")(v),
                    },
                    { key: "locations", label: "Locations" },
                  ]}
                  rows={staffByRole}
                  onChange={setStaffByRole}
                  addLabel="Add role"
                />
              </Field>
            </>
          )}

          {stageName === "Empanelments" && (
            <>
              <Field label="Lender empanelments">
                <DynamicTable
                  columns={[
                    { key: "client_name", label: "Lender", placeholder: "FlexiLoans" },
                    { key: "product_segment", label: "Product" },
                    {
                      key: "active_since",
                      label: "Since (year)",
                      type: "int" as const,
                      maxLength: 4,
                      placeholder: "2021",
                      validate: (v: string) => V.year(v),
                    },
                    { key: "reference_no", label: "Ref #" },
                  ]}
                  rows={empanelments}
                  onChange={setEmpanelments}
                  addLabel="Add empanelment"
                />
              </Field>
              {entity.mandatoryCredential && (
                <Alert tone="warning">
                  <b>{credentialLabels[entity.mandatoryCredential]}</b> is mandatory for entity type <b>{entity.label}</b> before
                  publishing.
                </Alert>
              )}
              <Field label="Regulatory credentials">
                <DynamicTable
                  columns={[
                    { key: "type", label: "Type (e.g. RBI_BC)" },
                    { key: "registration_no", label: "Registration No." },
                    { key: "document_id", label: "Document ID" },
                  ]}
                  rows={credentials}
                  onChange={setCredentials}
                  addLabel="Add credential"
                />
              </Field>
            </>
          )}

          {stageName === "Digital" && (
            <>
              <p className="mb-3 text-xs text-n500">LSP-only stage — shown because entity type is LSP / Aggregator.</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {["app", "website", "api"].map((k) => (
                  <label key={k} className="flex items-center gap-2 text-sm capitalize">
                    <input
                      type="checkbox"
                      checked={!!capabilities[k]?.enabled}
                      onChange={(e) => setCapabilities({ ...capabilities, [k]: { enabled: e.target.checked } })}
                    />
                    {k} ready
                  </label>
                ))}
              </div>
            </>
          )}

          {stageName === "Verify" && (
            <>
              {profileMeta?.completion && (
                <div className="mb-4">
                  <div className="space-y-1">
                    {profileMeta.completion.stages.map((s) => {
                      const note =
                        s.name === "Digital Capabilities" && !isLSP
                          ? "N/A"
                          : s.name === "Empanelments" && !entity.mandatoryCredential
                            ? "Optional"
                            : null;
                      return (
                        <div key={s.name} className="flex items-center justify-between py-1 text-xs">
                          <span className={`flex items-center gap-1.5 ${s.done ? "text-navy-900" : "text-n500"}`}>
                            {s.done ? (
                              <CheckCircle2 size={13} strokeWidth={2} className="text-success" />
                            ) : (
                              <Circle size={13} strokeWidth={2} className="text-n300" />
                            )}
                            {s.name}
                          </span>
                          {!s.done && note && (
                            <span className="rounded bg-n50 px-1.5 py-0.5 text-[10px] font-bold text-n500">{note}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <Alert tone="info">
                Verification tier: <b>{profileMeta?.verification_tier || "TIER_0"}</b> — moves up once staff approve a submitted
                claim.
              </Alert>
              {publishError && <Alert tone="error">{publishError}</Alert>}
              {profileMeta?.profile_status === "PUBLISHED" ? (
                <Alert tone="success">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} strokeWidth={2} /> Company page is PUBLISHED.
                  </span>
                </Alert>
              ) : (
                <Button type="button" variant="fgBlue" onClick={doPublish} className="w-full gap-1.5 py-3">
                  <Rocket size={15} strokeWidth={2} /> Publish Company Page
                </Button>
              )}
            </>
          )}
        </Card>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-n200 pt-4">
        {stepIdx > 0 ? (
          <Button type="button" variant="outline" onClick={() => setStepIdx(stepIdx - 1)} className="gap-1.5 px-5 py-2.5">
            <ArrowLeft size={14} strokeWidth={2} /> Back
          </Button>
        ) : (
          <span />
        )}
        {stageName !== "Verify" && (
          <Button type="button" variant="fgBlue" disabled={saving} onClick={goNext} className="gap-1.5 px-6 py-2.5">
            {saving ? "Saving…" : (
              <>
                Save &amp; Next <ArrowRight size={14} strokeWidth={2} />
              </>
            )}
          </Button>
        )}
        {stageName === "Verify" && isPublished && (
          <Button type="button" variant="fgBlue" onClick={() => router.push("/connect/company")} className="gap-1.5 px-6 py-2.5">
            View company page <ArrowRight size={14} strokeWidth={2} />
          </Button>
        )}
      </div>
    </div>
  );
}
