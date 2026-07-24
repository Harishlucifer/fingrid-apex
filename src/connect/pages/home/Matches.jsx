import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, Handshake, Target, ShieldCheck } from 'lucide-react';
import { Card, Alert, PageHeader, Avatar } from '../../components/Card';
import { useConnectState } from '../../state/ConnectContext';
import { listMatches, sendConnectRequest, listRequests, listPartners } from '../../services/connectApi';
import { PARTNERSHIP_TYPES } from '../../data/lookups';

const typeLabel = (key) => PARTNERSHIP_TYPES.find((t) => t.key === key)?.label || key || 'Requirement';
// Ranked colour for the fit score — high fit reads green, mid teal, low muted.
const scoreColor = (s) => (s >= 70 ? 'var(--c-green)' : s >= 40 ? 'var(--c-teal-d)' : 'var(--c-muted)');
const BREAKDOWN = [
  { key: 'geo', label: 'Geography', max: 30 },
  { key: 'product', label: 'Product', max: 25 },
  { key: 'ticket', label: 'Ticket', max: 25 },
  { key: 'tier', label: 'Tier', max: 20 },
];

// BR-08/09 read side. Note surfaced inline (not hidden): match_status will always read
// SUGGESTED — EC-05 (the cron's hard delete-and-recreate) is still unresolved, so nothing
// ever transitions it, and the earlier prototype-only "Requested ✓" demo state does not
// persist here the way it appeared to client-side — this screen reflects the real gap.
//
// Same already-partnered/already-pending gap Directory.jsx had (see its header comment):
// alpha-api's match candidates aren't filtered against existing relationships or pending
// requests either (confirmed live — a channel already ACTIVE-partnered with the caller still
// appears as a "Connect"-able match, and SendRequest only blocks a duplicate *pending* request,
// not one against an already-partnered channel). Fixed the same way: cross-reference
// GET /connect/partners and GET /connect/:channelId/requests client-side.
export default function Matches() {
  const { channelId } = useConnectState();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);
  const [pendingByTarget, setPendingByTarget] = useState({});
  const [partneredIds, setPartneredIds] = useState(new Set());

  const loadRequests = useCallback(() => {
    if (!channelId) return;
    listRequests(channelId)
      .then((r) => {
        const map = {};
        (r.items || []).forEach((req) => {
          if (req.direction === 'sent' && req.request_status === 'PENDING' && req.counterparty?.channel_id) {
            map[req.counterparty.channel_id] = req.request_id;
          }
        });
        setPendingByTarget(map);
      })
      .catch(() => {});
  }, [channelId]);

  const loadPartners = useCallback(() => {
    if (!channelId) return;
    listPartners(channelId)
      .then((r) => {
        const ids = new Set((r.items || []).filter((p) => p.counterparty?.channel_id).map((p) => p.counterparty.channel_id));
        setPartneredIds(ids);
      })
      .catch(() => {});
  }, [channelId]);

  useEffect(() => {
    if (!channelId) return;
    listMatches(channelId).then((r) => setGroups(r.items || [])).catch((e) => setError(e.message));
  }, [channelId]);

  useEffect(() => { loadRequests(); loadPartners(); }, [loadRequests, loadPartners]);

  const connect = async (toChannelId, requirementId) => {
    setActingId(toChannelId);
    try {
      const result = await sendConnectRequest(channelId, { toChannelId, requirementId });
      setPendingByTarget((prev) => ({ ...prev, [toChannelId]: result.request_id }));
    } catch (e) {
      setError(e.message);
      loadRequests();
    } finally {
      setActingId(null);
    }
  };

  const totalMatches = groups.reduce((sum, g) => sum + (g.matches?.length || 0), 0);

  return (
    <div>
      <PageHeader
        icon={Target}
        title="My Matches"
        subtitle={totalMatches > 0 ? `${totalMatches} candidate${totalMatches > 1 ? 's' : ''} auto-matched to your requirements` : 'Auto-matched candidates ranked by fit'}
      />
      {error && <Alert tone="warning">{error}</Alert>}
      {groups.length === 0 && !error && (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <Target size={26} strokeWidth={1.5} style={{ color: 'var(--c-faint)' }} />
          <div className="text-sm font-semibold" style={{ color: 'var(--c-slate)' }}>No matches yet</div>
          <div className="text-xs max-w-xs" style={{ color: 'var(--c-muted)' }}>Post a requirement and candidates ranked by geography, product fit, ticket size and tier will appear here.</div>
        </Card>
      )}
      {groups.map((g) => (
        <div key={g.requirement_id} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'var(--c-ts)', color: 'var(--c-teal-d)' }}>{typeLabel(g.partnership_type)}</span>
            <span className="text-xs" style={{ color: 'var(--c-muted)' }}>{g.matches.length} candidate{g.matches.length > 1 ? 's' : ''}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {g.matches.map((m) => {
              const isPartnered = partneredIds.has(m.channel_id);
              const isPending = !!pendingByTarget[m.channel_id];
              const busy = actingId === m.channel_id;
              const bd = m.breakdown || {};
              return (
                <Card key={m.match_id} className="flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar name={m.name} size={44} tint="var(--c-ts)" color="var(--c-teal-d)" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold truncate">{m.name}</div>
                      <div className="text-[11px] truncate" style={{ color: 'var(--c-muted)' }}>{m.entity_type} · {m.state || '—'}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-extrabold leading-none" style={{ color: scoreColor(m.score) }}>{m.score}%</div>
                      <div className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>fit</div>
                    </div>
                  </div>

                  {/* Fit breakdown mini-bars */}
                  <div className="space-y-1.5 mb-3">
                    {BREAKDOWN.map((b) => {
                      const val = bd[b.key] || 0;
                      return (
                        <div key={b.key} className="flex items-center gap-2">
                          <span className="text-[10px] w-14 flex-shrink-0" style={{ color: 'var(--c-muted)' }}>{b.label}</span>
                          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--c-line)' }}>
                            <div className="h-full rounded-full" style={{ width: `${(val / b.max) * 100}%`, background: 'var(--c-teal)' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] mb-3" style={{ color: 'var(--c-muted)' }}>
                    <ShieldCheck size={12} strokeWidth={2} /> {m.verification_tier}{m.vetted ? ' · Vetted' : ''}
                  </div>

                  <div className="mt-auto">
                    {isPartnered ? (
                      <span className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg" style={{ background: 'var(--c-gs)', color: 'var(--c-green)' }}>
                        <Handshake size={13} strokeWidth={2} /> Already Partners
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled={!m.can_connect || isPending || busy}
                          onClick={() => connect(m.channel_id, g.requirement_id)}
                          className="connect-btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
                        >
                          {isPending ? (<><CheckCircle2 size={13} strokeWidth={2} /> Requested</>) : busy ? 'Sending…' : m.can_connect ? 'Connect' : 'Restricted'}
                        </button>
                        {/* Match entries carry no per-candidate reason the way Directory's
                            contact_locked_reason does — same underlying rule (BR-11), so the same
                            static explanation applies regardless of which candidate this is. */}
                        {!m.can_connect && (
                          <div className="text-[10px] mt-1.5 text-center" style={{ color: 'var(--c-muted)' }}>
                            Connect requests currently require Lender status with AUM ≥ ₹100 Cr.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
