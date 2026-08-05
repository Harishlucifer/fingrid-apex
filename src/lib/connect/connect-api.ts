// Fingrid Connect — partner-facing API service seam. Every call maps 1:1 to a real alpha-api
// endpoint. Envelope convention: success -> {status:1, data}; error -> {status:-1, error}.
import { ALPHA_V1 as BASE, ALPHA_V2 as BASE_V2, tenantHeaders } from "./api-config";

const TOKEN_KEY = "connect_jwt";
const REFRESH_TOKEN_KEY = "connect_refresh_jwt";
const GUEST_TOKEN_KEY = "connect_guest_jwt";

export interface ConnectUser {
  access_token: string;
  refresh_token?: string;
  channel_id?: number | string;
  [key: string]: unknown;
}

export interface TenantConfig {
  TENANT_NAME?: string;
  TENANT_LOGO?: string;
  TENANT_FAVICON?: string;
  [key: string]: unknown;
}

interface ApiEnvelope<T> {
  status: number;
  data?: T;
  error?: string | Record<string, unknown>;
  channel_id?: number | string;
}

export class ConnectApiError extends Error {
  httpStatus?: number;
  body?: unknown;
  sessionExpired?: boolean;
}

function errorMessage(json: ApiEnvelope<unknown> | null, fallback: string) {
  if (!json?.error) return fallback;
  return typeof json.error === "string" ? json.error : JSON.stringify(json.error);
}

export function setConnectToken(token: string, refreshToken?: string) {
  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  // A real session now exists — the pre-login guest identity is redundant and weaker.
  clearGuestToken();
}

export function clearConnectToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  clearGuestToken();
}

// Gates the logged-in area (dashboard/directory/etc.).
export function hasConnectSession() {
  return !!localStorage.getItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// De-dupes concurrent 401s on a page with several in-flight requests so only one
// POST /auth/refresh fires; every other 401 awaits the same in-flight promise.
let refreshInFlight: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error("No refresh token available");
      const res = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tenantHeaders() },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const json: ApiEnvelope<{ access_token: string }> | null = await res
        .json()
        .catch(() => null);
      const newAccessToken = json?.data?.access_token;
      // A dead/expired refresh token comes back as HTTP 422 + {status:-2}, not 401.
      if (!res.ok || json?.status !== 1 || !newAccessToken) {
        throw new Error(errorMessage(json, "Session expired"));
      }
      setConnectToken(newAccessToken);
      return newAccessToken;
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

// /auth/logout is only mounted under v2, regardless of which base this app otherwise talks to.
export async function logout({ redirect = true }: { redirect?: boolean } = {}) {
  try {
    await fetch(`${BASE_V2}/auth/logout`, {
      method: "GET",
      headers: { ...tenantHeaders(), ...authHeaders(), "X-Platform": "PARTNER_PORTAL" },
    });
  } catch {
    // best-effort — local logout below is what actually matters
  }
  clearConnectToken();
  localStorage.removeItem("connect_state_v1");
  if (redirect) window.location.href = "/connect/login";
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  _retried?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, _retried = false } = options;
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
  if (!res.ok || !json || json.status === -1) {
    if (res.status === 401 && !_retried) {
      try {
        await refreshAccessToken();
        return request<T>(path, { method, body, headers, _retried: true });
      } catch {
        await logout();
        const err = new ConnectApiError("Session expired — please sign in again.");
        err.httpStatus = 401;
        err.sessionExpired = true;
        throw err;
      }
    }
    const err = new ConnectApiError(errorMessage(json, `Request failed (${res.status})`));
    err.httpStatus = res.status;
    err.body = json;
    throw err;
  }
  return json.data as T;
}

