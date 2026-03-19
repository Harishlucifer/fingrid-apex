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

export default function Stacks() {
  const sectionRef = useScrollAnimation();

  return (
    <div ref={sectionRef} className="overflow-hidden">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-blue">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-72 h-72 bg-blue/30 rounded-full blur-[100px] animate-float"></div>
          </div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link to="/products" className="inline-flex items-center gap-2 text-white/70 text-sm font-medium mb-6 hover:text-white transition-colors animate-fade-in" style={{ opacity: 0 }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Products
            </Link>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>Stacks</h1>
            <p className="text-lg text-white/80 mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              Modular, cloud-native technology stacks designed to scale with your business. Build, deploy, and manage your infrastructure with enterprise-grade tooling.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-4xl font-bold text-navy mb-4">Stack Components</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Modular building blocks for enterprise infrastructure.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 card-grid">
            {[
              { icon: '🏗️', title: 'Microservices', desc: 'Build resilient microservices with built-in service discovery, load balancing, and fault tolerance.' },
              { icon: '☁️', title: 'Cloud Native', desc: 'Deploy on any cloud provider with Kubernetes-native orchestration and auto-scaling.' },
              { icon: '🚪', title: 'API Gateway', desc: 'Unified API gateway with rate limiting, authentication, and request transformation.' },
              { icon: '🕸️', title: 'Service Mesh', desc: 'Transparent service-to-service communication with observability and security.' },
              { icon: '📈', title: 'Auto-Scaling', desc: 'Intelligent auto-scaling based on traffic patterns and resource utilization.' },
              { icon: '🔍', title: 'Observability', desc: 'Full-stack observability with distributed tracing, metrics, and log aggregation.' },
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

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy mb-6 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">Build Your Stack Today</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-navy to-blue text-white font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-on-scroll opacity-0 translate-y-8" style={{ transitionDelay: '100ms' }}>
            Get Started
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
