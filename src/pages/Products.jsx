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

const products = [
  {
    title: 'Lending Platform',
    subtitle: 'AI-Powered Lending Solutions',
    description: 'End-to-end lending automation with intelligent credit scoring, risk assessment, and loan management. Our platform streamlines the entire lending lifecycle from application to disbursement.',
    features: ['Credit Scoring Engine', 'Risk Assessment AI', 'Loan Origination System', 'Collections Management', 'Regulatory Compliance'],
    gradient: 'from-navy to-blue',
    iconBg: 'bg-navy/10',
    link: '/products/lending',
    icon: (
      <svg className="w-8 h-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    children: [
      { label: 'Bc DS', path: '/products/lending/bc-ds' },
      { label: 'DSaaS', path: '/products/lending/dsaas' },
    ],
  },
  {
    title: 'OS Suite',
    subtitle: 'Comprehensive Operating System',
    description: 'A robust operating suite that provides the core infrastructure for your financial operations. From workflow automation to data processing, OS Suite handles it all.',
    features: ['Process Automation', 'Workflow Engine', 'Data Pipeline', 'Real-time Monitoring', 'Custom Dashboards'],
    gradient: 'from-blue to-blue-light',
    iconBg: 'bg-blue/10',
    link: '/products/os-suite',
    icon: (
      <svg className="w-8 h-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    children: [],
  },
  {
    title: 'Stacks',
    subtitle: 'Modular Technology Infrastructure',
    description: 'Modular, cloud-native technology stacks designed to scale with your business. Build, deploy, and manage microservices with enterprise-grade tooling.',
    features: ['Microservices Architecture', 'Cloud Native Deployment', 'API Gateway', 'Service Mesh', 'Auto-scaling Infrastructure'],
    gradient: 'from-mint-dark to-mint',
    iconBg: 'bg-mint/10',
    link: '/products/stacks',
    icon: (
      <svg className="w-8 h-8 text-mint-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    children: [],
  },
];

export default function Products() {
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
            Our Solutions
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            Products & Solutions
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
            Discover our comprehensive suite of AI-powered products designed to revolutionize your financial operations.
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
                            style={{ animationDelay: `${fi * 100}ms` }}
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

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-600 text-lg mb-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '100ms' }}>
            Our team of experts will work with you to build a tailored solution for your specific needs.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-navy to-blue text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue/25 hover:-translate-y-1 transition-all duration-300 animate-on-scroll opacity-0 translate-y-8"
            style={{ transitionDelay: '200ms' }}
          >
            Talk to Our Team
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
