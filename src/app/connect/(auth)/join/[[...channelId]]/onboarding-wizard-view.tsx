"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Rocket,
  Building2,
  Clock,
  Mail,
  UserRound,
  Users,
  Link2,
  Store,
  Landmark,
  Home as HomeIcon,
  Handshake,
  Search,
  Briefcase,
  Scale,
  Building,
  Loader2,
  ShieldCheck,
  Pencil,
  Sparkles,
} from "lucide-react";
import { StageProgress } from "@/components/connect/stage-progress";
import { Card, Field, Alert, InitialAvatar } from "@/components/connect/card";
import { PillSelect } from "@/components/connect/pill-select";
import { OtpInput } from "@/components/connect/otp-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectTenantStore } from "@/stores/use-connect-tenant-store";
import { useConnectLookupsStore } from "@/stores/use-connect-lookups-store";
import { useWorkflowStages, type WorkflowStage } from "@/hooks/use-workflow-stages";
import {
  registerConnectAccount,
  sendIdentityOtp,
  verifyIdentityOtp,
  sendSignInOtp,
  resendSignInOtp,
  verifySignInOtp,
  checkIdentity,
  searchCompanyMaster,
  executeWorkflowStep,
} from "@/lib/connect/connect-api";

// Fallback stage list — used only if the CONNECT_ONBOARDING workflow can't be built.
const ONBOARDING_STAGES: WorkflowStage[] = [
  { code: "identity", name: "Identity", config: {}, taskStatus: null },
  { code: "details", name: "Your Details", config: {}, taskStatus: null },
  { code: "preferences", name: "Preferences", config: {}, taskStatus: null },
  { code: "company", name: "Company", config: {}, taskStatus: null },
  { code: "verify", name: "Verify", config: {}, taskStatus: null },
];

const ENTITY_ICONS: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  dsa_ind: UserRound,
  dsa_firm: Users,
  lsp: Link2,
  bc: Store,
  nbfc: Landmark,
  bank: Building2,
  hfc: HomeIcon,
  colender: Handshake,
  verif_agency: Search,
  collection_agency: Briefcase,
  legal_agency: Scale,
  property_agency: Building,
};

// Maps a UI visibility choice to the real ConnectPreferenceParams.Visibility values.
const VIS_CODE: Record<string, string> = { public: "pub", request: "req", private: "priv" };

const inputLg = "w-full rounded-lg border-2 border-n200 px-3.5 py-3 text-[15px]";
const inputSm = "w-full rounded-lg border-[1.5px] border-n200 px-3 py-2.5 text-sm";

interface IdentityCompany {
  channel_id?: string | number;
  name?: string;
  entity_type?: string;
  state?: string;
  verification_tier?: string;
}

interface ExistingRegistration {
  channel_id?: string | number;
  mobile?: string;
  name?: string;
}

interface McaResult {
  cin: string;
  name: string;
  category?: string;
  state?: string;
  date_of_incorporation?: string;
}

