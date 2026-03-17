import { useState, useEffect, useRef } from 'react';

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

export default function Contact() {
  const sectionRef = useScrollAnimation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div ref={sectionRef} className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-[20%] w-72 h-72 bg-mint/30 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-10 left-[20%] w-64 h-64 bg-blue/40 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }}></div>
          </div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(50,132,255,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-mint text-sm font-medium rounded-full border border-white/10 mb-6 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
            Contact Us
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            Let&apos;s Start a Conversation
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
            Have a question or want to learn more? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-navy mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Ready to transform your business with AI? Reach out to our team and we&apos;ll get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    label: 'Email',
                    value: 'hello@fingrid.ai',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ),
                    label: 'Phone',
                    value: '+1 (555) 123-4567',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    label: 'Location',
                    value: 'San Francisco, CA',
                  },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy to-blue flex items-center justify-center text-white flex-shrink-0 group-hover:shadow-lg group-hover:shadow-blue/25 group-hover:-translate-y-0.5 transition-all duration-300">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{info.label}</p>
                      <p className="text-navy font-semibold">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 font-medium mb-4">Follow us</p>
                <div className="flex gap-3">
                  {['LinkedIn', 'Twitter', 'GitHub'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-blue/30 hover:text-navy hover:shadow-md transition-all duration-300"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '150ms' }}>
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100">
                {submitted ? (
                  <div className="text-center py-16 animate-scale-in">
                    <div className="w-20 h-20 bg-mint/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-mint-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-navy mb-2">Thank You!</h3>
                    <p className="text-gray-500">We&apos;ve received your message and will get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-semibold text-navy mb-2">Full Name</label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/10 transition-all duration-300"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-semibold text-navy mb-2">Email</label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/10 transition-all duration-300"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="contact-company" className="block text-sm font-semibold text-navy mb-2">Company</label>
                        <input
                          id="contact-company"
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/10 transition-all duration-300"
                          placeholder="Acme Inc."
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-subject" className="block text-sm font-semibold text-navy mb-2">Subject</label>
                        <select
                          id="contact-subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/10 transition-all duration-300 appearance-none"
                        >
                          <option value="">Select a topic</option>
                          <option value="demo">Request a Demo</option>
                          <option value="lending">Lending Platform</option>
                          <option value="os-suite">OS Suite</option>
                          <option value="stacks">Stacks</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-semibold text-navy mb-2">Message</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/10 transition-all duration-300 resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-navy to-blue text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue/25 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Send Message</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue to-mint opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map-like decorative section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            {[
              { city: 'San Francisco', country: 'USA', type: 'Headquarters' },
              { city: 'London', country: 'UK', type: 'European Office' },
              { city: 'Singapore', country: 'SG', type: 'APAC Office' },
            ].map((office, i) => (
              <div
                key={office.city}
                className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-blue/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-center"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-navy to-blue rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-blue/20 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-blue uppercase tracking-wider mb-1">{office.type}</p>
                <h3 className="text-xl font-bold text-navy">{office.city}</h3>
                <p className="text-gray-500 text-sm">{office.country}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
