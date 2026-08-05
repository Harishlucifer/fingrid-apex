// ENABLE_CONNECT gates the whole Fingrid Connect zone: the "Community" entry point in the site
// nav, and every /connect/* route.
//
// Deliberately NOT a NEXT_PUBLIC_ var. A NEXT_PUBLIC value is inlined into the client bundle at
// build time, so one build could only ever carry one answer and the routes would still be
// reachable by typing the URL. Reading it server-side means the layout can refuse to render the
// zone at all, and the flag can change per environment without a rebuild.
//
// Anything other than "true" (unset, "false", "0", empty) disables Connect — the safe default is
// off, so a missing var can't silently expose an unfinished zone.
export function isConnectEnabled(): boolean {
  return process.env.ENABLE_CONNECT?.trim().toLowerCase() === "true";
}
