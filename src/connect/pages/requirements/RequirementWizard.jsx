import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Handshake, Package, ShieldCheck, ClipboardList, ArrowLeft, ArrowRight, Rocket } from 'lucide-react';
import StageProgress from '../../components/StageProgress';
import { Card, CardHeader, Field, Alert } from '../../components/Card';
import PillSelect from '../../components/PillSelect';
import { useConnectState } from '../../state/ConnectContext';
import { useConnectLookups } from '../../state/LookupsContext';
import { useWorkflowStages } from '../../state/useWorkflowStages';
import { getRequirement, saveRequirement } from '../../services/connectApi';

// WF3 — Requirement Listing. 4 stages, not 5 — R3 "What You Offer" (commission/FLDG/terms)
// was confirmed NOT required by the product owner (2026-07-22) and removed, matching the
// change already made to the L3 HTML prototype. Wired to the real
// POST /connect/:channelId/requirement endpoint (BR-05/06/07).
//
// Layout matches the shared prototype (fingrid-connect-v5.html) structurally, same as
// CompanyProfileWizard: stage badge + thin progress bar (StageProgress) instead of a circular
// stepper, a card-top icon/title/desc header (CardHeader) inside each stage's card, and
// Back/Next buttons in a footer BELOW the card rather than one full-width button inside it.
// Fallback stage list — used only if the CONNECT_REQUIREMENT workflow can't be built. Kept
// identical to the seeded workflow so the UI is unchanged either way. See useWorkflowStages.
const REQUIREMENT_STAGES = [
  { name: 'Type & Context' }, { name: 'What You Need' }, { name: 'Criteria' }, { name: 'Review' },
];
const STAGE_META = [
  { icon: Handshake, iconBg: 'var(--c-bs)', iconColor: 'var(--c-blue)', title: 'What partnership are you seeking?', desc: 'Partnership type, product focus, and background context.' },
  { icon: Package, iconBg: 'var(--c-ts)', iconColor: 'var(--c-teal)', title: 'What you need from the partner', desc: 'Geography, volume, ticket size, and turnaround expectations.' },
  { icon: ShieldCheck, iconBg: 'var(--c-bs)', iconColor: 'var(--c-blue)', title: 'Minimum criteria for counterparty', desc: 'Verification tier and scale thresholds candidates must meet.' },
  { icon: ClipboardList, iconBg: 'var(--c-gs)', iconColor: 'var(--c-green)', title: 'Review & publish', desc: 'Confirm details — auto-match runs once this goes live.' },
];

