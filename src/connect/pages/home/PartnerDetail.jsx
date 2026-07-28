import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Handshake, CheckCircle2, Phone, Mail, Lock, Link2, MapPin, UserRound } from 'lucide-react';
import { Card, CardHeader, Alert } from '../../components/Card';
import { useConnectState } from '../../state/ConnectContext';
import { getDirectoryEntry, listPartners } from '../../services/connectApi';

// Partner detail — GET /connect/directory/:channelId gives the same channel-detail read used
// by Directory.jsx (contact gated by BR-11), which is all the information alpha-api exposes
// per-channel; there's no separate "relationship detail" endpoint (see Partners.jsx's header
// comment). Relationship-specific fields (type/status/connected_at) come from the row Partners.jsx
// already fetched — passed via navigation state so this doesn't need to re-list and search for
// it, but falls back to a fresh listPartners() call if opened directly (e.g. a reload).
export default function PartnerDetail() {
  const { channelId: targetChannelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { channelId } = useConnectState();
  const [entry, setEntry] = useState(null);
  const [relationship, setRelationship] = useState(location.state?.relationship || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channelId || !targetChannelId) return;
    setLoading(true);
    getDirectoryEntry(targetChannelId, channelId)
      .then(setEntry)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [channelId, targetChannelId]);

  useEffect(() => {
    if (relationship || !channelId) return;
    listPartners(channelId)
      .then((r) => {
        const match = (r.items || []).find((p) => p.counterparty?.channel_id === targetChannelId);
        if (match) setRelationship(match);
      })
      .catch(() => {}); // non-fatal — channel details above still render without this
  }, [relationship, channelId, targetChannelId]);

  if (loading) return <Card className="text-center py-8 text-sm">Loading partner…</Card>;

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-semibold mb-4" style={{ color: 'var(--c-slate)' }}>
        <ArrowLeft size={14} strokeWidth={2} /> Back
      </button>
      {error && <Alert tone="warning">{error}</Alert>}
      {entry && (
        <Card>
          <CardHeader
            icon={<Handshake size={18} strokeWidth={2} style={{ color: 'var(--c-green)' }} />}
            iconBg="var(--c-gs)"
            title={entry.name}
            desc={`${entry.entity_type} · ${entry.state || '—'}`}
          />
          {relationship && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold px-2 py-1 rounded" style={{ background: 'var(--c-gs)', color: 'var(--c-green)' }}>{relationship.relationship_status}</span>
              <span className="text-xs" style={{ color: 'var(--c-muted)' }}>{relationship.relationship_type} · partners since {relationship.connected_at?.slice(0, 10)}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--c-slate)' }}>AUM</div>
              <div className="text-sm font-semibold">{entry.aum > 0 ? `₹${entry.aum} Cr` : 'N/A'}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--c-slate)' }}>Verification tier</div>
              <div className="text-sm font-semibold flex items-center gap-1">{entry.verification_tier} {entry.vetted && <CheckCircle2 size={14} strokeWidth={2} style={{ color: 'var(--c-green)' }} />}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--c-slate)' }}>Staff</div>
              <div className="text-sm font-semibold">{entry.staff ?? '—'}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--c-slate)' }}>Branches</div>
              <div className="text-sm font-semibold">{entry.branches ?? '—'}</div>
            </div>
          </div>
          <div className="pt-3" style={{ borderTop: '1px solid var(--c-line)' }}>
            <div className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--c-slate)' }}>Contact</div>
            {entry.contact ? (
              <div className="text-sm space-y-1">
                {/* Fields rendered per the partner's own onboarding visibility choices — the
                    backend sends only what this caller may see. As an established partner, any
                    "on request" fields the partner set are already unlocked here. */}
                {(entry.contact.person_name || entry.contact.designation) && (
                  <div className="flex items-center gap-1.5">
                    <UserRound size={13} strokeWidth={2} />
                    {[entry.contact.person_name, entry.contact.designation, entry.contact.department].filter(Boolean).join(' · ')}
                  </div>
                )}
                {entry.contact.mobile && <div className="flex items-center gap-1.5"><Phone size={13} strokeWidth={2} /> {entry.contact.mobile}</div>}
                {entry.contact.email && <div className="flex items-center gap-1.5"><Mail size={13} strokeWidth={2} /> {entry.contact.email}</div>}
                {entry.contact.linkedin && <div className="flex items-center gap-1.5"><Link2 size={13} strokeWidth={2} /> {entry.contact.linkedin}</div>}
                {entry.contact.territory && <div className="flex items-center gap-1.5"><MapPin size={13} strokeWidth={2} /> {entry.contact.territory}</div>}
                {entry.contact_pending_connect && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--c-muted)' }}>
                    <Lock size={12} strokeWidth={2} /> Some details are set to unlock only for connected partners.
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--c-amber)' }}>
                <Lock size={13} strokeWidth={2} /> {entry.contact_locked_reason}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
