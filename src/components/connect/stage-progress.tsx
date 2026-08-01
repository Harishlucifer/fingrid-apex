// A small pill badge naming the workflow + current stage, then a thin progress bar with a
// "Stage X of Y" label. Used by CompanyProfileWizard and RequirementWizard; OnboardingWizard
// keeps its own dot-stepper.
export function StageProgress({
  workflowLabel,
  stageLabel,
  currentIndex,
  total,
}: {
  workflowLabel: string;
  stageLabel: string;
  currentIndex: number;
  total: number;
}) {
  const pct = Math.round(((currentIndex + 1) / total) * 100);
  return (
    <div className="mb-3">
      <div className="mb-3 inline-block rounded-full bg-warning-bg px-2.5 py-1 text-[11px] font-bold text-warning-ink">
        {workflowLabel} · Stage {currentIndex + 1} of {total} — {stageLabel}
      </div>
      <div className="flex items-center gap-2.5">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-n200">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] font-bold whitespace-nowrap text-n700">
          Stage {currentIndex + 1} of {total}
        </span>
      </div>
    </div>
  );
}
