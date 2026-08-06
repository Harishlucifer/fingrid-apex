import {
  SESv2Client,
  SendEmailCommand,
} from "@aws-sdk/client-sesv2";
import type { DemoRequest } from "@/lib/demo-request";

// Server-only. Never import this from a "use client" module — it would pull the AWS
// SDK and the credentials-shaped env reads into the browser bundle.

/**
 * Mail settings come entirely from the environment so the same build can be
 * promoted across environments. AWS credentials are deliberately absent: the SDK
 * resolves them itself from the instance/task IAM role, or from
 * AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY when running outside AWS.
 */
interface MailConfig {
  region: string;
  from: string;
  to: string[];
}

function readMailConfig(): MailConfig | null {
  const region = process.env.AWS_REGION?.trim();
  const from = process.env.SES_FROM?.trim();
  const to = (process.env.DEMO_REQUEST_TO ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (!region || !from || to.length === 0) return null;
  return { region, from, to };
}

// One client per process — the SDK pools connections, and route handlers run warm.
let client: SESv2Client | null = null;
function sesClient(region: string) {
  client ??= new SESv2Client({ region });
  return client;
}

/** Submitted values land in an HTML body, so every interpolation is escaped. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type MailOutcome =
  | { status: "sent"; messageId?: string }
  | { status: "not-configured" };

/**
 * Notifies the internal team about a demo request. Reply-To is set to the
 * submitter so anyone on the receiving end can answer with a plain reply.
 *
 * Returns "not-configured" when SES env vars are absent (local dev, preview
 * builds) rather than throwing, so the form still works without mail set up.
 * A configured-but-failing send throws — the caller decides what the visitor sees.
 */
export async function sendDemoRequestNotification(
  reference: string,
  data: DemoRequest,
): Promise<MailOutcome> {
  const config = readMailConfig();
  if (!config) return { status: "not-configured" };

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Company", data.company || "—"],
    ["They are a", data.entityType],
    ["Reference", reference],
  ];

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    data.message,
  ].join("\n");

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:14px;color:#111">
  <h2 style="margin:0 0 16px;font-size:16px">New demo request</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#666">${escapeHtml(label)}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
      )
      .join("\n    ")}
  </table>
  <h3 style="margin:20px 0 6px;font-size:14px">Message</h3>
  <p style="margin:0;white-space:pre-wrap">${escapeHtml(data.message)}</p>
</div>`;

  const result = await sesClient(config.region).send(
    new SendEmailCommand({
      FromEmailAddress: config.from,
      Destination: { ToAddresses: config.to },
      ReplyToAddresses: [data.email],
      Content: {
        Simple: {
          Subject: {
            Data: `Demo request — ${data.company || data.name} (${reference})`,
            Charset: "UTF-8",
          },
          Body: {
            Text: { Data: text, Charset: "UTF-8" },
            Html: { Data: html, Charset: "UTF-8" },
          },
        },
      },
    }),
  );

  return { status: "sent", messageId: result.MessageId };
}
