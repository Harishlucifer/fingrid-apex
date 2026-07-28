import { createContext, useContext, useEffect, useState } from 'react';
import { fetchLookupGroups, initGuestSession } from '../services/connectApi';

const LookupsContext = createContext(null);

// Returned by entityByKey() before the live list has loaded (or on a miss), so consumers like
// CompanyProfileWizard's `entity.isLSP` don't crash reading off `undefined` on first render.
const DEFAULT_ENTITY = { key: '', label: '', role: '', category: '', isLSP: false, isLender: false, mandatoryCredential: null };

const EMPTY = {
  entityTypes: [],
  personalDomains: [],
  designationsByEntityType: {},
  departmentsByEntityType: {},
  partnershipTypes: [],
  credentialLabels: {},
};

// core_lookup_master rows' `configuration` column round-trips through res.json() already
// parsed into an object (verified live against GET /lookup — {"role":"DSA",...}, not a JSON
// string) — only fall back to JSON.parse for the unlikely case a driver/version serializes it
// as a string.
function parseConfig(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw;
}

// Rows have no dedicated sort column (see the migration) — id is assigned in the intended
// display order (e.g. "Other" last), so every group is sorted by id ascending here.
function byId(a, b) {
  return a.id - b.id;
}

function buildFromRows(rows) {
  const sorted = [...rows].sort(byId);

  const entityTypes = sorted
    .filter((r) => r.group_code === 'CHANNEL_ENTITY_TYPE')
    .map((r) => {
      const cfg = parseConfig(r.configuration);
      return {
        key: r.lu_key,
        label: r.lu_name,
        role: cfg.role || '',
        category: cfg.category || '',
        isLSP: !!cfg.is_lsp,
        isLender: !!cfg.is_lender,
        mandatoryCredential: cfg.mandatory_credential || null,
      };
    });

  const personalDomains = sorted
    .filter((r) => r.group_code === 'PERSONAL_EMAIL_DOMAIN')
    .map((r) => r.lu_value || r.lu_key);

  const designationsByEntityType = {};
  const departmentsByEntityType = {};
  sorted
    .filter((r) => r.group_code === 'CONNECT_DESIGNATION')
    .forEach((r) => {
      const et = parseConfig(r.configuration).entity_type;
      if (!et) return;
      (designationsByEntityType[et] ||= []).push(r.lu_value || r.lu_name);
    });
  sorted
    .filter((r) => r.group_code === 'CONNECT_DEPARTMENT')
    .forEach((r) => {
      const et = parseConfig(r.configuration).entity_type;
      if (!et) return;
      (departmentsByEntityType[et] ||= []).push(r.lu_value || r.lu_name);
    });

  const partnershipTypes = sorted
    .filter((r) => r.group_code === 'CONNECT_PARTNERSHIP_TYPE')
    .map((r) => ({ key: r.lu_key, label: r.lu_value || r.lu_name }));

  const credentialLabels = {};
  sorted
    .filter((r) => r.group_code === 'CONNECT_CREDENTIAL_LABEL')
    .forEach((r) => {
      credentialLabels[r.lu_key] = r.lu_value || r.lu_name;
    });

  return { entityTypes, personalDomains, designationsByEntityType, departmentsByEntityType, partnershipTypes, credentialLabels };
}

const GROUPS = ['CHANNEL_ENTITY_TYPE', 'PERSONAL_EMAIL_DOMAIN', 'CONNECT_DESIGNATION', 'CONNECT_DEPARTMENT', 'CONNECT_PARTNERSHIP_TYPE', 'CONNECT_CREDENTIAL_LABEL'];

// Fetches every Connect onboarding/company-profile config lookup once per app load (GET
// /lookup?group_code=... — real core_lookup_master data, see connectApi.js's
// fetchLookupGroups and the 20260710120000_FINGRID_CONNECT_ONBOARDING /
// 20260727120000_FINGRID_CONNECT_LOOKUPS_EXT migrations). None of this is hardcoded
// client-side anymore — entityTypes/personalDomains/etc start empty and populate once the
// live call resolves; consumers should treat `loading` as "don't render the real list yet"
// rather than trusting a stale local copy.
export function LookupsProvider({ children }) {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Warm the shared pre-login guest session once, up front — so the guest token exists before
    // registration/OTP/lookup calls need it (see ensureGuestToken in connectApi.js). fetchLookupGroups
    // below would lazily bootstrap it anyway; this makes it explicit and independent of that call
    // succeeding. Both share one in-flight /auth/guest request, so it's still a single network call.
    initGuestSession();
    fetchLookupGroups(GROUPS)
      .then((rows) => {
        if (cancelled) return;
        setData(buildFromRows(rows));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const entityByKey = (key) => data.entityTypes.find((e) => e.key === key) || data.entityTypes[1] || DEFAULT_ENTITY;
  const isPersonalDomain = (domain) => data.personalDomains.includes((domain || '').toLowerCase());

  return (
    <LookupsContext.Provider value={{ ...data, loading, error, entityByKey, isPersonalDomain }}>
      {children}
    </LookupsContext.Provider>
  );
}

export function useConnectLookups() {
  const ctx = useContext(LookupsContext);
  if (ctx === null) throw new Error('useConnectLookups must be used within a LookupsProvider');
  return ctx;
}
