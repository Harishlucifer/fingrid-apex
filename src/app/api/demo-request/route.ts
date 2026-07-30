import { NextResponse } from "next/server";
import { demoRequestSchema } from "@/lib/demo-request";

/**
 * Accepts a demo request. Validates and acknowledges; wiring to a CRM or
 * transactional mailer is a deployment concern, so the handler logs and
 * returns a reference the caller can quote.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Malformed JSON body." },
      { status: 400 },
    );
  }

  const parsed = demoRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const reference = `FG-${Date.now().toString(36).toUpperCase()}`;
  console.info("[demo-request]", reference, {
    company: parsed.data.company,
    entityType: parsed.data.entityType,
    email: parsed.data.email,
  });

  return NextResponse.json({ reference }, { status: 201 });
}
