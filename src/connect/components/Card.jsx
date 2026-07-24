export function Card({ children, className = '', ...props }) {
  return (
    <div className={`connect-card p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

// Matches the shared prototype's .card-top pattern (fingrid-connect-v5.html) — an icon box +
// title + short description sitting above a stage's form fields, inside the card but visually
// separated by a border. Used at the top of each CompanyProfileWizard/RequirementWizard stage.
export function CardHeader({ icon, iconBg = 'var(--c-bs)', title, desc }) {
  return (
    <div className="flex items-start gap-3 pb-3 mb-4" style={{ borderBottom: '1px solid var(--c-line)' }}>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div>
        <div className="text-[15px] font-bold" style={{ color: 'var(--c-ink)' }}>{title}</div>
        {desc && <div className="text-[11px] mt-0.5" style={{ color: 'var(--c-muted)' }}>{desc}</div>}
      </div>
    </div>
  );
}

export function Alert({ tone = 'info', children }) {
  const tones = {
    info: { bg: 'var(--c-bs)', border: 'var(--c-bm)', color: 'var(--c-blue)' },
    success: { bg: 'var(--c-gs)', border: 'var(--c-gm)', color: 'var(--c-green)' },
    warning: { bg: 'var(--c-as)', border: '#FDDFA8', color: 'var(--c-amber)' },
    error: { bg: '#FEF2F2', border: '#FECACA', color: '#B91C1C' },
  };
  const t = tones[tone] || tones.info;
  return (
    <div className="rounded-md px-3.5 py-2.5 text-[12.5px] mb-3" style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.color }}>
      {children}
    </div>
  );
}

// Consistent page header used across every Connect menu — icon chip + title + subtitle on the
// left, an optional action (button/link) on the right. Keeps all list pages visually aligned
// with the bento dashboard.
export function PageHeader({ icon: Icon, tint = 'var(--c-bs)', color = 'var(--c-blue)', title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tint, color }}>
            <Icon size={20} strokeWidth={2} />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold leading-tight" style={{ color: 'var(--c-ink)' }}>{title}</h1>
          {subtitle && <div className="text-sm mt-0.5" style={{ color: 'var(--c-muted)' }}>{subtitle}</div>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// Row of small summary tiles — the bento "stat strip" that heads each list page.
export function StatStrip({ items }) {
  return (
    <div className={`grid grid-cols-2 ${items.length >= 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-3 mb-5`}>
      {items.map((s) => (
        <div key={s.label} className="connect-card p-4 flex items-center gap-3">
          {s.icon && (
            <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.tint || 'var(--c-bs)', color: s.color || 'var(--c-blue)' }}>
              <s.icon size={17} strokeWidth={2} />
            </span>
          )}
          <div className="min-w-0">
            <div className="text-lg font-extrabold leading-none" style={{ color: 'var(--c-ink)' }}>{s.value}</div>
            <div className="text-[11px] font-semibold truncate mt-0.5" style={{ color: 'var(--c-muted)' }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Initial-letter avatar chip, shared by directory / partners / requests rows.
export function Avatar({ name, size = 40, tint = 'var(--c-bs)', color = 'var(--c-blue)' }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <span className="rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{ width: size, height: size, background: tint, color, fontSize: Math.round(size * 0.4) }}>
      {initial}
    </span>
  );
}

export function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--c-slate)' }}>
        {label}{required && <span style={{ color: '#B91C1C' }}> *</span>}
      </label>
      {children}
    </div>
  );
}
