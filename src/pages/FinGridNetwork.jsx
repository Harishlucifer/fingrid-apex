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

export default function FinGridNetwork() {
  const sectionRef = useScrollAnimation();

  return (
    <div ref={sectionRef} className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue via-navy to-navy-dark">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-72 h-72 bg-mint/30 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }}></div>
          </div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link to="/products" className="inline-flex items-center gap-2 text-white/70 text-sm font-medium mb-6 hover:text-white transition-colors animate-fade-in" style={{ opacity: 0 }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Products
            </Link>
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-mint text-xs font-bold uppercase tracking-widest rounded-lg mb-4 animate-fade-in" style={{ opacity: 0, animationDelay: '0.1s' }}>
              FinGrid Network
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              The Partnership Marketplace
            </h1>
            <p className="text-lg text-white/80 mb-4 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.4s', opacity: 0 }}>
              Connects lenders with partners through smart matching, partnership requests, and Easy Integrate — the single API for the entire ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features — 3 columns */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
                iconBg: 'bg-blue text-white',
                title: 'Smart Discovery & Matching',
                desc: 'AI-powered partner matching with readiness scores and eligibility evaluation for high-quality partnerships.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                ),
                iconBg: 'bg-red-500 text-white',
                title: 'Partnership Programs',
                desc: 'Lenders create portal or API-based programs. Partners apply once and get matched with multiple lenders.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                ),
                iconBg: 'bg-blue text-white',
                title: 'Easy Integrate',
                desc: 'Single API integration connects lenders to 200+ partners or partners to 50+ lenders instantly.',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 text-center group"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-navy mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Lenders & NBFCs Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-4xl font-bold text-navy mb-4">For Lenders & NBFCs</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Build and manage your partner network with pre-qualified DSAs, LSPs, and BCs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
                iconBg: 'bg-blue/10 text-blue',
                title: 'Discover Partners',
                desc: 'Search 200+ pre-qualified DSAs, LSPs, and BCs by readiness score, geography, volume, and product expertise.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                ),
                iconBg: 'bg-blue/10 text-blue',
                title: 'Create Partnership Programs',
                desc: 'Design portal-based or API-based programs with private eligibility criteria and automated partner matching.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                iconBg: 'bg-amber-100 text-amber-600',
                title: 'Easy Integrate for Lenders',
                desc: "Integrate once with Fingrid's API. Instantly receive leads from 200+ pre-integrated partners.",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-navy/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full">
                  <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300`}>
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-3">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section — from Image 4 */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border-l-4 border-navy p-10 md:p-14 shadow-sm animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 leading-tight">
              Network + Operating Systems Create a Real Lending Ecosystem
            </h2>
            <p className="text-gray-600 leading-relaxed mb-12">
              Operating Systems govern internal workflows while Fingrid Network governs inter-organization collaboration. Participants operate independently yet coordinate reliably through shared rules, permissions, and trust mechanisms.
            </p>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  num: '01',
                  title: 'Internal Governance',
                  desc: 'Operating Systems manage workflows, data, and operations within organizations.',
                },
                {
                  num: '02',
                  title: 'External Coordination',
                  desc: 'Network layer enables systematic collaboration across organizational boundaries.',
                },
                {
                  num: '03',
                  title: 'Ecosystem Function',
                  desc: 'Combined layers create reliable, governed interaction at scale without sacrificing autonomy.',
                },
              ].map((pillar, i) => (
                <div
                  key={pillar.num}
                  className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
                  style={{ transitionDelay: `${(i + 1) * 150}ms` }}
                >
                  <p className="text-blue text-3xl font-bold mb-2">{pillar.num}</p>
                  <h3 className="text-xl font-bold text-navy mb-3">{pillar.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-navy via-navy-dark to-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">Join the FinGrid Network</h2>
          <p className="text-white/70 mb-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '80ms' }}>
            Connect with 200+ partners and 50+ lenders through a single integration.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-on-scroll opacity-0 translate-y-8" style={{ transitionDelay: '160ms' }}>
            Get Started
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
