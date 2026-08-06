import { z } from "zod";

export const ENTITY_TYPES = [
  "NBFC / Bank",
  "Business Correspondent (BC)",
  "Loan Service Provider (LSP)",
  "DSA",
  "Verification agency",
  "Valuation agency",
  "Collection agency",
  "Other",
] as const;

// Field set and required/optional split follow the "Get in Touch" spec:
// Full Name*, Email Address*, Phone Number, Company Name, You are a*, Message*.
// Only phone and company are optional — everything else is mandatory.
export const demoRequestSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name."),
  email: z.string().trim().email("A valid work email, please."),
  phone: z
    .string()
    .trim()
    // Digits, spaces, +, - and () are all legitimate in a typed phone number; the length
    // bound is what actually rejects nonsense. Left loose on purpose — a rejected real
    // number costs a lead, an odd-looking one costs nothing.
    .regex(/^[0-9+\-()\s]{7,20}$/, "Enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .trim()
    .max(120, "Keep it under 120 characters.")
    .optional()
    .or(z.literal("")),
  entityType: z.enum(ENTITY_TYPES, { message: "Select your role." }),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little about your requirements.")
    .max(1000, "Keep it under 1000 characters."),
});

export type DemoRequest = z.infer<typeof demoRequestSchema>;

export interface DemoRequestResult {
  reference: string;
}

export async function submitDemoRequest(
  values: DemoRequest,
): Promise<DemoRequestResult> {
  const response = await fetch("/api/demo-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.error ?? "We couldn't send that just now. Please try again.",
    );
  }

  return response.json();
}
