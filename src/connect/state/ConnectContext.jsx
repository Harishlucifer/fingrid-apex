import { createContext, useContext, useReducer, useEffect } from 'react';

// Fingrid Connect — single store, replacing the prototype's global `st`/`state` objects.
// Shape follows fingrid-connect-integration-plan.md's Phase 0 spec + what the real API
// (05-api-contracts.md v3.0) actually returns, not the demo prototype's mock fields.

const STORAGE_KEY = 'connect_state_v1';

const initialState = {
  // Identity (WF1)
  channelId: null,
  channelUserId: null,
  email: '',
  domain: '',
  entityType: '',
  primaryRole: '',
  isPersonalDomain: false,
  // Signed-in user display info — login-with-otp's response (see connectApi.js's
  // verifySignInOtp) only ever returns business_name/mobile/partner_code for the CHANNEL, not
  // the individual's name, so `name` is only ever populated when set during the SAME session's
  // onboarding wizard (which does collect first/last name); a plain returning sign-in has no
  // name to show and falls back to businessName/email in the UI instead of inventing one.
  name: '',
  businessName: '',
  mobile: '',
  partnerCode: '',

  // Company Profile (WF2) — mirrors the real ProfileResponse shape
  profile: null, // { profile_status, verification_tier, legal, operations, staff, empanelments, credentials, capabilities, vetting, completion }
  profileLoading: false,
  profileError: null,

  // Requirements (WF3)
  requirements: [],
  requirementsLoading: false,
  requirementsError: null,

  // Directory / Matches / Requests / Partners (WF4)
  directoryFilters: { q: '', entityType: '', state: '' },
  matches: [],
  partners: [],

  // UI
  currentWorkflow: null, // 'onboard' | 'company' | 'req' | null
};

// core_channel.id is a real BIGINT — always all-digits. Anything else (e.g. the old
// 'DEMO-' + Date.now() placeholder this store used to accept before WF1 was wired to the
// real API) is a leftover fake identity from before that fix and must never be restored —
// every /v1/connect/:channelId/* call would silently 404/fail forever otherwise.
function isRealChannelId(id) {
  return typeof id === 'string' && /^\d+$/.test(id);
}

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!isRealChannelId(parsed.channelId)) {
      // Purge the whole persisted identity, not just channelId — a fake channelId means the
      // rest (email/domain/entityType) came from the same never-really-registered session.
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }
    // Only persist identity — everything else re-fetches from the API on load, since it's
    // the source of truth once WF1 auth is real (unlike the demo prototype's full-state persist).
    return {
      channelId: parsed.channelId,
      channelUserId: parsed.channelUserId ?? null,
      email: parsed.email ?? '',
      domain: parsed.domain ?? '',
      entityType: parsed.entityType ?? '',
      primaryRole: parsed.primaryRole ?? '',
      name: parsed.name ?? '',
      businessName: parsed.businessName ?? '',
      mobile: parsed.mobile ?? '',
      partnerCode: parsed.partnerCode ?? '',
    };
  } catch {
    return {};
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_IDENTITY':
      return { ...state, ...action.payload };
    case 'PROFILE_LOADING':
      return { ...state, profileLoading: true, profileError: null };
    case 'PROFILE_LOADED':
      return { ...state, profile: action.payload, profileLoading: false };
    case 'PROFILE_ERROR':
      return { ...state, profileLoading: false, profileError: action.payload };
    case 'REQUIREMENTS_LOADING':
      return { ...state, requirementsLoading: true, requirementsError: null };
    case 'REQUIREMENTS_LOADED':
      return { ...state, requirements: action.payload, requirementsLoading: false };
    case 'REQUIREMENTS_ERROR':
      return { ...state, requirementsLoading: false, requirementsError: action.payload };
    case 'SET_MATCHES':
      return { ...state, matches: action.payload };
    case 'SET_PARTNERS':
      return { ...state, partners: action.payload };
    case 'SET_DIRECTORY_FILTERS':
      return { ...state, directoryFilters: { ...state.directoryFilters, ...action.payload } };
    case 'SET_WORKFLOW':
      return { ...state, currentWorkflow: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

const ConnectStateContext = createContext(null);
const ConnectDispatchContext = createContext(null);

export function ConnectProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { ...initialState, ...loadPersisted() });

  useEffect(() => {
    const { channelId, channelUserId, email, domain, entityType, primaryRole, name, businessName, mobile, partnerCode } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ channelId, channelUserId, email, domain, entityType, primaryRole, name, businessName, mobile, partnerCode }));
  }, [state.channelId, state.channelUserId, state.email, state.domain, state.entityType, state.primaryRole, state.name, state.businessName, state.mobile, state.partnerCode]);

  return (
    <ConnectStateContext.Provider value={state}>
      <ConnectDispatchContext.Provider value={dispatch}>
        {children}
      </ConnectDispatchContext.Provider>
    </ConnectStateContext.Provider>
  );
}

export function useConnectState() {
  const ctx = useContext(ConnectStateContext);
  if (ctx === null) throw new Error('useConnectState must be used within a ConnectProvider');
  return ctx;
}

export function useConnectDispatch() {
  const ctx = useContext(ConnectDispatchContext);
  if (ctx === null) throw new Error('useConnectDispatch must be used within a ConnectProvider');
  return ctx;
}
