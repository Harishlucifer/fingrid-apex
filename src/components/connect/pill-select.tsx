import { cn } from "@/lib/utils";

// Single- or multi-select pill group.
export function PillSelect({
  options,
  value,
  onChange,
  multi = false,
}: {
  options: string[];
  value: string | string[] | null | undefined;
  onChange: (value: string | string[]) => void;
  multi?: boolean;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const toggle = (opt: string) => {
    if (multi) {
      onChange(selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt]);
    } else {
      onChange(opt);
    }
  };
  return (
    <div className="mt-1 flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const on = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              "rounded-full border-[1.5px] px-3 py-1.5 text-xs font-semibold transition-colors",
              on ? "border-blue-500 bg-blue-500/10 text-blue-600" : "border-n200 bg-white text-n500",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
