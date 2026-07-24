import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Plus, Building2, ClipboardList, Target, Inbox, Handshake, ShieldCheck,
  ChevronRight, Sparkles, TrendingUp,
} from 'lucide-react';
import { Card, Alert } from '../../components/Card';
import { useConnectState } from '../../state/ConnectContext';
import { useTenantConfig } from '../../state/TenantContext';
import { getProfile, listRequirements, listRequests, listPartners, listMatches, listDirectory } from '../../services/connectApi';

// Circular completion gauge for the feature tile.
function ProgressRing({ percent, size = 108, stroke = 10 }) {
  const pct = Math.min(100, Math.max(0, percent || 0));
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="#fff" strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ color: '#fff' }}>
        <span className="text-2xl font-extrabold">{pct}%</span>
        <span className="text-[10px] font-semibold opacity-80">complete</span>
      </div>
    </div>
  );
}

const avatarInitial = (s) => (s || '?').trim().charAt(0).toUpperCase();

export default function Dashboard() {
  const { channelId, entityType, primaryRole, name, businessName } = useConnectState();
  const { tenant } = useTenantConfig();
  const [profile, setProfile] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [partners, setPartners] = useState([]);
  const [topMatches, setTopMatches] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [discover, setDiscover] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!channelId) return;
    getProfile(channelId).then(setProfile).catch((e) => setError(e.message));
    listRequirements({ channel_id: channelId }).then((r) => setRequirements(r.items || [])).catch(() => {});
    listRequests(channelId)
      .then((r) => setPendingCount((r.items || []).filter((i) => i.direction === 'received' && i.request_status === 'PENDING').length))
      .catch(() => {});
    listPartners(channelId).then((r) => setPartners(r.items || [])).catch(() => {});
    listMatches(channelId)
      .then((r) => {
        const flat = (r.items || []).flatMap((g) => g.matches || []);
        flat.sort((a, b) => (b.score || 0) - (a.score || 0));
        setMatchCount(flat.length);
        setTopMatches(flat.slice(0, 2));
      })
      .catch(() => {});
    listDirectory(channelId, {}).then((r) => setDiscover((r.items || []).slice(0, 8))).catch(() => {});
  }, [channelId]);

  if (!channelId) {
    return <Alert tone="warning">No channel identity yet — <Link to="/connect/join" className="underline font-semibold">complete onboarding</Link> first.</Alert>;
  }

  const displayName = name || businessName || 'Your account';
  const firstName = displayName.split(' ')[0];
  const completionPct = profile?.completion?.percent ?? 0;
  const isPublished = profile?.profile_status === 'PUBLISHED';
  const ringPct = isPublished ? 100 : completionPct;
  const stages = profile?.completion?.stages || [];
  const companyCta = isPublished ? 'View company page' : completionPct > 0 ? 'Continue setup' : 'Start setup';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--c-ink)' }}>{greeting}, {firstName}</h1>
          {businessName && <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--c-muted)' }}>{businessName}</div>}
        </div>
        <span className="text-sm font-semibold hidden sm:block" style={{ color: 'var(--c-muted)' }}>{tenant?.TENANT_NAME || 'Fingrid Connect'}</span>
      </div>
      {error && <Alert tone="warning">{error} — showing what's available locally.</Alert>}

      {/* Bento grid. Fixed row height only kicks in at lg (where the asymmetric tiling matters);
          on smaller screens every tile is natural height and simply stacks, so nothing clips. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:auto-rows-[172px] grid-flow-row-dense">

        {/* Feature tile — company status. Spans 2×2 on desktop. */}
        <div
          className="sm:col-span-2 lg:col-span-2 lg:row-span-2 rounded-2xl p-5 flex flex-col text-white overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--c-blue) 0%, var(--c-teal-d) 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide opacity-90">
              <Building2 size={15} strokeWidth={2.5} /> Company Status
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,.2)' }}>
              {isPublished ? 'PUBLISHED' : 'DRAFT'}
            </span>
          </div>

          <div className="flex items-center gap-5 my-auto py-4">
            <ProgressRing percent={ringPct} />
            <div className="min-w-0">
              <div className="text-lg font-extrabold truncate">{businessName || displayName}</div>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {(entityType || primaryRole) && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,.2)' }}>{entityType || primaryRole}</span>
                )}
                {profile?.verification_tier && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(255,255,255,.2)' }}>
                    <ShieldCheck size={11} strokeWidth={2.5} /> {profile.verification_tier}
                  </span>
                )}
              </div>
              {/* Stage dots */}
              {stages.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3">
                  {stages.map((s) => (
                    <span key={s.name} title={s.name} className="w-2.5 h-2.5 rounded-full" style={{ background: s.done ? '#fff' : 'rgba(255,255,255,.35)' }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link
            to="/connect/company"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-colors"
            style={{ background: '#fff', color: 'var(--c-blue)' }}
          >
            {companyCta} <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Matches stat */}
        <Link to="/connect/matches" className="rounded-2xl p-5 flex flex-col justify-between overflow-hidden transition-shadow hover:shadow-md" style={{ background: 'var(--c-ts)', border: '1px solid var(--c-tm)' }}>
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fff', color: 'var(--c-teal-d)' }}>
              <Target size={19} strokeWidth={2} />
            </span>
            <ChevronRight size={16} strokeWidth={2} style={{ color: 'var(--c-teal-d)' }} />
          </div>
          <div>
            <div className="text-3xl font-extrabold leading-none" style={{ color: 'var(--c-teal-d)' }}>{matchCount}</div>
            <div className="text-xs font-semibold mt-1" style={{ color: 'var(--c-slate)' }}>Matches</div>
          </div>
        </Link>

        {/* Requests stat */}
        <Link to="/connect/requests" className="rounded-2xl p-5 flex flex-col justify-between overflow-hidden transition-shadow hover:shadow-md" style={{ background: 'var(--c-as)', border: '1px solid #FDDFA8' }}>
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fff', color: 'var(--c-amber)' }}>
              <Inbox size={19} strokeWidth={2} />
            </span>
            <ChevronRight size={16} strokeWidth={2} style={{ color: 'var(--c-amber)' }} />
          </div>
          <div>
            <div className="text-3xl font-extrabold leading-none" style={{ color: 'var(--c-amber)' }}>{pendingCount}</div>
            <div className="text-xs font-semibold mt-1" style={{ color: 'var(--c-slate)' }}>Pending requests</div>
          </div>
        </Link>

        {/* Partners strip — spans 2 cols under the two stat tiles */}
        <Link to="/connect/partners" className="sm:col-span-2 lg:col-span-2 transition-shadow hover:shadow-md">
          <Card className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-bold"><Handshake size={15} strokeWidth={2} /> Your partners</div>
              <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--c-teal-d)' }}>View all <ChevronRight size={13} strokeWidth={2} /></span>
            </div>
            {partners.length === 0 ? (
              <div className="text-xs" style={{ color: 'var(--c-muted)' }}>No partners yet — accept a connect request to build your network.</div>
            ) : (
              <div className="flex items-center gap-2">
                {partners.slice(0, 6).map((p) => (
                  <span key={p.relationship_id} title={p.counterparty?.name} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'var(--c-gs)', color: 'var(--c-green)', border: '2px solid #fff', boxShadow: 'var(--c-sh)' }}>
                    {avatarInitial(p.counterparty?.name)}
                  </span>
                ))}
                {partners.length > 6 && (
                  <span className="text-xs font-bold" style={{ color: 'var(--c-muted)' }}>+{partners.length - 6}</span>
                )}
                <span className="text-xs font-semibold ml-1" style={{ color: 'var(--c-slate)' }}>{partners.length} active</span>
              </div>
            )}
          </Card>
        </Link>

        {/* Requirements — spans 2 cols */}
        <div className="sm:col-span-2 lg:col-span-2">
          <Card className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-bold"><ClipboardList size={15} strokeWidth={2} /> Requirements</div>
              <Link to="/connect/requirements" className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--c-teal-d)' }}>View all <ChevronRight size={13} strokeWidth={2} /></Link>
            </div>
            {requirements.length === 0 ? (
              <div className="text-xs" style={{ color: 'var(--c-muted)' }}>No requirements yet — post one to get auto-matched.</div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-3xl font-extrabold" style={{ color: 'var(--c-ink)' }}>{requirements.length}</div>
                <div className="text-xs" style={{ color: 'var(--c-muted)' }}>partnership requirement{requirements.length > 1 ? 's' : ''} posted</div>
              </div>
            )}
            <Link to="/connect/requirements/new" className="connect-btn-outline flex items-center justify-center gap-1.5 py-2 text-sm">
              <Plus size={14} strokeWidth={2} /> Post a Requirement
            </Link>
          </Card>
        </div>

        {/* Top matches — spans 2 cols */}
        <div className="sm:col-span-2 lg:col-span-2">
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-sm font-bold"><TrendingUp size={15} strokeWidth={2} /> Top matches</div>
              <Link to="/connect/matches" className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--c-teal-d)' }}>View all <ChevronRight size={13} strokeWidth={2} /></Link>
            </div>
            {topMatches.length === 0 ? (
              <div className="flex-1 flex items-center text-xs" style={{ color: 'var(--c-muted)' }}>
                {requirements.length === 0 ? 'Post a requirement and candidates ranked by fit will appear here.' : 'No matches yet — check back shortly.'}
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center">
                {topMatches.map((m) => (
                  <div key={m.match_id} className="flex items-center justify-between py-1.5" style={{ borderTop: '1px solid var(--c-line)' }}>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{m.name}</div>
                      <div className="text-[10px]" style={{ color: 'var(--c-muted)' }}>{m.entity_type} · {m.state || '—'}</div>
                    </div>
                    <span className="text-sm font-extrabold flex-shrink-0 ml-2" style={{ color: 'var(--c-teal-d)' }}>{m.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Discover — full-width horizontal scroller */}
        <div className="sm:col-span-2 lg:col-span-4 lg:row-auto">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-sm font-bold"><Sparkles size={15} strokeWidth={2} /> Discover partners</div>
              <Link to="/connect/directory" className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--c-teal-d)' }}>Browse directory <ChevronRight size={13} strokeWidth={2} /></Link>
            </div>
            {discover.length === 0 ? (
              <div className="text-xs py-2" style={{ color: 'var(--c-muted)' }}>No organisations to show yet — published partners across the network will appear here.</div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                {discover.map((d) => (
                  <Link
                    key={d.channel_id}
                    to="/connect/directory"
                    className="flex-shrink-0 w-44 rounded-xl p-3.5 transition-colors"
                    style={{ background: 'var(--c-bg)', border: '1px solid var(--c-line)' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'var(--c-bs)', color: 'var(--c-blue)' }}>
                        {avatarInitial(d.name)}
                      </span>
                      <div className="text-xs font-bold truncate">{d.name}</div>
                    </div>
                    <div className="text-[10px] mb-1 truncate" style={{ color: 'var(--c-muted)' }}>{d.entity_type} · {d.state || '—'}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px]" style={{ color: 'var(--c-muted)' }}>{d.aum > 0 ? `₹${d.aum} Cr` : 'AUM N/A'}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--c-bs)', color: 'var(--c-blue)' }}>{d.verification_tier}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
