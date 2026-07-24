import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, CheckCircle2, Rocket, Building2, Clock, Mail,
  UserRound, Users, Link2, Store, Landmark, Home, Handshake, Search, Briefcase, Scale, Building,
  Loader2, ShieldCheck, Pencil, Sparkles,
} from 'lucide-react';
import StageProgress from '../../components/StageProgress';
import { Card, Field, Alert, Avatar } from '../../components/Card';
import PillSelect from '../../components/PillSelect';
import OtpInput from '../../components/OtpInput';
import { useConnectDispatch } from '../../state/ConnectContext';
import { useTenantConfig } from '../../state/TenantContext';
import { ENTITY_TYPES, DESIGNATIONS, DEPARTMENTS, isPersonalDomain, entityByKey } from '../../data/lookups';
import {
  registerConnectAccount, sendIdentityOtp, verifyIdentityOtp, sendSignInOtp, resendSignInOtp, verifySignInOtp,
  checkIdentity, searchCompanyMaster,
} from '../../services/connectApi';

const STEPS = ['Identity', 'Your Details', 'Preferences', 'Company', 'Verify'];

// ENTITY_TYPES (data/lookups.js) carries its own emoji `icon` field for other, non-React
// consumers of that lookup table — mapped to real icon components here rather than importing
// lucide into a plain data file.
const ENTITY_ICONS = {
  dsa_ind: UserRound, dsa_firm: Users, lsp: Link2, bc: Store, nbfc: Landmark, bank: Building2,
  hfc: Home, colender: Handshake, verif_agency: Search, collection_agency: Briefcase,
  legal_agency: Scale, property_agency: Building,
};

// map a UI visibility choice to the real ConnectPreferenceParams.Visibility values
// (app/handler/partner/connect.go: pub|req|priv — NOT the UI's public/request/private).
const VIS_CODE = { public: 'pub', request: 'req', private: 'priv' };

