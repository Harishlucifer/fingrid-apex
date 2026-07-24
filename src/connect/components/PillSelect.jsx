// Single- or multi-select pill group. Ports .pill/.pill.on from the L3 prototype.
export default function PillSelect({ options, value, onChange, multi = false }) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const toggle = (opt) => {
    if (multi) {
      onChange(selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt]);
    } else {
      onChange(opt);
    }
  };
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {options.map((opt) => {
        const on = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={{
              border: `1.5px solid ${on ? 'var(--c-teal)' : 'var(--c-line)'}`,
              color: on ? 'var(--c-teal)' : 'var(--c-muted)',
              background: on ? 'var(--c-ts)' : '#fff',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
