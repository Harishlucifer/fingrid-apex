import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import SEO from '../components/SEO';

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

const products = [
  {
    title: 'FinGrid Studio',
    subtitle: 'Low-Code Platform',
    description: 'Low code Studio that facilitates ease of Building domain specific processes. Design, build, and deploy financial workflows visually without writing complex code.',
    features: ['Visual Workflow Builder', 'Pre-built Components', 'Rapid Deployment', 'Process Automation', 'Template Library'],
    gradient: 'from-blue to-navy',
    iconBg: 'bg-blue/10',
    link: '/products/studio',
    icon: (
      <svg className="w-8 h-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    children: [],
  },
  {
    title: 'FinGrid Stacks',
    subtitle: 'Domain Stacks',
    description: 'Domain-specific modular stacks for every functional area of lending operations — Marketing, Sales, Credit, Loan Life Cycle, Collections, and Accounting.',
    features: ['Marketing Stack', 'Sales Stack', 'Credit Stack', 'Loan Life Cycle Stack', 'Collections Stack', 'Accounting Stack'],
    gradient: 'from-navy to-navy-dark',
    iconBg: 'bg-navy/10',
    link: '/products/stacks',
    icon: (
      <svg className="w-8 h-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
    children: [
      { label: 'Marketing', path: '/products/stacks/marketing' },
      { label: 'Sales', path: '/products/stacks/sales' },
      { label: 'Credit', path: '/products/stacks/credit' },
    ],
  },
  {
    title: 'FinGrid OS',
    subtitle: 'Operating Systems',
    description: 'Purpose-built Operating Systems for each player in the Lending Ecosystem — Lenders, Business Correspondents, DSAs, LSPs, Agencies, and Auto Dealers.',
    features: ['LenderOS', 'BcOS', 'DsaOS', 'LspOS', 'AgencyOS', 'AutoDealerOS'],
    gradient: 'from-mint-dark to-[#15a366]',
    iconBg: 'bg-mint/10',
    link: '/products/os',
    icon: (
      <svg className="w-8 h-8 text-mint-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
      </svg>
    ),
    children: [
      { label: 'LenderOS', path: '/products/os/lender-os' },
      { label: 'BcOS', path: '/products/os/bc-os' },
      { label: 'DsaOS', path: '/products/os/dsa-os' },
    ],
  },
  {
    title: 'FinGrid Network',
    subtitle: 'Partnership Marketplace',
    description: 'The partnership marketplace that connects lenders with partners through smart matching, partnership requests, and Easy Integrate — the single API for the entire ecosystem.',
    features: ['Smart Discovery & Matching', 'Partnership Programs', 'Easy Integrate', 'Profile Due Diligence', 'Deal Room', 'Network Registry'],
    gradient: 'from-blue to-mint',
    iconBg: 'bg-blue/10',
    link: '/products/network',
    icon: (
      <svg className="w-8 h-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    children: [
      { label: 'Register', path: '/products/network/register' },
      { label: 'Discover', path: '/products/network/discover' },
      { label: 'Deal Room', path: '/products/network/deal-room' },
    ],
  },
  {
    title: 'FinGrid AI',
    subtitle: 'Agentic AI Platform',
    description: 'AI Agents that orchestrate seamless data flow between clients and ecosystem lenders, automate onboarding, configuration & support — enabling 80% automation with zero manual work.',
    features: ['Agentic Lender Integration', 'AI Implementation Agents', 'Onboarding Automation', 'Real-Time Sync', 'Error Recovery', 'Smart Orchestration'],
    gradient: 'from-teal-600 to-emerald-500',
    iconBg: 'bg-teal-500/10',
    link: '/products/agentic-ai',
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    children: [],
  },
];

export default function Products() {
  const sectionRef = useScrollAnimation();

  return (
    <div ref={sectionRef} className="overflow-hidden">
      <SEO
        title="Products & Solutions - Fingrid.ai"
        description="Explore Fingrid.ai's comprehensive product suite including FinGrid Studio, Stacks, OS Suite, Network, and Agentic AI solutions for the lending ecosystem."
        keywords="FinGrid Studio, FinGrid Stacks, FinGrid OS, FinGrid Network, Agentic AI, lending products, fintech solutions"
      />
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
            FinGridAI Proposition
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            Products & Solutions
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.5s', opacity: 0 }}>
            Operating Systems for each player in the Lending Ecosystem. Discover, network, integrate and grow with a Collaboration platform.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {products.map((product, i) => (
              <div
                key={product.title}
                className={`animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className={`inline-flex items-center gap-3 p-3 rounded-2xl ${product.iconBg} mb-6`}>
                    {product.icon}
                  </div>
                  <span className="text-sm font-semibold text-blue uppercase tracking-wider">{product.subtitle}</span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">{product.title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-mint/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-mint-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={product.link}
                      className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${product.gradient} text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
                    >
                      Learn More
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    {product.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-700 font-medium text-sm rounded-xl border border-gray-200 hover:border-blue/30 hover:text-navy hover:shadow-md transition-all duration-300"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Visual Card */}
                <div className="flex-1 w-full">
                  <div className={`bg-gradient-to-br ${product.gradient} rounded-3xl p-8 sm:p-12 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform -translate-x-10 translate-y-10"></div>
                    <div className="relative z-10">
                      <div className="grid grid-cols-2 gap-4">
                        {product.features.slice(0, 4).map((f, fi) => (
                          <div
                            key={f}
                            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-all duration-300"
                          >
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                              <span className="text-white text-sm font-bold">{fi + 1}</span>
                            </div>
                            <p className="text-white/90 text-sm font-medium">{f}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Tagline */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-navy via-navy-dark to-blue rounded-3xl p-10 md:p-14 text-center relative overflow-hidden animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="absolute top-0 right-0 w-60 h-60 bg-mint/10 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue/10 rounded-full blur-[80px]"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Adopt only what you need, Scale when you are ready.
              </h2>
              <p className="text-white/70 text-lg mb-3">
                Purpose-built as Plug & Play to integrate with your existing systems.
              </p>
              <p className="text-mint font-semibold text-sm tracking-wider uppercase mb-8">
                Adopt → Integrate → Scale
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                Talk to Our Team
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
