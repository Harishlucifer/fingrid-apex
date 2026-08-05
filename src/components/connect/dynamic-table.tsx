import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { maskDecimal, maskDigits } from "@/lib/connect/validation";

export interface DynamicTableColumn {
  key: string;
  label: string;
  placeholder?: string;
  /** Masks the cell so it can only hold what the column means. Defaults to free text. */
  type?: "text" | "int" | "decimal";
  maxLength?: number;
  /** Marks the cell red when the row is filled but this value is unusable. */
  validate?: (value: unknown) => string | null;
}

// Add/remove-row table for repeatable structured fields (branches, staff-by-role,
// empanelments, loan-mix) in the Company Profile wizard.
export function DynamicTable({
  columns,
  rows,
  onChange,
  addLabel = "Add row",
}: {
  columns: DynamicTableColumn[];
  rows: Record<string, string>[];
  onChange: (rows: Record<string, string>[]) => void;
  addLabel?: string;
}) {
  const updateCell = (rowIdx: number, key: string, val: string) => {
    const next = rows.map((r, i) => (i === rowIdx ? { ...r, [key]: val } : r));
    onChange(next);
  };
  const addRow = () =>
    onChange([...rows, Object.fromEntries(columns.map((c) => [c.key, ""]))]);
  const removeRow = (rowIdx: number) => onChange(rows.filter((_, i) => i !== rowIdx));

  return (
    <div>
      {/* Up to 4 input columns + a remove button — narrower than that doesn't fit a phone
          screen, so this scrolls horizontally within its own box instead of forcing the whole
          page wider. */}
      <div className="-mx-0.5 overflow-x-auto px-0.5">
        <table
          className="mb-2 w-full border-collapse"
          style={{ minWidth: `${columns.length * 130 + 40}px` }}
        >
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="border-b border-n200 bg-n50 px-2 py-1.5 text-left text-[10px] font-bold tracking-wide text-n500 uppercase"
                >
                  {c.label}
                </th>
              ))}
              <th className="border-b border-n200"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {columns.map((c) => {
                  // Rows can arrive from the API with real numbers in numeric columns.
                  const raw = row[c.key] == null ? "" : String(row[c.key]);
                  const cellError = c.validate ? c.validate(raw) : null;
                  return (
                    <td key={c.key} className="p-1 align-top">
                      <Input
                        value={raw}
                        placeholder={c.placeholder}
                        inputMode={c.type === "int" ? "numeric" : c.type === "decimal" ? "decimal" : undefined}
                        aria-invalid={!!cellError || undefined}
                        title={cellError || undefined}
                        onChange={(e) => {
                          const v = e.target.value;
                          updateCell(
                            i,
                            c.key,
                            c.type === "int"
                              ? maskDigits(v, c.maxLength)
                              : c.type === "decimal"
                                ? maskDecimal(v)
                                : v,
                          );
                        }}
                        className="h-auto px-2 py-1.5 text-xs"
                      />
                      {cellError && (
                        <span className="text-danger-ink mt-0.5 block text-[10px] leading-tight">
                          {cellError}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="p-1">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => removeRow(i)}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="flex w-full items-center justify-center gap-1.5 rounded-md border-[1.5px] border-dashed border-n200 py-1.5 text-xs font-semibold text-n500 transition-colors hover:border-n300"
      >
        <Plus size={13} strokeWidth={2.5} /> {addLabel}
      </button>
    </div>
  );
}
