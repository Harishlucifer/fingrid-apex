import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Handshake, ChevronRight, CalendarDays, Users, Landmark, Search } from 'lucide-react';
import { Card, Alert, PageHeader, StatStrip, Avatar } from '../../components/Card';
import { useConnectState } from '../../state/ConnectContext';
import { listPartners } from '../../services/connectApi';

// Group counterparty entity types into the three network segments so the stat strip reads as
// a meaningful breakdown of the partner network rather than one flat total.
const SEGMENT = {
  dsa_ind: 'sourcing', dsa_firm: 'sourcing', lsp: 'sourcing', bc: 'sourcing',
  nbfc: 'lending', bank: 'lending', hfc: 'lending', colender: 'lending',
  verif_agency: 'service', collection_agency: 'service', legal_agency: 'service', property_agency: 'service',
};

// US-09 list view. RelationshipResponse (app/handler/connect/marketplace.go) has no dedicated
// single-relationship detail endpoint — the counterparty's full channel_id is already present
// on every list entry, so PartnerDetail.jsx re-uses GET /connect/directory/:channelId (the
// existing per-channel detail read, gated by the same BR-11 contact rule) instead of adding a
// new backend route for what the list already gives us the key to.
export default function Partners() {
  const { channelId } = useConnectState();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!channelId) return;
    listPartners(channelId).then((r) => setItems(r.items || [])).catch((e) => setError(e.message));
  }, [channelId]);

  const seg = { sourcing: 0, lending: 0, service: 0 };
  items.forEach((p) => { const s = SEGMENT[p.counterparty?.entity_type]; if (s) seg[s] += 1; });

  return (
    <div>
      <PageHeader
        icon={Handshake}
        tint="var(--c-gs)"
        color="var(--c-green)"
        title="My Partners"
        subtitle={items.length > 0 ? `${items.length} active partnership${items.length > 1 ? 's' : ''}` : "Organisations you've connected with"}
      />
      {error && <Alert tone="warning">{error}</Alert>}

      {items.length > 0 && (
        <StatStrip items={[
          { label: 'Total partners', value: items.length, icon: Handshake, tint: 'var(--c-gs)', color: 'var(--c-green)' },
          { label: 'Sourcing', value: seg.sourcing, icon: Search, tint: 'var(--c-bs)', color: 'var(--c-blue)' },
          { label: 'Lending', value: seg.lending, icon: Landmark, tint: 'var(--c-ts)', color: 'var(--c-teal-d)' },
          { label: 'Service', value: seg.service, icon: Users, tint: 'var(--c-as)', color: 'var(--c-amber)' },
        ]} />
      )}
      {items.length === 0 && !error ? (
        <Card className="flex flex-col items-center gap-2 py-12 text-center">
          <Handshake size={26} strokeWidth={1.5} style={{ color: 'var(--c-faint)' }} />
          <div className="text-sm font-semibold" style={{ color: 'var(--c-slate)' }}>No partners yet</div>
          <div className="text-xs max-w-xs" style={{ color: 'var(--c-muted)' }}>Accept a connect request to build your network — established partnerships show up here.</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <Card
              key={p.relationship_id}
              className="flex flex-col cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => p.counterparty?.channel_id && navigate(`/connect/partners/${p.counterparty.channel_id}`, { state: { relationship: p } })}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={p.counterparty?.name} size={44} tint="var(--c-gs)" color="var(--c-green)" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{p.counterparty?.name || '—'}</div>
                    <div className="text-[11px] truncate" style={{ color: 'var(--c-muted)' }}>{p.counterparty?.entity_type || p.relationship_type || '—'}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: 'var(--c-gs)', color: 'var(--c-green)' }}>{p.relationship_status}</span>
              </div>
              <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--c-line)' }}>
                <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--c-muted)' }}>
                  <CalendarDays size={12} strokeWidth={2} /> Partners since {p.connected_at?.slice(0, 10) || '—'}
                </span>
                <ChevronRight size={15} strokeWidth={2} style={{ color: 'var(--c-faint)' }} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
