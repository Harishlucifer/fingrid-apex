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

const team = [
  { name: 'Alex Morgan', role: 'CEO & Co-Founder', gradient: 'from-navy to-blue' },
  { name: 'Sarah Chen', role: 'CTO', gradient: 'from-blue to-blue-light' },
  { name: 'James Wu', role: 'VP of Engineering', gradient: 'from-mint-dark to-mint' },
  { name: 'Priya Patel', role: 'Head of AI/ML', gradient: 'from-navy to-mint-dark' },
];

const timeline = [
  { year: '2019', title: 'Founded', description: 'Fingrid.ai was founded with a vision to transform financial services through AI.' },
  { year: '2020', title: 'First Product', description: 'Launched our Lending Platform, serving over 50 clients in the first year.' },
  { year: '2021', title: 'Series A', description: 'Raised $25M in Series A funding to expand our product suite and team.' },
  { year: '2022', title: 'OS Suite Launch', description: 'Released our comprehensive operating suite for financial institutions.' },
  { year: '2023', title: 'Global Expansion', description: 'Expanded to 50+ countries with multi-currency and regulatory support.' },
  { year: '2024', title: 'Stacks Release', description: 'Launched our modular technology stacks for enterprise-grade deployments.' },
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-mint text-sm font-medium rounded-full border border-white/10 mb-6 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            Building the Future of
            <br />
            <span className="gradient-text">Financial Technology</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
            We&apos;re on a mission to democratize access to intelligent financial tools and empower businesses worldwide.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <div className="inline-flex items-center gap-2 p-3 bg-navy/10 rounded-2xl mb-6">
                <svg className="w-8 h-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-navy mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To revolutionize financial services by building intelligent, accessible, and scalable AI solutions. 
                We believe that every business, regardless of size, deserves access to world-class financial technology.
              </p>
            </div>
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '150ms' }}>
              <div className="inline-flex items-center gap-2 p-3 bg-mint/10 rounded-2xl mb-6">
                <svg className="w-8 h-8 text-mint-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-navy mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                A world where AI empowers every financial decision with precision, speed, and transparency. 
                We envision a future where technology bridges the gap between complexity and simplicity in finance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-4xl font-bold text-navy mb-4">Our Core Values</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">The principles that guide everything we do.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '💡', title: 'Innovation', description: 'Constantly pushing boundaries to deliver cutting-edge solutions.' },
              { icon: '🤝', title: 'Trust', description: 'Building lasting relationships through transparency and reliability.' },
              { icon: '🎯', title: 'Excellence', description: 'Committed to delivering the highest quality in everything we do.' },
              { icon: '🌱', title: 'Growth', description: 'Fostering continuous learning and professional development.' },
            ].map((value, i) => (
              <div
                key={value.title}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group p-8 bg-white rounded-2xl border border-gray-100 hover:border-blue/20 hover:shadow-xl hover:-translate-y-2 cursor-default text-center"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{value.icon}</div>
                <h3 className="text-lg font-bold text-navy mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-4xl font-bold text-navy mb-4">Our Journey</h2>
            <p className="text-gray-500 text-lg">From a bold idea to a global platform.</p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-navy via-blue to-mint rounded-full"></div>

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 flex gap-8 items-start"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy to-blue flex items-center justify-center shadow-lg shadow-blue/20">
                      <span className="text-white font-bold text-sm">{item.year}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-bold text-navy mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-4xl font-bold text-navy mb-4">Leadership Team</h2>
            <p className="text-gray-500 text-lg">Meet the people driving innovation at Fingrid.ai.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div
                key={member.name}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div className={`bg-gradient-to-br ${member.gradient} h-48 relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                        <span className="text-white text-2xl font-bold">{member.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-navy">{member.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{member.role}</p>
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
            Want to Join Our Team?
          </h2>
          <p className="text-gray-600 text-lg mb-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '100ms' }}>
            We&apos;re always looking for talented individuals who share our passion for innovation.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-navy to-blue text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue/25 hover:-translate-y-1 transition-all duration-300 animate-on-scroll opacity-0 translate-y-8"
            style={{ transitionDelay: '200ms' }}
          >
            Get in Touch
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
