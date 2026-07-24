import { useRef, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

// Box-per-digit OTP input. Every Connect OTP flow (email/mobile verification during
// onboarding, and sign-in) uses the same real backend mechanism — POST /v1/notification/otp
// or /v1/auth/login-with-otp — which this tenant has configured as spoofed
// (TENANT_SPOOF_OTP_CODE, 4 digits), so length defaults to 4. No demo/hardcoded code exists
// anywhere in this app; `hint` defaults to none — the real OTP is delivered the same way a
// real, non-spoofed deployment would deliver it, so there's nothing to hint at in the UI.
export default function OtpInput({ onVerify, onResend, hint = null, length = 4 }) {
  const [values, setValues] = useState(Array(length).fill(''));
  const [status, setStatus] = useState('idle'); // idle | error | success
  const refs = useRef([]);
  const lastIndex = length - 1;

  const handleChange = (i, raw) => {
    const digit = raw.replace(/[^0-9]/g, '').slice(-1);
    const next = [...values];
    next[i] = digit;
    setValues(next);
    setStatus('idle');
    if (digit && i < lastIndex) refs.current[i + 1]?.focus();
    if (i === lastIndex && digit) {
      const code = next.join('');
      if (code.length === length) attemptVerify(code);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const attemptVerify = async (code) => {
    const ok = await onVerify?.(code);
    setStatus(ok ? 'success' : 'error');
    if (!ok) {
      setTimeout(() => {
        setValues(Array(length).fill(''));
        setStatus('idle');
        refs.current[0]?.focus();
      }, 900);
    }
  };

  return (
    <div>
      <div className="flex gap-3 mb-2 w-full">
        {values.map((v, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            maxLength={1}
            inputMode="numeric"
            className="flex-1 min-w-0 h-16 text-center text-2xl font-bold rounded-lg outline-none transition-colors"
            style={{
              border: `2px solid ${status === 'error' ? '#B91C1C' : status === 'success' ? 'var(--c-green)' : 'var(--c-line)'}`,
              background: status === 'error' ? '#FEF2F2' : status === 'success' ? 'var(--c-gs)' : '#fff',
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        {hint && <div className="text-[11px]" style={{ color: 'var(--c-muted)' }}>{hint}</div>}
        {onResend && (
          <button type="button" onClick={onResend} className="text-[11px] font-semibold underline" style={{ color: 'var(--c-teal)' }}>
            Resend OTP
          </button>
        )}
      </div>
      {status === 'success' && (
        <div className="flex items-center gap-1.5 text-[12px] font-semibold mt-2" style={{ color: 'var(--c-green)' }}>
          <CheckCircle2 size={14} strokeWidth={2} /> Verified
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-1.5 text-[12px] font-semibold mt-2" style={{ color: '#B91C1C' }}>
          <XCircle size={14} strokeWidth={2} /> Incorrect code — try again
        </div>
      )}
    </div>
  );
}
