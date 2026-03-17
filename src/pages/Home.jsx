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

export default function Home() {
  const sectionRef = useScrollAnimation();

  return (
    <div ref={sectionRef} className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue/30 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-mint/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue/10 rounded-full blur-[150px] animate-pulse-glow"></div>
          </div>
          {/* Grid pattern overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(50,132,255,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-mint text-sm font-medium rounded-full border border-white/10 mb-8">
              <span className="w-2 h-2 bg-mint rounded-full animate-pulse"></span>
              AI-Powered Financial Solutions
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            Intelligent Solutions
            <br />
            <span className="gradient-text">for Modern Finance</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
            Transform your financial operations with Fingrid.ai&apos;s cutting-edge AI platform. 
            From lending automation to data services, we power the future of fintech.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.8s', opacity: 0 }}>
            <Link
              to="/products"
              className="group relative px-8 py-4 bg-gradient-to-r from-mint to-mint-light text-navy font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-mint/30 hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Products
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              to="/contact"
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                Contact Us
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-fade-in-up" style={{ animationDelay: '1s', opacity: 0 }}>
            {[
              { value: '500+', label: 'Clients Served' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '10M+', label: 'Transactions/Day' },
              { value: '50+', label: 'Countries' },
            ].map((stat) => (
              <div key={stat.label} className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-mint/30 transition-all duration-500 hover:-translate-y-1">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-mint transition-colors duration-300">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-mint rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-sm font-semibold text-blue uppercase tracking-wider">Why Fingrid.ai</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mt-3 mb-4">
              Built for the Future of Finance
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools helps you stay ahead in an ever-evolving financial landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Lightning Fast',
                description: 'Process millions of transactions in real-time with our optimized infrastructure and AI-driven automation.',
                color: 'from-blue/10 to-blue/5',
                border: 'hover:border-blue/30',
              },
              {
                icon: '🔒',
                title: 'Bank-Grade Security',
                description: 'Enterprise-level encryption and compliance with global financial regulations ensure your data stays protected.',
                color: 'from-navy/10 to-navy/5',
                border: 'hover:border-navy/30',
              },
              {
                icon: '🤖',
                title: 'AI-Powered Insights',
                description: 'Leverage machine learning algorithms that continuously learn and adapt to provide actionable intelligence.',
                color: 'from-mint/10 to-mint/5',
                border: 'hover:border-mint/30',
              },
              {
                icon: '📊',
                title: 'Advanced Analytics',
                description: 'Comprehensive dashboards and reporting tools that transform raw data into strategic business decisions.',
                color: 'from-blue/10 to-mint/5',
                border: 'hover:border-blue/30',
              },
              {
                icon: '🔗',
                title: 'Seamless Integration',
                description: 'Connect with your existing systems through our robust APIs and pre-built integrations with major platforms.',
                color: 'from-mint/10 to-blue/5',
                border: 'hover:border-mint/30',
              },
              {
                icon: '🌐',
                title: 'Global Scale',
                description: 'Deploy across regions with multi-currency support, localized compliance, and 24/7 global infrastructure.',
                color: 'from-navy/10 to-blue/5',
                border: 'hover:border-navy/30',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group p-8 rounded-2xl bg-gradient-to-br ${feature.color} border border-transparent ${feature.border} hover:shadow-xl hover:-translate-y-2 cursor-default`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 group-hover:animate-bounce-gentle transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-navy mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-sm font-semibold text-mint uppercase tracking-wider">Our Products</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mt-3 mb-4">
              Comprehensive Product Suite
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Lending Platform',
                description: 'End-to-end lending automation with AI-powered credit scoring, risk assessment, and loan origination systems.',
                features: ['Bc DS Integration', 'DSaaS Solutions', 'Risk Analytics'],
                gradient: 'from-navy to-blue',
                link: '/products/lending',
              },
              {
                title: 'OS Suite',
                description: 'A comprehensive operating system suite that provides the core infrastructure for your financial operations.',
                features: ['Process Automation', 'Workflow Engine', 'Data Pipeline'],
                gradient: 'from-blue to-blue-light',
                link: '/products/os-suite',
              },
              {
                title: 'Stacks',
                description: 'Modular technology stacks designed to scale with your business needs and integrate seamlessly.',
                features: ['Microservices', 'Cloud Native', 'API Gateway'],
                gradient: 'from-mint-dark to-mint',
                link: '/products/stacks',
              },
            ].map((product, i) => (
              <div
                key={product.title}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className={`bg-gradient-to-r ${product.gradient} p-8 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                    <h3 className="text-2xl font-bold text-white relative z-10">{product.title}</h3>
                  </div>
                  <div className="flex-1 p-8 bg-white">
                    <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
                    <ul className="space-y-3 mb-8">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                          <span className="w-5 h-5 rounded-full bg-mint/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-mint-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={product.link}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue hover:text-navy group-hover:gap-3 transition-all duration-300"
                    >
                      Learn More
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-animated"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/80 mb-10 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '100ms' }}>
            Join hundreds of companies that trust Fingrid.ai to power their financial operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-navy font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Schedule a Demo
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
