// Fingrid Connect — API service seam.
//
// Every call here maps 1:1 to a real endpoint documented in
// docs/sdd/connect/05-api-contracts.md v3.0 (WF1/WF2/WF3 built + verified in alpha-api;
// WF4 built in this session, not yet integration-tested against a live server).
//
// Base URL: alpha-api's dev port is 5050 (from alpha-api/.env APP_PORT), routes mounted under
// /alpha/v1 (app/routes/v1.go — not /v1, that changed 2026-07-23). Set via .env's
// VITE_CONNECT_API_BASE (see fingrid-apex/.env); the fallback below matches it for anyone
// running without that file. No proxy is configured in vite.config.js yet; requests will fail
// with a CORS/connection error until either a dev proxy is added there or alpha-api enables
// CORS for this origin. Flagging rather than silently assuming it works.
const BASE = import.meta.env.VITE_CONNECT_API_BASE || 'http://localhost:5050/alpha/v1';
// /auth/refresh exists under both v1 and v2 (app/routes/v1.go, app/routes/v2.go) but /auth/logout
// (app/controllers/v2/auth/controller.go's Logout) is only mounted under v2 — so logout must
// target the v2 base regardless of which base this app otherwise talks to.
const BASE_V2 = BASE.replace(/\/alpha\/v1$/, '/alpha/v2');

const TOKEN_KEY = 'connect_jwt';
const REFRESH_TOKEN_KEY = 'connect_refresh_jwt';

