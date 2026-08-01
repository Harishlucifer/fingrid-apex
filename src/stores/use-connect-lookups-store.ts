import { create } from "zustand";
import { fetchLookupGroups, initGuestSession, type LookupRow } from "@/lib/connect/connect-api";

// Fingrid Connect's onboarding/company-profile config lookups (GET /lookup?group_code=...),
// fetched once per app load. Nothing here is hardcoded client-side — every list starts empty
// and populates once the live call resolves; consumers should treat `loading` as "don't render
// the real list yet" rather than trusting a stale local copy.

export interface EntityTypeLookup {
  key: string;
  label: string;
  role: string;
  category: string;
  isLSP: boolean;
  isLender: boolean;
  mandatoryCredential: string | null;
}

const DEFAULT_ENTITY: EntityTypeLookup = {
  key: "",
  label: "",
  role: "",
  category: "",
  isLSP: false,
  isLender: false,
  mandatoryCredential: null,
};

const GROUPS = [
  "CHANNEL_ENTITY_TYPE",
  "PERSONAL_EMAIL_DOMAIN",
  "CONNECT_DESIGNATION",
  "CONNECT_DEPARTMENT",
  "CONNECT_PARTNERSHIP_TYPE",
  "CONNECT_CREDENTIAL_LABEL",
];

interface ConnectLookupsState {
  entityTypes: EntityTypeLookup[];
  personalDomains: string[];
  designationsByEntityType: Record<string, string[]>;
  departmentsByEntityType: Record<string, string[]>;
  partnershipTypes: { key: string; label: string }[];
  credentialLabels: Record<string, string>;
  loading: boolean;
  loaded: boolean;
  error: string | null;
  load: () => Promise<void>;
  entityByKey: (key: string) => EntityTypeLookup;
  isPersonalDomain: (domain: string) => boolean;
}

// core_lookup_master rows' `configuration` column round-trips through the API already parsed
// into an object — only fall back to JSON.parse for the unlikely case it arrives as a string.
function parseConfig(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw as Record<string, unknown>;
}

// Rows have no dedicated sort column — id is assigned in the intended display order (e.g.
// "Other" last), so every group is sorted by id ascending.
function byId(a: LookupRow & { id: number }, b: LookupRow & { id: number }) {
  return a.id - b.id;
}

function buildFromRows(rows: LookupRow[]) {
  const sorted = [...(rows as (LookupRow & { id: number })[])].sort(byId);

  const entityTypes: EntityTypeLookup[] = sorted
    .filter((r) => r.group_code === "CHANNEL_ENTITY_TYPE")
    .map((r) => {
      const cfg = parseConfig(r.configuration);
      return {
        key: r.lu_key,
        label: r.lu_name,
        role: (cfg.role as string) || "",
        category: (cfg.category as string) || "",
        isLSP: !!cfg.is_lsp,
        isLender: !!cfg.is_lender,
        mandatoryCredential: (cfg.mandatory_credential as string) || null,
      };
    });

  const personalDomains = sorted
    .filter((r) => r.group_code === "PERSONAL_EMAIL_DOMAIN")
    .map((r) => r.lu_value || r.lu_key);

  const designationsByEntityType: Record<string, string[]> = {};
  const departmentsByEntityType: Record<string, string[]> = {};
  sorted
    .filter((r) => r.group_code === "CONNECT_DESIGNATION")
    .forEach((r) => {
      const et = parseConfig(r.configuration).entity_type as string | undefined;
      if (!et) return;
      (designationsByEntityType[et] ||= []).push(r.lu_value || r.lu_name);
    });
  sorted
    .filter((r) => r.group_code === "CONNECT_DEPARTMENT")
    .forEach((r) => {
      const et = parseConfig(r.configuration).entity_type as string | undefined;
      if (!et) return;
      (departmentsByEntityType[et] ||= []).push(r.lu_value || r.lu_name);
    });

  const partnershipTypes = sorted
    .filter((r) => r.group_code === "CONNECT_PARTNERSHIP_TYPE")
    .map((r) => ({ key: r.lu_key, label: r.lu_value || r.lu_name }));

  const credentialLabels: Record<string, string> = {};
  sorted
    .filter((r) => r.group_code === "CONNECT_CREDENTIAL_LABEL")
    .forEach((r) => {
      credentialLabels[r.lu_key] = r.lu_value || r.lu_name;
    });

  return {
    entityTypes,
    personalDomains,
    designationsByEntityType,
    departmentsByEntityType,
    partnershipTypes,
    credentialLabels,
  };
}

export const useConnectLookupsStore = create<ConnectLookupsState>((set, get) => ({
  entityTypes: [],
  personalDomains: [],
  designationsByEntityType: {},
  departmentsByEntityType: {},
  partnershipTypes: [],
  credentialLabels: {},
  loading: false,
  loaded: false,
  error: null,

  load: async () => {
    if (get().loading || get().loaded) return;
    set({ loading: true, error: null });
    // Warms the shared pre-login guest session up front, independent of this call succeeding —
    // both share one in-flight /auth/guest request.
    initGuestSession();
    try {
      const rows = await fetchLookupGroups(GROUPS);
      set({ ...buildFromRows(rows), loading: false, loaded: true });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : "Failed to load lookups" });
    }
  },

  entityByKey: (key) => {
    const { entityTypes } = get();
    return entityTypes.find((e) => e.key === key) || entityTypes[1] || DEFAULT_ENTITY;
  },
  isPersonalDomain: (domain) => get().personalDomains.includes((domain || "").toLowerCase()),
}));
