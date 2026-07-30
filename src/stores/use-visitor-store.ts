import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DemoRequest } from "@/lib/demo-request";

type EntityType = DemoRequest["entityType"];

interface VisitorState {
  /**
   * Which seat at the lending table the visitor identifies with. Persisted so
   * the demo form arrives prefilled and the reference survives a reload.
   */
  entityType: EntityType | undefined;
  /** Reference returned by the last successful demo request. */
  lastReference: string | undefined;
  setEntityType: (entityType: EntityType) => void;
  setLastReference: (reference: string) => void;
}

export const useVisitorStore = create<VisitorState>()(
  persist(
    (set) => ({
      entityType: undefined,
      lastReference: undefined,
      setEntityType: (entityType) => set({ entityType }),
      setLastReference: (lastReference) => set({ lastReference }),
    }),
    { name: "fingrid-visitor" },
  ),
);