// ---- WF1 identity check (pre-registration) ----
// Pre-login, but NOT unauthenticated: cosmos-gateway rejects anything whose path is not in its
// whitelist (configuration/whitelist.json) with {"error":"Missing auth token"} before it ever
// proxies upstream, and /connect/identity is not on that list. So this rides the shared guest
// session like the other pre-registration calls — it cannot use request()/authHeaders(), which
// would try to refresh a real session that does not exist yet.
export async function checkIdentity(email: string) {
  const res = await guestFetch(`/connect/identity?email=${encodeURIComponent(email)}`);
  const json: ApiEnvelope<{
    domain: string;
    is_personal: boolean;
    company?: unknown;
    existing_registration?: unknown;
  }> | null = await res.json().catch(() => null);
  if (!res.ok || json?.status !== 1) {
    throw new Error(errorMessage(json, "Failed to check email domain"));
  }
  return json.data!;
}

export interface LookupRow {
  lu_key: string;
  lu_name: string;
  lu_value: string;
  group_code: string;
  configuration?: unknown;
  status?: number;
}

// Sits under a protected route with no real session yet this early in onboarding, so this
// borrows the guest-token bootstrap rather than assuming a session exists.
export async function fetchLookupGroups(groupCodes: string[]): Promise<LookupRow[]> {
  const res = await guestFetch(`/lookup?group_code=${groupCodes.join(",")}`);
  const json: ApiEnvelope<LookupRow[]> | null = await res.json().catch(() => null);
  if (!res.ok || json?.status !== 1) {
    throw new Error(errorMessage(json, "Failed to load lookup config"));
  }
  return json.data || [];
}

// MCA company-REGISTER search only — never carries a channel_id/domain/entity_type. Used for
// "my company isn't on Fingrid Connect yet, but it's a known/registered company".
// Guest-session backed for the same reason as checkIdentity: /employer/ is not in the gateway's
// whitelist, so a tokenless call is refused at the gateway with "Missing auth token".
export async function searchCompanyMaster(
  keyword: string,
  { page = 1, size = 8 }: { page?: number; size?: number } = {},
) {
  const qs = new URLSearchParams({ keyword, page: String(page), size: String(size) }).toString();
  const res = await guestFetch(`/employer/?${qs}`);
  const json: ApiEnvelope<unknown[]> | null = await res.json().catch(() => null);
  if (json?.status === -2) return []; // "data not found" — not a failure
  if (!res.ok || json?.status !== 1) {
    throw new Error(errorMessage(json, "Company search failed"));
  }
  return json.data || [];
}

// ---- Guest session (pre-login API access) ----
// Every pre-login endpoint that needs a token (lookups config, registration, pre-registration
// OTP) rides on one shared guest session, minted once and reused/re-minted transparently.
let guestTokenInFlight: Promise<string> | null = null;

