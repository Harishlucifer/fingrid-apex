import { useEffect, useState } from 'react';
import { Card, Alert } from '../../components/Card';
import { adminListRequirements, adminSetRequirementStatus } from '../../services/connectAdminApi';

// Moderate listings — every requirement regardless of listing_status/visibility (the partner-
// facing marketplace GET /connect/requirement only shows LIVE+PUBLIC when unscoped). Force
// Draft / Force Close bypass the owner-only checks in CloseRequirement — admin override.
export default function RequirementModeration() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [listingStatus, setListingStatus] = useState('');
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setError(null);
    const filters = { limit: 50 };
    if (listingStatus) filters.listing_status = listingStatus;
    adminListRequirements(filters)
      .then((r) => { setItems(r.items || []); setTotal(r.pagination?.total || 0); })
      .catch((e) => setError(e.message));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const act = async (requirementId, status) => {
    setActionError(null);
    setBusyId(requirementId);
    try {
      await adminSetRequirementStatus(requirementId, { status, reason: 'admin moderation' });
      load();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-1 text-slate-900">Requirement Moderation</h1>
      <p className="text-sm text-slate-500 mb-4">Every listing platform-wide, any status. Force Draft unpublishes; Force Close is terminal (same as the partner's own Close action).</p>

      <div className="flex gap-2 mb-4">
        <select value={listingStatus} onChange={(e) => setListingStatus(e.target.value)} className="px-3 py-2 rounded-lg text-sm border border-slate-300">
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="LIVE">Live</option>
          <option value="MATCHED">Matched</option>
          <option value="CLOSED">Closed</option>
        </select>
        <button type="button" onClick={load} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--c-teal, #00B09B)', color: '#fff' }}>
          Filter
        </button>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {actionError && <Alert tone="error">{actionError}</Alert>}

      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <th className="px-4 py-2.5">Owner</th>
              <th className="px-4 py-2.5">Type</th>
              <th className="px-4 py-2.5">Context</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Matches</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.requirement_id} className="border-b border-slate-50">
                <td className="px-4 py-2.5 font-medium text-slate-800">{r.channel?.name || r.channel_id}</td>
                <td className="px-4 py-2.5 text-slate-500">{r.partnership_type}</td>
                <td className="px-4 py-2.5 text-slate-500 max-w-xs truncate" title={r.context}>{r.context}</td>
                <td className="px-4 py-2.5">{r.listing_status}</td>
                <td className="px-4 py-2.5">{r.match_count}</td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                  {r.listing_status !== 'DRAFT' && r.listing_status !== 'CLOSED' && (
                    <button type="button" disabled={busyId === r.requirement_id} onClick={() => act(r.requirement_id, 'DRAFT')} className="text-[11px] font-semibold underline text-slate-500 mr-3">
                      Force Draft
                    </button>
                  )}
                  {r.listing_status !== 'CLOSED' && (
                    <button type="button" disabled={busyId === r.requirement_id} onClick={() => act(r.requirement_id, 'CLOSED')} className="text-[11px] font-bold px-2.5 py-1 rounded" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
                      Force Close
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No requirements match this filter.</td></tr>
            )}
          </tbody>
        </table>
        <div className="px-4 py-2 text-[11px] text-slate-400 border-t border-slate-100">{total} total</div>
      </Card>
    </div>
  );
}
