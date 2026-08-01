import type { ReactNode } from "react";
import { ConnectAppShell } from "./connect-app-shell";

export default function ConnectAppLayout({ children }: { children: ReactNode }) {
  return <ConnectAppShell>{children}</ConnectAppShell>;
}
