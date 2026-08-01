"use client";

import { useEffect } from "react";
import { useConnectLookupsStore } from "@/stores/use-connect-lookups-store";

// Fetches every Connect onboarding/company-profile config lookup once per app load.
export function ConnectBootstrap() {
  const load = useConnectLookupsStore((s) => s.load);
  useEffect(() => {
    load();
  }, [load]);
  return null;
}