export default function RequirementWizard() {
  const { channelId } = useConnectState();
  const { partnershipTypes: PARTNERSHIP_TYPES } = useConnectLookups();
  const navigate = useNavigate();
  // Present when resuming an existing draft (see MyRequirements.jsx's "Continue editing" link) —
  // distinct from a brand-new "requirements/new" visit, which has no id yet.
  const { requirementId: routeRequirementId } = useParams();
  const [stepIdx, setStepIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!routeRequirementId);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [requirementId, setRequirementId] = useState(routeRequirementId || null);

  const [partnershipType, setPartnershipType] = useState('');
  const [context, setContext] = useState('');
  const [products, setProducts] = useState([]);

  const [states, setStates] = useState([]);
  const [targetVolume, setTargetVolume] = useState('');
  const [ticketMin, setTicketMin] = useState('');
  const [ticketMax, setTicketMax] = useState('');
  const [casesPerMonth, setCasesPerMonth] = useState('');
  const [expectedTat, setExpectedTat] = useState('');

  const [minTier, setMinTier] = useState('');
  const [minAum, setMinAum] = useState('');
  const [minBranches, setMinBranches] = useState('');
  const [minFieldStaff, setMinFieldStaff] = useState('');

  // Stage list/order + per-step ids come from the seeded CONNECT_REQUIREMENT workflow (editable
  // in the builder), falling back to REQUIREMENT_STAGES. Source = THIS requirement (not the
  // channel — a channel posts many requirements, each with its own progress), so build returns
  // the workflow INSTANCE and executeStep() advances it. Null until the first save creates one,
  // same as onboarding before registration — nothing to resume yet on a brand-new draft.
  const { stages: wfStages, executeStep, resumeIndex } = useWorkflowStages('CONNECT_REQUIREMENT', REQUIREMENT_STAGES, { sourceId: requirementId });
  const STAGES = wfStages.map((s) => s.name);

  // Resume where a prior visit left off (craft's setCurrentComponent) — fires once per mount/
  // requirementId (see useWorkflowStages).
  useEffect(() => {
    if (resumeIndex != null) setStepIdx(resumeIndex);
  }, [resumeIndex]);

  // Editing an existing draft — load its saved fields (the workflow instance only tracks step
  // progress, not the form data itself).
  useEffect(() => {
    if (!routeRequirementId || !channelId) return;
    let cancelled = false;
    getRequirement(channelId, routeRequirementId)
      .then((r) => {
        if (cancelled) return;
        setPartnershipType(r.partnership_type || '');
        setContext(r.context || '');
        setProducts(r.products || []);
        setStates(r.need?.geography?.states || []);
        setTargetVolume(r.need?.target_volume || '');
        setTicketMin(r.need?.ticket_min ?? '');
        setTicketMax(r.need?.ticket_max ?? '');
        setCasesPerMonth(r.need?.cases_per_month ?? '');
        setExpectedTat(r.need?.expected_tat || '');
        setMinTier(r.criteria?.min_verification_tier || '');
        setMinAum(r.criteria?.min_aum ?? '');
        setMinBranches(r.criteria?.min_branches ?? '');
        setMinFieldStaff(r.criteria?.min_field_staff ?? '');
      })
      .catch((e) => setError(e.message))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [routeRequirementId, channelId]);

  useEffect(() => { setValidationError(null); }, [stepIdx]);

  const buildPayload = (extra = {}) => ({
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

  const save = async (extra) => {
    if (!channelId) { setError('No channel — complete onboarding first.'); return null; }
    setSaving(true);
    setError(null);
    try {
      const r = await saveRequirement(channelId, buildPayload(extra));
      setRequirementId(r.requirement_id);
      return r;
    } catch (e) {
      // BR-05 (422 missing partnership_type) / BR-04 (403 not owned) / BR-06 (409 already LIVE)
      // all surface here verbatim.
      setError(e.message);
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Client-side gate before the API call fires. The backend itself only enforces
  // partnership_type as required, and only on create (BR-05, checked in CreateOrUpdateRequirement,
  // not a struct validate tag) — mirrored here so the user sees it inline instead of a raw
  // 422 after clicking Save. Ticket min/max isn't backend-validated at all, but a min above
  // max is nonsensical and silently produces a listing no candidate could ever satisfy.
  const validateStage = () => {
    if (stepIdx === 0 && !partnershipType) return 'Partnership type is required.';
    if (stepIdx === 1 && ticketMin !== '' && ticketMax !== '' && Number(ticketMin) > Number(ticketMax)) {
      return 'Ticket min cannot be greater than ticket max.';
    }
    return null;
  };

  const goNext = async () => {
    const validationMessage = validateStage();
    if (validationMessage) { setValidationError(validationMessage); return; }
    setValidationError(null);
    const r = await save();
    if (r) {
      // Record workflow-engine progress for this stage (craft's per-step execution). Uses r's
      // requirement_id directly rather than the requirementId state, which won't have committed
      // yet on the very first save. Best-effort — the requirement is already persisted by save()
      // above. No-op if the workflow is unavailable.
      executeStep(wfStages[stepIdx]?.stepId, { sourceId: r.requirement_id });
      setStepIdx(stepIdx + 1);
    }
  };

  const publish = async () => {
    const validationMessage = validateStage();
    if (validationMessage) { setValidationError(validationMessage); return; }
    setValidationError(null);
    const r = await save({ listing_status: 'LIVE' });
    if (r) {
      // Review is the last stage and has no "Save & Next" — this is the only place its step
      // ever completes. Best-effort, after the real publish above.
      executeStep(wfStages[stepIdx]?.stepId, { sourceId: r.requirement_id });
      navigate('/connect/requirements');
    }
  };

  if (loading) return <Card className="text-center py-10">Loading requirement…</Card>;

  const StageIcon = STAGE_META[stepIdx].icon;

  return (
    <div>
      {/* Every stage save already persists (save() above) and the workflow instance tracks
          progress server-side (see resumeIndex above) — a DRAFT can be safely left and resumed
          later from MyRequirements.jsx's "Continue editing" link. */}
      <button
        type="button" onClick={() => navigate('/connect/dashboard')}
        className="flex items-center gap-1.5 text-xs font-semibold mb-3" style={{ color: 'var(--c-slate)' }}
      >
        <ArrowLeft size={14} strokeWidth={2} /> Back to Dashboard
      </button>
      <StageProgress workflowLabel="Requirement Listing" stageLabel={STAGES[stepIdx]} currentIndex={stepIdx} total={STAGES.length} />
      {error && <Alert tone="error">{error}</Alert>}
      {validationError && <Alert tone="error">{validationError}</Alert>}
      <Card>
        <CardHeader
          icon={<StageIcon size={18} strokeWidth={2} style={{ color: STAGE_META[stepIdx].iconColor }} />}
          iconBg={STAGE_META[stepIdx].iconBg}
          title={STAGE_META[stepIdx].title}
          desc={STAGE_META[stepIdx].desc}
        />
        {stepIdx === 0 && (
          <>
            <Field label="Partnership type" required>
              <select value={partnershipType} onChange={(e) => setPartnershipType(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }}>
                <option value="">Select…</option>
                {PARTNERSHIP_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Product focus"><PillSelect multi options={['Two-Wheeler', 'Personal Loans', 'MSME', 'Home Loans', 'Gold Loans']} value={products} onChange={setProducts} /></Field>
            <Field label="Context / background">
              <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-lg text-sm resize-none" style={{ border: '1.5px solid var(--c-line)' }} />
            </Field>
          </>
        )}

        {stepIdx === 1 && (
          <>
            <Field label="Primary states"><PillSelect multi options={['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Kerala', 'Pan-India']} value={states} onChange={setStates} /></Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Target volume / month"><input value={targetVolume} onChange={(e) => setTargetVolume(e.target.value)} placeholder="₹5 Cr" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
              <Field label="Cases / month"><input value={casesPerMonth} onChange={(e) => setCasesPerMonth(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
              <Field label="Ticket min (₹)"><input value={ticketMin} onChange={(e) => setTicketMin(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
              <Field label="Ticket max (₹)"><input value={ticketMax} onChange={(e) => setTicketMax(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
            </div>
            <Field label="Expected TAT"><input value={expectedTat} onChange={(e) => setExpectedTat(e.target.value)} placeholder="48 hours" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
          </>
        )}

        {stepIdx === 2 && (
          <>
            <Field label="Minimum verification tier">
              <select value={minTier} onChange={(e) => setMinTier(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }}>
                <option value="">Any tier</option>
                <option value="TIER_1">Tier 1</option><option value="TIER_2">Tier 2</option><option value="TIER_3">Tier 3</option>
              </select>
            </Field>
            <Alert tone="warning">EC-10: every candidate is TIER_0 today (no vetting-review action exists yet) — any tier above TIER_0 here will currently exclude every candidate. See 02-feature-spec.md.</Alert>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Min AUM (₹ Cr)"><input value={minAum} onChange={(e) => setMinAum(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
              <Field label="Min branches"><input value={minBranches} onChange={(e) => setMinBranches(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
              <Field label="Min field staff"><input value={minFieldStaff} onChange={(e) => setMinFieldStaff(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
            </div>
          </>
        )}

        {stepIdx === 3 && (
          <>
            {[['Type', PARTNERSHIP_TYPES.find((t) => t.key === partnershipType)?.label || '—'], ['Products', products.join(', ') || '—'], ['Geography', states.join(', ') || '—'], ['Volume', targetVolume || '—'], ['Ticket range', `${ticketMin || '—'} – ${ticketMax || '—'}`]].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1.5 text-[13px]" style={{ borderBottom: '1px solid var(--c-line)' }}>
                <span style={{ color: 'var(--c-muted)' }}>{l}</span><span className="font-semibold">{v}</span>
              </div>
            ))}
            <Alert tone="info">On publish, auto-match ranks candidates by geography, product fit, ticket size, and verification tier (async, cron-driven — BR-07/BR-08).</Alert>
          </>
        )}
      </Card>

      <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid var(--c-line)' }}>
        {stepIdx > 0
          ? <button type="button" onClick={() => setStepIdx(stepIdx - 1)} className="connect-btn-outline flex items-center gap-1.5 px-5 py-2.5"><ArrowLeft size={14} strokeWidth={2} /> Back</button>
          : <span />}
        {stepIdx < STAGES.length - 1
          ? (
            <button type="button" disabled={saving} onClick={goNext} className="connect-btn-primary flex items-center gap-1.5 px-6 py-2.5">
              {saving ? 'Saving…' : (<>Save & Next <ArrowRight size={14} strokeWidth={2} /></>)}
            </button>
          )
          : (
            <button type="button" disabled={saving} onClick={publish} className="connect-btn-primary flex items-center gap-1.5 px-6 py-2.5">
              <Rocket size={14} strokeWidth={2} /> Publish Requirement
            </button>
          )}
      </div>
    </div>
  );
}
