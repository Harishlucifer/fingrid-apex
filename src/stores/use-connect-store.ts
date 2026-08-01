import { create } from "zustand";
import { persist } from "zustand/middleware";

// Fingrid Connect's single app store — identity (WF1), company profile (WF2), requirements
// (WF3), and directory/matches/partners (WF4). Only identity is persisted (everything else
// re-fetches from the API, which is the source of truth once a session exists).

export interface ConnectIdentity {
  channelId: string | null;
  channelUserId: string | null;
  email: string;
  domain: string;
  entityType: string;
  primaryRole: string;
  isPersonalDomain: boolean;
  // login-with-otp's response only ever returns business_name/mobile/partner_code for the
  // CHANNEL, not the individual's name — `name` is only populated when set during the same
  // session's onboarding wizard; a plain returning sign-in falls back to businessName/email
  // in the UI instead of inventing one.
  name: string;
  businessName: string;
  mobile: string;
  partnerCode: string;
}

interface DirectoryFilters {
  q: string;
  entityType: string;
  state: string;
}

interface ConnectState extends ConnectIdentity {
  profile: Record<string, unknown> | null;
  profileLoading: boolean;
  profileError: string | null;

  requirements: unknown[];
  requirementsLoading: boolean;
  requirementsError: string | null;

  directoryFilters: DirectoryFilters;
  matches: unknown[];
  partners: unknown[];

  currentWorkflow: "onboard" | "company" | "req" | null;

  setIdentity: (identity: Partial<ConnectIdentity>) => void;
  setProfileLoading: () => void;
  setProfileLoaded: (profile: Record<string, unknown>) => void;
  setProfileError: (error: string) => void;
  setRequirementsLoading: () => void;
  setRequirementsLoaded: (requirements: unknown[]) => void;
  setRequirementsError: (error: string) => void;
  setMatches: (matches: unknown[]) => void;
  setPartners: (partners: unknown[]) => void;
  setDirectoryFilters: (filters: Partial<DirectoryFilters>) => void;
  setWorkflow: (workflow: ConnectState["currentWorkflow"]) => void;
  reset: () => void;
}

const identityDefaults: ConnectIdentity = {
  channelId: null,
  channelUserId: null,
  email: "",
  domain: "",
  entityType: "",
  primaryRole: "",
  isPersonalDomain: false,
  name: "",
  businessName: "",
  mobile: "",
  partnerCode: "",
};

// core_channel.id is a real BIGINT — always all-digits. Anything else is a leftover fake
// identity and must never be restored, or every /connect/:channelId/* call 404s forever.
function isRealChannelId(id: unknown): id is string {
  return typeof id === "string" && /^\d+$/.test(id);
}

export const useConnectStore = create<ConnectState>()(
  persist(
    (set) => ({
      ...identityDefaults,
      profile: null,
      profileLoading: false,
      profileError: null,
      requirements: [],
      requirementsLoading: false,
      requirementsError: null,
      directoryFilters: { q: "", entityType: "", state: "" },
      matches: [],
      partners: [],
      currentWorkflow: null,

      setIdentity: (identity) => set(identity),
      setProfileLoading: () => set({ profileLoading: true, profileError: null }),
      setProfileLoaded: (profile) => set({ profile, profileLoading: false }),
      setProfileError: (profileError) => set({ profileLoading: false, profileError }),
      setRequirementsLoading: () => set({ requirementsLoading: true, requirementsError: null }),
      setRequirementsLoaded: (requirements) =>
        set({ requirements, requirementsLoading: false }),
      setRequirementsError: (requirementsError) =>
        set({ requirementsLoading: false, requirementsError }),
      setMatches: (matches) => set({ matches }),
      setPartners: (partners) => set({ partners }),
      setDirectoryFilters: (filters) =>
        set((state) => ({ directoryFilters: { ...state.directoryFilters, ...filters } })),
      setWorkflow: (currentWorkflow) => set({ currentWorkflow }),
      reset: () => set({ ...identityDefaults, profile: null, matches: [], partners: [], requirements: [] }),
    }),
    {
      name: "connect_state_v1",
      partialize: (state) => ({
        channelId: state.channelId,
        channelUserId: state.channelUserId,
        email: state.email,
        domain: state.domain,
        entityType: state.entityType,
        primaryRole: state.primaryRole,
        name: state.name,
        businessName: state.businessName,
        mobile: state.mobile,
        partnerCode: state.partnerCode,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<ConnectIdentity> | undefined;
        if (!p || !isRealChannelId(p.channelId)) return current;
        return { ...current, ...p };
      },
    },
  ),
);
