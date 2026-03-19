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

const stacks = [
  {
    title: 'Marketing Stack',
    desc: 'Governed engagement and automated follow-ups across inbound inquiries and complete lending lifecycles.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
      </svg>
    ),
    position: 'top-left',
  },
  {
    title: 'Sales Stack',
    desc: 'Streamlined lead intake, ownership tracking, execution management, and submission readiness workflows.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    position: 'top-right',
  },
  {
    title: 'Financial Accounting Stack',
    desc: 'Automated GL Balances, Continuous Closing, Financial Reporting, mini HRMS, ALM and Treasury for Lender in a Box.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
      </svg>
    ),
    position: 'mid-left',
  },
  {
    title: 'LOS Stack',
    desc: 'End-to-end application processing, configurable underwriting workflows, and intelligent credit decisioning.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    position: 'mid-right',
  },
  {
    title: 'LCS Stack',
    desc: 'Unified collections workflow orchestrating digital outreach, tele operations, field activities, and legal processes.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    position: 'bottom-left',
  },
  {
    title: 'LMS Stack',
    desc: 'Loan disbursement, flexible repayment schedules, comprehensive servicing, and full account lifecycle management.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    position: 'bottom-right',
  },
];

export default function LenderOS() {
  const sectionRef = useScrollAnimation();

  return (
    <div ref={sectionRef} className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-blue">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-72 h-72 bg-blue/30 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-10 left-10 w-60 h-60 bg-mint/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }}></div>
          </div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link to="/products/os" className="inline-flex items-center gap-2 text-white/70 text-sm font-medium mb-6 hover:text-white transition-colors animate-fade-in" style={{ opacity: 0 }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to FinGrid OS
            </Link>
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-mint text-xs font-bold uppercase tracking-widest rounded-lg mb-4 animate-fade-in" style={{ opacity: 0, animationDelay: '0.1s' }}>
              Lender OS
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              Operating System for Modern Lending
            </h1>
            <p className="text-lg text-white/80 mb-4 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.4s', opacity: 0 }}>
              Delivers a complete suite of lending infrastructure for financial institutions. Adopt only what you need, scale when you are ready.
            </p>
          </div>
        </div>
      </section>

      {/* Stacks Circular Layout */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-4xl font-bold text-navy mb-4">Complete Lending Infrastructure</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Six powerful stacks working together to power your entire lending operation.
            </p>
          </div>

          {/* Stacks Grid — 3 columns on desktop */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stacks.map((stack, i) => (
              <div
                key={stack.title}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group relative"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative p-8 bg-white rounded-2xl border border-gray-100 hover:border-navy/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full">
                  {/* Accent line */}
                  <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-navy to-blue rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy to-blue text-white flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue/25 transition-all duration-500">
                    {stack.icon}
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-3">{stack.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{stack.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom callouts */}
          <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '600ms' }}>
            <div className="flex items-center gap-3 px-6 py-3 bg-navy/5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-mint flex-shrink-0"></span>
              <p className="text-sm font-medium text-navy">Adopt only what you need, Scale when you are ready.</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-navy/5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-blue flex-shrink-0"></span>
              <p className="text-sm font-medium text-navy">Purpose-built as Plug & Play to integrate with your existing systems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modular vs Full Stack Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-4xl font-bold text-navy mb-4">Modular Stacks — Full Suite - Plug & Play</h2>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto">
              Adopt only what you need, Scale when you are ready. Designed to integrate seamlessly with your existing ecosystem.
            </p>
          </div>

          {/* Tree Diagram */}
          <div className="max-w-4xl mx-auto">
            {/* Source Node */}
            <div className="flex justify-center mb-0 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <div className="px-8 py-3 bg-navy text-white font-bold text-sm rounded-xl shadow-lg shadow-navy/20">
                Lender OS
              </div>
            </div>

            {/* Connecting lines */}
            <div className="flex justify-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '100ms' }}>
              <svg width="400" height="60" viewBox="0 0 400 60" className="text-blue/30">
                <line x1="200" y1="0" x2="100" y2="60" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                <line x1="200" y1="0" x2="300" y2="60" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
              </svg>
            </div>

            {/* Labels */}
            <div className="grid grid-cols-2 gap-8 -mt-2 mb-4 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '150ms' }}>
              <p className="text-center text-sm font-semibold text-navy">Modular</p>
              <p className="text-center text-sm font-semibold text-navy">Full Stack</p>
            </div>

            {/* Two cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Modular */}
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group" style={{ transitionDelay: '200ms' }}>
                <div className="relative p-8 bg-white rounded-2xl border-2 border-blue/20 hover:border-blue/40 hover:shadow-xl transition-all duration-500 text-center h-full flex flex-col">
                  <div className="flex-1">
                    <div className="w-12 h-12 rounded-xl bg-blue/10 text-blue flex items-center justify-center mx-auto mb-5">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      Choose Stacks of your choice from Lender OS Suite, integrate with your existing infrastructure.
                    </p>
                  </div>
                  <span className="inline-block px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                    For Established Players
                  </span>
                </div>
              </div>

              {/* Full Stack */}
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group" style={{ transitionDelay: '300ms' }}>
                <div className="relative p-8 bg-white rounded-2xl border-2 border-blue/20 hover:border-blue/40 hover:shadow-xl transition-all duration-500 text-center h-full flex flex-col">
                  <div className="flex-1">
                    <div className="w-12 h-12 rounded-xl bg-mint/10 text-mint-dark flex items-center justify-center mx-auto mb-5">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      Lending in a Box — Marketing, Sales, LOS, LMS, Accounting, Finance, HRMS, ALM & Treasury.
                    </p>
                  </div>
                  <span className="inline-block px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                    For Upcoming Players
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom callouts */}
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '400ms' }}>
              <div className="flex items-center gap-3 px-6 py-3 bg-navy/5 rounded-xl">
                <span className="text-blue font-bold text-sm">Adopt → Integrate → Scale</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-navy/5 rounded-xl">
                <p className="text-sm font-medium text-navy">APIs-first architecture ensures fast deployment and future-proof flexibility.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-navy via-navy-dark to-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">Transform Your Lending Operations</h2>
          <p className="text-white/70 mb-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '80ms' }}>
            Get started with LenderOS — modular or full suite, purpose-built for your lending needs.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-on-scroll opacity-0 translate-y-8" style={{ transitionDelay: '160ms' }}>
            Schedule a Demo
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
