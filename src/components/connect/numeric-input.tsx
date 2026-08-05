"use client";

import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { maskDecimal, maskDigits } from "@/lib/connect/validation";

// Amount/count input that physically cannot hold a letter — the masking happens on change, so
// typing, pasting and autofill all go through it. `mode` picks the mask:
//   int     — digits only (counts, years, branches)
//   decimal — digits with at most one "." (money, ratios)
// A prefix/suffix renders inside the box so "₹" and "Cr" don't have to live in the label.
export function NumericInput({
  value,
  onValueChange,
  mode = "decimal",
  maxLength,
  prefix,
  suffix,
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "onChange" | "value" | "type"> & {
  value: string;
  onValueChange: (value: string) => void;
  mode?: "int" | "decimal";
  maxLength?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="relative">
      {prefix && (
        <span className="text-n400 pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm">
          {prefix}
        </span>
      )}
      <Input
        {...props}
        value={value}
        // "text" not "number": number inputs silently drop invalid keystrokes into an empty
        // string, hide the value from validation, and add scroll-wheel increment nobody wants.
        type="text"
        inputMode={mode === "int" ? "numeric" : "decimal"}
        autoComplete="off"
        onChange={(e) =>
          onValueChange(
            mode === "int" ? maskDigits(e.target.value, maxLength) : maskDecimal(e.target.value),
          )
        }
        className={cn(prefix && "pl-8", suffix && "pr-12", className)}
      />
      {suffix && (
        <span className="text-n400 pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-medium">
          {suffix}
        </span>
      )}
    </div>
  );
}
