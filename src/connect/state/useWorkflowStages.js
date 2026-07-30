import { useCallback, useEffect, useRef, useState } from 'react';
import { buildWorkflow, executeWorkflowStep } from '../services/connectApi';

// Parses a workflow stage/step `configuration` — GORM's datatypes.JSON comes back already parsed
// as an object over the wire, but tolerate a JSON string too (same defensiveness as
// LookupsContext.jsx).
function parseConfig(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw;
}

function toStageList(wf) {
  return (wf?.stages || [])
    .slice()
    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
    .map((s) => {
      const step = (s.steps || [])[0] || {};
      return {
        name: s.name,
        code: step.ui_component || '',
        config: parseConfig(s.configuration),
        stageId: s.id,
        stepId: step.id,
        // task_status: 2 = done, 1 = active, null/0 = pending (verified live)
        taskStatus: step.task_status ?? null,
      };
    });
}

// Drives a Connect wizard from its seeded CONNECT_* workflow, mirroring craft-frontend's
// PartnerFlow (loadWorkflow + execution). It is an ENHANCEMENT layer, never a hard dependency:
// on any failure it silently keeps `fallback`, so the wizard renders exactly as before.
//
//   workflowType — e.g. 'CONNECT_ONBOARDING'
//   fallback     — the wizard's existing hardcoded stages as [{ name, config? }]
//   guest        — true for the pre-login onboarding wizard (rides the guest session)
//   sourceId     — the workflow's source entity (channel id / requirement id). When set,
//                  build returns the workflow INSTANCE (per-step task_status + progress) and
//                  executeStep() can advance it. Null before an entity exists (onboarding start).
//
// Returns:
//   stages    — [{ name, code, config, stageId, stepId, taskStatus }] in sequence order
//   source    — 'workflow' | 'fallback' (where the stage list came from)
//   workflow  — the raw Workflow DTO (workflow_instance_id, last_active_step_id, …) or null
//   reload()  — re-fetch the particular workflow (craft's loadWorkflow(id, 0))
//   executeStep(stepId) — POST /workflow/execution for that step, then reload (craft's
//                 workflowBuild → loadWorkflow). No-op without a sourceId + stepId.
//   resumeIndex — the stage index matching last_active_step_id, resolved once per source; null
//                 until resolved or if there's nothing to resume (already at/before stage 0).
export function useWorkflowStages(workflowType, fallback, { guest = false, sourceId = null } = {}) {
  const [stages, setStages] = useState(fallback);
  const [source, setSource] = useState('fallback');
  const [workflow, setWorkflow] = useState(null);
  // The stage index to resume at, resolved ONCE per source from the instance's
  // last_active_step_id — craft-frontend's setCurrentComponent(workflow, last_active_step_id).
  // Consumers apply this on mount only (see the wizards): re-applying it on every rebuild would
  // fight a user who's just clicked Back, snapping them forward again.
  const [resumeIndex, setResumeIndex] = useState(null);
  // Remembers the resolved instance id so reloads target it directly (build's
  // workflow_instance_id branch) rather than re-resolving from source_id each time.
  const instanceIdRef = useRef(null);
  const resumeAppliedRef = useRef(false);

  const applyWorkflow = useCallback((wf) => {
    if (!wf) return;
    if (wf.workflow_instance_id && wf.workflow_instance_id !== '0') {
      instanceIdRef.current = wf.workflow_instance_id;
    }
    const list = toStageList(wf);
    if (list.length) {
      setStages(list);
      setSource('workflow');
      setWorkflow(wf);
      if (!resumeAppliedRef.current) {
        resumeAppliedRef.current = true;
        if (wf.last_active_step_id && wf.last_active_step_id !== '0') {
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
    // Source changed — drop any instance id / resume state resolved for a previous source.
    instanceIdRef.current = null;
    resumeAppliedRef.current = false;
    setResumeIndex(null);
    (async () => {
      const wf = await buildWorkflow(workflowType, {
        guest,
        sourceId: sourceId || undefined,
      }).catch(() => null);
      if (cancelled) return;
      applyWorkflow(wf);
    })();
    return () => {
      cancelled = true;
    };
  }, [workflowType, guest, sourceId, applyWorkflow]);

  // Advance one step of the particular workflow, then refresh its progress — craft's per-step
  // execution. Best-effort: a failure here never blocks the wizard, because the real data was
  // already persisted by the wizard's own endpoint (saveProfile / saveRequirement / registration);
  // execution only records workflow-engine progress on top of that.
  const executeStep = useCallback(async (stepId, { sourceId: overrideSource } = {}) => {
    const src = overrideSource || sourceId;
    if (!src || !stepId) return null;
    try {
      await executeWorkflowStep(workflowType, { stepId, sourceId: src, guest });
      return await reload();
    } catch {
      return null;
    }
  }, [workflowType, sourceId, guest, reload]);

  return { stages, source, workflow, reload, executeStep, resumeIndex };
}