async function fetchGuestToken(): Promise<string> {
  const res = await fetch(`${BASE}/auth/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...tenantHeaders() },
    body: "{}",
  });
  const json: ApiEnvelope<{ user?: ConnectUser }> | null = await res.json().catch(() => null);
  const token = json?.data?.user?.access_token;
  if (!token) throw new Error("Could not obtain a guest session");
  return token;
}

async function ensureGuestToken({ force = false }: { force?: boolean } = {}): Promise<string> {
  if (!force) {
    const cached = localStorage.getItem(GUEST_TOKEN_KEY);
    if (cached) return cached;
  }
  if (!guestTokenInFlight) {
    guestTokenInFlight = fetchGuestToken()
      .then((token) => {
        localStorage.setItem(GUEST_TOKEN_KEY, token);
        return token;
      })
      .finally(() => {
        guestTokenInFlight = null;
      });
  }
  return guestTokenInFlight;
}

function clearGuestToken() {
  localStorage.removeItem(GUEST_TOKEN_KEY);
}

// Warms the shared guest session up front so the first real pre-login call doesn't pay for it.
// Best-effort: a failure here is non-fatal, the lazy path in guestFetch will retry.
export function initGuestSession() {
  return ensureGuestToken().catch(() => null);
}

// fetch() against a protected pre-login endpoint with the shared guest token attached. If the
// stored token has expired, it's re-minted once and the call retried, so a stale token
// self-heals instead of surfacing as an auth error mid-onboarding.
async function guestFetch(
  path: string,
  {
    method = "GET",
    headers = {},
    body,
    _retried = false,
  }: { method?: string; headers?: Record<string, string>; body?: unknown; _retried?: boolean } = {},
): Promise<Response> {
  const token = await ensureGuestToken();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...tenantHeaders(),
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 && !_retried) {
    clearGuestToken();
    await ensureGuestToken({ force: true });
    return guestFetch(path, { method, headers, body, _retried: true });
  }
  return res;
}

// connectPayload must match ConnectParams exactly:
// { email, scenario, entity_type, company?, profile, preferences, company_completion, invite? }
// Callers build this shape rather than this function reshaping it.
export async function registerConnectAccount(connectPayload: Record<string, unknown>) {
  const res = await guestFetch("/partner/create", {
    method: "POST",
    body: { connect: connectPayload },
  });
  const json: (ApiEnvelope<unknown> & { channel_id?: number | string }) | null = await res
    .json()
    .catch(() => null);
  if (!res.ok || !json || json.status !== 1) {
    throw new Error(errorMessage(json, `Registration failed (${res.status})`));
  }
  return { channelId: json.channel_id };
}

// ---- Identity verification (pre-registration email/mobile OTP) ----
// Generic OTP endpoint, not login-with-otp — works off email/mobile directly, before any
// account exists, gated only by RequireLoggedIn (a guest token satisfies it).
async function identityOtpRequest({
  email,
  mobile,
  otp,
}: {
  email?: string;
  mobile?: string;
  otp?: string;
}) {
  const res = await guestFetch("/notification/otp", {
    method: "POST",
    headers: { "X-Platform": "PARTNER_PORTAL" },
    body: {
      type: "PARTNER_FLOW",
      name: email || mobile,
      template: "OTP_PARTNER_REGISTRATION",
      email: email || undefined,
      mobile: mobile || undefined,
      otp: otp || undefined,
    },
  });
  return (await res.json().catch(() => null)) as ApiEnvelope<unknown> | null;
}

export async function sendIdentityOtp({ email, mobile }: { email?: string; mobile?: string }) {
  const json = await identityOtpRequest({ email, mobile });
  if (json?.status !== 1) {
    throw new Error(errorMessage(json, "Failed to send OTP"));
  }
  return true;
}

export async function verifyIdentityOtp({
  email,
  mobile,
  otp,
}: {
  email?: string;
  mobile?: string;
  otp: string;
}) {
  const json = await identityOtpRequest({ email, mobile, otp });
  // The verify variant of this endpoint signals success with status 2, not 1.
  if (json?.status !== 2) {
    throw new Error(errorMessage(json, "Invalid or expired OTP"));
  }
  return true;
}

// ---- Workflow engine (build + execution) ----
export interface WorkflowStep {
  step_id: string | number;
  label?: string;
  task_status?: number | null;
  edit_mode?: boolean;
  [key: string]: unknown;
}

export interface WorkflowInstance {
  workflow_instance_id?: string | number;
  last_active_step_id?: string | number;
  steps?: WorkflowStep[];
  [key: string]: unknown;
}

// Without source_id, returns the workflow TEMPLATE (stages/steps). With source_id, returns the
// workflow INSTANCE for that entity — saved progress via last_active_step_id/task_status.
export async function buildWorkflow(
  workflowType: string,
  {
    data = {},
    sourceId = null,
    workflowInstanceId = null,
    guest = false,
  }: {
    data?: Record<string, unknown>;
    sourceId?: string | number | null;
    workflowInstanceId?: string | number | null;
    guest?: boolean;
  } = {},
): Promise<WorkflowInstance> {
  const body: Record<string, unknown> = { workflow_type: workflowType, data };
  if (sourceId) body.source_id = String(sourceId);
  if (workflowInstanceId) body.workflow_instance_id = String(workflowInstanceId);
  if (guest) {
    const res = await guestFetch("/workflow/build", { method: "POST", body });
    const json: ApiEnvelope<WorkflowInstance> | null = await res.json().catch(() => null);
    if (!res.ok || json?.status !== 1) {
      throw new Error(errorMessage(json, "Failed to build workflow"));
    }
    return json.data!;
  }
  return request<WorkflowInstance>("/workflow/build", { method: "POST", body });
}

// Marks a step's task complete and activates the next; callers re-build (with source_id)
// afterwards to pick up the refreshed task_status/last_active_step_id.
export async function executeWorkflowStep(
  workflowType: string,
  {
    stepId,
    sourceId,
    guest = false,
  }: { stepId: string | number; sourceId: string | number; guest?: boolean },
): Promise<WorkflowInstance> {
  const body = {
    workflow_type: workflowType,
    source_id: String(sourceId),
    execute_step_id: String(stepId),
  };
  if (guest) {
    const res = await guestFetch("/workflow/execution", { method: "POST", body });
    const json: ApiEnvelope<WorkflowInstance> | null = await res.json().catch(() => null);
    if (!res.ok || json?.status !== 1) {
      throw new Error(errorMessage(json, "Failed to execute workflow step"));
    }
    return json.data!;
  }
  return request<WorkflowInstance>("/workflow/execution", { method: "POST", body });
}

// ---- Sign-in (returning partner) ----
export type SignInResult =
  | { ok: true; channelId: string | number | undefined; user: ConnectUser; tenant?: TenantConfig; system?: unknown }
  | { ok: false; pending: "registration"; channelId: string | number | undefined }
  | { ok: false; pending: "approval"; channelId: string | number | undefined }
  | { ok: false; pending: "rejected" };

async function authRequest(body: Record<string, unknown>) {
  const res = await fetch(`${BASE}/auth/login-with-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...tenantHeaders(),
      "X-Platform": "PARTNER_PORTAL",
    },
    body: JSON.stringify(body),
  });
  const json: (ApiEnvelope<{ user?: ConnectUser }> & { channel_id?: string | number }) | null =
    await res.json().catch(() => null);
  return { httpOk: res.ok, json };
}

