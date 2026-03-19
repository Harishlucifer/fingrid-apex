import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import ModernCard from '../components/ModernCard';

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

export default function Lending() {
  const sectionRef = useScrollAnimation();

  return (
    <div ref={sectionRef} className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-blue">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-[30%] w-72 h-72 bg-mint/30 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-10 left-[20%] w-80 h-80 bg-blue/30 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(50,132,255,0.12) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link to="/products" className="inline-flex items-center gap-2 text-blue-light text-sm font-medium mb-6 hover:text-mint transition-colors animate-fade-in" style={{ opacity: 0 }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Products
            </Link>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              Lending Platform
            </h1>
            <p className="text-lg text-gray-300 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              End-to-end AI-powered lending automation. From credit scoring to disbursement, streamline your entire lending lifecycle with intelligent automation.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
              <Link to="/products/lending/bc-ds" className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5">
                Bc DS →
              </Link>
              <Link to="/products/lending/dsaas" className="px-6 py-3 bg-gradient-to-r from-mint to-mint-light text-navy font-semibold rounded-xl hover:shadow-lg hover:shadow-mint/25 transition-all duration-300 hover:-translate-y-0.5">
                DSaaS →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-4xl font-bold text-navy mb-4">Platform Capabilities</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Everything you need to manage the complete lending lifecycle.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 card-grid">
            {[
              { icon: '📋', title: 'Loan Origination', desc: 'Streamlined application processing with automated document verification and KYC compliance.' },
              { icon: '🧠', title: 'AI Credit Scoring', desc: 'Machine learning models that assess creditworthiness with 95% accuracy using alternative data sources.' },
              { icon: '⚡', title: 'Instant Decisions', desc: 'Real-time loan approval decisions powered by our proprietary risk assessment engine.' },
              { icon: '📊', title: 'Portfolio Analytics', desc: 'Comprehensive analytics dashboard for monitoring loan portfolio performance and risk metrics.' },
              { icon: '🔄', title: 'Collections Engine', desc: 'Automated collections management with intelligent follow-up scheduling and payment reminders.' },
              { icon: '🛡️', title: 'Compliance Suite', desc: 'Built-in regulatory compliance tools that adapt to local and global financial regulations.' },
            ].map((f, i) => (
              <ModernCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.desc}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sub-products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-4xl font-bold text-navy mb-4">Lending Solutions</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Bc DS', desc: 'Business Credit Data Services — Comprehensive credit data aggregation and analysis platform for informed lending decisions.', link: '/products/lending/bc-ds', gradient: 'from-navy to-blue' },
              { title: 'DSaaS', desc: 'Data Services as a Service — Cloud-native data processing and analytics infrastructure for scalable lending operations.', link: '/products/lending/dsaas', gradient: 'from-blue to-mint-dark' },
            ].map((p, i) => (
              <Link key={p.title} to={p.link} className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className={`bg-gradient-to-br ${p.gradient} rounded-3xl p-10 relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full`}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold text-white mb-4">{p.title}</h3>
                    <p className="text-white/80 mb-6 leading-relaxed">{p.desc}</p>
                    <span className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all duration-300">
                      Explore {p.title}
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
