// Shared field rules for the Connect wizards. One place so the same field means the same thing
// in every wizard, and so "is this valid?" and "what do I tell the user?" never drift apart.
//
// Every rule returns `null` when the value is acceptable, or a user-facing message when it is
// not. Empty input is treated as "not filled in" and left to the `required` rule — that keeps
// optional numeric fields from screaming at a user who simply skipped them.

// Values reaching these rules come from a Go API where numbers really are numbers, so the
// signature is `unknown` and every rule normalises first. A rule that assumed `string` is
// exactly how the earlier `v.trim is not a function` crash happened.
export type Rule = (value: unknown) => string | null;

const str = (v: unknown) => (v == null ? "" : String(v));
const isBlank = (v: unknown) => str(v).trim() === "";

export const required = (label: string): Rule => (v) =>
  isBlank(v) ? `${label} is required.` : null;

/** Digits only, no decimal point. Use for counts, years, branch numbers. */
export const integer = (label: string): Rule => (v) =>
  isBlank(v) || /^\d+$/.test(str(v).trim()) ? null : `${label} must be a whole number.`;

/** Digits with at most one decimal point. Use for money/amount fields. */
export const decimal = (label: string): Rule => (v) =>
  isBlank(v) || /^\d+(\.\d+)?$/.test(str(v).trim()) ? null : `${label} must be a number.`;

export const min = (label: string, floor: number): Rule => (v) =>
  isBlank(v) || Number(str(v)) >= floor ? null : `${label} cannot be less than ${floor}.`;

export const max = (label: string, ceiling: number): Rule => (v) =>
  isBlank(v) || Number(str(v)) <= ceiling ? null : `${label} cannot be more than ${ceiling}.`;

export const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const pan: Rule = (v) =>
  isBlank(v) || PAN_RE.test(str(v).trim().toUpperCase())
    ? null
    : "PAN must be in the format ABCDE1234F.";

// Deliberately loose: the server is the authority on deliverability. This only catches the
// shapes a human can see are wrong before they burn an OTP send on them.
export const email: Rule = (v) =>
  isBlank(v) || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(str(v).trim())
    ? null
    : "Enter a valid email address.";

export const mobile: Rule = (v) =>
  isBlank(v) || /^[6-9]\d{9}$/.test(str(v).trim())
    ? null
    : "Enter a valid 10-digit Indian mobile number.";

export const url: Rule = (v) =>
  isBlank(v) || /^https?:\/\/[^\s.]+\.[^\s]{2,}$/.test(str(v).trim())
    ? null
    : "Enter a full URL including https://";

/** CIN is 21 alphanumeric characters. Optional everywhere it appears. */
export const cin: Rule = (v) =>
  isBlank(v) || /^[A-Z0-9]{21}$/.test(str(v).trim().toUpperCase())
    ? null
    : "CIN must be 21 characters (e.g. U65999TN2019PTC123456).";

export const year: Rule = (v) => {
  if (isBlank(v)) return null;
  if (!/^\d{4}$/.test(str(v).trim())) return "Year must be 4 digits.";
  const n = Number(str(v));
  const now = new Date().getFullYear();
  if (n < 1800 || n > now) return `Year must be between 1800 and ${now}.`;
  return null;
};

/** First failing rule wins, so the user sees one actionable message at a time. */
export function firstError(value: unknown, rules: Rule[]): string | null {
  for (const rule of rules) {
    const err = rule(value);
    if (err) return err;
  }
  return null;
}

/** Collapses a field-keyed rule map into { field: message } for only the fields that fail. */
export function validateAll(
  values: Record<string, unknown>,
  rules: Record<string, Rule[]>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [key, fieldRules] of Object.entries(rules)) {
    const err = firstError(values[key], fieldRules);
    if (err) errors[key] = err;
  }
  return errors;
}

// ---- input masking ------------------------------------------------------------------
// Applied on change so a text-mode input physically cannot hold a letter. The rules above
// still run, because a mask can't catch "0" where a positive number is required, an
// out-of-range year, or a second decimal point pasted in.

export const maskDigits = (v: unknown, maxLen?: number) => {
  const digits = str(v).replace(/\D/g, "");
  return maxLen ? digits.slice(0, maxLen) : digits;
};

export const maskDecimal = (v: unknown) => {
  const cleaned = str(v).replace(/[^\d.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  return rest.length ? `${whole}.${rest.join("").replace(/\./g, "")}` : whole;
};
