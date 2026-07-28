import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Wallet, Users, Handshake, Settings, ClipboardList, ArrowLeft, ArrowRight, Rocket, CheckCircle2, Circle } from 'lucide-react';
import StageProgress from '../../components/StageProgress';
import { Card, CardHeader, Field, Alert } from '../../components/Card';
import DynamicTable from '../../components/DynamicTable';
import PillSelect from '../../components/PillSelect';
import { useConnectState } from '../../state/ConnectContext';
import { useConnectLookups } from '../../state/LookupsContext';
import { getProfile, saveProfile, publishProfile } from '../../services/connectApi';

// WF2 — Company Profile, wired to the REAL API (GET/POST /connect/:channelId/profile,
// verified working in alpha-api). BR-16 (confirmed 2026-07-22): Digital Capabilities is
// LSP-only — every other entity type skips C4→C6 directly. BR-03: publish blocked (409)
// without the entity's mandatory credential.
//
// Layout matches the shared prototype (fingrid-connect-v5.html) structurally: a stage
// badge + thin progress bar (StageProgress) instead of a circular stepper, a card-top
// icon/title/desc header inside each stage's card (CardHeader), and Back/Next buttons in a
// footer BELOW the card rather than a single full-width button inside it.
const STAGE_META = {
  'Legal Identity': { icon: Building2, iconBg: 'var(--c-bs)', iconColor: 'var(--c-blue)', title: 'Legal Identity', desc: 'As per MCA / PAN — anchors your company page.' },
  Operations: { icon: Wallet, iconBg: 'var(--c-ts)', iconColor: 'var(--c-teal)', title: 'Financial & Operational Scale', desc: 'AUM, monthly disbursal, branches, loan-type volumes.' },
  Staff: { icon: Users, iconBg: 'var(--c-ts)', iconColor: 'var(--c-teal)', title: 'Staff by Role & Location', desc: 'Self-declared — vetting available at Verify & Publish.' },
  Empanelments: { icon: Handshake, iconBg: 'var(--c-bs)', iconColor: 'var(--c-blue)', title: 'Empanelments & Credentials', desc: 'Lender tie-ups and mandatory regulatory credentials.' },
  Digital: { icon: Settings, iconBg: 'var(--c-bs)', iconColor: 'var(--c-blue)', title: 'Digital Capabilities', desc: 'App, website, bureau integrations, API readiness — LSP only.' },
  Verify: { icon: ClipboardList, iconBg: 'var(--c-gs)', iconColor: 'var(--c-green)', title: 'Verify & Publish', desc: 'Review completion and publish your company page.' },
};

