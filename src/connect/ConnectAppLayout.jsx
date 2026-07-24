import { useEffect, useRef, useState } from 'react';
import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { Bell, User, LogOut, Home, Building2, ClipboardList, Target, Inbox, Handshake, Mail, Phone } from 'lucide-react';
import '../connect/connect-theme.css';
import { useConnectState } from './state/ConnectContext';
import { useTenantConfig } from './state/TenantContext';
import { logout, hasConnectSession } from './services/connectApi';

const NAV = [
  { to: '/connect/dashboard', label: 'Dashboard', icon: Home },
  { to: '/connect/directory', label: 'Directory', icon: Building2 },
  { to: '/connect/requirements', label: 'Requirements', icon: ClipboardList },
  { to: '/connect/matches', label: 'Matches', icon: Target },
  { to: '/connect/requests', label: 'Requests', icon: Inbox },
  { to: '/connect/partners', label: 'Partners', icon: Handshake },
];

// Topbar + rail app-home shell — used ONLY for the logged-in Dashboard/Directory/Matches/
// Requests/Partners area, where a persistent nav is a legitimate pattern (there's actually
// somewhere to navigate between). Onboarding/Company-Profile/Requirement wizards use
// ConnectAuthLayout instead (see its own header comment for why).
export default function ConnectAppLayout() {
  const { name, businessName, email, mobile, domain, entityType, primaryRole } = useConnectState();
  const { tenant } = useTenantConfig();
  // See name/businessName's own comment in ConnectContext.jsx — a plain returning sign-in has
  // no individual name to show, only the company name, so this is the realistic fallback
  // chain rather than ever showing a blank "Signed in".
  const displayName = name || businessName || email || 'Signed in';
  const initial = (name || businessName || email || '?').trim().charAt(0).toUpperCase();
  // TenantContext (see its own header comment) is only populated after a real login — before
  // that, or if tenant data failed to load, this falls back to the same "Fingrid Connect"
  // wordmark the app always showed, so branding never goes blank.
  const brandName = tenant?.TENANT_NAME || '';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    // logout() calls the real GET /alpha/v2/auth/logout, clears local tokens + identity, and
    // hard-navigates to /connect/login itself — nothing further needed here on success or
    // failure (its own try/catch treats the API call as best-effort).
    await logout();
  };

  // Guards the whole logged-in area (dashboard/directory/requirements/matches/requests/
  // partners). Without this, a signed-out session could still land here — e.g. the browser
  // back button after logout()'s own hard redirect, or a direct URL — and each page rendered
  // its own inline "no channel identity" message instead of actually leaving the page.
  if (!hasConnectSession()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="connect-app min-h-screen flex flex-col">
      <header className="h-14 flex items-center gap-3 px-5 flex-shrink-0" style={{ background: '#fff', borderBottom: '1px solid var(--c-line)' }}>
        {tenant?.TENANT_LOGO ? (
          <img src={tenant.TENANT_LOGO} alt={brandName || 'Fingrid Connect'} className="h-6 max-w-[160px] object-contain" />
        ) : brandName ? (
          <span className="font-extrabold text-[15px]" style={{ color: 'var(--c-ink)' }}>{brandName}</span>
        ) : (
          <span className="font-extrabold text-[15px]" style={{ color: 'var(--c-ink)' }}>
            Fingrid<i style={{ color: 'var(--c-teal-d)', fontStyle: 'normal' }}>Connect</i>
          </span>
        )}
        <span className="flex-1" />
        <span className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer" style={{ color: 'var(--c-slate)' }} title="Notifications">
          <Bell size={18} strokeWidth={2} />
        </span>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'var(--c-bg)', border: '1px solid var(--c-line)', color: 'var(--c-slate)' }}
          >
            <User size={18} strokeWidth={2} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 w-64 rounded-lg overflow-hidden z-10" style={{ background: '#fff', border: '1px solid var(--c-line)', boxShadow: 'var(--c-shm)' }}>
              <div className="px-3.5 py-3 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--c-line)' }}>
                <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: 'var(--c-ts)', color: 'var(--c-teal-d)' }}>
                  {initial}
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold truncate">{displayName}</div>
                  {businessName && name && <div className="text-[11px] truncate" style={{ color: 'var(--c-muted)' }}>{businessName}</div>}
                </div>
              </div>
              <div className="px-3.5 py-2.5 text-[11px] space-y-1" style={{ borderBottom: '1px solid var(--c-line)', color: 'var(--c-muted)' }}>
                {email && <div className="flex items-center gap-1.5 truncate"><Mail size={11} strokeWidth={2} /> {email}</div>}
                {mobile && <div className="flex items-center gap-1.5 truncate"><Phone size={11} strokeWidth={2} /> {mobile}</div>}
                {(entityType || primaryRole) && <div className="truncate">{entityType || primaryRole}{domain ? ` · ${domain}` : ''}</div>}
              </div>
              <button
                type="button"
                disabled={loggingOut}
                onClick={handleLogout}
                className="w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center gap-2"
                style={{ color: '#B91C1C' }}
              >
                <LogOut size={14} strokeWidth={2} />
                {loggingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        {/* Desktop/tablet rail — hidden below md, replaced by the fixed bottom tab bar so the
            6 destinations stay reachable without eating ~92px of a phone's width. */}
        <nav className="hidden md:flex w-[92px] flex-shrink-0 flex-col gap-0.5 py-3" style={{ background: '#fff', borderRight: '1px solid var(--c-line)' }}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 px-1 text-[10.5px] font-semibold transition-colors border-l-[3px] ${isActive ? '' : 'border-transparent'}`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--c-teal)' : 'var(--c-slate)',
                borderLeftColor: isActive ? 'var(--c-teal)' : 'transparent',
                background: isActive ? 'rgba(50,132,255,.08)' : 'transparent',
              })}
            >
              <item.icon size={20} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
          <div className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">
            <Outlet />
          </div>
          {/* Anchors the bottom of the content area instead of leaving it open-ended — on
              shorter pages (e.g. an empty Dashboard) this sits flush with the viewport bottom
              rather than trailing off into blank space, matching the footer bar the shared
              prototype (connect-flow-prototype.html) always had. Hidden on mobile — the fixed
              bottom tab bar already occupies that space there. */}
          <footer className="hidden md:flex px-6 py-3.5 text-[11px] items-center justify-between flex-shrink-0" style={{ borderTop: '1px solid var(--c-line)', color: 'var(--c-muted)' }}>
            <span>© {new Date().getFullYear()} {brandName || 'Fingrid Connect'}</span>
            <span>Powered by Fingrid.ai</span>
          </footer>
        </main>
      </div>

      {/* Mobile bottom tab bar — the rail's equivalent below md. Fixed so it stays reachable
          while the content area above scrolls independently. */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 flex" style={{ background: '#fff', borderTop: '1px solid var(--c-line)', boxShadow: 'var(--c-shm)' }}>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex-1 min-w-0 flex flex-col items-center gap-0.5 py-2"
            style={({ isActive }) => ({ color: isActive ? 'var(--c-teal)' : 'var(--c-slate)' })}
          >
            <item.icon size={19} strokeWidth={2} />
            <span className="text-[9px] font-semibold truncate max-w-full px-0.5">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