// WF1 — User & Identity Onboarding. Wired to the real POST /v1/partner/create (connect
// sub-object) via a no-credentials guest token — verified live to return a real BIGINT
// channel_id (see docs/sdd/connect/02-feature-spec.md's WF1 update). BR-14's personal-domain
// classification is client-side (same PERSONAL_EMAIL_DOMAINS list alpha-api seeds, for instant
// feedback while typing). The 3-way domain scenario the shared prototype
// (connect-flow-prototype.html / stage1_email.html) shows is now real, not stubbed:
//   - Personal domain -> DSA Individual only (client-side, unchanged).
//   - Company domain already on the platform -> GET /connect/identity?email= (added
//     2026-07-24 — previously didn't exist anywhere in alpha-api) returns the matching
//     channel; user can "Join this page" (self-service, no approval gate — see
//     app/services/application/connect.go's join branch, fixed the same day to stop stranding
//     joiners in PENDING_APPROVAL with no way out).
//   - Company domain not on the platform -> search by name against the real MCA company
//     register (GET /employer/?keyword=, app/controllers/v1/employer/controller.go's
//     McaMasterList) and pick a match, or fall back to entering name+PAN manually.
export default function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const dispatch = useConnectDispatch();
  const { tenant, setTenant } = useTenantConfig();
  const tenantName = tenant?.TENANT_NAME || 'Fingrid Connect';

  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [personal, setPersonal] = useState(false);
  const [entityType, setEntityType] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [companyPan, setCompanyPan] = useState('');

  // Company resolution for a non-personal domain — one of three real paths now, matching the
  // shared prototype's 3-way scenario: 'join' (identity-matched existing channel),
  // 'mca' (picked from the real MCA register search), 'manual' (name+PAN, the original
  // fallback). null until the user picks one.
  const [companyMode, setCompanyMode] = useState(null);
  const [identityChecking, setIdentityChecking] = useState(false);
  const [identityCompany, setIdentityCompany] = useState(null); // ChannelSummary from GET /connect/identity
  const [showEntitySearch, setShowEntitySearch] = useState(false); // "search a different legal entity" under a found company
  const [mcaQuery, setMcaQuery] = useState('');
  const [mcaSearching, setMcaSearching] = useState(false);
  const [mcaResults, setMcaResults] = useState([]);
  const [mcaError, setMcaError] = useState(null);
  const [selectedMca, setSelectedMca] = useState(null); // { cin, name, category, state, date_of_incorporation }
  const identityRequestId = useRef(0);
  const mcaDebounce = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [sendingMobileOtp, setSendingMobileOtp] = useState(false);
  const [mobileOtpError, setMobileOtpError] = useState(null);
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [territory, setTerritory] = useState('');

  const [visibility, setVisibility] = useState({ mobile: 'request', email: 'request', linkedin: 'public', territory: 'public' });
  const [interests, setInterests] = useState([]);

  const [companyChoice, setCompanyChoice] = useState(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [verifyError, setVerifyError] = useState(null);

  const onEmailChange = (val) => {
    setEmail(val);
    setEmailVerified(false);
    setEmailOtpSent(false);
    setEmailOtpError(null);
    // Domain changed — whatever company resolution was in progress no longer applies.
    setCompanyMode(null);
    setIdentityCompany(null);
    setShowEntitySearch(false);
    setMcaQuery(''); setMcaResults([]); setMcaError(null); setSelectedMca(null);
    setCompanyName(''); setCompanyPan('');
    const at = val.indexOf('@');
    if (at < 1 || val.indexOf('.', at) < 0) { setDomain(''); return; }
    const d = val.slice(at + 1).toLowerCase();
    setDomain(d);
    const isP = isPersonalDomain(d);
    setPersonal(isP);
    setEntityType(isP ? 'dsa_ind' : '');
  };

  // WF1 identity check (GET /connect/identity?email=) — debounced, and guarded against a
  // fast-typing race (an earlier keystroke's response landing after a later one's) via a
  // monotonically-increasing request id rather than trusting fetch resolution order.
  useEffect(() => {
    if (!domain || personal) { setIdentityChecking(false); return; }
    const myRequestId = ++identityRequestId.current;
    setIdentityChecking(true);
    const t = setTimeout(async () => {
      try {
        const result = await checkIdentity(email);
        if (identityRequestId.current !== myRequestId) return; // superseded by a newer keystroke
        setIdentityCompany(result?.company || null);
      } catch {
        if (identityRequestId.current !== myRequestId) return;
        setIdentityCompany(null); // non-fatal — user can still search/create manually
      } finally {
        if (identityRequestId.current === myRequestId) setIdentityChecking(false);
      }
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, personal]);

  // MCA-master name search (GET /employer/?keyword=) — debounced the same way.
  useEffect(() => {
    clearTimeout(mcaDebounce.current);
    if (!mcaQuery.trim() || mcaQuery.trim().length < 2) { setMcaResults([]); return; }
    mcaDebounce.current = setTimeout(async () => {
      setMcaSearching(true); setMcaError(null);
      try {
        const results = await searchCompanyMaster(mcaQuery.trim());
        setMcaResults(results);
      } catch (err) {
        setMcaError(err.message);
        setMcaResults([]);
      } finally {
        setMcaSearching(false);
      }
    }, 400);
    return () => clearTimeout(mcaDebounce.current);
  }, [mcaQuery]);

  // Real OTP, not a hardcoded demo code — POST /v1/notification/otp (template
  // OTP_PARTNER_REGISTRATION), the same generic pre-registration verification endpoint used
  // for both email and mobile here. This tenant's template is already spoofed server-side, so
  // no real SMS/email goes out; the code is whatever TENANT_SPOOF_OTP_CODE is configured to.
  const sendEmailOtp = async () => {
    setEmailOtpError(null);
    setSendingEmailOtp(true);
    try {
      await sendIdentityOtp({ email });
      setEmailOtpSent(true);
    } catch (err) {
      setEmailOtpError(err.message);
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const verifyEmailOtp = async (code) => {
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
      setMobileOtpError(err.message);
    } finally {
      setSendingMobileOtp(false);
    }
  };

  const verifyMobileOtp = async (code) => {
    try {
      await verifyIdentityOtp({ mobile, otp: code });
      setMobileVerified(true);
      return true;
    } catch {
      return false;
    }
  };

  const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const allowedEntities = personal ? ENTITY_TYPES.filter((e) => e.key === 'dsa_ind') : ENTITY_TYPES;
  // Company resolution is satisfied by exactly one of the three real paths — join (entity type
  // comes from the matched channel itself), mca (a register pick, entity type still chosen
  // manually since the register doesn't classify DSA/LSP/BC/etc.), or manual (name + valid PAN).
  const companyResolved = personal
    || (companyMode === 'join' && !!identityCompany)
    || (companyMode === 'mca' && !!selectedMca)
    || (companyMode === 'manual' && companyName.trim() && PAN_RE.test(companyPan.trim()));
  const canContinueStage1 = emailVerified && !!entityType && companyResolved;
  const canContinueStage2 = firstName && lastName && mobileVerified && designation;
  const canFinishStage4 = companyChoice && (companyChoice !== 'invite' || (inviteName.trim() && inviteEmail.trim()));

  // Kicks off real registration (POST /v1/partner/create) once Stage 4's choice is made, then
  // moves to Stage 5 to actually authenticate (registration alone returns no session token —
  // a separate real OTP login is required, same endpoint SignIn.jsx uses).
  const startRegistration = async () => {
    setRegisterError(null);
    setRegistering(true);
    try {
      const payload = {
        email,
        scenario: personal ? 'personal' : 'create',
        entity_type: entityType,
        profile: {
          first_name: firstName,
          last_name: lastName,
          mobile,
          designation,
          department,
          territory: territory.split(',').map((t) => t.trim()).filter(Boolean),
          loan_types: [],
          linkedin: '',
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
        if (companyMode === 'join') {
          payload.company = { action: 'join', target_channel_id: identityCompany.channel_id };
        } else if (companyMode === 'mca') {
          payload.company = { action: 'create', source: 'mca', cin: selectedMca.cin };
        } else {
          payload.company = { action: 'create', source: 'manual', name: companyName.trim(), pan: companyPan.trim() };
        }
      }
      if (companyChoice === 'invite') {
        payload.invite = { name: inviteName.trim(), email: inviteEmail.trim() };
      }

      const { channelId: newChannelId } = await registerConnectAccount(payload);
      setChannelId(newChannelId);
      await sendSignInOtp(mobile);
      setOtpSent(true);
      setStep(4);
    } catch (err) {
      setRegisterError(err.message);
    } finally {
      setRegistering(false);
    }
  };

  const verifyAndEnter = async (code) => {
    setVerifyError(null);
    try {
      const result = await verifySignInOtp(mobile, code);
      if (!result.ok) {
        setVerifyError('Registration succeeded but sign-in did not — your account may need approval before you can enter.');
        return false;
      }
      if (result.tenant || result.system) setTenant({ tenant: result.tenant, system: result.system });
      dispatch({
        type: 'SET_IDENTITY',
        payload: {
          email, domain, entityType, primaryRole: entityByKey(entityType).role, channelId: result.channelId || channelId,
          // Unlike a plain returning sign-in (SignIn.jsx), this wizard collected the person's
          // own name and the company name itself just now — login-with-otp's response has
          // neither, so this is the only place either is ever actually available to display.
          name: [firstName, lastName].filter(Boolean).join(' '),
          businessName: personal ? '' : companyMode === 'join' ? identityCompany?.name : companyMode === 'mca' ? selectedMca?.name : companyName,
          mobile,
        },
      });
      navigate('/connect/dashboard');
      return true;
    } catch (err) {
      setVerifyError(err.message);
      return false;
    }
  };

  return (
    <div>
      <StageProgress workflowLabel="Registration" stageLabel={STEPS[step]} currentIndex={step} total={STEPS.length} />
      <Card className="mt-4">
        {step === 0 && (
          <>
            <h2 className="text-2xl font-bold mb-1">Start with your work email</h2>
            <p className="text-[13px] mb-5" style={{ color: 'var(--c-muted)' }}>
              Your email domain identifies your organisation on {tenantName}. (BR-14)
            </p>
            <Field label="Work email" required>
              <input
                type="email" value={email} onChange={(e) => onEmailChange(e.target.value)}
                placeholder="you@yourcompany.com"
                className="w-full px-3.5 py-3 rounded-lg text-[15px]" style={{ border: '2px solid var(--c-line)' }}
              />
            </Field>
            {domain && (
              <Alert tone={personal ? 'warning' : 'info'}>
                {personal
                  ? <>Personal email domain: <b>{domain}</b> — only DSA Individual is allowed.</>
                  : <>Company domain: <b>@{domain}</b> — becomes your organisation identifier.</>}
              </Alert>
            )}

            {/* Company resolution — the 3-way scenario from the shared prototype, now backed
                by real endpoints (see this file's header comment). */}
            {domain && !personal && (
              <div className="mb-1">
                {identityChecking && (
                  <div className="flex items-center gap-2 text-xs py-2" style={{ color: 'var(--c-muted)' }}>
                    <Loader2 size={14} className="animate-spin" /> Checking @{domain}…
                  </div>
                )}

                {!identityChecking && companyMode === 'join' && identityCompany && (
                  <div className="flex items-center gap-3 p-3 rounded-lg mb-2" style={{ background: 'var(--c-gs)', border: '1.5px solid var(--c-gm)' }}>
                    <Avatar name={identityCompany.name} size={38} tint="var(--c-gs)" color="var(--c-green)" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold" style={{ color: 'var(--c-green)' }}>Joining this company page</div>
                      <div className="text-sm font-bold truncate">{identityCompany.name}</div>
                    </div>
                    <button type="button" onClick={() => { setCompanyMode(null); setEntityType(''); }} className="flex items-center gap-1 text-xs font-semibold flex-shrink-0" style={{ color: 'var(--c-blue)' }}>
                      <Pencil size={11} strokeWidth={2} /> Change
                    </button>
                  </div>
                )}

                {!identityChecking && companyMode !== 'join' && identityCompany && !showEntitySearch && companyMode !== 'mca' && companyMode !== 'manual' && (
                  <div className="p-3.5 rounded-lg mb-2" style={{ background: 'var(--c-gs)', border: '1.5px solid var(--c-gm)' }}>
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: 'var(--c-green)' }}>
                      <Building2 size={13} strokeWidth={2} /> Company page found on {tenantName}
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg mb-2" style={{ background: '#fff' }}>
                      <Avatar name={identityCompany.name} size={38} tint="var(--c-gs)" color="var(--c-green)" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate">{identityCompany.name}</div>
                        <div className="text-[11px]" style={{ color: 'var(--c-muted)' }}>
                          {identityCompany.entity_type}{identityCompany.state ? ` · ${identityCompany.state}` : ''}{identityCompany.verification_tier ? ` · ${identityCompany.verification_tier}` : ''}
                        </div>
                      </div>
                      <button type="button" onClick={() => { setCompanyMode('join'); setEntityType(identityCompany.entity_type); }} className="connect-btn-primary px-3 py-1.5 text-xs flex-shrink-0">
                        Join this page
                      </button>
                    </div>
                    <button type="button" onClick={() => setShowEntitySearch(true)} className="text-[11px] font-semibold underline" style={{ color: 'var(--c-blue)' }}>
                      Not your entity? Search for a different legal entity
                    </button>
                  </div>
                )}

                {!identityChecking && companyMode === 'mca' && selectedMca && (
                  <div className="flex items-center gap-3 p-3 rounded-lg mb-2" style={{ background: 'var(--c-bs)', border: '1.5px solid var(--c-bm)' }}>
                    <Avatar name={selectedMca.name} size={38} tint="var(--c-bs)" color="var(--c-blue)" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--c-blue)' }}>From MCA register</div>
                      <div className="text-sm font-bold truncate">{selectedMca.name}</div>
                      <div className="text-[11px]" style={{ color: 'var(--c-muted)' }}>CIN: {selectedMca.cin}{selectedMca.state ? ` · ${selectedMca.state}` : ''}</div>
                    </div>
                    <button type="button" onClick={() => { setCompanyMode(null); setSelectedMca(null); }} className="flex items-center gap-1 text-xs font-semibold flex-shrink-0" style={{ color: 'var(--c-blue)' }}>
                      <Pencil size={11} strokeWidth={2} /> Change
                    </button>
                  </div>
                )}

                {!identityChecking && companyMode !== 'join' && (!identityCompany || showEntitySearch) && companyMode !== 'mca' && companyMode !== 'manual' && (
                  <Field label={identityCompany ? 'Search for a different legal entity' : 'Search your company by name'}>
                    {!identityCompany && (
                      <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'var(--c-muted)' }}>
                        <Search size={13} strokeWidth={2} /> Domain not registered on {tenantName} yet.
                      </div>
                    )}
                    <input
                      value={mcaQuery} onChange={(e) => setMcaQuery(e.target.value)}
                      placeholder="e.g. Sundaram Finance, FlexiLoans…"
                      className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }}
                    />
                    {mcaSearching && (
                      <div className="flex items-center gap-1.5 text-xs mt-2" style={{ color: 'var(--c-muted)' }}>
                        <Loader2 size={12} className="animate-spin" /> Searching MCA register…
                      </div>
                    )}
                    {mcaError && <Alert tone="error">{mcaError}</Alert>}
                    {!mcaSearching && mcaQuery.trim().length >= 2 && mcaResults.length === 0 && !mcaError && (
                      <div className="text-xs mt-2" style={{ color: 'var(--c-muted)' }}>No company found with that name.</div>
                    )}
                    {mcaResults.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {mcaResults.map((m) => (
                          <button
                            type="button" key={m.cin}
                            onClick={() => { setCompanyMode('mca'); setSelectedMca(m); setMcaQuery(''); setMcaResults([]); setShowEntitySearch(false); }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors"
                            style={{ border: '1px solid var(--c-line)' }}
                          >
                            <Avatar name={m.name} size={32} />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold truncate">{m.name}</div>
                              <div className="text-[10px]" style={{ color: 'var(--c-muted)' }}>{m.category}{m.state ? ` · ${m.state}` : ''}{m.date_of_incorporation ? ` · Inc. ${m.date_of_incorporation}` : ''}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    <button type="button" onClick={() => { setCompanyMode('manual'); setShowEntitySearch(false); }} className="w-full mt-2 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5" style={{ border: '1.5px dashed var(--c-line)', color: 'var(--c-muted)' }}>
                      <Sparkles size={13} strokeWidth={2} /> My company isn't listed — create manually
                    </button>
                  </Field>
                )}

                {!identityChecking && companyMode === 'manual' && (
                  <div className="p-3 rounded-lg mb-1" style={{ border: '1.5px solid var(--c-teal)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold" style={{ color: 'var(--c-teal-d)' }}>Create company manually</div>
                      <button type="button" onClick={() => { setCompanyMode(null); setCompanyName(''); setCompanyPan(''); }} className="text-[11px] font-semibold" style={{ color: 'var(--c-muted)' }}>Cancel</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Company name" required>
                        <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Sundaram Sourcing Partners LLP" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} />
                      </Field>
                      <Field label="Company PAN" required>
                        <input value={companyPan} onChange={(e) => setCompanyPan(e.target.value.toUpperCase())} maxLength={10} placeholder="ABCDE1234F" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} />
                        {companyPan.trim() && !PAN_RE.test(companyPan.trim()) && (
                          <div className="text-[11px] mt-1" style={{ color: '#B91C1C' }}>Format: ABCDE1234F</div>
                        )}
                      </Field>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Entity type — locked to the found company's type when joining; otherwise a free
                pick (personal domains are already filtered to the single DSA-Individual
                option via allowedEntities). */}
            {domain && companyMode === 'join' && identityCompany ? (
              <Field label="Entity type">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--c-gs)', color: 'var(--c-green)', border: '1.5px solid var(--c-gm)' }}>
                  <ShieldCheck size={15} strokeWidth={2} /> {identityCompany.entity_type} <span className="text-[11px] font-normal ml-auto" style={{ color: 'var(--c-muted)' }}>from company page</span>
                </div>
              </Field>
            ) : domain && (personal || !!companyMode || allowedEntities.length === 1) && (
              <Field label="Entity type" required>
                <div className="flex flex-wrap gap-1.5">
                  {allowedEntities.map((e) => {
                    const EntityIcon = ENTITY_ICONS[e.key];
                    return (
                      <button key={e.key} type="button" onClick={() => setEntityType(e.key)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
                        style={{ border: `1.5px solid ${entityType === e.key ? 'var(--c-teal)' : 'var(--c-line)'}`, color: entityType === e.key ? 'var(--c-teal)' : 'var(--c-slate)', background: entityType === e.key ? 'var(--c-ts)' : '#fff' }}>
                        {EntityIcon && <EntityIcon size={13} strokeWidth={2} />} {e.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
            )}

            {domain && entityType && !emailVerified && (
              <Field label="Verify your email">
                {emailOtpError && <Alert tone="error">{emailOtpError}</Alert>}
                {!emailOtpSent ? (
                  <button type="button" disabled={sendingEmailOtp} onClick={sendEmailOtp} className="connect-btn-outline w-full py-2.5 text-sm">
                    {sendingEmailOtp ? 'Sending OTP…' : 'Send OTP to this email'}
                  </button>
                ) : (
                  <OtpInput onVerify={verifyEmailOtp} onResend={sendEmailOtp} />
                )}
              </Field>
            )}
            {emailVerified && (
              <Alert tone="success">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} strokeWidth={2} /> Email verified</span>
              </Alert>
            )}
            <button type="button" disabled={!canContinueStage1} onClick={() => setStep(1)}
              className="connect-btn-primary w-full flex items-center justify-center gap-1.5 py-3 mt-2">
              Continue <ArrowRight size={14} strokeWidth={2} />
            </button>
            <div className="text-center mt-4 text-[13px]" style={{ color: 'var(--c-muted)' }}>
              Already registered? <Link to="/connect/login" className="font-semibold underline">Sign in</Link>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-1">Tell us about you</h2>
            <p className="text-[13px] mb-5" style={{ color: 'var(--c-muted)' }}>Your personal profile card on {tenantName}.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="First name" required><input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
              <Field label="Last name" required><input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
            </div>
            <Field label="Mobile" required>
              <div className="flex gap-2">
                <input value={mobile} maxLength={10} onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); setMobileVerified(false); setMobileOtpSent(false); setMobileOtpError(null); }} placeholder="9XXXXXXXXX" className="flex-1 px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} />
              </div>
            </Field>
            {mobile.length === 10 && !mobileVerified && (
              <Field label="Verify mobile">
                {mobileOtpError && <Alert tone="error">{mobileOtpError}</Alert>}
                {!mobileOtpSent ? (
                  <button type="button" disabled={sendingMobileOtp} onClick={sendMobileOtp} className="connect-btn-outline w-full py-2.5 text-sm">
                    {sendingMobileOtp ? 'Sending OTP…' : 'Send OTP to this mobile'}
                  </button>
                ) : (
                  <OtpInput onVerify={verifyMobileOtp} onResend={sendMobileOtp} />
                )}
              </Field>
            )}
            {mobileVerified && (
              <Alert tone="success">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} strokeWidth={2} /> Mobile verified</span>
              </Alert>
            )}
            <Field label="Designation" required>
              <PillSelect options={DESIGNATIONS[entityType] || DESIGNATIONS.dsa_firm} value={designation} onChange={setDesignation} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Department">
                <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }}>
                  <option value="">Select…</option>
                  {(DEPARTMENTS[entityType] || DEPARTMENTS.dsa_firm).map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Territory / Districts"><input value={territory} onChange={(e) => setTerritory(e.target.value)} placeholder="Coimbatore, Tiruppur" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
            </div>
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={() => setStep(0)} className="connect-btn-outline flex items-center gap-1.5 px-5 py-2.5"><ArrowLeft size={14} strokeWidth={2} /> Back</button>
              <button type="button" disabled={!canContinueStage2} onClick={() => setStep(2)} className="connect-btn-primary flex-1 flex items-center justify-center gap-1.5 py-2.5">Next: Preferences <ArrowRight size={14} strokeWidth={2} /></button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-1">Your preferences</h2>
            <p className="text-[13px] mb-5" style={{ color: 'var(--c-muted)' }}>Control how others can reach you.</p>
            <Alert tone="info">Only Lenders with AUM ≥ ₹100 Cr can view "On Request" fields (BR-11).</Alert>
            {['mobile', 'email', 'linkedin', 'territory'].map((k) => (
              <div key={k} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--c-line)' }}>
                <span className="text-sm font-semibold capitalize">{k}</span>
                <div className="flex gap-1">
                  {['public', 'request', 'private'].map((v) => (
                    <button key={v} type="button" onClick={() => setVisibility((p) => ({ ...p, [k]: v }))}
                      className="px-2 py-1 rounded text-[10px] font-bold"
                      style={{ border: `1.5px solid ${visibility[k] === v ? 'var(--c-teal)' : 'var(--c-line)'}`, color: visibility[k] === v ? 'var(--c-teal)' : 'var(--c-muted)', background: visibility[k] === v ? 'var(--c-ts)' : '#fff' }}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <Field label="What are you looking for?">
              <PillSelect multi options={['Lender tie-ups', 'DSA / LSP network', 'BC partners', 'Co-lending partners', 'Verification agencies']} value={interests} onChange={setInterests} />
            </Field>
            <div className="flex gap-2 mt-3">
              <button type="button" onClick={() => setStep(1)} className="connect-btn-outline flex items-center gap-1.5 px-5 py-2.5"><ArrowLeft size={14} strokeWidth={2} /> Back</button>
              <button type="button" onClick={() => setStep(3)} className="connect-btn-primary flex-1 flex items-center justify-center gap-1.5 py-2.5">Next: Company <ArrowRight size={14} strokeWidth={2} /></button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-1">Company profile</h2>
            <p className="text-[13px] mb-5" style={{ color: 'var(--c-muted)' }}>A complete company page is required to publish partnership requirements.</p>
            {[
              { key: 'now', icon: Building2, title: "I'll complete the company profile now", desc: 'Recommended — 10–15 minutes.' },
              { key: 'later', icon: Clock, title: "I'll complete it later from my dashboard", desc: 'Requirement listings stay locked until then.' },
              { key: 'invite', icon: Mail, title: "I'll invite a colleague to complete it", desc: 'They get a link; you stay Page Admin.' },
            ].map((opt) => (
              <div key={opt.key} onClick={() => setCompanyChoice(opt.key)} className="flex gap-3 p-3.5 rounded-lg cursor-pointer mb-2"
                style={{ border: `2px solid ${companyChoice === opt.key ? 'var(--c-teal)' : 'var(--c-line)'}`, background: companyChoice === opt.key ? 'var(--c-ts)' : '#fff' }}>
                <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--c-ts)', color: 'var(--c-teal)' }}>
                  <opt.icon size={17} strokeWidth={2} />
                </span>
                <div><div className="text-sm font-bold">{opt.title}</div><div className="text-xs" style={{ color: 'var(--c-muted)' }}>{opt.desc}</div></div>
              </div>
            ))}
            {companyChoice === 'invite' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                <Field label="Colleague's name" required><input value={inviteName} onChange={(e) => setInviteName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
                <Field label="Colleague's email" required><input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
              </div>
            )}
            {registerError && <Alert tone="error">{registerError}</Alert>}
            <div className="flex gap-2 mt-3">
              <button type="button" onClick={() => setStep(2)} className="connect-btn-outline flex items-center gap-1.5 px-5 py-2.5"><ArrowLeft size={14} strokeWidth={2} /> Back</button>
              <button type="button" disabled={!canFinishStage4 || registering} onClick={startRegistration} className="connect-btn-primary flex-1 flex items-center justify-center gap-1.5 py-2.5">
                {registering ? 'Creating your account…' : (<><Rocket size={14} strokeWidth={2} /> Complete Registration</>)}
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-2xl font-bold mb-1">Verify your mobile to sign in</h2>
            <p className="text-[13px] mb-5" style={{ color: 'var(--c-muted)' }}>
              Your account was created{channelId ? ` (ID ${channelId})` : ''}. Enter the OTP sent to {mobile} to sign in for the first time.
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
