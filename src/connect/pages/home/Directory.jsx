import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, Mail, Lock, Handshake, CheckCircle2, ShieldCheck, Wallet, Link2, MapPin, UserRound } from 'lucide-react';
import { Card, Alert, PageHeader, Avatar } from '../../components/Card';
import { useConnectState } from '../../state/ConnectContext';
import { listDirectory, sendConnectRequest, cancelRequest, listRequests, listPartners } from '../../services/connectApi';

// BR-11 contact gate + BR-12 send-request, both wired to the real API. BR-21 (confirmed
// 2026-07-22): the gate is satisfied by construction here — there's only one "Connect"
// action in this whole screen, backed by one endpoint, so there's no second, ungated path
// the way the demo prototype's Matches screen briefly had before that was fixed.
//
// Previously "already requested" state only lived in local React state, set on a successful
// send — it never reflected reality across a reload, so re-clicking "Send Connect Request" on
// an already-pending target just re-hit the real API, which correctly 409s
// ("a pending request to this channel already exists"), while the button itself never
// changed. Fixed: load the caller's own sent requests (now a real endpoint,
// GET /connect/:channelId/requests) and key off that instead, with a real Cancel action.
//
// Separately: ListDirectory/directoryEntry (alpha-api's app/services/connect/directory.go)
// compute can_connect purely from the CALLER's own contact-visibility gate (BR-11) — they
// don't check ChannelRelationship at all, so a channel you're already an ACTIVE partner with
// still shows can_connect:true with a live "Send Connect Request" button, and SendRequest only
// blocks a duplicate *pending* request, not a request against an already-partnered channel.
// Fixed client-side (no backend change): cross-reference GET /connect/partners and treat an
// already-partnered channel as its own state, taking priority over "pending"/"connectable".
export default function Directory() {
  const { channelId } = useConnectState();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  // channel_id -> request_id, for this caller's own PENDING sent requests
  const [pendingByTarget, setPendingByTarget] = useState({});
  // channel_id set, for channels with an already-ACTIVE partnership
  const [partneredIds, setPartneredIds] = useState(new Set());
  const [actingId, setActingId] = useState(null);

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
      .catch(() => {}); // non-fatal — directory still usable, just without accurate "requested" state
  }, [channelId]);

  const loadPartners = useCallback(() => {
    if (!channelId) return;
    listPartners(channelId)
      .then((r) => {
        const ids = new Set((r.items || []).filter((p) => p.counterparty?.channel_id).map((p) => p.counterparty.channel_id));
        setPartneredIds(ids);
      })
      .catch(() => {}); // non-fatal — directory still usable, just without the "already partners" state
  }, [channelId]);

  useEffect(() => {
    if (!channelId) return;
    listDirectory(channelId, query ? { q: query } : {})
      .then((r) => setEntries(r.items || []))
      .catch((e) => setError(e.message));
  }, [channelId, query]);

  useEffect(() => { loadRequests(); loadPartners(); }, [loadRequests, loadPartners]);

  const connect = async (targetChannelId) => {
    setActionError(null);
    setActingId(targetChannelId);
    try {
      const result = await sendConnectRequest(channelId, { toChannelId: targetChannelId });
      setPendingByTarget((prev) => ({ ...prev, [targetChannelId]: result.request_id }));
    } catch (e) {
      // If it turns out a request already existed (e.g. sent from another device/tab since
      // this page loaded), re-sync from the server instead of just showing a stale error.
      setActionError(e.message);
      loadRequests();
    } finally {
      setActingId(null);
    }
  };

  const cancel = async (targetChannelId) => {
    const requestId = pendingByTarget[targetChannelId];
    if (!requestId) return;
    setActionError(null);
    setActingId(targetChannelId);
    try {
      await cancelRequest(channelId, requestId);
      setPendingByTarget((prev) => { const next = { ...prev }; delete next[targetChannelId]; return next; });
    } catch (e) {
      setActionError(e.message);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        icon={Search}
        title="Partner Directory"
        subtitle="Browse and connect with organisations on the network"
        action={(
          <div className="relative w-52">
            <Search size={15} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--c-muted)' }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="w-full pl-9 pr-3 py-2 rounded-lg text-sm" style={{ border: '1.5px solid var(--c-line)' }} />
          </div>
        )}
      />
      {error && <Alert tone="warning">{error}</Alert>}
      {actionError && <Alert tone="error">{actionError}</Alert>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((e) => {
          const isPartnered = partneredIds.has(e.channel_id);
          const isPending = !!pendingByTarget[e.channel_id];
          const busy = actingId === e.channel_id;
          return (
            <Card key={e.channel_id} className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={e.name} size={44} />
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate">{e.name}</div>
                  <div className="text-[11px] truncate" style={{ color: 'var(--c-muted)' }}>{e.entity_type} · {e.state || '—'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg" style={{ background: 'var(--c-bs)', color: 'var(--c-blue)' }}>
                  <Wallet size={11} strokeWidth={2} /> {e.aum > 0 ? `₹${e.aum} Cr` : 'AUM N/A'}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg" style={{ background: 'var(--c-ts)', color: 'var(--c-teal-d)' }}>
                  <ShieldCheck size={11} strokeWidth={2} /> {e.verification_tier}
                </span>
              </div>
              <div className="flex-1 mb-3">
                {e.contact ? (
                  <div className="text-xs space-y-1 rounded-lg p-2.5" style={{ background: 'var(--c-bg)' }}>
                    {/* Which fields appear here is driven by the partner's own onboarding
                        visibility choices (pub/req/priv) — the backend only sends the ones this
                        caller is allowed to see, so each is rendered conditionally. */}
                    {(e.contact.person_name || e.contact.designation) && (
                      <div className="flex items-center gap-1.5 truncate">
                        <UserRound size={12} strokeWidth={2} style={{ color: 'var(--c-muted)' }} />
                        {[e.contact.person_name, e.contact.designation].filter(Boolean).join(' · ')}
                        {e.contact.department ? <span style={{ color: 'var(--c-muted)' }}> · {e.contact.department}</span> : null}
                      </div>
                    )}
                    {e.contact.mobile && <div className="flex items-center gap-1.5"><Phone size={12} strokeWidth={2} style={{ color: 'var(--c-muted)' }} /> {e.contact.mobile}</div>}
                    {e.contact.email && <div className="flex items-center gap-1.5 truncate"><Mail size={12} strokeWidth={2} style={{ color: 'var(--c-muted)' }} /> {e.contact.email}</div>}
                    {e.contact.linkedin && <div className="flex items-center gap-1.5 truncate"><Link2 size={12} strokeWidth={2} style={{ color: 'var(--c-muted)' }} /> {e.contact.linkedin}</div>}
                    {e.contact.territory && <div className="flex items-center gap-1.5 truncate"><MapPin size={12} strokeWidth={2} style={{ color: 'var(--c-muted)' }} /> {e.contact.territory}</div>}
                    {e.contact_pending_connect && (
                      <div className="flex items-start gap-1.5 pt-1 mt-1" style={{ color: 'var(--c-muted)', borderTop: '1px solid var(--c-line)' }}>
                        <Lock size={11} strokeWidth={2} className="flex-shrink-0 mt-0.5" /> More contact details unlock once you connect.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-1.5 text-[11px] rounded-lg p-2.5" style={{ background: 'var(--c-as)', color: 'var(--c-amber)' }}>
                    <Lock size={12} strokeWidth={2} className="flex-shrink-0 mt-0.5" /> {e.contact_locked_reason}
                  </div>
                )}
              </div>
              {isPartnered ? (
                <button type="button" onClick={() => navigate(`/connect/partners/${e.channel_id}`)} className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg" style={{ background: 'var(--c-gs)', color: 'var(--c-green)' }}>
                  <Handshake size={14} strokeWidth={2} /> Already Partners — View
                </button>
              ) : isPending ? (
                <div className="flex gap-2">
                  <span className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg" style={{ background: 'var(--c-as)', color: 'var(--c-amber)' }}>
                    <CheckCircle2 size={13} strokeWidth={2} /> Requested
                  </span>
                  <button type="button" disabled={busy} onClick={() => cancel(e.channel_id)} className="connect-btn-outline px-3 py-2.5 text-xs">
                    {busy ? '…' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!e.can_connect || busy}
                  onClick={() => connect(e.channel_id)}
                  className="connect-btn-primary w-full py-2.5 text-xs"
                >
                  {busy ? 'Sending…' : e.can_connect ? 'Send Connect Request' : 'Restricted'}
                </button>
              )}
            </Card>
          );
        })}
        {entries.length === 0 && !error && (
          <Card className="sm:col-span-2 lg:col-span-3 flex flex-col items-center gap-2 py-10 text-center">
            <Search size={24} strokeWidth={1.5} style={{ color: 'var(--c-faint)' }} />
            <div className="text-sm" style={{ color: 'var(--c-muted)' }}>No organisations found{query ? ` for “${query}”` : ''}.</div>
          </Card>
        )}
      </div>
    </div>
  );
}
