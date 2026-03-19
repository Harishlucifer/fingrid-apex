import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function useScrollAnimation() {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('animate-visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    const els = ref.current?.querySelectorAll('.animate-on-scroll');
    els?.forEach((el) => obs.observe(el));
    return () => els?.forEach((el) => obs.unobserve(el));
  }, []);
  return ref;
}

export default function ProductDetailPage({
  title,
  subtitle,
  description,
  gradient = 'from-navy via-navy-dark to-blue',
  backTo = '/products',
  backLabel = 'Back to Products',
  features = [],
  ctaTitle = 'Get Started Today',
  ctaLabel = 'Schedule a Demo',
}) {
  const sectionRef = useScrollAnimation();

  return (
    <div ref={sectionRef} className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-72 h-72 bg-blue/30 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-10 left-10 w-60 h-60 bg-mint/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }}></div>
          </div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link to={backTo} className="inline-flex items-center gap-2 text-white/70 text-sm font-medium mb-6 hover:text-white transition-colors animate-fade-in" style={{ opacity: 0 }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {backLabel}
            </Link>
            {subtitle && (
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm text-mint text-xs font-bold uppercase tracking-widest rounded-md mb-4 animate-fade-in" style={{ opacity: 0, animationDelay: '0.1s' }}>
                {subtitle}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>{title}</h1>
            <p className="text-lg text-white/80 mb-4 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.4s', opacity: 0 }}>
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      {features.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-4xl font-bold text-navy mb-4">Key Features</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">Explore the capabilities that make this solution stand out.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div key={f.title} className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group p-8 bg-white rounded-2xl border border-gray-100 hover:border-navy/20 hover:shadow-xl hover:-translate-y-2" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                  <h3 className="text-xl font-bold text-navy mb-3">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy mb-6 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">{ctaTitle}</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-navy to-blue text-white font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-on-scroll opacity-0 translate-y-8" style={{ transitionDelay: '100ms' }}>
            {ctaLabel}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
