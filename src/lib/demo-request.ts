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

export const demoRequestSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name."),
  email: z.string().trim().email("A valid work email, please."),
  company: z.string().trim().min(2, "Which company are you with?"),
  entityType: z.enum(ENTITY_TYPES, { message: "Pick the closest match." }),
  assetClasses: z
    .string()
    .trim()
    .max(500, "Keep it under 500 characters.")
    .optional()
    .or(z.literal("")),
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