// Sign-in failures the UI treats differently from a generic error. `code` is derived from
// alpha-api's LoginWithOtp status codes rather than from the message text, which is a bare
// "Invalid credentials" and is not safe to match on.
export type SignInErrorCode = "not_registered" | "inactive" | "unknown";

export class SignInError extends Error {
  readonly code: SignInErrorCode;
  constructor(message: string, code: SignInErrorCode) {
    super(message);
    this.name = "SignInError";
    this.code = code;
  }
}

export async function sendSignInOtp(mobile: string) {
  const { json } = await authRequest({ mobile });
  // status -6 here means "OTP sent" — not a failure.
  if (json?.status === -6) return true;
  // -2 is returned when FindByActiveMobile finds no active PARTNER_PORTAL user for this number
  // (or the channel is Terminated) — i.e. there is no Connect account to sign in to.
  if (json?.status === -2) {
    throw new SignInError("This number is not registered with Fingrid Connect.", "not_registered");
  }
  // -104 is a deactivated partner; the server supplies the tenant's own wording for it.
  if (json?.status === -104) {
    throw new SignInError(errorMessage(json, "This partner account is inactive."), "inactive");
  }
  throw new SignInError(errorMessage(json, "Failed to send OTP"), "unknown");
}

export async function resendSignInOtp(mobile: string, retryType?: string) {
  const { json } = await authRequest({ mobile, resend: true, retry_type: retryType });
  if (json?.status !== 1) {
    throw new Error(errorMessage(json, "Failed to resend OTP"));
  }
  return true;
}

