// Central alpha-api endpoint config. The env var supplies only the host (e.g.
// http://localhost:5050); the versioned /alpha/v1 · /alpha/v2 path prefixes are appended here.
// Must be NEXT_PUBLIC_-prefixed since these calls are made client-side, straight from the
// browser to alpha-api (no server-side proxy route in this app).
function resolveAlphaHost(): string {
  const host = process.env.NEXT_PUBLIC_ALPHA_API_URL;
  if (host) return host.replace(/\/+$/, "");
  return "http://localhost:5050";
}

export const ALPHA_HOST = resolveAlphaHost();
export const ALPHA_V1 = `${ALPHA_HOST}/alpha/v1`;
export const ALPHA_V2 = `${ALPHA_HOST}/alpha/v2`;

// ---- Tenant identification (X-Tenant-Domain) ----
// cosmos-gateway under TENANCY_MODE=SHARED resolves EVERY request to a tenant — pre-login ones
// like /auth/guest included — by looking the hostname up in tenant_domain. It reads
// X-Tenant-Domain first, then X-Forwarded-Host, then the request Host.
//
// The hostname is whichever portal the visitor opened, so it is read from the browser at request
// time and is NOT configurable. There is deliberately no env var: a NEXT_PUBLIC_ value is inlined
// into the bundle at build time, so one build could only ever name one tenant, and a value set in
// the server's environment after the build would be ignored entirely.
//
// This mirrors craft-frontend (src/helpers/api_helper.js), which sets the same header from
// window.location on the axios defaults. It sends the full origin; the bare hostname here is the
// already-canonical form of the same value — the gateway's CleanDomain strips scheme and port
// from either one.
//
// Sending it explicitly rather than leaning on the gateway's Host fallback is what keeps this
// correct when the gateway is served from its own hostname: an api.* origin would otherwise have
// the gateway resolving its OWN hostname instead of the portal the user is actually on.
//
// Every hostname the app is served from must exist in tenant_domain — including "localhost" for
// local development. An unregistered one gets 404 {"error":"Unknown tenant"} on every call.
function resolveTenantDomain(): string {
  // No window during SSR/prerender. Every alpha-api call in this app is client-side, so this is
  // a guard against evaluation order, not a real code path — the gateway's Host/X-Forwarded-Host
  // fallback covers anything that did slip through.
  if (typeof window === "undefined") return "";
  return window.location.hostname;
}

// Spread into every outbound fetch's headers.
export function tenantHeaders(): Record<string, string> {
  const domain = resolveTenantDomain();
  return domain ? { "X-Tenant-Domain": domain } : {};
}
