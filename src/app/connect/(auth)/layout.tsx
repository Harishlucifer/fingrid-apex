import type { ReactNode } from "react";

// Centered, chrome-free layout for onboarding + the Company Profile / Requirement wizards.
// Deliberately has no persistent topbar or nav rail — a persistent app-shell during a linear
// wizard reads as an internal admin console rather than a guided flow.
export default function ConnectAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-[640px]">{children}</div>
    </div>
  );
}
