import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

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

function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const numericTarget = parseInt(target);
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * numericTarget));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const pillars = [
  {
    title: 'About Us',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    gradient: 'from-navy to-blue',
    items: [
      '25 Years Domain Expertise',
      '18 Member Product & Tech Team',
      'HQ in Coimbatore',
    ],
  },
  {
    title: 'Low Code Studio',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    gradient: 'from-blue to-blue-light',
    items: [
      'Finserv Data Model',
      'BPM Workflow',
      'Form Builder',
      'Integration Service',
      'Business Rule Engine',
    ],
  },
  {
    title: 'Functional Domains',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    gradient: 'from-mint-dark to-mint',
    items: [
      'Marketing',
      'Sales',
      'Credit',
      'Loan Management',
      'Collections',
      'HRMS',
      'Financials',
    ],
  },
  {
    title: 'Enterprise Clientele',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    gradient: 'from-navy to-mint-dark',
    items: [
      '5 Clientele across Lenders, Business Correspondents & Loan Distributors',
    ],
  },
];

const values = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI-First Approach',
    description: 'We embed artificial intelligence at the core of every product, enabling smarter decisions and automation.'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Low-Code Innovation',
    description: 'Our proprietary studio accelerates development, reducing time-to-market for domain-specific solutions.'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Collaboration',
    description: 'Empowering lending ecosystem players with a unique collaboration platform for seamless partnerships.'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Domain Expertise',
    description: '25 years of deep fintech knowledge ensuring solutions that truly understand lending operations.'
  },
];

