import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Plus, Target, Radio, Users, MapPin } from 'lucide-react';
import { Card, Alert, PageHeader, StatStrip } from '../../components/Card';
import { useConnectState } from '../../state/ConnectContext';
import { useConnectLookups } from '../../state/LookupsContext';
import { listRequirements, closeRequirement } from '../../services/connectApi';

const STATUS_STYLE = {
  DRAFT: { bg: 'var(--c-bg)', color: 'var(--c-muted)' },
  LIVE: { bg: 'var(--c-gs)', color: 'var(--c-green)' },
  MATCHED: { bg: 'var(--c-bs)', color: 'var(--c-blue)' },
  CLOSED: { bg: 'var(--c-bg)', color: 'var(--c-muted)' },
};

const typeLabel = (key, partnershipTypes) => partnershipTypes.find((t) => t.key === key)?.label || key || 'Requirement';

export default function MyRequirements() {
  const { channelId } = useConnectState();
  const { partnershipTypes } = useConnectLookups();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    if (!channelId) return;
    listRequirements({ channel_id: channelId }).then((r) => setItems(r.items || [])).catch((e) => setError(e.message));
  }, [channelId]);

  useEffect(() => { load(); }, [load]);

  const doClose = async (id) => {
    try {
      // BR-20: manual close — confirmed real, implemented 2026-07-22.
      await closeRequirement(channelId, id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const liveCount = items.filter((r) => r.listing_status === 'LIVE' || r.listing_status === 'MATCHED').length;
  const totalMatches = items.reduce((sum, r) => sum + (r.match_count || 0), 0);

  return (
    <div>
      <PageHeader
        icon={ClipboardList}
        tint="var(--c-ts)"
        color="var(--c-teal-d)"
        title="My Requirements"
        subtitle="Partnership needs you've posted to the network"
        action={<Link to="/connect/requirements/new" className="connect-btn-primary flex items-center gap-1.5 px-4 py-2 text-sm"><Plus size={14} strokeWidth={2} /> New Requirement</Link>}
      />
      {error && <Alert tone="warning">{error}</Alert>}

      {items.length > 0 && (
        <StatStrip items={[
          { label: 'Total posted', value: items.length, icon: ClipboardList, tint: 'var(--c-ts)', color: 'var(--c-teal-d)' },
          { label: 'Live', value: liveCount, icon: Radio, tint: 'var(--c-gs)', color: 'var(--c-green)' },
          { label: 'Total matches', value: totalMatches, icon: Target, tint: 'var(--c-bs)', color: 'var(--c-blue)' },
        ]} />
      )}

      {items.length === 0 && !error ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <ClipboardList size={26} strokeWidth={1.5} style={{ color: 'var(--c-faint)' }} />
          <div className="text-sm font-semibold" style={{ color: 'var(--c-slate)' }}>No requirements yet</div>
          <div className="text-xs max-w-xs" style={{ color: 'var(--c-muted)' }}>Post what kind of partner you're looking for — auto-match runs the moment it goes live.</div>
          <Link to="/connect/requirements/new" className="connect-btn-primary flex items-center gap-1.5 px-4 py-2 text-sm mt-1"><Plus size={14} strokeWidth={2} /> Post a Requirement</Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((r) => {
            const s = STATUS_STYLE[r.listing_status] || STATUS_STYLE.DRAFT;
            const states = r.need?.geography?.states || [];
            return (
              <Card key={r.requirement_id} className="flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--c-ts)', color: 'var(--c-teal-d)' }}>
                      <ClipboardList size={18} strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate">{typeLabel(r.partnership_type, partnershipTypes)}</div>
                      {r.context && <div className="text-[11px] truncate" style={{ color: 'var(--c-muted)' }}>{r.context}</div>}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: s.bg, color: s.color }}>{r.listing_status}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg" style={{ background: 'var(--c-bs)', color: 'var(--c-blue)' }}>
                    <Target size={11} strokeWidth={2} /> {r.match_count || 0} match{(r.match_count || 0) === 1 ? '' : 'es'}
                  </span>
                  {states.length > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg" style={{ background: 'var(--c-bg)', color: 'var(--c-slate)' }}>
                      <MapPin size={11} strokeWidth={2} /> {states.slice(0, 2).join(', ')}{states.length > 2 ? ` +${states.length - 2}` : ''}
                    </span>
                  )}
                  {(r.products || []).length > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg" style={{ background: 'var(--c-bg)', color: 'var(--c-slate)' }}>
                      <Users size={11} strokeWidth={2} /> {r.products.slice(0, 2).join(', ')}{r.products.length > 2 ? ` +${r.products.length - 2}` : ''}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-auto pt-3" style={{ borderTop: '1px solid var(--c-line)' }}>
                  {(r.match_count || 0) > 0 && (
                    <Link to="/connect/matches" className="connect-btn-outline px-3 py-1.5 text-xs">View matches</Link>
                  )}
                  {(r.listing_status === 'LIVE' || r.listing_status === 'MATCHED') && (
                    <button type="button" onClick={() => doClose(r.requirement_id)} className="text-xs font-semibold ml-auto" style={{ color: '#B91C1C' }}>Close</button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
