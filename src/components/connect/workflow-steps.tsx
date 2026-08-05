"use client";

import { Check, Lock, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// Horizontal stage strip that sits above a Connect wizard's form. Stage names only — no
// sub-tasks, no per-stage blurb: at this altitude the partner needs "where am I in this flow",
// and the detail belongs in the form itself.

export type StageStatus = "done" | "current" | "pending" | "locked" | "na";

export interface WorkflowStep {
  label: string;
  /** Overrides the position-derived status (done before / current at / pending after). */
  status?: StageStatus;
}

function resolveStatus(step: WorkflowStep, index: number, currentIndex: number): StageStatus {
  if (step.status) return step.status;
  if (index < currentIndex) return "done";
  if (index === currentIndex) return "current";
  return "pending";
}

const BULLET: Record<StageStatus, string> = {
  done: "bg-success-bg text-success-ink ring-success/30",
  current: "bg-blue-500 text-white ring-blue-500/30 shadow-[0_4px_12px_rgb(49_133_255_/_0.35)]",
  pending: "bg-white text-n400 ring-n200",
  locked: "bg-n100 text-n400 ring-n200",
  na: "bg-n100 text-n400 ring-n200",
};

const LABEL: Record<StageStatus, string> = {
  done: "text-navy-900",
  current: "text-blue-600",
  pending: "text-n400",
  locked: "text-n400",
  na: "text-n400",
};

export interface WorkflowStepsProps {
  /** Used for the landmark's accessible name; not rendered. */
  workflowLabel: string;
  steps: WorkflowStep[];
  currentIndex: number;
  /** Omit to render a read-only strip. */
  onSelect?: (index: number) => void;
  /** Which steps are clickable (defaults to "already completed, or the current one"). */
  canSelect?: (index: number) => boolean;
  className?: string;
}

export function WorkflowSteps({
  workflowLabel,
  steps,
  currentIndex,
  onSelect,
  canSelect,
  className,
}: WorkflowStepsProps) {
  const total = steps.length || 1;

  return (
    <nav
      aria-label={`${workflowLabel} stages`}
      className={cn(
        "ring-navy-900/5 flex items-center gap-3 rounded-2xl border border-white bg-white/90 px-3 py-2.5 shadow-[0_12px_34px_rgb(1_39_86_/_0.06)] ring-1 backdrop-blur-sm",
        className,
      )}
    >
      {/* Scrolls sideways rather than wrapping, so a five-stage flow stays one line on a phone. */}
      <ol className="flex min-w-0 flex-1 items-center overflow-x-auto">
        {steps.map((step, index) => {
          const status = resolveStatus(step, index, currentIndex);
          const active = index === currentIndex;
          const selectable =
            !!onSelect && (canSelect ? canSelect(index) : status === "done" || active);
          const Row = selectable ? "button" : "div";

          return (
            <li key={`${step.label}-${index}`} className="flex shrink-0 items-center">
              <Row
                {...(selectable
                  ? { type: "button" as const, onClick: () => onSelect?.(index) }
                  : {})}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-2.5 py-1.5 transition-colors",
                  active && "bg-blue-500/[.09]",
                  selectable && !active && "hover:bg-n50 cursor-pointer",
                )}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full text-[10.5px] font-bold ring-1",
                    BULLET[status],
                  )}
                >
                  {status === "done" ? (
                    <Check size={12} strokeWidth={3} />
                  ) : status === "locked" ? (
                    <Lock size={11} strokeWidth={2.5} />
                  ) : status === "na" ? (
                    <Minus size={11} strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-[12.5px] font-semibold whitespace-nowrap",
                    LABEL[status],
                  )}
                >
                  {step.label}
                </span>
              </Row>

              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-0.5 h-px w-4 shrink-0 sm:w-6",
                    status === "done" ? "bg-success/35" : "bg-n200",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <span className="border-n200 text-n500 shrink-0 border-l pl-3 text-[11px] font-bold whitespace-nowrap">
        {Math.min(currentIndex + 1, total)}/{total}
      </span>
    </nav>
  );
}
