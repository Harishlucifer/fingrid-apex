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
