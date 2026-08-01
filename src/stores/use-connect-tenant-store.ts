import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TenantConfig } from "@/lib/connect/connect-api";

// Tenant branding/config for Fingrid Connect. POST /auth/login-with-otp's response already
// carries `tenant`/`system` alongside `user`, so this is populated directly off the sign-in
// response rather than a separate round-trip.

interface ConnectTenantState {
  tenant: TenantConfig | null;
  system: unknown | null;
  setTenant: (args: { tenant?: TenantConfig | null; system?: unknown }) => void;
  clearTenant: () => void;
  applyDocumentEffects: () => void;
}

export const useConnectTenantStore = create<ConnectTenantState>()(
  persist(
    (set, get) => ({
      tenant: null,
      system: null,
      setTenant: ({ tenant, system }) => {
        set({ tenant: tenant || null, system: system || null });
        get().applyDocumentEffects();
      },
      clearTenant: () => set({ tenant: null, system: null }),
      // Applies branding side effects (title/favicon) — the only two fields ever actually
      // wired up to something visible.
      applyDocumentEffects: () => {
        if (typeof document === "undefined") return;
        const { tenant } = get();
        if (tenant?.TENANT_NAME) {
          document.title = tenant.TENANT_NAME;
        }
        if (tenant?.TENANT_FAVICON) {
          let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = tenant.TENANT_FAVICON as string;
        }
      },
    }),
    { name: "connect_tenant_v1" },
  ),
);
