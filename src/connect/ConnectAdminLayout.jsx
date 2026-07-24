import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getAdminToken, adminLogout } from './services/connectAdminApi';
import './connect-theme.css';

const NAV = [
  { to: '/connect/admin/partners', label: 'Partners & Vetting' },
  { to: '/connect/admin/requirements', label: 'Requirement Moderation' },
];

// Internal-staff shell — deliberately styled DIFFERENT from ConnectAppLayout's teal
// customer-facing system (dark bar, plain type) so nobody mistakes this for a partner-facing
// screen. Gated on the presence of an admin token (see connectAdminApi.js); the real
// authorization check is server-side (RequireEmployee on every /connect/admin/* route) — this
// client-side check is just to keep a logged-out admin from seeing a blank/erroring screen.
export default function ConnectAdminLayout() {
  const navigate = useNavigate();
  if (!getAdminToken()) return <Navigate to="/connect/admin/login" replace />;

  return (
    <div className="connect-app min-h-screen flex flex-col" style={{ background: '#0f172a' }}>
      <header className="h-14 flex items-center gap-4 px-5 flex-shrink-0" style={{ background: '#0b1220', borderBottom: '1px solid #1f2937' }}>
        <span className="font-extrabold text-[15px] text-white">
          Fingrid Connect <span style={{ color: '#94a3b8', fontWeight: 500 }}>— Internal</span>
        </span>
        <nav className="flex gap-1 ml-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-[13px] font-semibold transition-colors ${isActive ? 'text-white' : ''}`
              }
              style={({ isActive }) => ({
                background: isActive ? 'rgba(0,176,155,.18)' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <span className="flex-1" />
        <button
          type="button"
          onClick={() => { adminLogout(); navigate('/connect/admin/login'); }}
          className="text-[12px] font-semibold px-3 py-1.5 rounded-md"
          style={{ color: '#e2e8f0', border: '1px solid #334155' }}
        >
          Log out
        </button>
      </header>
      <main className="flex-1 min-w-0 overflow-y-auto p-6" style={{ background: '#f1f5f9' }}>
        <Outlet />
      </main>
    </div>
  );
}