export default function About() {
  const sectionRef = useScrollAnimation();

  return (
    <div ref={sectionRef} className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-72 h-72 bg-mint/30 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-10 right-20 w-64 h-64 bg-blue/40 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
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
                About Fingrid.ai
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                About
                <span className="gradient-text"> Fingrid.ai</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
                We offer <strong className="text-mint">AI-first operating systems</strong> for key players in the Lending Ecosystem and empower them with a unique <strong className="text-mint">Collaboration Platform</strong>. We leverage our proprietary <strong className="text-blue-light">Low Code Studio</strong> to build domain-specific stacks and bundle them into business model specific systems.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-5 animate-fade-in-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
              {[
                { value: '25', suffix: '+', label: 'Years Domain Expertise', color: 'from-navy to-blue' },
                { value: '18', suffix: '', label: 'Product & Tech Team', color: 'from-blue to-blue-light' },
                { value: '5', suffix: '+', label: 'Enterprise Clients', color: 'from-mint-dark to-mint' },
                { value: '7', suffix: '+', label: 'Functional Domains', color: 'from-navy to-mint-dark' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-mint/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className="text-4xl font-bold text-white mb-1 group-hover:text-mint transition-colors duration-300">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-gray-400 leading-snug">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-sm font-semibold text-blue uppercase tracking-wider">What We Bring</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mt-3 mb-4">Our Strengths at a Glance</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Four pillars that define who we are and what makes Fingrid.ai the trusted choice for lending ecosystem players.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${pillar.gradient} p-5 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                        {pillar.icon}
                      </div>
                      <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                    </div>
                  </div>
                  {/* Card Body */}
                  <div className="p-6">
                    <ul className="space-y-3">
                      {pillar.items.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-3 text-sm text-gray-700 group-hover:text-gray-800 transition-colors"
                        >
                          <span className="w-5 h-5 rounded-full bg-mint/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-mint-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Platform */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Mission */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <div className="inline-flex items-center gap-2 p-3 bg-navy/10 rounded-2xl mb-6">
                <svg className="w-8 h-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                To revolutionize the lending ecosystem by building <strong>AI-first operating systems</strong> that empower 
                lenders, business correspondents, and loan distributors with intelligent automation and seamless collaboration.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our proprietary <strong>Low Code Studio</strong> enables us to rapidly build domain-specific stacks and bundle 
                them into complete business model specific systems — reducing time-to-market and operational complexity for our enterprise clients.
              </p>
            </div>

            {/* Right: Platform Visual */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
              <div className="bg-gradient-to-br from-navy to-blue rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-mint/20 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-light/20 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-6">Low Code Studio Platform</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Finserv Data Model', icon: '📊', desc: 'Domain-specific data models for financial services' },
                      { name: 'BPM Workflow', icon: '⚙️', desc: 'Business process automation & orchestration' },
                      { name: 'Form Builder', icon: '📝', desc: 'Dynamic form creation with validation' },
                      { name: 'Integration Service', icon: '🔗', desc: 'Seamless third-party system connectivity' },
                      { name: 'Business Rule Engine', icon: '🧠', desc: 'Configurable rules for complex logic' },
                    ].map((tool, i) => (
                      <div
                        key={tool.name}
                        className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/15 hover:border-mint/20 transition-all duration-300 group cursor-default"
                      >
                        <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{tool.icon}</span>
                        <div>
                          <h4 className="text-white font-semibold text-sm">{tool.name}</h4>
                          <p className="text-white/60 text-xs mt-0.5">{tool.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-sm font-semibold text-mint uppercase tracking-wider">Our DNA</span>
            <h2 className="text-4xl font-bold text-navy mt-3 mb-4">Core Values</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">The principles that drive every product we build and every partnership we form.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group p-8 bg-white rounded-2xl border border-gray-100 hover:border-blue/20 hover:shadow-xl hover:-translate-y-2 cursor-default text-center"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-navy/10 to-blue/10 rounded-2xl flex items-center justify-center text-navy group-hover:from-navy group-hover:to-blue group-hover:text-white transition-all duration-500">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Functional Domains Showcase */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-80 h-80 bg-mint/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-40 top-1/3 w-80 h-80 bg-blue/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-sm font-semibold text-blue uppercase tracking-wider">What We Cover</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mt-3 mb-4">Functional Domains</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Our platform covers the entire lending lifecycle across all critical functional areas.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[
              { name: 'Marketing', icon: '📢', color: 'from-blue/5 to-blue/10', hover: 'hover:border-blue/30' },
              { name: 'Sales', icon: '💼', color: 'from-navy/5 to-navy/10', hover: 'hover:border-navy/30' },
              { name: 'Credit', icon: '💳', color: 'from-mint/5 to-mint/10', hover: 'hover:border-mint/30' },
              { name: 'Loan Management', icon: '🏦', color: 'from-blue/5 to-mint/5', hover: 'hover:border-blue/30' },
              { name: 'Collections', icon: '📋', color: 'from-navy/5 to-blue/5', hover: 'hover:border-navy/30' },
              { name: 'HRMS', icon: '👥', color: 'from-mint/5 to-blue/5', hover: 'hover:border-mint/30' },
              { name: 'Financials', icon: '📊', color: 'from-blue/5 to-navy/5', hover: 'hover:border-blue/30' },
            ].map((domain, i) => (
              <div
                key={domain.name}
                className={`animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group p-6 bg-gradient-to-br ${domain.color} rounded-2xl border border-transparent ${domain.hover} hover:shadow-lg hover:-translate-y-1 cursor-default text-center`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 group-hover:animate-bounce-gentle transition-transform duration-300">{domain.icon}</div>
                <h3 className="text-base font-bold text-navy">{domain.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Headquarter / Location */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="bg-gradient-to-br from-navy to-blue rounded-3xl p-10 sm:p-16 relative overflow-hidden text-center">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-40 h-40 bg-mint/30 rounded-full blur-[80px] animate-float"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-light/30 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1.5s' }}></div>
              </div>
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
                backgroundSize: '30px 30px'
              }}></div>

              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <svg className="w-8 h-8 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Headquartered in Coimbatore
                </h2>
                <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
                  Building world-class fintech solutions from India&apos;s engineering hub — the Manchester of South India.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/contact"
                    className="px-8 py-4 bg-white text-navy font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    Visit Us
                  </Link>
                  <Link
                    to="/contact"
                    className="px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
