import { useEffect, useState, useCallback } from 'react';
import { Inbox, Send, CheckCircle2, Clock, X } from 'lucide-react';
import { Card, Alert, PageHeader, StatStrip, Avatar } from '../../components/Card';
import { useConnectState } from '../../state/ConnectContext';
import { listRequests, respondToRequest, cancelRequest } from '../../services/connectApi';

// US-08 — Connect Requests inbox. Previously there was no GET endpoint to list pending
// requests at all (05-api-contracts.md only defined send/accept/reject), so this page could
// only accept/reject a request_id the user already somehow knew. Fixed: GET
// /connect/:channelId/requests now lists every request involving this channel, either
// direction, closing that gap for real.
const STATUS_STYLE = {
  ACCEPTED: { bg: 'var(--c-gs)', color: 'var(--c-green)' },
  REJECTED: { bg: '#FEF2F2', color: '#B91C1C' },
  CANCELLED: { bg: 'var(--c-bg)', color: 'var(--c-muted)' },
  PENDING: { bg: 'var(--c-as)', color: 'var(--c-amber)' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.CANCELLED;
  return <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: s.bg, color: s.color }}>{status}</span>;
}

function Section({ icon: Icon, title, count, children }) {
  return (
    <Card className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} strokeWidth={2} style={{ color: 'var(--c-slate)' }} />
        <span className="text-sm font-bold">{title}</span>
        {count > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--c-bs)', color: 'var(--c-blue)' }}>{count}</span>}
      </div>
      {children}
    </Card>
  );
}

export default function Requests() {
  const { channelId } = useConnectState();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(() => {
    if (!channelId) return;
    setLoading(true);
    listRequests(channelId)
      .then((r) => setItems(r.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [channelId]);

  useEffect(() => { load(); }, [load]);

  const act = async (requestId, action) => {
    setActionError(null);
    setActingId(requestId);
    try {
      if (action === 'CANCEL') await cancelRequest(channelId, requestId);
      else await respondToRequest(channelId, { requestId, action });
      load();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setActingId(null);
    }
  };

  const received = items.filter((r) => r.direction === 'received' && r.request_status === 'PENDING');
  const sent = items.filter((r) => r.direction === 'sent');
  const history = items.filter((r) => r.direction === 'received' && r.request_status !== 'PENDING');
  const acceptedCount = items.filter((r) => r.request_status === 'ACCEPTED').length;

  if (loading) return <Card className="text-center py-8 text-sm">Loading requests…</Card>;

  const emptyRow = (text) => <div className="text-xs py-2" style={{ color: 'var(--c-muted)' }}>{text}</div>;

  return (
    <div>
      <PageHeader
        icon={Inbox}
        tint="var(--c-as)"
        color="var(--c-amber)"
        title="Connect Requests"
        subtitle="Manage incoming and outgoing partnership requests"
      />
      {error && <Alert tone="warning">{error}</Alert>}
      {actionError && <Alert tone="error">{actionError}</Alert>}

      <StatStrip items={[
        { label: 'Awaiting you', value: received.length, icon: Inbox, tint: 'var(--c-as)', color: 'var(--c-amber)' },
        { label: 'Sent by you', value: sent.length, icon: Send, tint: 'var(--c-bs)', color: 'var(--c-blue)' },
        { label: 'Accepted', value: acceptedCount, icon: CheckCircle2, tint: 'var(--c-gs)', color: 'var(--c-green)' },
      ]} />

      <Section icon={Inbox} title="Received — awaiting your response" count={received.length}>
        {received.length === 0 ? emptyRow('No pending requests right now.') : received.map((r) => (
          <div key={r.request_id} className="flex items-center justify-between gap-3 py-2.5" style={{ borderTop: '1px solid var(--c-line)' }}>
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={r.counterparty?.name} size={38} />
              <div className="min-w-0">
                <div className="text-sm font-bold truncate">{r.counterparty?.name || 'Unknown'}</div>
                <div className="text-[11px] truncate" style={{ color: 'var(--c-muted)' }}>{r.message || 'Wants to connect'} · {r.created_at?.slice(0, 10)}</div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button type="button" disabled={actingId === r.request_id} onClick={() => act(r.request_id, 'ACCEPT')} className="connect-btn-primary px-3 py-1.5 text-xs">Accept</button>
              <button type="button" disabled={actingId === r.request_id} onClick={() => act(r.request_id, 'REJECT')} className="connect-btn-outline px-3 py-1.5 text-xs">Reject</button>
            </div>
          </div>
        ))}
      </Section>

      <Section icon={Send} title="Sent by you" count={sent.length}>
        {sent.length === 0 ? emptyRow("You haven't sent any connect requests yet.") : sent.map((r) => (
          <div key={r.request_id} className="flex items-center justify-between gap-3 py-2.5" style={{ borderTop: '1px solid var(--c-line)' }}>
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={r.counterparty?.name} size={38} />
              <div className="min-w-0">
                <div className="text-sm font-bold truncate">{r.counterparty?.name || 'Unknown'}</div>
                <div className="text-[11px]" style={{ color: 'var(--c-muted)' }}>{r.created_at?.slice(0, 10)}</div>
              </div>
            </div>
            {r.request_status === 'PENDING' ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: 'var(--c-as)', color: 'var(--c-amber)' }}>
                  <Clock size={11} strokeWidth={2} /> PENDING
                </span>
                <button type="button" disabled={actingId === r.request_id} onClick={() => act(r.request_id, 'CANCEL')} className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#B91C1C' }}>
                  <X size={12} strokeWidth={2.5} /> {actingId === r.request_id ? 'Cancelling…' : 'Cancel'}
                </button>
              </div>
            ) : <StatusBadge status={r.request_status} />}
          </div>
        ))}
      </Section>

      {history.length > 0 && (
        <Section icon={Clock} title="Past received" count={history.length}>
          {history.map((r) => (
            <div key={r.request_id} className="flex items-center justify-between gap-3 py-2.5" style={{ borderTop: '1px solid var(--c-line)' }}>
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={r.counterparty?.name} size={38} tint="var(--c-bg)" color="var(--c-muted)" />
                <div className="text-sm font-bold truncate">{r.counterparty?.name || 'Unknown'}</div>
              </div>
              <StatusBadge status={r.request_status} />
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
