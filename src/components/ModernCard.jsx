/**
 * ModernCard — Premium animated card component with:
 *  • Gradient animated border on hover
 *  • Shimmer sweep effect
 *  • Icon glow & rotation
 *  • Floating particle decorations
 *  • Animated top accent line
 *  • Corner dot indicator
 *  • Scroll-triggered entrance animation
 */
export default function ModernCard({
  icon,
  title,
  description,
  iconBg = 'bg-gradient-to-br from-blue/10 to-navy/10',
  className = '',
  children,
  index = 0,
}) {
  return (
    <div
      className={`modern-card animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 cursor-default ${className}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Animated accent line at top */}
      <div className="card-accent" />

      {/* Shimmer overlay */}
      <div className="card-shimmer" />

      {/* Floating particles — appear on hover */}
      <div
        className="card-particle"
        style={{
          width: 6, height: 6,
          background: 'rgba(50,132,255,0.35)',
          top: '20%', right: '15%',
        }}
      />
      <div
        className="card-particle"
        style={{
          width: 4, height: 4,
          background: 'rgba(53,234,149,0.35)',
          top: '60%', right: '10%',
        }}
      />
      <div
        className="card-particle"
        style={{
          width: 5, height: 5,
          background: 'rgba(1,52,124,0.25)',
          bottom: '25%', left: '12%',
        }}
      />

      {/* Content */}
      <div className="card-content">
        {/* Icon */}
        {icon && (
          <div className={`card-icon-wrap ${iconBg} mb-5`}>
            {typeof icon === 'string' ? (
              <span>{icon}</span>
            ) : (
              icon
            )}
          </div>
        )}

        {/* Title */}
        {title && (
          <h3 className="text-lg font-bold text-navy mb-2 tracking-tight">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-gray-500 text-sm leading-relaxed">
            {description}
          </p>
        )}

        {/* Any extra children */}
        {children}
      </div>

      {/* Corner dot */}
      <div className="card-corner-dot" />
    </div>
  );
}
