import type { ReactNode } from "react";
import { ConnectBootstrap } from "./connect-bootstrap";

// Fingrid Connect is a chrome-free, stateful "app zone" — no SiteNav/SiteFooter (see the
// (marketing) route group for that chrome). This root layout just sets the app-wide surface
// and warms shared config lookups.
export default function ConnectLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-n50 font-sans text-navy-900">
      <ConnectBootstrap />
      {children}
    </div>
  );
}
