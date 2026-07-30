// Fingrid Connect — internal admin API service seam (WF5).
//
// Separate identity from the partner-facing connectApi.js: an admin caller is a Fingrid
// EMPLOYEE user, not a channel/partner. Token is stored under its own localStorage key so it
// never collides with a partner session in the same browser.
//
// Endpoints map 1:1 to app/routes/v1.go's connectAdminRoute group (RequireEmployee-gated),
// backed by app/services/connect/admin.go. Verified live against the real dev DB — see
// docs/sdd/connect/09-integration-report.md.
// Same alpha host as connectApi.js, resolved once in apiConfig.js (single VITE_ALPHA_API_URL
// host env + the /alpha/v1 prefix appended there — mirrors craft-frontend's ApiEndPoint.js).
import { ALPHA_V1 as BASE } from './apiConfig';

const TOKEN_KEY = 'connect_admin_token';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (res.status === 401) clearAdminToken();
  if (!res.ok || !json || json.status === -1) {
    const message = json?.error ? (typeof json.error === 'string' ? json.error : JSON.stringify(json.error)) : `Request failed (${res.status})`;
    const err = new Error(message);
    err.httpStatus = res.status;
    throw err;
  }
  return json.data;
}

// ---- Auth ----
// alpha-api's LoginWithPassword (app/controllers/v1/auth/controller.go) reads the platform
// from the X-Platform header, not the body — EMPLOYEE_PORTAL resolves to UserTypeEmployee
// (app/common/utility/utility.go:ValidatePlatform), which is what RequireEmployee checks for.
export async function adminLogin({ email, password }) {
  const res = await fetch(`${BASE}/auth/login-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Platform': 'EMPLOYEE_PORTAL' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.status !== 1) {
    throw new Error(json?.error ? (typeof json.error === 'string' ? json.error : JSON.stringify(json.error)) : `Login failed (${res.status})`);
  }
  const token = json.data?.user?.access_token;
  if (!token) throw new Error('Login succeeded but no access token was returned');
  setAdminToken(token);
  return json.data.user;
}

export function adminLogout() {
  clearAdminToken();
}

// ---- Partner oversight + vetting queue ----
export const adminListPartners = (filters = {}) => {
  const qs = new URLSearchParams(filters).toString();
  return request(`/connect/admin/partners${qs ? `?${qs}` : ''}`);
};

// Reuses the existing (non-owner-gated) profile GET to drill into one partner's vetting detail.
export const adminGetPartnerProfile = (channelId) =>
  request(`/connect/${channelId}/profile`);

export const adminSetVetting = (channelId, { claim, status }) =>
  request(`/connect/admin/${channelId}/vetting`, { method: 'POST', body: { claim, status } });

// ---- Requirement moderation ----
export const adminListRequirements = (filters = {}) => {
  const qs = new URLSearchParams(filters).toString();
  return request(`/connect/admin/requirements${qs ? `?${qs}` : ''}`);
};

export const adminSetRequirementStatus = (requirementId, { status, reason }) =>
  request(`/connect/admin/requirement/${requirementId}/status`, { method: 'POST', body: { status, reason } });
