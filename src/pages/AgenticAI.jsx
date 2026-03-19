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

/* ===== Lender Integration Flow Diagram ===== */
function EcosystemFlowDiagram() {
  return (
    <div className="relative py-8">
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {/* Fingrid Client */}
        <div className="relative group">
          <div className="h-full bg-white border-2 border-blue/30 rounded-2xl p-6 hover:border-blue/60 hover:shadow-xl transition-all duration-500">
            <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue/20 to-navy/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-navy text-center mb-1">FINGRID CLIENT</h3>
            <p className="text-sm text-gray-400 text-center mb-4">(NBFC / DSA / BC)</p>
            <ul className="space-y-2">
              {['Loan application', 'Borrower KYC', 'Bureau score', 'Bank statement', 'Underwriting decision'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-navy/40 rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Integration Agent */}
        <div className="relative group">
          <div className="h-full bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-2xl p-6 shadow-xl shadow-teal-500/20 hover:shadow-2xl hover:shadow-teal-500/30 hover:-translate-y-1 transition-all duration-500">
            <div className="w-14 h-14 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-1">INTEGRATION AGENT</h3>
            <p className="text-sm text-white/60 text-center mb-4">(Orchestrator)</p>
            <ul className="space-y-2">
              {[
                'Data normalization',
                'Field mapping',
                'Validation & enrichment',
                'API orchestration',
                'Error handling & retry',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Arrows */}
          <div className="hidden md:block absolute top-1/2 -left-3 transform -translate-y-1/2">
            <svg className="w-6 h-6 text-blue" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </div>
          <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
            <svg className="w-6 h-6 text-blue" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </div>
        </div>

        {/* Ecosystem Lenders */}
        <div className="relative group">
          <div className="h-full bg-white border-2 border-amber-300/50 rounded-2xl p-6 hover:border-amber-400/70 hover:shadow-xl transition-all duration-500">
            <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-navy text-center mb-1">ECOSYSTEM LENDERS</h3>
            <p className="text-sm text-gray-400 text-center mb-4">(Banks / NBFCs / Fintechs)</p>
            <ul className="space-y-2">
              {[
                'Receive application',
                'Auto-decisioning',
                'Disbursement trigger',
                'Portfolio tracking',
                'Repayment updates',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-blue">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Agent Architecture Diagram ===== */
function AgentArchitecture() {
  const agents = [
    {
      name: 'Onboarding Agent',
      icon: '🤝',
      gradient: 'from-amber-500 to-orange-500',
      features: [
        'Automated KYC document collection',
        'Entity extraction (company, directors, financials)',
        'Compliance checklist auto-validation',
      ],
    },
    {
      name: 'Configuration Agent',
      icon: '⚙️',
      gradient: 'from-blue to-navy',
      features: [
        'Learns workflows from similar clients',
        'Auto-generates loan product configs',
        'Sets up approval hierarchies',
      ],
    },
    {
      name: 'Support Agent',
      icon: '🎧',
      gradient: 'from-mint-dark to-[#15a366]',
      features: [
        'Natural language query understanding',
        'Auto-resolves 80% of tickets',
        'Proactive issue detection',
        'Escalates to humans with full context',
      ],
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {agents.map((agent, i) => (
        <div
          key={agent.name}
          className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group"
          style={{ transitionDelay: `${i * 150}ms` }}
        >
          <div className="h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className={`bg-gradient-to-r ${agent.gradient} p-6 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 text-center">
                <span className="text-4xl block mb-2">{agent.icon}</span>
                <h3 className="text-lg font-bold text-white">{agent.name}</h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {agent.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-mint/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-mint-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AgenticAI() {
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
            Agentic AI Platform
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            FinGrid AI
            <span className="gradient-text"> Agents</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.5s', opacity: 0 }}>
            AI Agents that orchestrate seamless data flow, automate onboarding, configuration & support — so humans can focus on strategy.
          </p>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
            {[
              { value: '80%', label: 'Automation' },
              { value: '70%', label: 'Cost Reduction' },
              { value: '2-3', label: 'Days Onboarding' },
              { value: '24/7', label: 'AI Support' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-2xl font-bold text-mint">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agentic Lender Integration */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-8 mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex-1">
              <span className="text-sm font-semibold text-blue uppercase tracking-wider">Lender Integration</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-navy mt-3 mb-4">Agentic Lender Integration</h2>
              <p className="text-gray-500 text-lg">
                AI Agents orchestrate seamless data flow between clients and ecosystem lenders — zero manual work, real-time sync.
              </p>
            </div>
            <div className="flex-shrink-0 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <div className="bg-gradient-to-r from-navy to-blue text-white px-6 py-3 rounded-xl text-center">
                <div className="text-lg font-bold">Zero Manual Work</div>
                <div className="text-white/70 text-sm">Real-Time Sync</div>
              </div>
            </div>
          </div>

          {/* Ecosystem Flow */}
          <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
            <h3 className="text-sm font-bold text-navy uppercase tracking-widest mb-6">THE ECOSYSTEM FLOW</h3>
            <EcosystemFlowDiagram />
          </div>
        </div>
      </section>

      {/* What the Agent Does (Behind the Scenes) */}
      <section className="py-24 bg-gray-50 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-xl font-bold text-lg mb-6">
              WHAT THE AGENT DOES (Behind the Scenes)
            </div>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              {
                num: '1',
                title: 'Data Normalization',
                desc: "Converts Fingrid client's data to lender's required format (JSON → XML, field name mapping)",
                color: 'border-teal-500',
                bg: 'bg-teal-50',
              },
              {
                num: '2',
                title: 'Intelligent Validation',
                desc: 'Checks mandatory fields, data types, business rules before sending to lender',
                color: 'border-blue',
                bg: 'bg-blue/5',
              },
              {
                num: '3',
                title: 'API Orchestration',
                desc: "Calls lender's API endpoints in correct sequence (auth → submit → status poll → callback)",
                color: 'border-purple-500',
                bg: 'bg-purple-50',
              },
              {
                num: '4',
                title: 'Error Recovery',
                desc: 'Auto-retry on failures, fallback to alternative lenders, human escalation if needed',
                color: 'border-red-400',
                bg: 'bg-red-50',
              },
              {
                num: '5',
                title: 'Real-Time Sync',
                desc: 'Bi-directional updates: lender decisions flow back to Fingrid client instantly',
                color: 'border-emerald-500',
                bg: 'bg-emerald-50',
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ${step.bg} border-2 ${step.color} rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-500`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`inline-flex items-center gap-2 mb-3`}>
                  <span className={`w-7 h-7 rounded-lg border-2 ${step.color} flex items-center justify-center text-xs font-bold text-navy`}>{step.num}</span>
                  <h3 className="text-sm font-bold text-navy">{step.title}</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Network Effect Banner */}
          <div className="mt-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '600ms' }}>
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold px-6 py-3 rounded-xl text-center">
              NETWORK EFFECT: Every lender integrated = more value for every client. DSAs access 10+ lenders through one platform. Fingrid becomes the API gateway for Indian lending.
            </div>
          </div>
        </div>
      </section>

      {/* Agentic AI for Implementation */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-80 h-80 bg-mint/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-8 mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex-1">
              <span className="text-sm font-semibold text-mint uppercase tracking-wider">Implementation</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-navy mt-3 mb-4">
                Agentic AI for Implementation
              </h2>
              <p className="text-gray-500 text-lg">
                AI Agents handle Onboarding, Configuration & Support — Humans focus on strategy.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-xl text-center">
                <div className="text-lg font-bold">80% Automation</div>
                <div className="text-white/70 text-sm">Weeks → Hours</div>
              </div>
            </div>
          </div>

          {/* Problem vs Solution Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
            {/* The Problem */}
            <div className="bg-white border-2 border-red-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
              <div className="bg-red-50 px-6 py-4 border-b border-red-200">
                <h3 className="text-lg font-bold text-red-700">THE PROBLEM: Traditional Implementation</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy">Client onboarding</p>
                      <p className="text-sm text-gray-400">Manual data collection, config setup</p>
                    </div>
                    <span className="text-sm font-bold text-red-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      4-6 weeks
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy">Platform configuration</p>
                      <p className="text-sm text-gray-400">Custom workflows, loan types, rules</p>
                    </div>
                    <span className="text-sm font-bold text-red-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      2-3 weeks
                    </span>
                  </div>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-700 font-semibold">
                    Result: <span className="line-through">8-12 week</span> onboarding, high support costs, delayed time-to-value
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-3 italic">Human response time bottleneck</p>
              </div>
            </div>

            {/* The Solution */}
            <div className="bg-white border-2 border-emerald-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-200">
                <h3 className="text-lg font-bold text-emerald-700">THE SOLUTION: Agentic AI Implementation</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy">Onboarding Agent</p>
                      <p className="text-sm text-gray-400">Auto KYC, data extraction, validation</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      2-3 days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy">Configuration Agent</p>
                      <p className="text-sm text-gray-400">Learns from examples, auto-config</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      4-6 hours
                    </span>
                  </div>
                </div>
                <div className="bg-emerald-100 border border-emerald-300 rounded-xl px-4 py-3">
                  <p className="text-sm text-emerald-700 font-semibold">
                    Result: <span className="line-through">1-2 week</span> onboarding, 70% cost reduction, immediate time-to-value
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-3 italic">24/7 instant resolution, escalates if needed</p>
              </div>
            </div>
          </div>

          {/* Agent Architecture */}
          <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '400ms' }}>
            <div className="text-center mb-10">
              <div className="inline-block bg-gradient-to-r from-purple-600 to-blue text-white px-8 py-3 rounded-xl font-bold text-lg">
                AGENT ARCHITECTURE: How It Works
              </div>
            </div>
            <AgentArchitecture />
          </div>

          {/* Investor Value */}
          <div className="mt-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '600ms' }}>
            <div className="bg-gradient-to-r from-navy to-blue text-white text-sm font-semibold px-6 py-4 rounded-xl text-center">
              INVESTOR VALUE: Agents reduce operational headcount from 50 → 10 at 100 clients. Traditional competitors need linear scaling. Fingrid scales exponentially.
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
            Ready to Automate with AI?
          </h2>
          <p className="text-xl text-white/80 mb-10 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '100ms' }}>
            Deploy AI agents that reduce onboarding from weeks to days and cut operational costs by 70%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-navy font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Schedule a Demo
            </Link>
            <Link
              to="/products"
              className="px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
