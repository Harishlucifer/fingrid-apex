import { NextResponse } from "next/server";
import { demoRequestSchema } from "@/lib/demo-request";
import { sendDemoRequestNotification } from "@/lib/mail";

// The AWS SDK needs the Node runtime; be explicit rather than relying on the default.
export const runtime = "nodejs";

/**
 * Accepts a demo request: validates, emails the internal team via SES, and
 * returns a reference the caller can quote. The submission is always logged
 * first, so a lead survives even if the mail leg fails.
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

  try {
    const outcome = await sendDemoRequestNotification(reference, parsed.data);
    if (outcome.status === "not-configured") {
      // Local dev and preview builds run without SES. The log above is the record.
      console.warn(
        "[demo-request] mail not configured — set AWS_REGION, SES_FROM and DEMO_REQUEST_TO",
      );
    }
  } catch (error) {
    // Mail is configured but the send failed, so nobody has been notified. Say so
    // rather than returning a reference that leads nowhere; the form asks the
    // visitor to retry or reach us directly.
    console.error("[demo-request] SES send failed", reference, error);
    return NextResponse.json(
      {
        error:
          "We couldn't submit that just now. Please try again, or email us at sreedhar@fingrid.ai.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ reference }, { status: 201 });
}
