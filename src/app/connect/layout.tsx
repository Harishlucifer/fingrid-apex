import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ConnectBootstrap } from "./connect-bootstrap";
import { isConnectEnabled } from "@/lib/connect/feature-flag";

// Fingrid Connect is a chrome-free, stateful "app zone" — no SiteNav/SiteFooter (see the
// (marketing) route group for that chrome). This root layout just sets the app-wide surface
// and warms shared config lookups.
//
// It is also the single gate for the whole zone: with ENABLE_CONNECT off, every /connect/*
// route 404s here. Hiding the nav button alone would not be enough — the URLs are guessable.
export default function ConnectLayout({ children }: { children: ReactNode }) {
  if (!isConnectEnabled()) notFound();

  return (
    <div className="min-h-screen bg-n50 font-sans text-navy-900">
      <ConnectBootstrap />
      {children}
    </div>
  );
}
