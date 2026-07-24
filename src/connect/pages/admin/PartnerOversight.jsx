import { useEffect, useState } from 'react';
import { Card, Alert } from '../../components/Card';
import { adminListPartners, adminGetPartnerProfile, adminSetVetting } from '../../services/connectAdminApi';

// Read-only oversight (every partner channel, any profile_status) + the vetting queue —
// the fix for EC-10 (nothing previously ever moved a claim to VETTED, so verification_tier
// was always TIER_0 and tier-gated matching silently excluded everyone). Verified live:
// approving a claim here recomputes and persists verification_tier immediately (BR-17).
export default function PartnerOversight() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null); // channel_id being drilled into
  const [profile, setProfile] = useState(null);
  const [actionError, setActionError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    const filters = { limit: 50 };
    if (query) filters.q = query;
    if (profileStatus) filters.profile_status = profileStatus;
    adminListPartners(filters)
      .then((r) => { setItems(r.items || []); setTotal(r.pagination?.total || 0); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openPartner = (channelId) => {
    setSelected(channelId);
    setProfile(null);
    setActionError(null);
    adminGetPartnerProfile(channelId).then(setProfile).catch((e) => setActionError(e.message));
  };

  const setClaim = async (claim, status) => {
    setActionError(null);
    try {
      const updated = await adminSetVetting(selected, { claim, status });
      setProfile(updated);
      load(); // refresh the list row's tier/pending-count too
    } catch (e) {
      setActionError(e.message);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-1 text-slate-900">Partners & Vetting</h1>
      <p className="text-sm text-slate-500 mb-4">Every partner channel, any profile status. Click a row to review and approve vetting claims.</p>

      <div className="flex gap-2 mb-4">
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          placeholder="Search by name…"
          className="px-3 py-2 rounded-lg text-sm border border-slate-300 flex-1 max-w-xs"
        />
        <select value={profileStatus} onChange={(e) => setProfileStatus(e.target.value)} className="px-3 py-2 rounded-lg text-sm border border-slate-300">
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <button type="button" onClick={load} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--c-teal, #00B09B)', color: '#fff' }}>
          Filter
        </button>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        <Card className="!p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Entity</th>
                <th className="px-4 py-2.5">Profile</th>
                <th className="px-4 py-2.5">Tier</th>
                <th className="px-4 py-2.5">Pending vetting</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr
                  key={p.channel_id}
                  onClick={() => openPartner(p.channel_id)}
                  className={`border-b border-slate-50 cursor-pointer hover:bg-slate-50 ${selected === p.channel_id ? 'bg-slate-50' : ''}`}
                >
                  <td className="px-4 py-2.5 font-medium text-slate-800">{p.name || '—'}</td>
                  <td className="px-4 py-2.5 text-slate-500">{p.entity_type || '—'}</td>
                  <td className="px-4 py-2.5">{p.profile_status}</td>
                  <td className="px-4 py-2.5">{p.verification_tier}</td>
                  <td className="px-4 py-2.5">
                    {p.pending_vetting_count > 0
                      ? <span className="font-bold" style={{ color: '#b45309' }}>{p.pending_vetting_count}</span>
                      : <span className="text-slate-300">0</span>}
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No partners match this filter.</td></tr>
              )}
            </tbody>
          </table>
          <div className="px-4 py-2 text-[11px] text-slate-400 border-t border-slate-100">{total} total</div>
        </Card>

        <Card>
          {!selected && <div className="text-sm text-slate-400 py-6 text-center">Select a partner to review vetting claims.</div>}
          {selected && !profile && !actionError && <div className="text-sm text-slate-400">Loading…</div>}
          {actionError && <Alert tone="error">{actionError}</Alert>}
          {profile && (
            <div>
              <div className="font-bold text-slate-800 mb-1">{profile.legal?.legal_name || 'Profile'}</div>
              <div className="text-[12px] text-slate-500 mb-4">Tier: <b>{profile.verification_tier}</b></div>
              {(profile.vetting || []).length === 0 && <div className="text-sm text-slate-400">No vetting claims submitted.</div>}
              {(profile.vetting || []).map((v) => (
                <div key={v.claim} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">{v.claim}</div>
                    <div className="text-[11px] text-slate-400">{v.document_id}</div>
                  </div>
                  {v.vet_status === 'VETTED' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-1 rounded" style={{ background: 'var(--c-gs, #e6f7f0)', color: 'var(--c-green, #1cc075)' }}>VETTED</span>
                      <button type="button" onClick={() => setClaim(v.claim, 'PENDING')} className="text-[11px] font-semibold underline text-slate-400">revert</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setClaim(v.claim, 'VETTED')} className="text-[12px] font-bold px-3 py-1.5 rounded-lg" style={{ background: 'var(--c-teal, #00B09B)', color: '#fff' }}>
                      Approve
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
