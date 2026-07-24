// Matches the shared prototype's .sbadge + .prog-s pattern exactly (fingrid-connect-v5.html):
// a small pill badge naming the workflow + current stage, then a thin progress bar with a
// "Stage X of Y" label — not a circular numbered stepper. Used by CompanyProfileWizard and
// RequirementWizard; OnboardingWizard keeps its own dot-stepper (a different, already-settled
// pattern — see Stepper.jsx's own header comment for why that one stays boxed-tab-free).
export default function StageProgress({ workflowLabel, stageLabel, currentIndex, total }) {
  const pct = Math.round(((currentIndex + 1) / total) * 100);
  return (
    <div className="mb-3">
      <div
        className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full mb-3"
        style={{ background: 'var(--c-as)', color: 'var(--c-amber)' }}
      >
        {workflowLabel} · Stage {currentIndex + 1} of {total} — {stageLabel}
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--c-line)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--c-teal)' }} />
        </div>
        <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: 'var(--c-slate)' }}>
          Stage {currentIndex + 1} of {total}
        </span>
      </div>
    </div>
  );
}
