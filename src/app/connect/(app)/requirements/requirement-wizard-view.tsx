"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Handshake, Package, ShieldCheck, ClipboardList, ArrowLeft, ArrowRight, Rocket } from "lucide-react";
import { WorkflowSteps, type WorkflowStep } from "@/components/connect/workflow-steps";
import { NumericInput } from "@/components/connect/numeric-input";
import * as V from "@/lib/connect/validation";
import { Card, CardHeader, Field, Alert } from "@/components/connect/card";
import { PillSelect } from "@/components/connect/pill-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectLookupsStore } from "@/stores/use-connect-lookups-store";
import { useWorkflowStages, type WorkflowStage } from "@/hooks/use-workflow-stages";
import { getRequirement, saveRequirement } from "@/lib/connect/connect-api";

// Fallback stage list — used only if the CONNECT_REQUIREMENT workflow can't be built.
const REQUIREMENT_STAGES: WorkflowStage[] = [
  { code: "type", name: "Type & Context", config: {}, taskStatus: null },
  { code: "need", name: "What You Need", config: {}, taskStatus: null },
  { code: "criteria", name: "Criteria", config: {}, taskStatus: null },
  { code: "review", name: "Review", config: {}, taskStatus: null },
];

const STAGE_META = [
  { icon: Handshake, iconBg: "bg-n100", iconColor: "text-navy-900", title: "What partnership are you seeking?", desc: "Partnership type, product focus, and background context." },
  { icon: Package, iconBg: "bg-blue-500/10", iconColor: "text-blue-500", title: "What you need from the partner", desc: "Geography, volume, ticket size, and turnaround expectations." },
  { icon: ShieldCheck, iconBg: "bg-n100", iconColor: "text-navy-900", title: "Minimum criteria for counterparty", desc: "Verification tier and scale thresholds candidates must meet." },
  { icon: ClipboardList, iconBg: "bg-success-bg", iconColor: "text-success", title: "Review & publish", desc: "Confirm details — auto-match runs once this goes live." },
];

const inputSm = "w-full rounded-lg border-[1.5px] border-n200 px-3 py-2.5 text-sm";

interface RequirementDetail {
  requirement_id?: string | number;
  partnership_type?: string;
  context?: string;
  products?: string[];
  need?: {
    geography?: { states?: string[] };
    target_volume?: string;
    ticket_min?: number | string;
    ticket_max?: number | string;
    cases_per_month?: number | string;
    expected_tat?: string;
  };
  criteria?: {
    min_verification_tier?: string;
    min_aum?: number | string;
    min_branches?: number | string;
    min_field_staff?: number | string;
  };
}

