// Central alpha-api endpoint config — mirrors craft-frontend's split (Components/helper/
// ApiEndPoint.js + axiosInstance.js): the ENV supplies ONLY the host (e.g.
// http://127.0.0.1:5050, craft's REACT_APP_API_URL), and the versioned `/alpha/v1` · `/alpha/v2`
// path prefixes are the app's concern, appended here in code — not baked into the deploy value.
//
// This replaces the earlier approach where VITE_CONNECT_API_BASE carried the full
// `.../alpha/v1` base and each service string-surgeried it into v2 (BASE.replace(/\/alpha\/v1$/,
// '/alpha/v2')), duplicated across connectApi.js and connectAdminApi.js. One host, derived
// prefixes, one source of truth.

// Preferred env var: VITE_ALPHA_API_URL = host only (matches craft's REACT_APP_API_URL intent).
// Back-compat: the older VITE_CONNECT_API_BASE embedded the full `.../alpha/vN` base, so if
// that's all that's set, strip the version suffix back off to recover the bare host.
function resolveAlphaHost() {
  const host = import.meta.env.VITE_ALPHA_API_URL;
  if (host) return host.replace(/\/+$/, '');
  const legacy = import.meta.env.VITE_CONNECT_API_BASE;
  if (legacy) return legacy.replace(/\/alpha\/v\d+\/?$/, '').replace(/\/+$/, '');
  return 'http://localhost:5050';
}

export const ALPHA_HOST = resolveAlphaHost();
export const ALPHA_V1 = `${ALPHA_HOST}/alpha/v1`;
export const ALPHA_V2 = `${ALPHA_HOST}/alpha/v2`;
