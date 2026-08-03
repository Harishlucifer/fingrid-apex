// Fingrid Connect — internal admin API service seam (WF5). Separate identity from the
// partner-facing connect-api.ts: an admin caller is a Fingrid EMPLOYEE user, not a
// channel/partner, so the token is stored under its own localStorage key.
import { ALPHA_V1 as BASE, tenantHeaders } from "./api-config";

const TOKEN_KEY = "connect_admin_token";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface ApiEnvelope<T> {
  status: number;
  data?: T;
  error?: string | Record<string, unknown>;
}

function errorMessage(json: ApiEnvelope<unknown> | null, fallback: string) {
  if (!json?.error) return fallback;
  return typeof json.error === "string" ? json.error : JSON.stringify(json.error);
}

export class ConnectAdminApiError extends Error {
  httpStatus?: number;
}

async function request<T>(
  path: string,
  {
    method = "GET",
    body,
    headers = {},
  }: { method?: string; body?: unknown; headers?: Record<string, string> } = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...tenantHeaders(),
      ...authHeaders(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json: ApiEnvelope<T> | null = await res.json().catch(() => null);
  if (res.status === 401) clearAdminToken();
  if (!res.ok || !json || json.status === -1) {
    const err = new ConnectAdminApiError(errorMessage(json, `Request failed (${res.status})`));
    err.httpStatus = res.status;
    throw err;
  }
  return json.data as T;
}

// ---- Auth ----
// LoginWithPassword reads the platform from the X-Platform header, not the body —
// EMPLOYEE_PORTAL resolves to UserTypeEmployee, which is what RequireEmployee checks for.
export async function adminLogin({ email, password }: { email: string; password: string }) {
  const res = await fetch(`${BASE}/auth/login-with-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...tenantHeaders(),
      "X-Platform": "EMPLOYEE_PORTAL",
    },
    body: JSON.stringify({ email, password }),
  });
  const json: ApiEnvelope<{ user?: { access_token?: string; [key: string]: unknown } }> | null =
    await res.json().catch(() => null);
  if (!res.ok || !json || json.status !== 1) {
    throw new Error(errorMessage(json, `Login failed (${res.status})`));
  }
  const token = json.data?.user?.access_token;
  if (!token) throw new Error("Login succeeded but no access token was returned");
  setAdminToken(token);
  return json.data!.user!;
}

export function adminLogout() {
  clearAdminToken();
}

// ---- Partner oversight + vetting queue ----
export const adminListPartners = (filters: Record<string, string> = {}) => {
  const qs = new URLSearchParams(filters).toString();
  return request<unknown[]>(`/connect/admin/partners${qs ? `?${qs}` : ""}`);
};

// Reuses the existing (non-owner-gated) profile GET to drill into one partner's vetting detail.
export const adminGetPartnerProfile = (channelId: string | number) =>
  request<Record<string, unknown>>(`/connect/${channelId}/profile`);

export const adminSetVetting = (
  channelId: string | number,
  { claim, status }: { claim: string; status: string },
) =>
  request(`/connect/admin/${channelId}/vetting`, {
    method: "POST",
    body: { claim, status },
  });

// ---- Requirement moderation ----
export const adminListRequirements = (filters: Record<string, string> = {}) => {
  const qs = new URLSearchParams(filters).toString();
  return request<unknown[]>(`/connect/admin/requirements${qs ? `?${qs}` : ""}`);
};

export const adminSetRequirementStatus = (
  requirementId: string | number,
  { status, reason }: { status: string; reason?: string },
) =>
  request(`/connect/admin/requirement/${requirementId}/status`, {
    method: "POST",
    body: { status, reason },
  });
