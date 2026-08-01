"use client";

import { useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Box-per-digit OTP input. Every Connect OTP flow (email/mobile verification during
// onboarding, and sign-in) uses the same backend mechanism, spoofed to a 4-digit code for this
// tenant — length defaults to 4.
export function OtpInput({
  onVerify,
  onResend,
  hint,
  length = 4,
}: {
  onVerify: (code: string) => Promise<boolean> | boolean;
  onResend?: () => void;
  hint?: string;
  length?: number;
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const lastIndex = length - 1;

  const attemptVerify = async (code: string) => {
    const ok = await onVerify?.(code);
    setStatus(ok ? "success" : "error");
    if (!ok) {
      setTimeout(() => {
        setValues(Array(length).fill(""));
        setStatus("idle");
        refs.current[0]?.focus();
      }, 900);
    }
  };

  const handleChange = (i: number, raw: string) => {
    const digit = raw.replace(/[^0-9]/g, "").slice(-1);
    const next = [...values];
    next[i] = digit;
    setValues(next);
    setStatus("idle");
    if (digit && i < lastIndex) refs.current[i + 1]?.focus();
    if (i === lastIndex && digit) {
      const code = next.join("");
      if (code.length === length) attemptVerify(code);
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div>
      <div className="mb-2 flex w-full gap-3">
        {values.map((v, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            maxLength={1}
            inputMode="numeric"
            className={cn(
              "h-16 min-w-0 flex-1 rounded-lg border-2 text-center text-2xl font-bold transition-colors outline-none",
              status === "error" && "border-danger bg-danger-bg",
              status === "success" && "border-success bg-success-bg",
              status === "idle" && "border-n200 bg-white",
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        {hint && <div className="text-[11px] text-n500">{hint}</div>}
        {onResend && (
          <button
            type="button"
            onClick={onResend}
            className="text-[11px] font-semibold text-blue-500 underline"
          >
            Resend OTP
          </button>
        )}
      </div>
      {status === "success" && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-success">
          <CheckCircle2 size={14} strokeWidth={2} /> Verified
        </div>
      )}
      {status === "error" && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-danger">
          <XCircle size={14} strokeWidth={2} /> Incorrect code — try again
        </div>
      )}
    </div>
  );
}
