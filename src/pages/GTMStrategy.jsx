import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function useScrollAnimation() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = ref.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => elements?.forEach((el) => observer.unobserve(el));
  }, []);
  return ref;
}

export default function GTMStrategy() {
  const sectionRef = useScrollAnimation();

  return (
    <div ref={sectionRef} className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-64 h-64 bg-blue/40 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-10 left-20 w-80 h-80 bg-mint/30 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1.5s' }}></div>
          </div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(50,132,255,0.12) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-mint text-sm font-medium rounded-full border border-white/10 mb-6 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <span className="w-2 h-2 bg-mint rounded-full animate-pulse"></span>
            Go-To-Market Strategy
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            Unique GTM
            <span className="gradient-text"> Strategy</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto animate-fade-in-up leading-relaxed italic" style={{ animationDelay: '0.5s', opacity: 0 }}>
            Fingrid Connect: The Partnership Platform That Builds Our Brand
          </p>
        </div>
      </section>

      {/* The Insight */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex items-start gap-6 p-8 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200/60">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-300/30">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy mb-2">The Insight:</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Lenders and sourcing entities constantly seek partnership opportunities — but lack a <strong className="text-navy">trusted platform to discover and connect</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Column Comparison */}
      <section className="py-24 bg-gray-50 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Traditional Distribution */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <div className="h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-5">
                  <h3 className="text-lg font-bold text-white">Traditional Distribution</h3>
                </div>
                <div className="p-6 bg-red-50/50">
                  <ul className="space-y-3">
                    {[
                      'Cold calling',
                      'Trade shows & conferences',
                      'Expensive sales teams',
                      'Long sales cycles',
                      'Low trust, manual vetting',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Fingrid Connect */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '150ms' }}>
              <div className="h-full bg-white rounded-2xl border-2 border-blue/30 overflow-hidden hover:shadow-xl hover:shadow-blue/10 transition-all duration-500 hover:-translate-y-1">
                <div className="bg-gradient-to-r from-blue to-navy p-5">
                  <h3 className="text-lg font-bold text-white">Fingrid Connect</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4 p-3 bg-blue/5 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue to-navy rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <h4 className="text-base font-bold text-navy">The Marketplace</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Lenders list requirements',
                      'DSAs/LSPs browse opportunities',
                      'Smart matching algorithm',
                      'In-platform agreements',
                      'Performance tracking & ratings',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-blue rounded-full flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Strategic Benefits */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '300ms' }}>
              <div className="h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5">
                  <h3 className="text-lg font-bold text-white">Strategic Benefits</h3>
                </div>
                <div className="p-6 bg-emerald-50/30">
                  <ul className="space-y-3">
                    {[
                      'Every participant becomes a lead',
                      'Build target database organically',
                      'Zero CAC customer acquisition',
                      'Fingrid = trusted platform brand',
                      'Network effects accelerate growth',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Growth Flywheel */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">The Growth Flywheel</h2>
          </div>

          <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
            <div className="flex flex-col sm:flex-row items-stretch">
              {[
                { label: 'Lenders join', color: 'from-navy to-blue' },
                { label: 'DSAs join', color: 'from-blue to-teal-500' },
                { label: 'Partnerships form', color: 'from-teal-500 to-emerald-500' },
                { label: 'Both adopt Fingrid', color: 'from-emerald-500 to-mint' },
                { label: 'More join', color: 'from-mint to-mint-dark' },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center flex-1">
                  <div className={`flex-1 bg-gradient-to-r ${step.color} text-white px-4 py-4 text-center text-sm font-semibold ${i === 0 ? 'rounded-l-xl' : ''} ${i === 4 ? 'rounded-r-xl' : ''}`}>
                    {step.label}
                  </div>
                  {i < 4 && (
                    <div className="flex-shrink-0 px-1">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Differentiated Strategy Framework */}
      <section className="py-24 bg-gray-50 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-sm font-semibold text-blue uppercase tracking-wider">Competitive Moats</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mt-3 mb-4">Differentiated Strategy Framework</h2>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto">
              Compounding moats that make Fingrid unreplicable — infrastructure, not just SaaS.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              {
                icon: '🏗️',
                title: 'Low-Cost Development',
                borderColor: 'border-green-400',
                iconBg: 'bg-green-50',
                items: [
                  'University lab based low-cost surround modules',
                  '10× output at 1/5th cost',
                  'Pre-trained talent pipeline',
                ],
              },
              {
                icon: '🌐',
                title: 'Platform-Led GTM',
                borderColor: 'border-blue',
                iconBg: 'bg-blue/5',
                items: [
                  'Network effect, not sales-driven',
                  'DSAs pull lenders to platform',
                  'Trust layer = switching cost',
                  'Viral growth, low CAC',
                ],
              },
              {
                icon: '☁️',
                title: 'Flexible Deployment',
                borderColor: 'border-purple-400',
                iconBg: 'bg-purple-50',
                items: [
                  'Multi-tenant SaaS for small',
                  'On-prem for large enterprises',
                  'Source code licensing option',
                  'IP remains with Fingrid',
                ],
              },
              {
                icon: '🔗',
                title: 'Integration Platform',
                borderColor: 'border-teal-400',
                iconBg: 'bg-teal-50',
                items: [
                  'Canonical data model across countries',
                  'Config-driven, not code-driven',
                  '500+ provider connectors',
                  'New country = new YAML, not rebuild',
                ],
              },
            ].map((moat, i) => (
              <div
                key={moat.title}
                className={`animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`h-full bg-white rounded-2xl border-l-4 ${moat.borderColor} p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-500`}>
                  <div className={`w-12 h-12 ${moat.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <span className="text-2xl">{moat.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-4">{moat.title}</h3>
                  <ul className="space-y-2.5">
                    {moat.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-navy/40 rounded-full flex-shrink-0 mt-1.5"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Flywheel tagline */}
          <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '500ms' }}>
            <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl py-4 px-6 text-center">
              <p className="text-white text-xs sm:text-sm font-medium leading-relaxed">
                <strong>RESULT:</strong> Every strategy compounds. University labs reduce dev cost → enables aggressive positioning → attracts more lenders → strengthens network → generates more data → improves AI models → drives API usage → increases revenue per client. This is a flywheel, not a feature list.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-animated"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            Ready to Connect?
          </h2>
          <p className="text-xl text-white/80 mb-10 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '100ms' }}>
            Join the partnership platform that builds your brand and grows your business organically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-navy font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Join Fingrid Connect
            </Link>
            <Link
              to="/products/network"
              className="px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
            >
              Explore Network
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
