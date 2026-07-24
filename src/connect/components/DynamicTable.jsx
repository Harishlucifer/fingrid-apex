import { Plus, X } from 'lucide-react';

// Add/remove-row table for repeatable structured fields (branches, staff-by-role,
// empanelments, loan-mix). L4b classified these Company Profile fields as the HYBRID
// "DynamicTable" widget slot — this is that widget, shared across every stage that needs it.
export default function DynamicTable({ columns, rows, onChange, addLabel = 'Add row' }) {
  const updateCell = (rowIdx, key, val) => {
    const next = rows.map((r, i) => (i === rowIdx ? { ...r, [key]: val } : r));
    onChange(next);
  };
  const addRow = () => onChange([...rows, Object.fromEntries(columns.map((c) => [c.key, '']))]);
  const removeRow = (rowIdx) => onChange(rows.filter((_, i) => i !== rowIdx));

  return (
    <div>
      {/* Up to 4 input columns + a remove button — narrower than that doesn't fit a phone
          screen no matter how the inputs are sized, so this scrolls horizontally within its
          own box instead of forcing the whole page wider (which would break every layout
          around it, not just this table). */}
      <div className="overflow-x-auto -mx-0.5 px-0.5">
      <table className="w-full border-collapse mb-2" style={{ minWidth: `${columns.length * 130 + 40}px` }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left text-[10px] font-bold uppercase tracking-wide px-2 py-1.5" style={{ background: 'var(--c-bg)', color: 'var(--c-muted)', borderBottom: '1px solid var(--c-line)' }}>
                {c.label}
              </th>
            ))}
            <th style={{ borderBottom: '1px solid var(--c-line)' }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} className="p-1">
                  <input
                    value={row[c.key] ?? ''}
                    placeholder={c.placeholder}
                    onChange={(e) => updateCell(i, c.key, e.target.value)}
                    className="w-full px-2 py-1.5 rounded text-xs"
                    style={{ border: '1.5px solid var(--c-line)' }}
                  />
                </td>
              ))}
              <td className="p-1">
                <button type="button" onClick={() => removeRow(i)} className="flex items-center justify-center p-1 rounded" style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
                  <X size={12} strokeWidth={2.5} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="w-full py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        style={{ border: '1.5px dashed var(--c-line)', color: 'var(--c-muted)' }}
      >
        <Plus size={13} strokeWidth={2.5} /> {addLabel}
      </button>
    </div>
  );
}
