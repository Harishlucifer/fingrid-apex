"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AdvantagesPanel } from "./advantages-panel";

// Full-screen split used by the pre-login pages (sign-in, registration): the navy advantages
// panel holds the left third, the task itself gets the rest. No site header or footer — these
// pages ask for one thing, and chrome here only offers ways to leave.
//
// Below lg the navy half is dropped and the card version of the panel renders under the form,
// so a phone opens straight onto the task rather than a screen of marketing.
export function ConnectSplitShell({
  children,
  contentClassName,
}: {
  children: ReactNode;
  /** Widen the right column for form-heavy content (the login form is deliberately narrow). */
  contentClassName?: string;
}) {
  return (
    // `grid-cols-1` is load-bearing: without an explicit track the implicit column is `auto`,
    // which sizes to max-content — so the content's own max-width became the column width and
    // overflowed the viewport on phones.
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[clamp(340px,33vw,500px)_minmax(0,1fr)]">
      <AdvantagesPanel variant="hero" className="hidden lg:flex" />

      <div className="flex items-center justify-center px-[clamp(18px,4vw,44px)] py-[clamp(28px,5vw,56px)]">
        <div className={cn("w-full max-w-[452px]", contentClassName)}>
          {children}

          {/* The advantages still reach phone users — just below the thing they came to do. */}
          <AdvantagesPanel className="mt-6 lg:hidden" />

          <p className="text-n400 mt-6 text-[11px]">© 2026 Inforvio Technologies Pvt. Ltd.</p>
        </div>
      </div>
    </div>
  );
}
