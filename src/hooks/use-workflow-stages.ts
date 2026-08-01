"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildWorkflow, executeWorkflowStep, type WorkflowInstance } from "@/lib/connect/connect-api";

export interface WorkflowStage {
  name?: string;
  code: string;
  config: Record<string, unknown>;
  stageId?: string | number;
  stepId?: string | number;
  // 2 = done, 1 = active, null/0 = pending.
  taskStatus: number | null;
}

interface RawStage {
  name?: string;
  sequence?: number;
  configuration?: unknown;
  id?: string | number;
  steps?: { id?: string | number; ui_component?: string; task_status?: number | null }[];
}

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

function toStageList(wf: WorkflowInstance | null): WorkflowStage[] {
  const stages = (wf as { stages?: RawStage[] } | null)?.stages || [];
  return stages
    .slice()
    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
    .map((s) => {
      const step = (s.steps || [])[0] || {};
      return {
        name: s.name,
        code: step.ui_component || "",
        config: parseConfig(s.configuration),
        stageId: s.id,
        stepId: step.id,
        taskStatus: step.task_status ?? null,
      };
    });
}

// Drives a Connect wizard from its seeded CONNECT_* workflow. It is an ENHANCEMENT layer, never
// a hard dependency: on any failure it silently keeps `fallback`, so the wizard renders exactly
// as if the workflow engine weren't there.
//
//   workflowType — e.g. 'CONNECT_ONBOARDING'
//   fallback     — the wizard's own hardcoded stages as [{ name, code, config? }]
//   guest        — true for the pre-login onboarding wizard (rides the guest session)
//   sourceId     — the workflow's source entity (channel id / requirement id). When set, build
//                  returns the workflow INSTANCE (per-step task_status + progress) and
//                  executeStep() can advance it. Null before an entity exists.
export function useWorkflowStages(
  workflowType: string,
  fallback: WorkflowStage[],
  { guest = false, sourceId = null }: { guest?: boolean; sourceId?: string | number | null } = {},
) {
  const [stages, setStages] = useState<WorkflowStage[]>(fallback);
  const [source, setSource] = useState<"workflow" | "fallback">("fallback");
  const [workflow, setWorkflow] = useState<WorkflowInstance | null>(null);
  // The stage index to resume at, resolved ONCE per source from the instance's
  // last_active_step_id. Consumers should apply this on mount only — re-applying it on every
  // rebuild would fight a user who's just clicked Back, snapping them forward again.
  const [resumeIndex, setResumeIndex] = useState<number | null>(null);
  const instanceIdRef = useRef<string | number | null>(null);
  const resumeAppliedRef = useRef(false);

  const applyWorkflow = useCallback((wf: WorkflowInstance | null) => {
    if (!wf) return;
    if (wf.workflow_instance_id && wf.workflow_instance_id !== "0") {
      instanceIdRef.current = wf.workflow_instance_id;
    }
    const list = toStageList(wf);
    if (list.length) {
      setStages(list);
      setSource("workflow");
      setWorkflow(wf);
      if (!resumeAppliedRef.current) {
        resumeAppliedRef.current = true;
        if (wf.last_active_step_id && wf.last_active_step_id !== "0") {
          const idx = list.findIndex((s) => String(s.stepId) === String(wf.last_active_step_id));
          if (idx > 0) setResumeIndex(idx);
        }
      }
    }
  }, []);

  const reload = useCallback(async () => {
    try {
      const wf = await buildWorkflow(workflowType, {
        guest,
        sourceId: sourceId || undefined,
        workflowInstanceId: instanceIdRef.current || undefined,
      });
      applyWorkflow(wf);
      return wf;
    } catch {
      // keep fallback — the wizard is fully functional without the workflow layer
      return null;
    }
  }, [workflowType, guest, sourceId, applyWorkflow]);

  useEffect(() => {
    let cancelled = false;
    instanceIdRef.current = null;
    resumeAppliedRef.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets resume state when the workflow source changes
    setResumeIndex(null);
    (async () => {
      const wf = await buildWorkflow(workflowType, { guest, sourceId: sourceId || undefined }).catch(
        () => null,
      );
      if (cancelled) return;
      applyWorkflow(wf);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowType, guest, sourceId]);

  // Advance one step, then refresh progress. Best-effort: a failure here never blocks the
  // wizard, because the real data was already persisted by the wizard's own save endpoint;
  // execution only records workflow-engine progress on top of that.
  const executeStep = useCallback(
    async (stepId: string | number, { sourceId: overrideSource }: { sourceId?: string | number } = {}) => {
      const src = overrideSource || sourceId;
      if (!src || !stepId) return null;
      try {
        await executeWorkflowStep(workflowType, { stepId, sourceId: src, guest });
        return await reload();
      } catch {
        return null;
      }
    },
    [workflowType, sourceId, guest, reload],
  );

  return { stages, source, workflow, reload, executeStep, resumeIndex };
}
