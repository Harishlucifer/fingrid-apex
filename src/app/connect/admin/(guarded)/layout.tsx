import type { ReactNode } from "react";
import { ConnectAdminShell } from "./connect-admin-shell";

export default function ConnectAdminGuardedLayout({ children }: { children: ReactNode }) {
  return <ConnectAdminShell>{children}</ConnectAdminShell>;
}