export default function CompanyProfileWizard() {
  const { channelId, entityType } = useConnectState();
  const navigate = useNavigate();
  const { entityByKey, credentialLabels } = useConnectLookups();
  const entity = entityByKey(entityType);
  const isLSP = !!entity.isLSP;

  const allStages = ['Legal Identity', 'Operations', 'Staff', 'Empanelments', 'Digital', 'Verify'];
  const stages = isLSP ? allStages : allStages.filter((s) => s !== 'Digital');

  const [stepIdx, setStepIdx] = useState(0);
  const stageName = stages[stepIdx];
  const meta = STAGE_META[stageName];

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => { setValidationError(null); }, [stageName]);

  const [legal, setLegal] = useState({ legal_name: '', pan: '', cin: '', incorporation_year: '', registered_state: '', website: '' });
  const [operations, setOperations] = useState({ aum: '', monthly_disbursal: '' });
  const [branches, setBranches] = useState([]);
  const [loanMix, setLoanMix] = useState([]);
  const [states, setStates] = useState([]);
  const [products, setProducts] = useState([]);
  const [staff, setStaff] = useState({ total_staff: '', field_staff_count: '' });
  const [staffByRole, setStaffByRole] = useState([]);
  const [empanelments, setEmpanelments] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [capabilities, setCapabilities] = useState({});
  const [profileMeta, setProfileMeta] = useState(null); // profile_status, verification_tier, completion, vetting

  const loadProfile = useCallback(async () => {
    if (!channelId) { setLoading(false); setApiError('No channel — complete onboarding first.'); return; }
    setLoading(true);
    try {
      const p = await getProfile(channelId);
      setProfileMeta(p);
      if (p.legal) setLegal((s) => ({ ...s, ...p.legal }));
      if (p.operations) {
        setOperations({ aum: p.operations.aum || '', monthly_disbursal: p.operations.monthly_disbursal || '' });
        setLoanMix(p.operations.loan_mix || []);
        setProducts(p.operations.products || []);
        // Geography is an array of {states,districts} groups server-side (matches
        // Requirement Listing's shape); this wizard only ever writes one flat group, so
        // flatten every group's states back into one list for the pill selector.
        setStates((p.operations.geography || []).flatMap((g) => g.states || []));
      }
      if (p.staff) {
        setStaff({ total_staff: p.staff.total_staff || '', field_staff_count: p.staff.field_staff_count || '' });
        setStaffByRole(p.staff.staff_by_role || []);
      }
      if (p.empanelments) setEmpanelments(p.empanelments);
      if (p.credentials) setCredentials(p.credentials);
      if (p.capabilities) setCapabilities(p.capabilities);
      setApiError(null);
    } catch (e) {
      // Expected today: WF1 isn't wired to a real backend, so channelId is a demo string with
      // no matching core_channel row — this 404s. Flagged, not hidden; wizard still usable
      // locally so the UI itself can be reviewed independent of that gap.
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  // saveStage returns true/false so goNext can gate advancement on it — previously this
  // swallowed failures internally and goNext always advanced regardless, so a failed save
  // (e.g. a type mismatch — see the num()/cleanRows() helpers below) silently lost that
  // stage's data while the wizard moved on as if it had succeeded.
  const saveStage = async (stage, payload) => {
    setSaving(true);
    setApiError(null);
    try {
      const p = await saveProfile(channelId, { stage, ...payload });
      setProfileMeta(p);
      return true;
    } catch (e) {
      setApiError(e.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ProfileRequest's numeric fields are real Go int/float64 — the plain <input>/DynamicTable
  // elements that feed them only ever produce strings, and alpha-api's JSON unmarshal does not
  // coerce "2015" into an int (verified live: it 400s "cannot unmarshal string into ... int").
  // num() converts, dropping genuinely-empty values rather than sending 0/NaN.
  const num = (v) => {
    if (v === '' || v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  };

  // DynamicTable rows are all-string and can be "added but not yet filled in" — sending an
  // empty required field (e.g. ClientName/Type, both `validate:"required"` server-side) 422s
  // the WHOLE stage save because of one blank row. Filter those out before sending, and
  // coerce this row-shape's own numeric field.
  const cleanRows = (rows, requiredKey, numericKey) =>
    rows
      .filter((r) => (r[requiredKey] ?? '').toString().trim() !== '')
      .map((r) => (numericKey ? { ...r, [numericKey]: num(r[numericKey]) } : r));

  const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

  // Client-side gate, checked before the API call ever fires — the backend itself is loose
  // (Legal/Operations/Staff have no `validate:"required"` tags at all; a fully empty stage
  // would 200 successfully), but a company page with no name/PAN is meaningless everywhere
  // downstream (Directory, Matches, the requirement owner's own profile). Only the two fields
  // already shown with a `required` asterisk are enforced — that badge was previously
  // decorative, not checked.
  const validateStage = () => {
    if (stageName === 'Legal Identity') {
      if (!legal.legal_name.trim()) return 'Registered legal name is required.';
      if (!legal.pan.trim()) return 'PAN is required.';
      if (!PAN_RE.test(legal.pan.trim())) return 'PAN must be in the format ABCDE1234F.';
    }
    if (stageName === 'Operations') {
      if (operations.aum !== '' && Number(operations.aum) < 0) return 'AUM cannot be negative.';
      if (operations.monthly_disbursal !== '' && Number(operations.monthly_disbursal) < 0) return 'Monthly disbursal cannot be negative.';
    }
    if (stageName === 'Staff') {
      if (staff.total_staff !== '' && Number(staff.total_staff) < 0) return 'Total staff cannot be negative.';
      if (staff.field_staff_count !== '' && Number(staff.field_staff_count) < 0) return 'Field staff count cannot be negative.';
      if (staff.total_staff !== '' && staff.field_staff_count !== '' && Number(staff.field_staff_count) > Number(staff.total_staff)) {
        return 'Field staff count cannot exceed total staff.';
      }
    }
    return null;
  };

  const goNext = async () => {
    const validationMessage = validateStage();
    if (validationMessage) { setValidationError(validationMessage); return; }
    setValidationError(null);

    let ok = true;
    if (stageName === 'Legal Identity') {
      ok = await saveStage('LEGAL', { legal: { ...legal, incorporation_year: num(legal.incorporation_year) } });
    } else if (stageName === 'Operations') {
      ok = await saveStage('OPERATIONS', {
        operations: {
          aum: num(operations.aum),
          monthly_disbursal: num(operations.monthly_disbursal),
          branches: branches.filter((r) => (r.location ?? '').trim() !== ''),
          loan_mix: cleanRows(loanMix, 'loan_type', 'monthly_amount'),
          geography: states.length ? [{ states }] : undefined,
          products,
        },
      });
    } else if (stageName === 'Staff') {
      ok = await saveStage('STAFF', {
        staff: {
          total_staff: num(staff.total_staff),
          field_staff_count: num(staff.field_staff_count),
          staff_by_role: cleanRows(staffByRole, 'role', 'count'),
        },
      });
    } else if (stageName === 'Empanelments') {
      ok = await saveStage('EMPANELMENT', {
        empanelments: cleanRows(empanelments, 'client_name', 'active_since'),
        credentials: cleanRows(credentials, 'type'),
      });
    } else if (stageName === 'Digital') {
      ok = await saveStage('CAPABILITIES', { capabilities });
    }
    if (ok && stepIdx < stages.length - 1) setStepIdx(stepIdx + 1);
  };

  const doPublish = async () => {
    setPublishError(null);
    try {
      const p = await publishProfile(channelId);
      setProfileMeta(p);
    } catch (e) {
      // BR-03: 409 with a message naming the missing mandatory credential — surfaced verbatim.
      setPublishError(e.message);
    }
  };

  if (loading) return <Card className="text-center py-10">Loading profile…</Card>;

  return (
    <div>
      <StageProgress workflowLabel="Company Profile" stageLabel={stageName} currentIndex={stepIdx} total={stages.length} />
      {apiError && <Alert tone="warning">{apiError} — form still works locally for review.</Alert>}
      {validationError && <Alert tone="error">{validationError}</Alert>}
      <Card>
        <CardHeader
          icon={<meta.icon size={18} strokeWidth={2} style={{ color: meta.iconColor }} />}
          iconBg={meta.iconBg}
          title={meta.title}
          desc={meta.desc}
        />

        {stageName === 'Legal Identity' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Registered legal name" required><input value={legal.legal_name} onChange={(e) => setLegal({ ...legal, legal_name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
            <Field label="PAN" required><input value={legal.pan} onChange={(e) => setLegal({ ...legal, pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
            <Field label="CIN (if applicable)"><input value={legal.cin} onChange={(e) => setLegal({ ...legal, cin: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
            <Field label="Year of incorporation"><input value={legal.incorporation_year} onChange={(e) => setLegal({ ...legal, incorporation_year: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
            <Field label="Registered state"><input value={legal.registered_state} onChange={(e) => setLegal({ ...legal, registered_state: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
            <Field label="Website"><input value={legal.website} onChange={(e) => setLegal({ ...legal, website: e.target.value })} placeholder="https://" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
          </div>
        )}

        {stageName === 'Operations' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <Field label="Overall AUM (₹ Cr)"><input value={operations.aum} onChange={(e) => setOperations({ ...operations, aum: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
              <Field label="Monthly disbursal (₹ Cr)"><input value={operations.monthly_disbursal} onChange={(e) => setOperations({ ...operations, monthly_disbursal: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
            </div>
            <Field label="Primary states"><PillSelect multi options={['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Kerala', 'Pan-India']} value={states} onChange={setStates} /></Field>
            <Field label="Products offered"><PillSelect multi options={['Two-Wheeler', 'Personal Loans', 'MSME', 'Home Loans', 'Gold Loans']} value={products} onChange={setProducts} /></Field>
            <Field label="Branches">
              <DynamicTable columns={[{ key: 'location', label: 'Location', placeholder: 'Coimbatore' }, { key: 'address', label: 'Address' }]} rows={branches} onChange={setBranches} addLabel="Add branch" />
            </Field>
            <Field label="Loan mix (monthly)">
              <DynamicTable columns={[{ key: 'loan_type', label: 'Loan Type', placeholder: 'Two-Wheeler' }, { key: 'monthly_amount', label: '₹ Cr / month' }]} rows={loanMix} onChange={setLoanMix} addLabel="Add loan type" />
            </Field>
          </>
        )}

        {stageName === 'Staff' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <Field label="Total staff"><input value={staff.total_staff} onChange={(e) => setStaff({ ...staff, total_staff: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
              <Field label="Field staff count"><input value={staff.field_staff_count} onChange={(e) => setStaff({ ...staff, field_staff_count: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} /></Field>
            </div>
            <Field label="Staff by role">
              <DynamicTable columns={[{ key: 'role', label: 'Role', placeholder: 'Field Sales' }, { key: 'count', label: 'Count' }, { key: 'locations', label: 'Locations' }]} rows={staffByRole} onChange={setStaffByRole} addLabel="Add role" />
            </Field>
          </>
        )}

        {stageName === 'Empanelments' && (
          <>
            <Field label="Lender empanelments">
              <DynamicTable columns={[{ key: 'client_name', label: 'Lender', placeholder: 'FlexiLoans' }, { key: 'product_segment', label: 'Product' }, { key: 'active_since', label: 'Since' }, { key: 'reference_no', label: 'Ref #' }]} rows={empanelments} onChange={setEmpanelments} addLabel="Add empanelment" />
            </Field>
            {entity.mandatoryCredential && (
              <Alert tone="warning">
                BR-03: <b>{credentialLabels[entity.mandatoryCredential]}</b> is mandatory for entity type <b>{entity.label}</b> before publishing.
              </Alert>
            )}
            <Field label="Regulatory credentials">
              <DynamicTable columns={[{ key: 'type', label: 'Type (e.g. RBI_BC)' }, { key: 'registration_no', label: 'Registration No.' }, { key: 'document_id', label: 'Document ID' }]} rows={credentials} onChange={setCredentials} addLabel="Add credential" />
            </Field>
          </>
        )}

        {stageName === 'Digital' && (
          <>
            <p className="text-xs mb-3" style={{ color: 'var(--c-muted)' }}>LSP-only stage (BR-16) — shown because entity type is LSP / Aggregator.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['app', 'website', 'api'].map((k) => (
                <label key={k} className="flex items-center gap-2 text-sm capitalize">
                  <input type="checkbox" checked={!!capabilities[k]?.enabled} onChange={(e) => setCapabilities({ ...capabilities, [k]: { enabled: e.target.checked } })} />
                  {k} ready
                </label>
              ))}
            </div>
          </>
        )}

        {stageName === 'Verify' && (
          <>
            {profileMeta?.completion && (
              <div className="mb-4">
                <div className="space-y-1">
                  {profileMeta.completion.stages.map((s) => {
                    // The server's completion checklist always includes "Digital Capabilities"
                    // even for non-LSP entities (this wizard itself hides that stage for them —
                    // see the `stages` filter above) and marks "Empanelments" incomplete whenever
                    // it's genuinely empty, regardless of whether this entity type even requires
                    // one (BR-03 only requires it for entity types with a mandatoryCredential).
                    // Left unlabeled, a company can publish successfully and still see stages
                    // marked incomplete forever with no way to know that's expected — so mark
                    // those specific cases Optional/N/A instead of leaving them looking missing.
                    const note = s.name === 'Digital Capabilities' && !isLSP
                      ? 'N/A'
                      : s.name === 'Empanelments' && !entity.mandatoryCredential
                        ? 'Optional'
                        : null;
                    return (
                      <div key={s.name} className="flex items-center justify-between py-1 text-xs">
                        <span className="flex items-center gap-1.5" style={{ color: s.done ? 'var(--c-ink)' : 'var(--c-muted)' }}>
                          {s.done
                            ? <CheckCircle2 size={13} strokeWidth={2} style={{ color: 'var(--c-green)' }} />
                            : <Circle size={13} strokeWidth={2} style={{ color: 'var(--c-faint)' }} />}
                          {s.name}
                        </span>
                        {!s.done && note && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--c-bg)', color: 'var(--c-muted)' }}>{note}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <Alert tone="info">Verification tier: <b>{profileMeta?.verification_tier || 'TIER_0'}</b> — moves up once staff approve a submitted claim (see 02-feature-spec.md BR-17/BR-24).</Alert>
            {publishError && <Alert tone="error">{publishError}</Alert>}
            {profileMeta?.profile_status === 'PUBLISHED' ? (
              <Alert tone="success">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} strokeWidth={2} /> Company page is PUBLISHED.</span>
              </Alert>
            ) : (
              <button type="button" onClick={doPublish} className="connect-btn-primary w-full flex items-center justify-center gap-1.5 py-3">
                <Rocket size={15} strokeWidth={2} /> Publish Company Page
              </button>
            )}
          </>
        )}
      </Card>

      <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid var(--c-line)' }}>
        {stepIdx > 0
          ? <button type="button" onClick={() => setStepIdx(stepIdx - 1)} className="connect-btn-outline flex items-center gap-1.5 px-5 py-2.5"><ArrowLeft size={14} strokeWidth={2} /> Back</button>
          : <span />}
        {stageName !== 'Verify' && (
          <button type="button" disabled={saving} onClick={goNext} className="connect-btn-primary flex items-center gap-1.5 px-6 py-2.5">
            {saving ? 'Saving…' : (<>Save & Next <ArrowRight size={14} strokeWidth={2} /></>)}
          </button>
        )}
        {stageName === 'Verify' && profileMeta?.profile_status === 'PUBLISHED' && (
          <button type="button" onClick={() => navigate('/connect/dashboard')} className="connect-btn-primary flex items-center gap-1.5 px-6 py-2.5">
            Go to Dashboard <ArrowRight size={14} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}