export async function verifySignInOtp(mobile: string, otp: string): Promise<SignInResult> {
  const { json } = await authRequest({ mobile, otp });
  if (json?.status === 1 && json.data?.user?.access_token) {
    setConnectToken(json.data.user.access_token, json.data.user.refresh_token);
    return {
      ok: true,
      channelId: json.data.user.channel_id,
      user: json.data.user,
      tenant: (json.data as { tenant?: TenantConfig }).tenant,
      system: (json.data as { system?: unknown }).system,
    };
  }
  // Real account-state cases, not generic errors:
  // -100 registration flow pending, -101 pending approval, -102 registration rejected.
  if (json?.status === -100) return { ok: false, pending: "registration", channelId: json.channel_id };
  if (json?.status === -101) return { ok: false, pending: "approval", channelId: json.channel_id };
  if (json?.status === -102) return { ok: false, pending: "rejected" };
  throw new Error(errorMessage(json, "Invalid or expired OTP"));
}

// ---- WF2 — Company Profile ----
export const getProfile = (channelId: string | number) =>
  request<Record<string, unknown>>(`/connect/${channelId}/profile`);

export const saveProfile = (channelId: string | number, payload: Record<string, unknown>) =>
  request<Record<string, unknown>>(`/connect/${channelId}/profile`, {
    method: "POST",
    body: payload,
  });

export const publishProfile = (channelId: string | number) =>
  saveProfile(channelId, { action: "publish" });

// ---- WF3 — Requirement Listing ----
export const listRequirements = (params: Record<string, string> = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request<unknown[]>(`/connect/requirement${qs ? `?${qs}` : ""}`);
};

export const getRequirement = (channelId: string | number, requirementId: string | number) =>
  request<Record<string, unknown>>(`/connect/${channelId}/requirement/${requirementId}`);

export const saveRequirement = (channelId: string | number, payload: Record<string, unknown>) =>
  request<Record<string, unknown>>(`/connect/${channelId}/requirement`, {
    method: "POST",
    body: payload,
  });

export const closeRequirement = (channelId: string | number, requirementId: string | number) =>
  request<Record<string, unknown>>(`/connect/${channelId}/requirement/${requirementId}/close`, {
    method: "POST",
  });

// ---- WF4 — Matches, Directory, Requests, Partners ----
export const listMatches = (channelId: string | number, requirementId?: string | number) =>
  request<unknown[]>(
    `/connect/${channelId}/matches${requirementId ? `?requirement_id=${requirementId}` : ""}`,
  );

export const listDirectory = (callerChannelId: string | number, filters: Record<string, string> = {}) => {
  const qs = new URLSearchParams({ channel_id: String(callerChannelId), ...filters }).toString();
  return request<unknown[]>(`/connect/directory?${qs}`);
};

export const getDirectoryEntry = (targetChannelId: string | number, callerChannelId: string | number) =>
  request<Record<string, unknown>>(
    `/connect/directory/${targetChannelId}?caller_channel_id=${callerChannelId}`,
  );

export const sendConnectRequest = (
  channelId: string | number,
  { toChannelId, requirementId, message }: { toChannelId: string | number; requirementId?: string | number; message?: string },
) =>
  request("/connect/request", {
    method: "POST",
    body: {
      channel_id: channelId,
      action: "REQUEST",
      to_channel_id: toChannelId,
      requirement_id: requirementId,
      message,
    },
  });

export const respondToRequest = (
  channelId: string | number,
  { requestId, action }: { requestId: string | number; action: string },
) =>
  request("/connect/request", {
    method: "POST",
    body: { channel_id: channelId, action, request_id: requestId },
  });

// Same endpoint as respondToRequest, action=CANCEL — only the original sender can cancel their
// own still-PENDING request (checked against from_channel_id server-side).
export const cancelRequest = (channelId: string | number, requestId: string | number) =>
  respondToRequest(channelId, { requestId, action: "CANCEL" });

export const listRequests = (channelId: string | number) =>
  request<unknown[]>(`/connect/${channelId}/requests`);

export const listPartners = (channelId: string | number) =>
  request<unknown[]>(`/connect/partners?channel_id=${channelId}`);