export function setConnectToken(token, refreshToken) {
  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearConnectToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Used by ConnectAppLayout to gate the logged-in area (dashboard/directory/etc.) — after
// logout() clears storage, those routes previously kept rendering (just with an inline
// "no channel identity" message) instead of actually leaving the page.
export function hasConnectSession() {
  return !!localStorage.getItem(TOKEN_KEY);
}

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Guards against every 401 on a page with several in-flight requests independently calling
// /auth/refresh in parallel — the first 401 starts the refresh, every other concurrent 401
// awaits that same in-flight promise instead of firing its own POST /auth/refresh.
let refreshInFlight = null;

// authService.GetUserFromRefreshToken (app/services/auth/auth.go) rejects an invalid/expired
// refresh token with HTTP 422 + {status:-2}, not 401 — so failure here has to be read from the
// envelope, not just res.ok.
async function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('No refresh token available');
      const res = await fetch(`${BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const json = await res.json().catch(() => null);
      const newAccessToken = json?.data?.access_token;
      if (!res.ok || json?.status !== 1 || !newAccessToken) {
        throw new Error(json?.error ? String(json.error) : 'Session expired');
      }
      setConnectToken(newAccessToken);
      return newAccessToken;
    })().finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
}

// POST /auth/refresh failing means the refresh token itself is dead (expired/revoked) — the
// session is unrecoverable, so this calls the real logout endpoint (best-effort — it needs the
// now-invalid access token itself, so a failure there is not worth surfacing) purely to clear
// server-side session state, then always clears local tokens + the persisted channel identity
// (same 'connect_state_v1' key ConnectContext.jsx persists to) and hard-navigates to sign-in,
// regardless of that call's outcome — matching a real session end, not just a failed request.
export async function logout({ redirect = true } = {}) {
  try {
    await fetch(`${BASE_V2}/auth/logout`, {
      method: 'GET',
      headers: { ...authHeaders(), 'X-Platform': 'PARTNER_PORTAL' },
    });
  } catch {
    // best-effort — local logout below is what actually matters
  }
  clearConnectToken();
  localStorage.removeItem('connect_state_v1');
  if (redirect) window.location.href = '/connect/login';
}

async function request(path, { method = 'GET', body, headers = {}, _retried = false } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  // Real envelope, verified against every controller in app/controllers/v1/connect:
  // success -> {status:1, data}; error -> {status:-1, error}. HTTP status also meaningful
  // (401/403/404/409/422/500) per httpFor() in the Go controllers.
  if (!res.ok || !json || json.status === -1) {
    if (res.status === 401 && !_retried) {
      try {
        await refreshAccessToken();
        return request(path, { method, body, headers, _retried: true });
      } catch {
        await logout();
        const err = new Error('Session expired — please sign in again.');
        err.httpStatus = 401;
        err.sessionExpired = true;
        throw err;
      }
    }
    const message = json?.error ? (typeof json.error === 'string' ? json.error : JSON.stringify(json.error)) : `Request failed (${res.status})`;
    const err = new Error(message);
    err.httpStatus = res.status;
    err.body = json;
    throw err;
  }
  return json.data;
}

// ---- WF1 identity check (pre-registration) ----
// GET /connect/identity?email=... — real endpoint, added 2026-07-24 (previously didn't exist
// anywhere in alpha-api; the backend's own engineering brief explicitly deferred "WF1
// identity"). Public — registered on the un-authenticated v1 group, same as /employer below —
// so this is a plain fetch, not routed through request()/authHeaders(): there's no session to
// attach or refresh yet at this point in onboarding, and request()'s 401 handling would
// otherwise try to refresh a session that doesn't exist and hard-redirect away mid-wizard.
export async function checkIdentity(email) {
  const res = await fetch(`${BASE}/connect/identity?email=${encodeURIComponent(email)}`);
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.status !== 1) {
    throw new Error(json?.error ? String(json.error) : 'Failed to check email domain');
  }
  return json.data; // { domain, is_personal, company? }
}

// GET /employer/?keyword=... (app/controllers/v1/employer/controller.go's McaMasterList) —
// real, working, public endpoint, but it's an MCA company-REGISTER search only (core_mca_master
// table: name/CIN/state/incorporation/etc.) — it does not search platform-registered channels
// at all, so results never carry a channel_id/domain/entity_type. Used for the "my company
// isn't on Fingrid Connect yet, but it's a known/registered company" search step.
export async function searchCompanyMaster(keyword, { page = 1, size = 8 } = {}) {
  const qs = new URLSearchParams({ keyword, page, size }).toString();
  const res = await fetch(`${BASE}/employer/?${qs}`);
  const json = await res.json().catch(() => null);
  if (json?.status === -2) return []; // "data not found" per the real controller — not a failure
  if (!res.ok || json?.status !== 1) {
    throw new Error(json?.error ? String(json.error) : 'Company search failed');
  }
  return json.data || [];
}

// ---- WF1 — Onboarding (new registration) ----
// Delivered as a `connect` sub-object inside the pre-existing POST /v1/partner/create
// (see app/services/application/connect.go's createConnectChannel) — not a standalone
// /v1/connect/* route, and NOT auto-generated: channel_id/user ids are real BIGINT values
// from the server's utility.UniqueId(), returned in the response. The frontend must never
// invent an id itself (the earlier 'DEMO-' + Date.now() placeholder was wrong for exactly
// this reason — channel_id is a BIGINT column, not an arbitrary string).
//
// Auth bootstrap: createConnectChannel does not check the caller's UserType at all (verified
// in app/services/application/connect.go — the UserDetails param is discarded), so a
// no-credentials guest token (POST /v1/auth/guest) is sufficient to call this as a brand-new,
// unauthenticated website visitor. Verified live: a guest-token call returned a real numeric
// channel_id. This endpoint does NOT return a session token, though — see verifySignInOtp()
// below, which must run as a follow-up step to actually get a usable access_token.
async function getGuestToken() {
  const res = await fetch(`${BASE}/auth/guest`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  const json = await res.json().catch(() => null);
  const token = json?.data?.user?.access_token;
  if (!token) throw new Error('Could not obtain a guest session to register with');
  return token;
}

// connectPayload must already match ConnectParams (app/handler/partner/connect.go) exactly:
// { email, scenario, entity_type, company?, profile, preferences, company_completion, invite? }
// Callers build this shape rather than this function reshaping it, so the mapping stays
// visible at the call site (OnboardingWizard.jsx) instead of hidden in this service layer.
export async function registerConnectAccount(connectPayload) {
  const guestToken = await getGuestToken();
  const res = await fetch(`${BASE}/partner/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${guestToken}` },
    body: JSON.stringify({ connect: connectPayload }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.status !== 1) {
    const message = json?.error ? (typeof json.error === 'string' ? json.error : JSON.stringify(json.error)) : `Registration failed (${res.status})`;
    throw new Error(message);
  }
  return { channelId: json.channel_id };
}

// ---- Identity verification (pre-registration email/mobile OTP) ----
// Real, pre-existing, generic endpoint — POST /v1/notification/otp
// (app/controllers/v1/notification/controller.go's Otp()) — NOT login-with-otp, which requires
// an existing core_user record and so cannot verify a brand-new registrant's email/mobile
// before an account exists. This endpoint works off email/mobile directly, gated only by
// RequireLoggedIn (a guest token satisfies it, same as registerConnectAccount above).
// template="OTP_PARTNER_REGISTRATION" already exists and is already spoofed (core_template.status=2)
// for this tenant, so send/verify use the same TENANT_SPOOF_OTP_CODE ("4024") as sign-in —
// one real OTP mechanism, not a separate hardcoded demo code.
async function identityOtpRequest({ email, mobile, otp }) {
  const guestToken = await getGuestToken();
  const res = await fetch(`${BASE}/notification/otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${guestToken}`, 'X-Platform': 'PARTNER_PORTAL' },
    body: JSON.stringify({
      type: 'PARTNER_FLOW',
      name: email || mobile,
      template: 'OTP_PARTNER_REGISTRATION',
      email: email || undefined,
      mobile: mobile || undefined,
      otp: otp || undefined,
    }),
  });
  return res.json().catch(() => null);
}

export async function sendIdentityOtp({ email, mobile }) {
  const json = await identityOtpRequest({ email, mobile });
  if (json?.status !== 1) {
    throw new Error(json?.error ? String(json.error) : 'Failed to send OTP');
  }
  return true;
}

export async function verifyIdentityOtp({ email, mobile, otp }) {
  const json = await identityOtpRequest({ email, mobile, otp });
  if (json?.status !== 2) {
    throw new Error(json?.error ? String(json.error) : 'Invalid or expired OTP');
  }
  return true;
}

// ---- Sign-in (returning partner) ----
// Real, pre-existing endpoint (POST /v1/auth/login-with-otp), not Connect-specific — the same
// mobile-OTP login every partner-type user already has. X-Platform: PARTNER_PORTAL resolves
// server-side to UserTypeChannel (app/common/utility/utility.go:ValidatePlatform), matching
// the mobile-first identity model already used in WF1's own onboarding OTP step.
//
// The single endpoint does double duty based on payload shape:
//   {mobile} (no otp)        -> sends a real SMS OTP, response status is -6 (not a real error)
//   {mobile, otp}            -> verifies; on success returns {channel_id, access_token, ...}
//   {mobile, resend: true}   -> resends
// Special negative statuses on verify, all real account-state cases, not generic errors:
//   -100 registration flow pending (redirect to /connect/join to finish it)
//   -101 pending approval (channel_token issued but not a full session)
//   -102 registration rejected
async function authRequest(body) {
  const res = await fetch(`${BASE}/auth/login-with-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Platform': 'PARTNER_PORTAL' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  return { httpOk: res.ok, json };
}

export async function sendSignInOtp(mobile) {
  const { json } = await authRequest({ mobile });
  // status -6 here means "OTP sent" per the real controller — not a failure.
  if (json?.status !== -6) {
    throw new Error(json?.error ? String(json.error) : 'Failed to send OTP');
  }
  return true;
}

export async function resendSignInOtp(mobile, retryType) {
  const { json } = await authRequest({ mobile, resend: true, retry_type: retryType });
  if (json?.status !== 1) {
    throw new Error(json?.error ? String(json.error) : 'Failed to resend OTP');
  }
  return true;
}

export async function verifySignInOtp(mobile, otp) {
  const { json } = await authRequest({ mobile, otp });
  if (json?.status === 1 && json.data?.user?.access_token) {
    setConnectToken(json.data.user.access_token, json.data.user.refresh_token);
    // login-with-otp's response also carries `tenant`/`system` alongside `user` — real tenant
    // config (TENANT_NAME/TENANT_LOGO/TENANT_FAVICON/etc, same shape craft-frontend's separate
    // POST /setup call fetches), returned for free on every login/sign-in rather than needing
    // a second round-trip. TenantContext.jsx is what actually stores/exposes this.
    return { ok: true, channelId: json.data.user.channel_id, user: json.data.user, tenant: json.data.tenant, system: json.data.system };
  }
  if (json?.status === -100) {
    return { ok: false, pending: 'registration', channelId: json.channel_id };
  }
  if (json?.status === -101) {
    return { ok: false, pending: 'approval', channelId: json.channel_id };
  }
  if (json?.status === -102) {
    return { ok: false, pending: 'rejected' };
  }
  throw new Error(json?.error ? String(json.error) : 'Invalid or expired OTP');
}

// ---- WF2 — Company Profile ----
export const getProfile = (channelId) =>
  request(`/connect/${channelId}/profile`);

export const saveProfile = (channelId, payload) =>
  request(`/connect/${channelId}/profile`, { method: 'POST', body: payload });

export const publishProfile = (channelId) =>
  saveProfile(channelId, { action: 'publish' });

// ---- WF3 — Requirement Listing ----
export const listRequirements = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/connect/requirement${qs ? `?${qs}` : ''}`);
};

export const getRequirement = (channelId, requirementId) =>
  request(`/connect/${channelId}/requirement/${requirementId}`);

export const saveRequirement = (channelId, payload) =>
  request(`/connect/${channelId}/requirement`, { method: 'POST', body: payload });

export const closeRequirement = (channelId, requirementId) =>
  request(`/connect/${channelId}/requirement/${requirementId}/close`, { method: 'POST' });

// ---- WF4 — Matches, Directory, Requests, Partners ----
export const listMatches = (channelId, requirementId) =>
  request(`/connect/${channelId}/matches${requirementId ? `?requirement_id=${requirementId}` : ''}`);

export const listDirectory = (callerChannelId, filters = {}) => {
  const qs = new URLSearchParams({ channel_id: callerChannelId, ...filters }).toString();
  return request(`/connect/directory?${qs}`);
};

export const getDirectoryEntry = (targetChannelId, callerChannelId) =>
  request(`/connect/directory/${targetChannelId}?caller_channel_id=${callerChannelId}`);

export const sendConnectRequest = (channelId, { toChannelId, requirementId, message }) =>
  request('/connect/request', {
    method: 'POST',
    body: { channel_id: channelId, action: 'REQUEST', to_channel_id: toChannelId, requirement_id: requirementId, message },
  });

export const respondToRequest = (channelId, { requestId, action }) =>
  request('/connect/request', {
    method: 'POST',
    body: { channel_id: channelId, action, request_id: requestId },
  });

// Same endpoint as respondToRequest, action=CANCEL — only the original sender can cancel
// their own still-PENDING request (checked against from_channel_id server-side).
export const cancelRequest = (channelId, requestId) =>
  respondToRequest(channelId, { requestId, action: 'CANCEL' });

// GET /connect/:channelId/requests (US-08) — every request involving this channel, either
// direction. Previously there was no way to discover a pending request_id at all; this closes
// that gap (see docs/sdd/connect/09-integration-report.md).
export const listRequests = (channelId) =>
  request(`/connect/${channelId}/requests`);

export const listPartners = (channelId) =>
  request(`/connect/partners?channel_id=${channelId}`);
