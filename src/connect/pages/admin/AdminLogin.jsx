import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { adminLogin, getAdminToken } from '../../services/connectAdminApi';

// Employee login for the Fingrid Connect admin view. Calls the real, pre-existing
// POST /v1/auth/login-with-password (X-Platform: EMPLOYEE_PORTAL) — there is no separate
// "admin login" endpoint; this is the same login every internal Fingrid tool would use.
//
// NOT live-verified end to end: doing so needs a real employee's email/password, which
// weren't available during build/test. The route-level guard (RequireEmployee) and every
// downstream admin endpoint WERE verified live using a manually-signed test JWT with
// userType=EMPLOYEE — see docs/sdd/connect/09-integration-report.md. Only this specific
// login form's request/response wiring is unverified against a real account.
export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (getAdminToken()) return <Navigate to="/connect/admin/partners" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminLogin({ email, password });
      navigate('/connect/admin/partners');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
      <form onSubmit={submit} className="w-full max-w-sm p-7 rounded-xl" style={{ background: '#0b1220', border: '1px solid #1f2937' }}>
        <div className="font-extrabold text-lg text-white mb-1">Fingrid Connect</div>
        <div className="text-[13px] mb-6" style={{ color: '#94a3b8' }}>Internal admin sign-in</div>

        {error && (
          <div className="rounded-md px-3 py-2 text-[12.5px] mb-4" style={{ background: '#3f1d1d', border: '1px solid #7f1d1d', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <label className="text-[11px] font-bold uppercase tracking-wide mb-1 block" style={{ color: '#94a3b8' }}>Work Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-sm mb-4 bg-transparent text-white"
          style={{ border: '1.5px solid #334155' }}
        />

        <label className="text-[11px] font-bold uppercase tracking-wide mb-1 block" style={{ color: '#94a3b8' }}>Password</label>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-sm mb-5 bg-transparent text-white"
          style={{ border: '1.5px solid #334155' }}
        />

        <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg text-sm font-bold" style={{ background: 'var(--c-teal, #00B09B)', color: '#fff' }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
