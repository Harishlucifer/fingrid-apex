import { create } from "zustand";

interface NavState {
  /** Mobile drawer visibility. */
  mobileOpen: boolean;
  /** Which mobile accordion section is expanded. */
  openSection: string | undefined;
  setMobileOpen: (open: boolean) => void;
  setOpenSection: (section: string | undefined) => void;
  close: () => void;
}

export const useNavStore = create<NavState>((set) => ({
  mobileOpen: false,
  openSection: undefined,
  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
  setOpenSection: (openSection) => set({ openSection }),
  close: () => set({ mobileOpen: false, openSection: undefined }),
}));
