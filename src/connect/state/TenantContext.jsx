import { createContext, useContext, useEffect, useState } from 'react';

// Tenant branding/config — mirrors craft-frontend's TenantConfigurationProvider pattern
// (src/Components/Common/TenantConfigurationProvider.js there: a dedicated Context + a
// useTenantConfiguration() hook, consumed everywhere branding is shown instead of hardcoding
// "Fingrid Connect"). One difference: craft-frontend populates it from a separate
// POST /alpha/v1/setup call fired on every app mount; here, POST /auth/login-with-otp's own
// response already carries the same `tenant`/`system` shape (TENANT_NAME/TENANT_LOGO/
// TENANT_FAVICON/etc) alongside `user`, so this is populated directly off the real sign-in
// response (connectApi.js's verifySignInOtp) rather than a second round-trip.
const STORAGE_KEY = 'connect_tenant_v1';

const TenantContext = createContext(null);

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function TenantProvider({ children }) {
  const [data, setData] = useState(loadPersisted);

  // The one place craft-frontend's own equivalent provider actually applies tenant config to
  // something visible (title + favicon) — PRIMARY_COLOR/SECONDARY_COLOR are fetched there too
  // but a codebase-wide check found them never actually applied anywhere in that app either,
  // so that half isn't replicated here; connect-theme.css's palette stays the deliberate
  // brand retheme from earlier in this session, not a per-tenant override.
  useEffect(() => {
    if (data?.tenant?.TENANT_NAME) {
      document.title = data.tenant.TENANT_NAME;
    }
    if (data?.tenant?.TENANT_FAVICON) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = data.tenant.TENANT_FAVICON;
    }
  }, [data]);

  const setTenant = ({ tenant, system }) => {
    const next = { tenant: tenant || null, system: system || null };
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort — in-memory context still works this session even if persistence fails
    }
  };

  const clearTenant = () => {
    setData(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <TenantContext.Provider value={{ tenant: data?.tenant || null, system: data?.system || null, setTenant, clearTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantConfig() {
  const ctx = useContext(TenantContext);
  if (ctx === null) throw new Error('useTenantConfig must be used within a TenantProvider');
  return ctx;
}
