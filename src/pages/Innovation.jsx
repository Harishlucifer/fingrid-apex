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

const strategyItems = [
  'Sandbox APIs',
  'Developer Portal',
  'SDKs & Documentation',
  'Real-world lending use cases',
  'Mentorship & evaluation',
];

const whatGetsBuilt = [
  { icon: '🔗', name: 'Alternate data integrations' },
  { icon: '📊', name: 'Bureau & analytics connectors' },
  { icon: '🏦', name: 'Lender API integrations' },
  { icon: '🌍', name: 'Country-specific regulatory workflows' },
  { icon: '📄', name: 'Loan-type process templates' },
  { icon: '💳', name: 'Embedded finance use cases' },
  { icon: '📈', name: 'Analytics dashboards' },
  { icon: '🤖', name: 'Automation bots' },
];

const whyPowerful = [
  {
    num: '1',
    title: 'Capital Efficient Innovation',
    desc: 'Structured external innovation at fraction of internal R&D cost',
    gradient: 'from-blue to-blue-light',
  },
  {
    num: '2',
    title: 'Rapid Market Expansion',
    desc: 'New geographies · new verticals · new loan products — faster',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    num: '3',
    title: 'Talent Pipeline',
    desc: 'Top contributors → internships → full-time → startup founders',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    num: '4',
    title: 'Ecosystem Brand',
    desc: 'Fingrid = the fintech platform students build on',
    gradient: 'from-purple-500 to-pink-500',
  },
];

const governanceItems = [
  { icon: '🎯', name: 'Curated problem statements' },
  { icon: '👨‍🏫', name: 'Mentor oversight' },
  { icon: '🔍', name: 'Code review & security audit' },
  { icon: '📋', name: 'IP assignment structure' },
  { icon: '🛡️', name: 'Production-grade hardening' },
];

export default function Innovation() {
  const sectionRef = useScrollAnimation();

  return (
    <div ref={sectionRef} className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/30 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-10 right-20 w-80 h-80 bg-blue/30 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(53,234,149,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-mint text-sm font-medium rounded-full border border-white/10 mb-6 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
                <span className="w-2 h-2 bg-mint rounded-full animate-pulse"></span>
                Innovation Network
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                University Innovation
                <span className="gradient-text"> Network</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
                Engineering & MBA Collaboration as a Strategic Innovation Multiplier. Fingrid partners with leading engineering & management institutions to create a structured{' '}
                <strong className="text-mint">Fintech Innovation Ecosystem</strong>.
              </p>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
              <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8 py-5 rounded-2xl text-center shadow-xl shadow-teal-500/20">
                <div className="text-2xl font-bold mb-1">Capital Efficient</div>
                <div className="text-white/80 text-base">Innovation Engine</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-24 bg-gray-50 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-6">

            {/* THE STRATEGY */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <div className="h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="bg-gradient-to-r from-navy to-blue p-5">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">THE STRATEGY</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Fingrid partners with leading engineering & management institutions to create a structured
                  </p>
                  <div className="bg-gradient-to-r from-navy to-blue text-white px-4 py-2 rounded-xl text-sm font-semibold text-center mb-5">
                    Fintech Innovation Ecosystem
                  </div>
                  <p className="text-xs font-bold text-navy uppercase tracking-wider mb-3">We provide:</p>
                  <ul className="space-y-2">
                    {strategyItems.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-2 h-2 bg-blue rounded-full flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* WHAT GETS BUILT */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '100ms' }}>
              <div className="h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">WHAT GETS BUILT</h3>
                </div>
                <div className="p-6">
                  <p className="text-xs text-gray-500 italic mb-4">Through guided innovation tracks:</p>
                  <ul className="space-y-3">
                    {whatGetsBuilt.map((item) => (
                      <li key={item.name} className="flex items-center gap-3 text-sm text-gray-700 hover:text-navy transition-colors">
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* WHY IT'S POWERFUL */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
              <div className="h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-5">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">WHY IT'S POWERFUL</h3>
                </div>
                <div className="p-6 space-y-4">
                  {whyPowerful.map((item) => (
                    <div key={item.num} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default">
                      <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                        {item.num}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-navy">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* GOVERNANCE MODEL */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '300ms' }}>
              <div className="h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-5">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">GOVERNANCE MODEL</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {governanceItems.map((item) => (
                      <li key={item.name} className="flex items-center gap-3 text-sm text-gray-700 hover:text-navy transition-colors">
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        {item.name}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 p-4 bg-gradient-to-br from-navy/5 to-blue/5 rounded-xl border border-navy/10">
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-2">INVESTOR TAKEAWAY</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Lean core team + structured university network = accelerated product expansion without proportional burn increase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Badges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            {[
              { label: 'Capital Efficient', color: 'from-teal-500 to-emerald-500' },
              { label: 'Ecosystem Oriented', color: 'from-blue to-navy' },
              { label: 'Talent Magnet', color: 'from-amber-500 to-orange-500' },
              { label: 'Scalable R&D Engine', color: 'from-purple-600 to-purple-500' },
            ].map((badge) => (
              <div
                key={badge.label}
                className={`bg-gradient-to-r ${badge.color} text-white px-6 py-4 rounded-xl text-center font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {badge.label}
              </div>
            ))}
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
            Join Our Innovation Network
          </h2>
          <p className="text-xl text-white/80 mb-10 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '100ms' }}>
            Partner with us to build the future of fintech through collaborative innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-navy font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Partner With Us
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