export function OnboardingWizardView() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const params = useParams<{ channelId?: string[] }>();
  const routeChannelId = params.channelId?.[0];

  const setIdentity = useConnectStore((s) => s.setIdentity);
  const tenant = useConnectTenantStore((s) => s.tenant);
  const setTenant = useConnectTenantStore((s) => s.setTenant);
  const tenantName = (tenant?.TENANT_NAME as string | undefined) || "Fingrid Connect";

  const ENTITY_TYPES = useConnectLookupsStore((s) => s.entityTypes);
  const isPersonalDomain = useConnectLookupsStore((s) => s.isPersonalDomain);
  const entityByKey = useConnectLookupsStore((s) => s.entityByKey);
  const designationsByEntityType = useConnectLookupsStore((s) => s.designationsByEntityType);
  const departmentsByEntityType = useConnectLookupsStore((s) => s.departmentsByEntityType);

  const { stages: wfStages } = useWorkflowStages("CONNECT_ONBOARDING", ONBOARDING_STAGES, { guest: true });
  const STEPS = wfStages.map((s) => s.name || "");

  const recordOnboardingSteps = async (sourceId: string | number, stageObjs: WorkflowStage[]) => {
    for (const s of stageObjs) {
      if (!s.stepId) continue;
      try {
        await executeWorkflowStep("CONNECT_ONBOARDING", { stepId: s.stepId, sourceId, guest: true });
      } catch {
        /* best-effort */
      }
    }
  };

  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [personal, setPersonal] = useState(false);
  const [entityType, setEntityType] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyPan, setCompanyPan] = useState("");

  const [companyMode, setCompanyMode] = useState<"join" | "mca" | "manual" | null>(null);
  const [identityChecking, setIdentityChecking] = useState(false);
  const [identityCompany, setIdentityCompany] = useState<IdentityCompany | null>(null);
  const [existingRegistration, setExistingRegistration] = useState<ExistingRegistration | null>(null);
  const [resuming, setResuming] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [showEntitySearch, setShowEntitySearch] = useState(false);
  const [mcaQuery, setMcaQuery] = useState("");
  const [mcaSearching, setMcaSearching] = useState(false);
  const [mcaResults, setMcaResults] = useState<McaResult[]>([]);
  const [mcaError, setMcaError] = useState<string | null>(null);
  const [selectedMca, setSelectedMca] = useState<McaResult | null>(null);
  const identityRequestId = useRef(0);
  const mcaDebounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [sendingMobileOtp, setSendingMobileOtp] = useState(false);
  const [mobileOtpError, setMobileOtpError] = useState<string | null>(null);
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [territory, setTerritory] = useState("");

  const [visibility, setVisibility] = useState<Record<string, string>>({
    mobile: "request",
    email: "request",
    linkedin: "public",
    territory: "public",
  });
  const [interests, setInterests] = useState<string[]>([]);

  const [companyChoice, setCompanyChoice] = useState<"now" | "later" | "invite" | null>(null);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string | number | null>(routeChannelId || null);
  const [otpSent, setOtpSent] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const onEmailChange = (val: string) => {
    setEmail(val);
    setEmailVerified(false);
    setEmailOtpSent(false);
    setEmailOtpError(null);
    setCompanyMode(null);
    setCompanyChoice(null);
    setIdentityCompany(null);
    setExistingRegistration(null);
    setResumeError(null);
    setShowEntitySearch(false);
    setMcaQuery("");
    setMcaResults([]);
    setMcaError(null);
    setSelectedMca(null);
    setCompanyName("");
    setCompanyPan("");
    const at = val.indexOf("@");
    if (at < 1 || val.indexOf(".", at) < 0) {
      setDomain("");
      return;
    }
    const d = val.slice(at + 1).toLowerCase();
    setDomain(d);
    const isP = isPersonalDomain(d);
    setPersonal(isP);
    setEntityType(isP ? "dsa_ind" : "");
  };

  // WF1 identity check — debounced, guarded against a fast-typing race via a monotonic id.
  useEffect(() => {
    if (!domain || personal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs the checking flag off when there's nothing to check
      setIdentityChecking(false);
      return;
    }
    const myRequestId = ++identityRequestId.current;
    setIdentityChecking(true);
    const t = setTimeout(async () => {
      try {
        const result = await checkIdentity(email);
        if (identityRequestId.current !== myRequestId) return;
        setIdentityCompany((result?.company as IdentityCompany) || null);
        setExistingRegistration((result?.existing_registration as ExistingRegistration) || null);
      } catch {
        if (identityRequestId.current !== myRequestId) return;
        setIdentityCompany(null);
        setExistingRegistration(null);
      } finally {
        if (identityRequestId.current === myRequestId) setIdentityChecking(false);
      }
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, personal]);

  // MCA-master name search — debounced the same way.
  useEffect(() => {
    clearTimeout(mcaDebounce.current);
    if (!mcaQuery.trim() || mcaQuery.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clears stale results when the query is cleared
      setMcaResults([]);
      return;
    }
    mcaDebounce.current = setTimeout(async () => {
      setMcaSearching(true);
      setMcaError(null);
      try {
        const results = await searchCompanyMaster(mcaQuery.trim());
        setMcaResults(results as McaResult[]);
      } catch (err) {
        setMcaError(err instanceof Error ? err.message : "Company search failed");
        setMcaResults([]);
      } finally {
        setMcaSearching(false);
      }
    }, 400);
    return () => clearTimeout(mcaDebounce.current);
  }, [mcaQuery]);

  const sendEmailOtp = async () => {
    setEmailOtpError(null);
    setSendingEmailOtp(true);
    try {
      await sendIdentityOtp({ email });
      setEmailOtpSent(true);
    } catch (err) {
      setEmailOtpError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const verifyEmailOtp = async (code: string) => {
    try {
      await verifyIdentityOtp({ email, otp: code });
      setEmailVerified(true);
      return true;
    } catch {
      return false;
    }
  };

  const sendMobileOtp = async () => {
    setMobileOtpError(null);
    setSendingMobileOtp(true);
    try {
      await sendIdentityOtp({ mobile });
      setMobileOtpSent(true);
    } catch (err) {
      setMobileOtpError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setSendingMobileOtp(false);
    }
  };

  const verifyMobileOtp = async (code: string) => {
    try {
      await verifyIdentityOtp({ mobile, otp: code });
      setMobileVerified(true);
      return true;
    } catch {
      return false;
    }
  };

  // "Continue your registration" — this exact email already has an account; jump straight to
  // the Verify step and send a fresh OTP to the mobile already on file.
  const resumeRegistration = async () => {
    if (!existingRegistration) return;
    setResumeError(null);
    setResuming(true);
    try {
      const existingChannelId = existingRegistration.channel_id;
      const existingMobile = existingRegistration.mobile || "";
      setChannelId(existingChannelId ?? null);
      setMobile(existingMobile);
      await sendSignInOtp(existingMobile);
      setOtpSent(true);
      router.replace(`/connect/join/${existingChannelId}`);
      const verifyIdx = STEPS.findIndex((s) => s === "Verify");
      setStep(verifyIdx >= 0 ? verifyIdx : STEPS.length - 1);
    } catch (err) {
      setResumeError(err instanceof Error ? err.message : "Failed to resume registration");
    } finally {
      setResuming(false);
    }
  };

  const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const allowedEntities = personal ? ENTITY_TYPES.filter((e) => e.key === "dsa_ind") : ENTITY_TYPES;
  const companyResolved =
    personal ||
    (companyMode === "join" && !!identityCompany) ||
    (companyMode === "mca" && !!selectedMca) ||
    (companyMode === "manual" && !!companyName.trim() && PAN_RE.test(companyPan.trim()));
  const canContinueStage1 = emailVerified && !!entityType && companyResolved;
  const canContinueStage2 = !!firstName && !!lastName && mobileVerified && !!designation;
  const canFinishStage4 = !!companyChoice && (companyChoice !== "invite" || (!!inviteName.trim() && !!inviteEmail.trim()));

  const startRegistration = async () => {
    setRegisterError(null);
    setRegistering(true);
    try {
      const payload: Record<string, unknown> = {
        email,
        scenario: personal ? "personal" : "create",
        entity_type: entityType,
        profile: {
          first_name: firstName,
          last_name: lastName,
          mobile,
          designation,
          department,
          territory: territory.split(",").map((t) => t.trim()).filter(Boolean),
          loan_types: [],
          linkedin: "",
        },
        preferences: {
          visibility: {
            mobile: VIS_CODE[visibility.mobile],
            email: VIS_CODE[visibility.email],
            linkedin: VIS_CODE[visibility.linkedin],
            territory: VIS_CODE[visibility.territory],
          },
          interests,
          notify_email: true,
        },
        company_completion: companyChoice,
      };
      if (!personal) {
        if (companyMode === "join") {
          payload.company = { action: "join", target_channel_id: identityCompany?.channel_id };
        } else if (companyMode === "mca") {
          payload.company = { action: "create", source: "mca", cin: selectedMca?.cin };
        } else {
          payload.company = { action: "create", source: "manual", name: companyName.trim(), pan: companyPan.trim() };
        }
      }
      if (companyChoice === "invite") {
        payload.invite = { name: inviteName.trim(), email: inviteEmail.trim() };
      }

      const { channelId: newChannelId } = await registerConnectAccount(payload);
      setChannelId(newChannelId ?? null);
      if (newChannelId) await recordOnboardingSteps(newChannelId, wfStages.slice(0, -1));
      await sendSignInOtp(mobile);
      setOtpSent(true);
      setStep(4);
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const verifyAndEnter = async (code: string) => {
    setVerifyError(null);
    try {
      const result = await verifySignInOtp(mobile, code);
      if (!result.ok) {
        setVerifyError(
          "Registration succeeded but sign-in did not — your account may need approval before you can enter.",
        );
        return false;
      }
      const resolvedChannelId = result.channelId ?? channelId ?? undefined;
      if (resolvedChannelId != null) await recordOnboardingSteps(resolvedChannelId, wfStages.slice(-1));
      if (result.tenant || result.system) setTenant({ tenant: result.tenant, system: result.system });
      setIdentity({
        email,
        domain,
        entityType,
        primaryRole: entityByKey(entityType).role,
        channelId: resolvedChannelId != null ? String(resolvedChannelId) : null,
        name: [firstName, lastName].filter(Boolean).join(" "),
        businessName: personal
          ? ""
          : companyMode === "join"
            ? identityCompany?.name || ""
            : companyMode === "mca"
              ? selectedMca?.name || ""
              : companyName,
        mobile,
      });
      router.push("/connect/dashboard");
      return true;
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "Invalid or expired OTP");
      return false;
    }
  };

  return (
    <div>
      <StageProgress
        workflowLabel="Registration"
        stageLabel={STEPS[step] || ""}
        currentIndex={step}
        total={STEPS.length}
      />
      <Card className="mt-4">
        {step === 0 && (
          <>
            <h2 className="mb-1 text-2xl font-bold">Start with your work email</h2>
            <p className="mb-5 text-[13px] text-n500">
              Your email domain identifies your organisation on {tenantName}.
            </p>
            <Field label="Work email" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="you@yourcompany.com"
                className={inputLg}
              />
            </Field>
            {domain && (
              <Alert tone={personal ? "warning" : "info"}>
                {personal ? (
                  <>
                    Personal email domain: <b>{domain}</b> — only DSA Individual is allowed.
                  </>
                ) : (
                  <>
                    Company domain: <b>@{domain}</b> — becomes your organisation identifier.
                  </>
                )}
              </Alert>
            )}

            {existingRegistration && (
              <div className="mb-2 flex items-center gap-3 rounded-lg border-[1.5px] border-blue-500 bg-blue-500/10 p-3.5">
                <InitialAvatar name={existingRegistration.name} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-blue-600">Welcome back</div>
                  <div className="truncate text-sm font-bold">You&apos;re already registered as partner</div>
                </div>
                <Button
                  type="button"
                  variant="fgBlue"
                  size="sm"
                  disabled={resuming}
                  onClick={resumeRegistration}
                  className="flex-shrink-0"
                >
                  {resuming ? "Sending OTP…" : "Continue"}
                </Button>
              </div>
            )}
            {resumeError && <Alert tone="error">{resumeError}</Alert>}

            {domain && !personal && !existingRegistration && (
              <div className="mb-1">
                {identityChecking && (
                  <div className="flex items-center gap-2 py-2 text-xs text-n500">
                    <Loader2 size={14} className="animate-spin" /> Checking @{domain}…
                  </div>
                )}

                {!identityChecking && companyMode === "join" && identityCompany && (
                  <div className="mb-2 flex items-center gap-3 rounded-lg border-[1.5px] border-success/30 bg-success-bg p-3">
                    <InitialAvatar name={identityCompany.name} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-success-ink">Joining this company page</div>
                      <div className="truncate text-sm font-bold">{identityCompany.name}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCompanyMode(null);
                        setEntityType("");
                        setCompanyChoice(null);
                      }}
                      className="flex flex-shrink-0 items-center gap-1 text-xs font-semibold text-navy-900"
                    >
                      <Pencil size={11} strokeWidth={2} /> Change
                    </button>
                  </div>
                )}

                {!identityChecking &&
                  companyMode !== "join" &&
                  identityCompany &&
                  !showEntitySearch &&
                  companyMode !== "mca" &&
                  companyMode !== "manual" && (
                    <div className="mb-2 rounded-lg border-[1.5px] border-success/30 bg-success-bg p-3.5">
                      <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-success-ink">
                        <Building2 size={13} strokeWidth={2} /> Company page found on {tenantName}
                      </div>
                      <div className="mb-2 flex items-center gap-3 rounded-lg bg-white p-2.5">
                        <InitialAvatar name={identityCompany.name} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold">{identityCompany.name}</div>
                          <div className="text-[11px] text-n500">
                            {identityCompany.entity_type}
                            {identityCompany.state ? ` · ${identityCompany.state}` : ""}
                            {identityCompany.verification_tier ? ` · ${identityCompany.verification_tier}` : ""}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="fgBlue"
                          size="sm"
                          className="flex-shrink-0"
                          onClick={() => {
                            setCompanyMode("join");
                            setEntityType(identityCompany.entity_type || "");
                            setCompanyChoice("later");
                          }}
                        >
                          Join this page
                        </Button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowEntitySearch(true)}
                        className="text-[11px] font-semibold text-navy-900 underline"
                      >
                        Not your entity? Search for a different legal entity
                      </button>
                    </div>
                  )}

                {!identityChecking && companyMode === "mca" && selectedMca && (
                  <div className="mb-2 flex items-center gap-3 rounded-lg border-[1.5px] border-n300 bg-n100 p-3">
                    <InitialAvatar name={selectedMca.name} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold tracking-wide text-navy-900 uppercase">
                        From MCA register
                      </div>
                      <div className="truncate text-sm font-bold">{selectedMca.name}</div>
                      <div className="text-[11px] text-n500">
                        CIN: {selectedMca.cin}
                        {selectedMca.state ? ` · ${selectedMca.state}` : ""}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCompanyMode(null);
                        setSelectedMca(null);
                      }}
                      className="flex flex-shrink-0 items-center gap-1 text-xs font-semibold text-navy-900"
                    >
                      <Pencil size={11} strokeWidth={2} /> Change
                    </button>
                  </div>
                )}

                {!identityChecking &&
                  companyMode !== "join" &&
                  (!identityCompany || showEntitySearch) &&
                  companyMode !== "mca" &&
                  companyMode !== "manual" && (
                    <Field label={identityCompany ? "Search for a different legal entity" : "Search your company by name"}>
                      {!identityCompany && (
                        <div className="mb-2 flex items-center gap-1.5 text-xs text-n500">
                          <Search size={13} strokeWidth={2} /> Domain not registered on {tenantName} yet.
                        </div>
                      )}
                      <Input
                        value={mcaQuery}
                        onChange={(e) => setMcaQuery(e.target.value)}
                        placeholder="e.g. Sundaram Finance, FlexiLoans…"
                        className={inputSm}
                      />
                      {mcaSearching && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-n500">
                          <Loader2 size={12} className="animate-spin" /> Searching MCA register…
                        </div>
                      )}
                      {mcaError && <Alert tone="error">{mcaError}</Alert>}
                      {!mcaSearching && mcaQuery.trim().length >= 2 && mcaResults.length === 0 && !mcaError && (
                        <div className="mt-2 text-xs text-n500">No company found with that name.</div>
                      )}
                      {mcaResults.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {mcaResults.map((m) => (
                            <button
                              type="button"
                              key={m.cin}
                              onClick={() => {
                                setCompanyMode("mca");
                                setSelectedMca(m);
                                setMcaQuery("");
                                setMcaResults([]);
                                setShowEntitySearch(false);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg border border-n200 p-2.5 text-left transition-colors"
                            >
                              <InitialAvatar name={m.name} size="sm" />
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-xs font-bold">{m.name}</div>
                                <div className="text-[10px] text-n500">
                                  {m.category}
                                  {m.state ? ` · ${m.state}` : ""}
                                  {m.date_of_incorporation ? ` · Inc. ${m.date_of_incorporation}` : ""}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setCompanyMode("manual");
                          setShowEntitySearch(false);
                        }}
                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-dashed border-n200 py-2 text-xs font-semibold text-n500"
                      >
                        <Sparkles size={13} strokeWidth={2} /> My company isn&apos;t listed — create manually
                      </button>
                    </Field>
                  )}

                {!identityChecking && companyMode === "manual" && (
                  <div className="mb-1 rounded-lg border-[1.5px] border-blue-500 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-xs font-bold text-blue-600">Create company manually</div>
                      <button
                        type="button"
                        onClick={() => {
                          setCompanyMode(null);
                          setCompanyName("");
                          setCompanyPan("");
                        }}
                        className="text-[11px] font-semibold text-n500"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Field label="Company name" required>
                        <Input
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Sundaram Sourcing Partners LLP"
                          className={inputSm}
                        />
                      </Field>
                      <Field label="Company PAN" required>
                        <Input
                          value={companyPan}
                          onChange={(e) => setCompanyPan(e.target.value.toUpperCase())}
                          maxLength={10}
                          placeholder="ABCDE1234F"
                          className={inputSm}
                        />
                        {companyPan.trim() && !PAN_RE.test(companyPan.trim()) && (
                          <div className="mt-1 text-[11px] text-danger">Format: ABCDE1234F</div>
                        )}
                      </Field>
                    </div>
                  </div>
                )}
              </div>
            )}

            {domain && companyMode === "join" && identityCompany ? (
              <Field label="Entity type">
                <div className="flex items-center gap-2 rounded-lg border-[1.5px] border-success/30 bg-success-bg px-3 py-2.5 text-sm font-semibold text-success-ink">
                  <ShieldCheck size={15} strokeWidth={2} /> {identityCompany.entity_type}{" "}
                  <span className="ml-auto text-[11px] font-normal text-n500">from company page</span>
                </div>
              </Field>
            ) : (
              domain &&
              (personal || !!companyMode || allowedEntities.length === 1) && (
                <Field label="Entity type" required>
                  <div className="flex flex-wrap gap-1.5">
                    {allowedEntities.map((e) => {
                      const EntityIcon = ENTITY_ICONS[e.key];
                      const on = entityType === e.key;
                      return (
                        <button
                          key={e.key}
                          type="button"
                          onClick={() => setEntityType(e.key)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-md border-[1.5px] px-3 py-1.5 text-xs font-semibold",
                            on ? "border-blue-500 bg-blue-500/10 text-blue-600" : "border-n200 bg-white text-n700",
                          )}
                        >
                          {EntityIcon && <EntityIcon size={13} strokeWidth={2} />} {e.label}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              )
            )}

            {domain && entityType && !emailVerified && (
              <Field label="Verify your email">
                {emailOtpError && <Alert tone="error">{emailOtpError}</Alert>}
                {!emailOtpSent ? (
                  <Button type="button" variant="outline" disabled={sendingEmailOtp} onClick={sendEmailOtp} className="w-full py-2.5 text-sm">
                    {sendingEmailOtp ? "Sending OTP…" : "Send OTP to this email"}
                  </Button>
                ) : (
                  <OtpInput onVerify={verifyEmailOtp} onResend={sendEmailOtp} />
                )}
              </Field>
            )}
            {emailVerified && (
              <Alert tone="success">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} strokeWidth={2} /> Email verified
                </span>
              </Alert>
            )}
            <Button
              type="button"
              variant="fgBlue"
              disabled={!canContinueStage1}
              onClick={() => setStep(1)}
              className="mt-2 w-full gap-1.5 py-3"
            >
              Continue <ArrowRight size={14} strokeWidth={2} />
            </Button>
            <div className="mt-4 text-center text-[13px] text-n500">
              Already registered?{" "}
              <Link href="/connect/login" className="font-semibold underline">
                Sign in
              </Link>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="mb-1 text-2xl font-bold">Tell us about you</h2>
            <p className="mb-5 text-[13px] text-n500">Your personal profile card on {tenantName}.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="First name" required>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputSm} />
              </Field>
              <Field label="Last name" required>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputSm} />
              </Field>
            </div>
            <Field label="Mobile" required>
              <Input
                value={mobile}
                maxLength={10}
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, ""));
                  setMobileVerified(false);
                  setMobileOtpSent(false);
                  setMobileOtpError(null);
                }}
                placeholder="9XXXXXXXXX"
                className={inputSm}
              />
            </Field>
            {mobile.length === 10 && !mobileVerified && (
              <Field label="Verify mobile">
                {mobileOtpError && <Alert tone="error">{mobileOtpError}</Alert>}
                {!mobileOtpSent ? (
                  <Button type="button" variant="outline" disabled={sendingMobileOtp} onClick={sendMobileOtp} className="w-full py-2.5 text-sm">
                    {sendingMobileOtp ? "Sending OTP…" : "Send OTP to this mobile"}
                  </Button>
                ) : (
                  <OtpInput onVerify={verifyMobileOtp} onResend={sendMobileOtp} />
                )}
              </Field>
            )}
            {mobileVerified && (
              <Alert tone="success">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} strokeWidth={2} /> Mobile verified
                </span>
              </Alert>
            )}
            <Field label="Designation" required>
              <PillSelect
                options={designationsByEntityType[entityType] || designationsByEntityType.dsa_firm || []}
                value={designation}
                onChange={(v) => setDesignation(v as string)}
              />
            </Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Department">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={inputSm}
                >
                  <option value="">Select…</option>
                  {(departmentsByEntityType[entityType] || departmentsByEntityType.dsa_firm || []).map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>
              <Field label="Territory / Districts">
                <Input
                  value={territory}
                  onChange={(e) => setTerritory(e.target.value)}
                  placeholder="Coimbatore, Tiruppur"
                  className={inputSm}
                />
              </Field>
            </div>
            <div className="mt-2 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(0)} className="gap-1.5 px-5 py-2.5">
                <ArrowLeft size={14} strokeWidth={2} /> Back
              </Button>
              <Button
                type="button"
                variant="fgBlue"
                disabled={!canContinueStage2}
                onClick={() => setStep(2)}
                className="flex-1 gap-1.5 py-2.5"
              >
                Next: Preferences <ArrowRight size={14} strokeWidth={2} />
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="mb-1 text-2xl font-bold">Your preferences</h2>
            <p className="mb-5 text-[13px] text-n500">Control how others can reach you.</p>
            <Alert tone="info">Only Lenders with AUM ≥ ₹100 Cr can view &quot;On Request&quot; fields.</Alert>
            {["mobile", "email", "linkedin", "territory"].map((k) => (
              <div key={k} className="flex items-center justify-between border-b border-n200 py-2">
                <span className="text-sm font-semibold capitalize">{k}</span>
                <div className="flex gap-1">
                  {["public", "request", "private"].map((v) => {
                    const on = visibility[k] === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVisibility((p) => ({ ...p, [k]: v }))}
                        className={cn(
                          "rounded px-2 py-1 text-[10px] font-bold",
                          on ? "border-[1.5px] border-blue-500 bg-blue-500/10 text-blue-600" : "border-[1.5px] border-n200 text-n500",
                        )}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <Field label="What are you looking for?">
              <PillSelect
                multi
                options={["Lender tie-ups", "DSA / LSP network", "BC partners", "Co-lending partners", "Verification agencies"]}
                value={interests}
                onChange={(v) => setInterests(v as string[])}
              />
            </Field>
            <div className="mt-3 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-1.5 px-5 py-2.5">
                <ArrowLeft size={14} strokeWidth={2} /> Back
              </Button>
              <Button type="button" variant="fgBlue" onClick={() => setStep(3)} className="flex-1 gap-1.5 py-2.5">
                Next: Company <ArrowRight size={14} strokeWidth={2} />
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="mb-1 text-2xl font-bold">Company profile</h2>
            {companyMode === "join" ? (
              <>
                <p className="mb-5 text-[13px] text-n500">
                  You&apos;re joining an existing company page — its profile is managed by that page&apos;s Admin.
                </p>
                <div className="mb-2 flex items-center gap-3 rounded-lg border-[1.5px] border-success/30 bg-success-bg p-3.5">
                  <InitialAvatar name={identityCompany?.name} size="lg" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-success-ink">Joining as a member</div>
                    <div className="truncate text-sm font-bold">{identityCompany?.name}</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="mb-5 text-[13px] text-n500">
                  A complete company page is required to publish partnership requirements.
                </p>
                {(
                  [
                    { key: "now", icon: Building2, title: "I'll complete the company profile now", desc: "Recommended — 10–15 minutes." },
                    { key: "later", icon: Clock, title: "I'll complete it later from my dashboard", desc: "Requirement listings stay locked until then." },
                    { key: "invite", icon: Mail, title: "I'll invite a colleague to complete it", desc: "They get a link; you stay Page Admin." },
                  ] as const
                ).map((opt) => (
                  <div
                    key={opt.key}
                    onClick={() => setCompanyChoice(opt.key)}
                    className={cn(
                      "mb-2 flex cursor-pointer gap-3 rounded-lg border-2 p-3.5",
                      companyChoice === opt.key ? "border-blue-500 bg-blue-500/10" : "border-n200 bg-white",
                    )}
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                      <opt.icon size={17} strokeWidth={2} />
                    </span>
                    <div>
                      <div className="text-sm font-bold">{opt.title}</div>
                      <div className="text-xs text-n500">{opt.desc}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {companyMode !== "join" && companyChoice === "invite" && (
              <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Colleague's name" required>
                  <Input value={inviteName} onChange={(e) => setInviteName(e.target.value)} className={inputSm} />
                </Field>
                <Field label="Colleague's email" required>
                  <Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className={inputSm} />
                </Field>
              </div>
            )}
            {registerError && <Alert tone="error">{registerError}</Alert>}
            <div className="mt-3 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="gap-1.5 px-5 py-2.5">
                <ArrowLeft size={14} strokeWidth={2} /> Back
              </Button>
              <Button
                type="button"
                variant="fgBlue"
                disabled={!canFinishStage4 || registering}
                onClick={startRegistration}
                className="flex-1 gap-1.5 py-2.5"
              >
                {registering ? "Creating your account…" : (
                  <>
                    <Rocket size={14} strokeWidth={2} /> Complete Registration
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="mb-1 text-2xl font-bold">Verify your mobile to sign in</h2>
            <p className="mb-5 text-[13px] text-n500">
              Your account was created{channelId ? ` (ID ${channelId})` : ""}. Enter the OTP sent to {mobile} to sign in for
              the first time.
            </p>
            {verifyError && <Alert tone="error">{verifyError}</Alert>}
            {otpSent && (
              <Field label={`OTP sent to ${mobile}`}>
                <OtpInput onVerify={verifyAndEnter} onResend={() => resendSignInOtp(mobile)} />
              </Field>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
