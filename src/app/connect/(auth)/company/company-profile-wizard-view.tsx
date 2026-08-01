"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
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
import { StageProgress } from "@/components/connect/stage-progress";
import { Card, CardHeader, Field, Alert } from "@/components/connect/card";
import { DynamicTable } from "@/components/connect/dynamic-table";
import { PillSelect } from "@/components/connect/pill-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectLookupsStore } from "@/stores/use-connect-lookups-store";
import { useWorkflowStages, type WorkflowStage } from "@/hooks/use-workflow-stages";
import { getProfile, saveProfile, publishProfile } from "@/lib/connect/connect-api";

interface StageMeta {
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clears a stale error when the stage changes
    setValidationError(null);
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

  const loadProfile = useCallback(async () => {
    if (!channelId) {
      setLoading(false);
      setApiError("No channel — complete onboarding first.");
      return;
    }
    setLoading(true);
    try {
      const p = (await getProfile(channelId)) as ProfileMeta;
      setProfileMeta(p);
      if (p.legal) setLegal((s) => ({ ...s, ...(p.legal as Record<string, string>) }));
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
      setApiError(e instanceof Error ? e.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetches the profile from the server on mount
    loadProfile();
  }, [loadProfile]);

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

  const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

  const validateStage = () => {
    if (stageName === "Legal Identity") {
      if (!legal.legal_name.trim()) return "Registered legal name is required.";
      if (!legal.pan.trim()) return "PAN is required.";
      if (!PAN_RE.test(legal.pan.trim())) return "PAN must be in the format ABCDE1234F.";
    }
    if (stageName === "Operations") {
      if (operations.aum !== "" && Number(operations.aum) < 0) return "AUM cannot be negative.";
      if (operations.monthly_disbursal !== "" && Number(operations.monthly_disbursal) < 0)
        return "Monthly disbursal cannot be negative.";
    }
    if (stageName === "Staff") {
      if (staff.total_staff !== "" && Number(staff.total_staff) < 0) return "Total staff cannot be negative.";
      if (staff.field_staff_count !== "" && Number(staff.field_staff_count) < 0)
        return "Field staff count cannot be negative.";
      if (
        staff.total_staff !== "" &&
        staff.field_staff_count !== "" &&
        Number(staff.field_staff_count) > Number(staff.total_staff)
      ) {
        return "Field staff count cannot exceed total staff.";
      }
    }
    return null;
  };

  const goNext = async () => {
    const validationMessage = validateStage();
    if (validationMessage) {
      setValidationError(validationMessage);
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
          branches: branches.filter((r) => (r.location ?? "").trim() !== ""),
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

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push("/connect/dashboard")}
        className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-n700"
      >
        <ArrowLeft size={14} strokeWidth={2} /> Back to Dashboard
      </button>
      <StageProgress workflowLabel="Company Profile" stageLabel={stageName} currentIndex={stepIdx} total={stages.length} />
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
              <Field label="Registered legal name" required>
                <Input value={legal.legal_name} onChange={(e) => setLegal({ ...legal, legal_name: e.target.value })} className={inputSm} />
              </Field>
              <Field label="PAN" required>
                <Input value={legal.pan} onChange={(e) => setLegal({ ...legal, pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" className={inputSm} />
              </Field>
              <Field label="CIN (if applicable)">
                <Input value={legal.cin} onChange={(e) => setLegal({ ...legal, cin: e.target.value })} className={inputSm} />
              </Field>
              <Field label="Year of incorporation">
                <Input value={legal.incorporation_year} onChange={(e) => setLegal({ ...legal, incorporation_year: e.target.value })} className={inputSm} />
              </Field>
              <Field label="Registered state">
                <Input value={legal.registered_state} onChange={(e) => setLegal({ ...legal, registered_state: e.target.value })} className={inputSm} />
              </Field>
              <Field label="Website">
                <Input value={legal.website} onChange={(e) => setLegal({ ...legal, website: e.target.value })} placeholder="https://" className={inputSm} />
              </Field>
            </div>
          )}

          {stageName === "Operations" && (
            <>
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Overall AUM (₹ Cr)">
                  <Input value={operations.aum} onChange={(e) => setOperations({ ...operations, aum: e.target.value })} className={inputSm} />
                </Field>
                <Field label="Monthly disbursal (₹ Cr)">
                  <Input value={operations.monthly_disbursal} onChange={(e) => setOperations({ ...operations, monthly_disbursal: e.target.value })} className={inputSm} />
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
                    { key: "monthly_amount", label: "₹ Cr / month" },
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
                <Field label="Total staff">
                  <Input value={staff.total_staff} onChange={(e) => setStaff({ ...staff, total_staff: e.target.value })} className={inputSm} />
                </Field>
                <Field label="Field staff count">
                  <Input value={staff.field_staff_count} onChange={(e) => setStaff({ ...staff, field_staff_count: e.target.value })} className={inputSm} />
                </Field>
              </div>
              <Field label="Staff by role">
                <DynamicTable
                  columns={[
                    { key: "role", label: "Role", placeholder: "Field Sales" },
                    { key: "count", label: "Count" },
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
                    { key: "active_since", label: "Since" },
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
        {stageName === "Verify" && profileMeta?.profile_status === "PUBLISHED" && (
          <Button type="button" variant="fgBlue" onClick={() => router.push("/connect/dashboard")} className="gap-1.5 px-6 py-2.5">
            Go to Dashboard <ArrowRight size={14} strokeWidth={2} />
          </Button>
        )}
      </div>
    </div>
  );
}