export function RequirementWizardView() {
  const channelId = useConnectStore((s) => s.channelId);
  const partnershipTypes = useConnectLookupsStore((s) => s.partnershipTypes);
  const router = useRouter();
  const params = useParams<{ requirementId?: string }>();
  const routeRequirementId = params.requirementId;

  const [stepIdx, setStepIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!routeRequirementId);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [requirementId, setRequirementId] = useState<string | number | null>(routeRequirementId || null);

  const [partnershipType, setPartnershipType] = useState("");
  const [context, setContext] = useState("");
  const [products, setProducts] = useState<string[]>([]);

  const [states, setStates] = useState<string[]>([]);
  const [targetVolume, setTargetVolume] = useState("");
  const [ticketMin, setTicketMin] = useState("");
  const [ticketMax, setTicketMax] = useState("");
  const [casesPerMonth, setCasesPerMonth] = useState("");
  const [expectedTat, setExpectedTat] = useState("");

  const [minTier, setMinTier] = useState("");
  const [minAum, setMinAum] = useState("");
  const [minBranches, setMinBranches] = useState("");
  const [minFieldStaff, setMinFieldStaff] = useState("");

  const { stages: wfStages, executeStep, resumeIndex } = useWorkflowStages(
    "CONNECT_REQUIREMENT",
    REQUIREMENT_STAGES,
    { sourceId: requirementId },
  );
  const STAGES = wfStages.map((s) => s.name || "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resumes the wizard from saved server progress, once per source
    if (resumeIndex != null) setStepIdx(resumeIndex);
  }, [resumeIndex]);

  // Editing an existing draft — load its saved fields.
  useEffect(() => {
    if (!routeRequirementId || !channelId) return;
    let cancelled = false;
    getRequirement(channelId, routeRequirementId)
      .then((raw) => {
        if (cancelled) return;
        const r = raw as RequirementDetail;
        setPartnershipType(r.partnership_type || "");
        setContext(r.context || "");
        setProducts(r.products || []);
        setStates(r.need?.geography?.states || []);
        setTargetVolume(r.need?.target_volume || "");
        setTicketMin(String(r.need?.ticket_min ?? ""));
        setTicketMax(String(r.need?.ticket_max ?? ""));
        setCasesPerMonth(String(r.need?.cases_per_month ?? ""));
        setExpectedTat(r.need?.expected_tat || "");
        setMinTier(r.criteria?.min_verification_tier || "");
        setMinAum(String(r.criteria?.min_aum ?? ""));
        setMinBranches(String(r.criteria?.min_branches ?? ""));
        setMinFieldStaff(String(r.criteria?.min_field_staff ?? ""));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load requirement"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [routeRequirementId, channelId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clears a stale error when the stage changes
    setValidationError(null);
    setFieldErrors({});
    setShowErrors(false);
  }, [stepIdx]);

  const buildPayload = (extra: Record<string, unknown> = {}) => ({
    requirement_id: requirementId || undefined,
    partnership_type: partnershipType,
    context,
    products,
    need: {
      geography: { states },
      target_volume: targetVolume,
      ticket_min: Number(ticketMin) || undefined,
      ticket_max: Number(ticketMax) || undefined,
      cases_per_month: Number(casesPerMonth) || undefined,
      expected_tat: expectedTat,
    },
    criteria: {
      min_verification_tier: minTier || undefined,
      min_aum: Number(minAum) || undefined,
      min_branches: Number(minBranches) || undefined,
      min_field_staff: Number(minFieldStaff) || undefined,
    },
    ...extra,
  });

  const save = async (extra?: Record<string, unknown>) => {
    if (!channelId) {
      setError("No channel — complete onboarding first.");
      return null;
    }
    setSaving(true);
    setError(null);
    try {
      const r = (await saveRequirement(channelId, buildPayload(extra))) as RequirementDetail;
      setRequirementId(r.requirement_id ?? null);
      return r;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save requirement");
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Per-stage field rules. The numeric inputs are masked so letters can't get in; these catch
  // required-but-empty, out-of-range, and min/max inversion.
  const validateStage = (): { errors: Record<string, string>; message: string | null } => {
    let errors: Record<string, string> = {};

    if (stepIdx === 0) {
      if (!partnershipType) errors.partnership_type = "Partnership type is required.";
    }

    if (stepIdx === 1) {
      errors = {
        ...errors,
        ...V.validateAll(
          { cases_per_month: casesPerMonth, ticket_min: ticketMin, ticket_max: ticketMax },
          {
            cases_per_month: [V.integer("Cases per month"), V.max("Cases per month", 1_000_000)],
            ticket_min: [V.decimal("Ticket min"), V.min("Ticket min", 0)],
            ticket_max: [V.decimal("Ticket max"), V.min("Ticket max", 0)],
          },
        ),
      };
      if (!errors.ticket_max && ticketMin !== "" && ticketMax !== "" && Number(ticketMin) > Number(ticketMax)) {
        errors.ticket_max = "Ticket max must be greater than ticket min.";
      }
    }

    if (stepIdx === 2) {
      errors = {
        ...errors,
        ...V.validateAll(
          { min_aum: minAum, min_branches: minBranches, min_field_staff: minFieldStaff },
          {
            min_aum: [V.decimal("Min AUM"), V.min("Min AUM", 0)],
            min_branches: [V.integer("Min branches"), V.max("Min branches", 100_000)],
            min_field_staff: [V.integer("Min field staff"), V.max("Min field staff", 1_000_000)],
          },
        ),
      };
    }

    const count = Object.keys(errors).length;
    return {
      errors,
      message: count === 0 ? null : count === 1 ? Object.values(errors)[0] : `Fix ${count} fields to continue.`,
    };
  };

  const fieldError = (key: string) => (showErrors ? fieldErrors[key] : undefined);

  const goNext = async () => {
    const { errors, message } = validateStage();
    setFieldErrors(errors);
    setShowErrors(true);
    if (message) {
      setValidationError(message);
      return;
    }
    setValidationError(null);
    const r = await save();
    if (r) {
      const stepId = wfStages[stepIdx]?.stepId;
      if (stepId && r.requirement_id != null) executeStep(stepId, { sourceId: r.requirement_id });
      setStepIdx(stepIdx + 1);
    }
  };

  const publish = async () => {
    const { errors, message } = validateStage();
    setFieldErrors(errors);
    setShowErrors(true);
    if (message) {
      setValidationError(message);
      return;
    }
    setValidationError(null);
    const r = await save({ listing_status: "LIVE" });
    if (r) {
      const stepId = wfStages[stepIdx]?.stepId;
      if (stepId && r.requirement_id != null) executeStep(stepId, { sourceId: r.requirement_id });
      router.push("/connect/requirements");
    }
  };

  if (loading) return <Card className="py-10 text-center">Loading requirement…</Card>;

  const stageMeta = STAGE_META[stepIdx];
  const StageIcon = stageMeta.icon;

  const steps: WorkflowStep[] = STAGES.map((name, i) => ({
    label: name || STAGE_META[i]?.title || `Stage ${i + 1}`,
  }));

  // Runs inside ConnectAppShell (topbar + left menu), so no page shell of its own — and no
  // Advantages rail, which is signed-out marketing this partner is already past.
  return (
    <div className="mx-auto w-full max-w-[880px]">
      <button
        type="button"
        onClick={() => router.push("/connect/requirements")}
        className="text-n500 hover:text-navy-900 mb-3 flex items-center gap-1.5 text-xs font-semibold transition-colors"
      >
        <ArrowLeft size={14} strokeWidth={2.2} /> Back to requirements
      </button>
      <h1 className="font-display text-navy-900 text-[clamp(23px,2.8vw,30px)] leading-[1.06] font-bold tracking-[-0.04em]">
        Post a <span className="text-grad">partnership requirement</span>.
      </h1>
      <p className="text-n500 mt-2 max-w-[58ch] text-[14px] leading-[1.6]">
        Describe what you need and Connect ranks candidates across the network by geography,
        product fit, ticket size and verification tier.
      </p>

      <WorkflowSteps
        workflowLabel="Requirement listing"
        steps={steps}
        currentIndex={stepIdx}
        onSelect={(i) => setStepIdx(i)}
        canSelect={(i) => i <= stepIdx}
        className="mt-5 mb-4"
      />

      {error && <Alert tone="error">{error}</Alert>}
      {validationError && <Alert tone="error">{validationError}</Alert>}
      <Card>
        <CardHeader
          icon={<StageIcon size={18} strokeWidth={2} className={stageMeta.iconColor} />}
          iconBg={stageMeta.iconBg}
          title={stageMeta.title}
          desc={stageMeta.desc}
        />
        {stepIdx === 0 && (
          <>
            <Field label="Partnership type" required error={fieldError("partnership_type")}>
              <select
                value={partnershipType}
                aria-invalid={!!fieldError("partnership_type") || undefined}
                onChange={(e) => setPartnershipType(e.target.value)}
                className={inputSm}
              >
                <option value="">Select…</option>
                {partnershipTypes.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Product focus">
              <PillSelect multi options={["Two-Wheeler", "Personal Loans", "MSME", "Home Loans", "Gold Loans"]} value={products} onChange={(v) => setProducts(v as string[])} />
            </Field>
            <Field label="Context / background">
              <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={3} className={`${inputSm} resize-none`} />
            </Field>
          </>
        )}

        {stepIdx === 1 && (
          <>
            <Field label="Primary states">
              <PillSelect multi options={["Tamil Nadu", "Karnataka", "Maharashtra", "Kerala", "Pan-India"]} value={states} onChange={(v) => setStates(v as string[])} />
            </Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Target volume / month">
                <Input value={targetVolume} onChange={(e) => setTargetVolume(e.target.value)} placeholder="₹5 Cr" className={inputSm} />
              </Field>
              <Field label="Cases / month" error={fieldError("cases_per_month")}>
                <NumericInput
                  mode="int"
                  value={casesPerMonth}
                  aria-invalid={!!fieldError("cases_per_month") || undefined}
                  onValueChange={setCasesPerMonth}
                  placeholder="0"
                  className={inputSm}
                />
              </Field>
              <Field label="Ticket min" error={fieldError("ticket_min")} hint="Per case, in ₹">
                <NumericInput
                  value={ticketMin}
                  prefix="₹"
                  aria-invalid={!!fieldError("ticket_min") || undefined}
                  onValueChange={setTicketMin}
                  placeholder="50000"
                  className={inputSm}
                />
              </Field>
              <Field label="Ticket max" error={fieldError("ticket_max")} hint="Must exceed ticket min">
                <NumericInput
                  value={ticketMax}
                  prefix="₹"
                  aria-invalid={!!fieldError("ticket_max") || undefined}
                  onValueChange={setTicketMax}
                  placeholder="300000"
                  className={inputSm}
                />
              </Field>
            </div>
            <Field label="Expected TAT">
              <Input value={expectedTat} onChange={(e) => setExpectedTat(e.target.value)} placeholder="48 hours" className={inputSm} />
            </Field>
          </>
        )}

        {stepIdx === 2 && (
          <>
            <Field label="Minimum verification tier">
              <select value={minTier} onChange={(e) => setMinTier(e.target.value)} className={inputSm}>
                <option value="">Any tier</option>
                <option value="TIER_1">Tier 1</option>
                <option value="TIER_2">Tier 2</option>
                <option value="TIER_3">Tier 3</option>
              </select>
            </Field>
            <Alert tone="warning">
              Every candidate is TIER_0 today (no vetting-review action exists yet) — any tier above TIER_0 here will currently
              exclude every candidate.
            </Alert>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Min AUM" error={fieldError("min_aum")} hint="In ₹ crore">
                <NumericInput
                  value={minAum}
                  prefix="₹"
                  suffix="Cr"
                  aria-invalid={!!fieldError("min_aum") || undefined}
                  onValueChange={setMinAum}
                  placeholder="0"
                  className={inputSm}
                />
              </Field>
              <Field label="Min branches" error={fieldError("min_branches")}>
                <NumericInput
                  mode="int"
                  value={minBranches}
                  aria-invalid={!!fieldError("min_branches") || undefined}
                  onValueChange={setMinBranches}
                  placeholder="0"
                  className={inputSm}
                />
              </Field>
              <Field label="Min field staff" error={fieldError("min_field_staff")}>
                <NumericInput
                  mode="int"
                  value={minFieldStaff}
                  aria-invalid={!!fieldError("min_field_staff") || undefined}
                  onValueChange={setMinFieldStaff}
                  placeholder="0"
                  className={inputSm}
                />
              </Field>
            </div>
          </>
        )}

        {stepIdx === 3 && (
          <>
            {(
              [
                ["Type", partnershipTypes.find((t) => t.key === partnershipType)?.label || "—"],
                ["Products", products.join(", ") || "—"],
                ["Geography", states.join(", ") || "—"],
                ["Volume", targetVolume || "—"],
                ["Ticket range", `${ticketMin || "—"} – ${ticketMax || "—"}`],
              ] as const
            ).map(([l, v]) => (
              <div key={l} className="flex justify-between border-b border-n200 py-1.5 text-[13px]">
                <span className="text-n500">{l}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
            <Alert tone="info">
              On publish, auto-match ranks candidates by geography, product fit, ticket size, and verification tier
              (async, cron-driven).
            </Alert>
          </>
        )}
      </Card>

      <div className="mt-4 flex items-center justify-between border-t border-n200 pt-4">
        {stepIdx > 0 ? (
          <Button type="button" variant="outline" onClick={() => setStepIdx(stepIdx - 1)} className="gap-1.5 px-5 py-2.5">
            <ArrowLeft size={14} strokeWidth={2} /> Back
          </Button>
        ) : (
          <span />
        )}
        {stepIdx < STAGES.length - 1 ? (
          <Button type="button" variant="fgBlue" disabled={saving} onClick={goNext} className="gap-1.5 px-6 py-2.5">
            {saving ? "Saving…" : (
              <>
                Save &amp; Next <ArrowRight size={14} strokeWidth={2} />
              </>
            )}
          </Button>
        ) : (
          <Button type="button" variant="fgBlue" disabled={saving} onClick={publish} className="gap-1.5 px-6 py-2.5">
            <Rocket size={14} strokeWidth={2} /> Publish Requirement
          </Button>
        )}
      </div>
    </div>
  );
}
