"use client";

import { useCallback, useEffect, useState, type ReactNode, type ComponentType } from "react";
import { Inbox, Send, CheckCircle2, Clock, X } from "lucide-react";
import { Card, Alert, PageHeader, StatStrip, InitialAvatar } from "@/components/connect/card";
import { Button } from "@/components/ui/button";
import { useConnectStore } from "@/stores/use-connect-store";
import { listRequests, respondToRequest, cancelRequest } from "@/lib/connect/connect-api";

const STATUS_STYLE: Record<string, string> = {
  ACCEPTED: "bg-success-bg text-success-ink",
  REJECTED: "bg-danger-bg text-danger-ink",
  CANCELLED: "bg-n50 text-n500",
  PENDING: "bg-warning-bg text-warning-ink",
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLE[status] || STATUS_STYLE.CANCELLED;
  return <span className={`flex-shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${cls}`}>{status}</span>;
}

function Section({
  icon: Icon,
  title,
  count,
  children,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <Card className="mb-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={15} strokeWidth={2} className="text-n700" />
        <span className="text-sm font-bold">{title}</span>
        {count > 0 && <span className="rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">{count}</span>}
      </div>
      {children}
    </Card>
  );
}

interface RequestItem {
  request_id: string | number;
  direction: string;
  request_status: string;
  message?: string;
  created_at?: string;
  counterparty?: { name?: string };
}

export function RequestsView() {
  const channelId = useConnectStore((s) => s.channelId);
  const [items, setItems] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!channelId) return;
    setLoading(true);
    listRequests(channelId)
      .then((raw) => setItems(((raw as { items?: RequestItem[] }).items) || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load requests"))
      .finally(() => setLoading(false));
  }, [channelId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetches requests from the server on mount
    load();
  }, [load]);

  const act = async (requestId: string | number, action: string) => {
    setActionError(null);
    setActingId(requestId);
    try {
      if (action === "CANCEL") await cancelRequest(channelId as string, requestId);
      else await respondToRequest(channelId as string, { requestId, action });
      load();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to update request");
    } finally {
      setActingId(null);
    }
  };

  const received = items.filter((r) => r.direction === "received" && r.request_status === "PENDING");
  const sent = items.filter((r) => r.direction === "sent");
  const history = items.filter((r) => r.direction === "received" && r.request_status !== "PENDING");
  const acceptedCount = items.filter((r) => r.request_status === "ACCEPTED").length;

  if (loading) return <Card className="py-8 text-center text-sm">Loading requests…</Card>;

  const emptyRow = (text: string) => <div className="py-2 text-xs text-n500">{text}</div>;

  return (
    <div>
      <PageHeader
        icon={Inbox}
        tint="bg-warning-bg"
        color="text-warning-ink"
        title="Connect Requests"
        subtitle="Manage incoming and outgoing partnership requests"
      />
      {error && <Alert tone="warning">{error}</Alert>}
      {actionError && <Alert tone="error">{actionError}</Alert>}

      <StatStrip
        items={[
          { label: "Awaiting you", value: received.length, icon: Inbox, tint: "bg-warning-bg", color: "text-warning-ink" },
          { label: "Sent by you", value: sent.length, icon: Send, tint: "bg-n100", color: "text-navy-900" },
          { label: "Accepted", value: acceptedCount, icon: CheckCircle2, tint: "bg-success-bg", color: "text-success-ink" },
        ]}
      />

      <Section icon={Inbox} title="Received — awaiting your response" count={received.length}>
        {received.length === 0
          ? emptyRow("No pending requests right now.")
          : received.map((r) => (
              <div key={r.request_id} className="flex items-center justify-between gap-3 border-t border-n200 py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <InitialAvatar name={r.counterparty?.name} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{r.counterparty?.name || "Unknown"}</div>
                    <div className="truncate text-[11px] text-n500">
                      {r.message || "Wants to connect"} · {r.created_at?.slice(0, 10)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <Button type="button" variant="fgBlue" size="sm" disabled={actingId === r.request_id} onClick={() => act(r.request_id, "ACCEPT")} className="px-3 py-1.5 text-xs">
                    Accept
                  </Button>
                  <Button type="button" variant="outline" size="sm" disabled={actingId === r.request_id} onClick={() => act(r.request_id, "REJECT")} className="px-3 py-1.5 text-xs">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
      </Section>

      <Section icon={Send} title="Sent by you" count={sent.length}>
        {sent.length === 0
          ? emptyRow("You haven't sent any connect requests yet.")
          : sent.map((r) => (
              <div key={r.request_id} className="flex items-center justify-between gap-3 border-t border-n200 py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <InitialAvatar name={r.counterparty?.name} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{r.counterparty?.name || "Unknown"}</div>
                    <div className="text-[11px] text-n500">{r.created_at?.slice(0, 10)}</div>
                  </div>
                </div>
                {r.request_status === "PENDING" ? (
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-warning-bg px-2 py-1 text-[10px] font-bold text-warning-ink">
                      <Clock size={11} strokeWidth={2} /> PENDING
                    </span>
                    <button
                      type="button"
                      disabled={actingId === r.request_id}
                      onClick={() => act(r.request_id, "CANCEL")}
                      className="flex items-center gap-1 text-xs font-semibold text-danger-ink"
                    >
                      <X size={12} strokeWidth={2.5} /> {actingId === r.request_id ? "Cancelling…" : "Cancel"}
                    </button>
                  </div>
                ) : (
                  <StatusBadge status={r.request_status} />
                )}
              </div>
            ))}
      </Section>

      {history.length > 0 && (
        <Section icon={Clock} title="Past received" count={history.length}>
          {history.map((r) => (
            <div key={r.request_id} className="flex items-center justify-between gap-3 border-t border-n200 py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <InitialAvatar name={r.counterparty?.name} />
                <div className="truncate text-sm font-bold">{r.counterparty?.name || "Unknown"}</div>
              </div>
              <StatusBadge status={r.request_status} />
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
