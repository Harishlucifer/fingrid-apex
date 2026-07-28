import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Pencil } from 'lucide-react';
import { Card, Field, Alert } from '../../components/Card';
import OtpInput from '../../components/OtpInput';
import { useConnectDispatch } from '../../state/ConnectContext';
import { useTenantConfig } from '../../state/TenantContext';
import { sendSignInOtp, resendSignInOtp, verifySignInOtp, getProfile } from '../../services/connectApi';

// Real returning-partner sign-in — POST /v1/auth/login-with-otp (pre-existing, not
// Connect-specific). Previously there was NO way back in at all: OnboardingWizard only ever
// creates a fresh local-only demo identity and never calls a real endpoint or stores a token,
// so even a "successfully onboarded" user had no way to return, and nothing downstream
// (Profile/Requirements/Directory) could actually authenticate. This closes that gap.
//
// NOT live-verified end to end: the real endpoint sends an actual SMS OTP via the
// configured provider, so exercising the happy path here would send a real text message to
// a real phone number — not something to trigger blindly during testing. Verified instead
// that sending to an unregistered mobile number fails cleanly ("Invalid credentials"), and
// that the request/response wiring matches the controller's real shape exactly (see
// docs/sdd/connect/05-api-contracts.md and 09-integration-report.md).
export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useConnectDispatch();
  const { tenant, setTenant } = useTenantConfig();
  const tenantName = tenant?.TENANT_NAME || 'Fingrid Connect';
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendSignInOtp(mobile);
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (code) => {
    setError(null);
    setNotice(null);
    try {
      const result = await verifySignInOtp(mobile, code);
      if (result.ok) {
        // See TenantContext.jsx — the login response carries real tenant/system config for
        // free, this is where it actually enters the app after a returning sign-in.
        if (result.tenant || result.system) setTenant({ tenant: result.tenant, system: result.system });
        // login-with-otp's response has no entity_type/primary_role at all (only the coarser
        // partner_category) and no individual name — a plain returning sign-in (as opposed to
        // the onboarding wizard, which collects these itself) previously left the whole rest of
        // identity blank, so CompanyProfileWizard's entityByKey('') silently fell back to
        // ENTITY_TYPES[1] ('dsa_firm') regardless of the real entity type, and the greeting/
        // profile dropdown had nothing to show beyond the company name twice over. One extra
        // GET fixes both — GetProfile now also resolves caller_name from the JWT (see
        // ProfileResponse.CallerName in alpha-api), since neither core_user nor
        // core_channel_user ever had anywhere to durably store the signed-in person's own name.
        const payload = { channelId: result.channelId, email: result.user?.email || '', mobile: result.user?.mobile || '', businessName: result.user?.business_name || '', partnerCode: result.user?.partner_code || '' };
        try {
          const p = await getProfile(result.channelId);
          payload.entityType = p.entity_type || '';
          payload.primaryRole = p.primary_role || '';
          payload.name = p.caller_name || '';
        } catch {
          // non-fatal — identity still mostly populated from the sign-in response above
        }
        dispatch({ type: 'SET_IDENTITY', payload });
        navigate('/connect/dashboard');
        return true;
      }
      if (result.pending === 'registration') {
        setNotice('Your registration is still in progress — continue it to finish setting up your account.');
      } else if (result.pending === 'approval') {
        setNotice('Your registration is pending Fingrid approval. You will be able to sign in once approved.');
      } else if (result.pending === 'rejected') {
        setError('This registration was rejected. Contact Fingrid support for details.');
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return (
    <div>
      <Card className="mt-4 max-w-md mx-auto">
        {/* Logo lockup, matching docs/sdd/connect/03-html-ui/connect-flow-prototype.html's
            login-card composition — reusing the site's own brand gradient (index.css's
            .gradient-bg, navy->blue) for the mark rather than the prototype's teal, per "don't
            change the theme". */}
        <div className="flex flex-col items-center text-center mb-6">
          {tenant?.TENANT_LOGO ? (
            <img src={tenant.TENANT_LOGO} alt={tenantName} className="h-9 max-w-[200px] object-contain mb-4" />
          ) : (
            <div className="flex items-center gap-2 mb-4">
              <span className="gradient-bg w-8 h-8 rounded-lg flex-shrink-0" />
              <span className="font-extrabold text-base" style={{ color: 'var(--c-ink)' }}>
                Fingrid<i style={{ color: 'var(--c-teal-d)', fontStyle: 'normal' }}>Connect</i>
              </span>
            </div>
          )}
          <h2 className="text-2xl font-extrabold mb-1">Welcome back</h2>
          <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>
            Log in to your {tenantName} account
          </p>
        </div>

        {error && <Alert tone="error">{error}</Alert>}
        {notice && <Alert tone="warning">{notice}</Alert>}

        {/* Mobile field stays on screen once OTP is sent (locked, with a "Change" action)
            instead of being swapped away for a separate OTP-only view — the OTP box then
            appears directly underneath it in the same form, matching the pattern
            OnboardingWizard.jsx's own mobile-verify step already uses. */}
        <form onSubmit={sendOtp}>
          <Field label="Registered mobile number" required>
            <div className="flex gap-2">
              <input
                value={mobile} maxLength={10} required disabled={otpSent}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="9XXXXXXXXX"
                className="flex-1 px-3.5 py-3 rounded-lg text-[15px]"
                style={{ border: '2px solid var(--c-line)', background: otpSent ? 'var(--c-bg)' : '#fff', color: otpSent ? 'var(--c-muted)' : 'var(--c-ink)' }}
              />
              {otpSent && (
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setError(null); setNotice(null); }}
                  className="connect-btn-outline flex items-center gap-1.5 px-3.5 text-sm font-semibold"
                >
                  <Pencil size={13} strokeWidth={2} /> Change
                </button>
              )}
            </div>
          </Field>
          {!otpSent && (
            <button type="submit" disabled={mobile.length !== 10 || loading} className="connect-btn-primary w-full flex items-center justify-center gap-1.5 py-3 mt-2">
              {loading ? 'Sending OTP…' : (<>Send OTP <ArrowRight size={15} strokeWidth={2} /></>)}
            </button>
          )}
          {otpSent && (
            <Field label={`OTP sent to ${mobile}`}>
              <OtpInput onVerify={verify} onResend={() => resendSignInOtp(mobile)} />
            </Field>
          )}
        </form>

        <div className="text-center mt-5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
          New to {tenantName}? <Link to="/connect/join" className="font-semibold underline">Create an account</Link>
        </div>
      </Card>
    </div>
  );
}
