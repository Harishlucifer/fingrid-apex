import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { clientData } from '../data/clients';
import ModernCard from '../components/ModernCard';
import SEO from '../components/SEO';

/* ===== AI Neural Network Background Canvas ===== */
function NeuralNetworkCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let nodes = [];
    const nodeCount = 60;
    const connectionDist = 160;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create nodes
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2.5 + 1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      // Update positions
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > cw) n.vx *= -1;
        if (n.y < 0 || n.y > ch) n.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(50, 132, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const glow = 0.5 + Math.sin(n.pulse) * 0.3;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(53, 234, 149, ${glow})`;
        ctx.fill();
        // outer glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(53, 234, 149, ${glow * 0.15})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

/* ===== Unique SVG Illustrations per Opportunity ===== */
function LenderIllustration() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px] h-auto">
      {/* Bank building */}
      <rect x="90" y="60" width="100" height="80" rx="4" fill="#01347c" opacity="0.12" />
      <rect x="100" y="40" width="80" height="20" rx="2" fill="#01347c" opacity="0.18" />
      <polygon points="140,25 185,40 95,40" fill="#01347c" opacity="0.22" />
      {/* Pillars */}
      <rect x="108" y="70" width="10" height="50" rx="2" fill="#3284ff" opacity="0.3" />
      <rect x="128" y="70" width="10" height="50" rx="2" fill="#3284ff" opacity="0.3" />
      <rect x="148" y="70" width="10" height="50" rx="2" fill="#3284ff" opacity="0.3" />
      <rect x="168" y="70" width="10" height="50" rx="2" fill="#3284ff" opacity="0.3" />
      {/* Arrows going out */}
      <line x1="140" y1="140" x2="60" y2="170" stroke="#35ea95" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
      <line x1="140" y1="140" x2="140" y2="180" stroke="#35ea95" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
      <line x1="140" y1="140" x2="220" y2="170" stroke="#35ea95" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
      {/* Endpoint dots */}
      <circle cx="60" cy="170" r="8" fill="#35ea95" opacity="0.25" />
      <circle cx="60" cy="170" r="4" fill="#35ea95" opacity="0.6" />
      <circle cx="140" cy="180" r="8" fill="#35ea95" opacity="0.25" />
      <circle cx="140" cy="180" r="4" fill="#35ea95" opacity="0.6" />
      <circle cx="220" cy="170" r="8" fill="#35ea95" opacity="0.25" />
      <circle cx="220" cy="170" r="4" fill="#35ea95" opacity="0.6" />
      {/* Labels */}
      <text x="45" y="192" fontSize="9" fill="#01347c" opacity="0.6" fontFamily="Inter">NBFC</text>
      <text x="130" y="198" fontSize="9" fill="#01347c" opacity="0.6" fontFamily="Inter">HFC</text>
      <text x="208" y="192" fontSize="9" fill="#01347c" opacity="0.6" fontFamily="Inter">Bank</text>
    </svg>
  );
}

function EmbeddedFinanceIllustration() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px] h-auto">
      {/* Center API block */}
      <rect x="100" y="70" width="80" height="60" rx="12" fill="#01347c" opacity="0.15" />
      <text x="118" y="105" fontSize="16" fontWeight="700" fill="#01347c" opacity="0.5" fontFamily="Inter">{"<API/>"}</text>
      {/* Platform blocks */}
      <rect x="20" y="30" width="50" height="35" rx="6" fill="#0a9e6e" opacity="0.15" />
      <rect x="20" y="36" width="50" height="4" rx="2" fill="#35ea95" opacity="0.4" />
      <rect x="20" y="44" width="35" height="4" rx="2" fill="#35ea95" opacity="0.25" />
      <rect x="20" y="52" width="45" height="4" rx="2" fill="#35ea95" opacity="0.2" />
      <rect x="210" y="30" width="50" height="35" rx="6" fill="#0a9e6e" opacity="0.15" />
      <rect x="210" y="36" width="50" height="4" rx="2" fill="#35ea95" opacity="0.4" />
      <rect x="210" y="44" width="35" height="4" rx="2" fill="#35ea95" opacity="0.25" />
      <rect x="210" y="52" width="45" height="4" rx="2" fill="#35ea95" opacity="0.2" />
      <rect x="20" y="140" width="50" height="35" rx="6" fill="#3284ff" opacity="0.12" />
      <rect x="20" y="146" width="50" height="4" rx="2" fill="#3284ff" opacity="0.3" />
      <rect x="20" y="154" width="35" height="4" rx="2" fill="#3284ff" opacity="0.2" />
      <rect x="210" y="140" width="50" height="35" rx="6" fill="#3284ff" opacity="0.12" />
      <rect x="210" y="146" width="50" height="4" rx="2" fill="#3284ff" opacity="0.3" />
      <rect x="210" y="154" width="35" height="4" rx="2" fill="#3284ff" opacity="0.2" />
      {/* Connections */}
      <line x1="70" y1="48" x2="100" y2="85" stroke="#3284ff" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
      <line x1="210" y1="48" x2="180" y2="85" stroke="#3284ff" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
      <line x1="70" y1="158" x2="100" y2="115" stroke="#3284ff" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
      <line x1="210" y1="158" x2="180" y2="115" stroke="#3284ff" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
      {/* Arrows */}
      <circle cx="85" cy="66" r="3" fill="#3284ff" opacity="0.5" />
      <circle cx="195" cy="66" r="3" fill="#3284ff" opacity="0.5" />
      <circle cx="85" cy="136" r="3" fill="#3284ff" opacity="0.5" />
      <circle cx="195" cy="136" r="3" fill="#3284ff" opacity="0.5" />
    </svg>
  );
}

function DistributorIllustration() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px] h-auto">
      {/* Center hub */}
      <circle cx="140" cy="90" r="28" fill="#01347c" opacity="0.12" />
      <circle cx="140" cy="90" r="18" fill="#01347c" opacity="0.18" />
      <circle cx="140" cy="90" r="6" fill="#3284ff" opacity="0.5" />
      {/* Satellite nodes */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 140 + Math.cos(rad) * 70;
        const y = 90 + Math.sin(rad) * 65;
        const colors = ['#35ea95', '#3284ff', '#01347c', '#35ea95', '#3284ff', '#01347c'];
        return (
          <g key={i}>
            <line x1="140" y1="90" x2={x} y2={y} stroke={colors[i]} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.35" />
            <circle cx={x} cy={y} r="12" fill={colors[i]} opacity="0.12" />
            <circle cx={x} cy={y} r="5" fill={colors[i]} opacity="0.45" />
          </g>
        );
      })}
      {/* Labels around */}
      <text x="50" y="195" fontSize="8" fill="#01347c" opacity="0.5" fontFamily="Inter">DSA</text>
      <text x="105" y="195" fontSize="8" fill="#01347c" opacity="0.5" fontFamily="Inter">Merchant</text>
      <text x="180" y="195" fontSize="8" fill="#01347c" opacity="0.5" fontFamily="Inter">Builder</text>
      <text x="230" y="195" fontSize="8" fill="#01347c" opacity="0.5" fontFamily="Inter">Dealer</text>
    </svg>
  );
}

const illustrations = [LenderIllustration, EmbeddedFinanceIllustration, DistributorIllustration];

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

const opportunityData = [
  {
    category: 'LENDING SOLUTIONS',
    categoryColor: 'text-navy',
    categoryBg: 'bg-navy/10',
    title: 'Lenders',
    subtitle: 'NBFCs, HFCs, Banks',
    description: 'End-to-end lending suite and affordable sophisticated point solutions for lenders of all sizes.',
    points: [
      'End to end Lending Suite for Small Lenders',
      'Affordable Sophisticated Point Solutions for Lenders with Existing Infrastructure',
    ],
    accentColor: 'from-navy to-blue',
    arrowBg: 'bg-navy',
  },
  {
    category: 'DIGITAL PLATFORMS',
    categoryColor: 'text-emerald-700',
    categoryBg: 'bg-emerald-50',
    title: 'Embedded Finance',
    subtitle: 'Non-fintech platforms',
    description: 'Plug & Play API-first solution with multi-lender integration for platforms looking to embed financing.',
    points: [
      'Plug & Play API first Solution with multi Lender Integration',
      'Seamless embedding into existing digital platforms',
    ],
    accentColor: 'from-emerald-600 to-teal-500',
    arrowBg: 'bg-emerald-600',
  },
  {
    category: 'DISTRIBUTION',
    categoryColor: 'text-amber-700',
    categoryBg: 'bg-amber-50',
    title: 'Loan Distributors',
    subtitle: 'DSAs, Merchants, Builders, Dealers',
    description: 'Comprehensive CRM and ERP solution designed for end-to-end loan distribution management.',
    points: [
      'End to end CRM cum ERP solution for Loan Distribution',
      'Multi-lender panel management and tracking',
    ],
    accentColor: 'from-amber-600 to-orange-500',
    arrowBg: 'bg-amber-600',
  },
];

function OpportunitySection() {
  const [activeIndex, setActiveIndex] = useState(null);
  const sectionRef = useRef(null);

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
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => elements?.forEach((el) => observer.unobserve(el));
  }, []);

  const handleToggle = useCallback((index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-white via-gray-50/50 to-blue/5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 mb-14">
          <span className="text-sm font-semibold text-blue uppercase tracking-wider">Who We Serve</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-navy mt-3 mb-4">Opportunity</h2>
          <p className="text-gray-500 text-lg max-w-2xl">
            Tailored solutions for every player in the lending ecosystem.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
          {opportunityData.map((opp, i) => {
            const isActive = activeIndex === i;
            return (
              <div key={opp.title} className="flex flex-col">
                {/* Card */}
                <button
                  onClick={() => handleToggle(i)}
                  className={`
                    relative text-left w-full rounded-2xl p-6 sm:p-8 border transition-all duration-500 cursor-pointer group overflow-hidden
                    ${isActive
                      ? 'bg-gradient-to-br from-navy via-navy-dark to-[#013a6b] border-navy shadow-2xl shadow-navy/20 scale-[1.02]'
                      : 'bg-white border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 hover:-translate-y-1'
                    }
                  `}
                  aria-expanded={isActive}
                >
                  {/* Decorative glow for active */}
                  {isActive && (
                    <>
                      <div className="absolute top-0 right-0 w-40 h-40 bg-blue/15 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-mint/10 rounded-full blur-3xl translate-y-10 -translate-x-10"></div>
                    </>
                  )}

                  {/* Category Badge */}
                  <span className={`
                    inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md mb-4 transition-colors duration-500
                    ${isActive ? 'bg-white/15 text-mint' : `${opp.categoryBg} ${opp.categoryColor}`}
                  `}>
                    {opp.category}
                  </span>

                  {/* Title */}
                  <h3 className={`
                    text-xl sm:text-2xl font-bold mb-1 transition-colors duration-500
                    ${isActive ? 'text-white' : 'text-navy'}
                  `}>
                    {opp.title}
                  </h3>

                  {/* Subtitle */}
                  <p className={`
                    text-sm mb-4 transition-colors duration-500
                    ${isActive ? 'text-white/60' : 'text-gray-400'}
                  `}>
                    {opp.subtitle}
                  </p>

                  {/* Description */}
                  <p className={`
                    text-sm leading-relaxed mb-6 transition-colors duration-500
                    ${isActive ? 'text-white/80' : 'text-gray-600'}
                  `}>
                    {opp.description}
                  </p>

                  {/* Arrow Button */}
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                    ${isActive
                      ? 'bg-mint text-navy shadow-lg shadow-mint/30'
                      : `${opp.arrowBg} text-white group-hover:scale-110 group-hover:shadow-lg`
                    }
                  `}>
                    <svg
                      className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'rotate-90' : 'group-hover:translate-x-0.5'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>

                {/* Expandable Detail Panel */}
                <div
                  className="grid transition-all duration-500 ease-in-out"
                  style={{
                    gridTemplateRows: isActive ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`
                        mt-3 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-6 sm:p-8
                        transition-all duration-500 ease-in-out
                        ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
                      `}
                    >
                      {/* Points */}
                      <h4 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">Key Highlights</h4>
                      <ul className="space-y-3 mb-6">
                        {opp.points.map((point, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed"
                          >
                            <span className={`
                              w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                              bg-gradient-to-br ${opp.accentColor} text-white
                            `}>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Illustration — unique per card */}
                      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-navy/5 to-blue/5 p-6 flex justify-center">
                        {(() => { const Illus = illustrations[i]; return <Illus />; })()}
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-mint/20 rounded-full blur-lg animate-float"></div>
                        <div className="absolute -bottom-2 -left-4 w-12 h-12 bg-blue/15 rounded-full blur-lg animate-float" style={{ animationDelay: '1.5s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const sectionRef = useScrollAnimation();

  return (
    <div ref={sectionRef} className="overflow-hidden">
      <SEO
        title="Fingrid.ai - Intelligent AI Solutions for Modern Finance"
        description="Transform your financial operations with Fingrid.ai's cutting-edge AI platform. From lending automation to data services, we power the future of fintech."
        keywords="Fingrid.ai, AI, fintech, lending automation, financial technology, loan origination, credit scoring"
      />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* AI Neural Network animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy">
          {/* Soft glowing orbs */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue/30 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-mint/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue/10 rounded-full blur-[150px] animate-pulse-glow"></div>
          </div>
          {/* Neural network canvas */}
          <NeuralNetworkCanvas />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(50,132,255,0.08) 1px, transparent 0)',
            backgroundSize: '48px 48px'
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
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-mint rounded-full animate-pulse"></div>
          </div>
        </div> */}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 card-grid">
            {[
              {
                icon: '🚀',
                title: 'Lightning Fast',
                description: 'Process millions of transactions in real-time with our optimized infrastructure and AI-driven automation.',
                iconBg: 'bg-gradient-to-br from-blue/10 to-blue/5',
              },
              {
                icon: '🔒',
                title: 'Bank-Grade Security',
                description: 'Enterprise-level encryption and compliance with global financial regulations ensure your data stays protected.',
                iconBg: 'bg-gradient-to-br from-navy/10 to-navy/5',
              },
              {
                icon: '🤖',
                title: 'AI-Powered Insights',
                description: 'Leverage machine learning algorithms that continuously learn and adapt to provide actionable intelligence.',
                iconBg: 'bg-gradient-to-br from-mint/10 to-mint/5',
              },
              {
                icon: '📊',
                title: 'Advanced Analytics',
                description: 'Comprehensive dashboards and reporting tools that transform raw data into strategic business decisions.',
                iconBg: 'bg-gradient-to-br from-blue/10 to-mint/5',
              },
              {
                icon: '🔗',
                title: 'Seamless Integration',
                description: 'Connect with your existing systems through our robust APIs and pre-built integrations with major platforms.',
                iconBg: 'bg-gradient-to-br from-mint/10 to-blue/5',
              },
              {
                icon: '🌐',
                title: 'Global Scale',
                description: 'Deploy across regions with multi-currency support, localized compliance, and 24/7 global infrastructure.',
                iconBg: 'bg-gradient-to-br from-navy/10 to-blue/5',
              },
            ].map((feature, i) => (
              <ModernCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconBg={feature.iconBg}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Opportunity Section */}
      <OpportunitySection />

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
                gradient: 'from-navy to-blue',
                link: '/products/os-suite',
              },
              {
                title: 'Stacks',
                description: 'Modular technology stacks designed to scale with your business needs and integrate seamlessly.',
                features: ['Microservices', 'Cloud Native', 'API Gateway'],
                gradient: 'from-navy to-blue',
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

      {/* Trusted By Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-sm font-semibold text-blue uppercase tracking-wider">Trusted By</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-3">
              Leading Financial Institutions
            </h2>
          </div>

          {/* Logo Marquee */}
          <div className="relative overflow-hidden animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
            <div className="flex animate-marquee items-center">
              {[...clientData.clients, ...clientData.clients, ...clientData.clients].map((client, i) => (
                <div
                  key={`${client.name}-${i}`}
                  className="flex-shrink-0 h-14 mx-12 flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500"
                >
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="h-10 w-auto max-w-[160px] object-contain"
                    />
                  ) : (
                    <span className="text-xl font-bold text-gray-400 whitespace-nowrap">{client.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute -left-40 top-1/4 w-80 h-80 bg-blue/5 rounded-full blur-[100px]"></div>
        <div className="absolute -right-40 bottom-1/4 w-80 h-80 bg-navy/5 rounded-full blur-[100px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-sm font-semibold text-blue uppercase tracking-wider">Success Stories</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mt-3 mb-4">
              Client Testimonials
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Hear from the leaders who transformed their lending operations with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ashish Pawar',
                role: 'Head Products',
                company: 'Flexiloans',
                avatar: new URL('../assets/testimonials/ashish_pawar.png', import.meta.url).href,
                quote: 'In V1, we were managing DSA Business and in V2, we are managing all our Loan sales across DSA, Digital Alliance, FOS',
              },
              {
                name: 'Aditya Shankar',
                role: 'Fintech Head',
                company: 'TradeUdhaar',
                avatar: new URL('../assets/testimonials/aditya_shankar.png', import.meta.url).href,
                quote: 'Lendingstack Team comes with Deep domain expertise and technical prowess to automate our FLDG based Fintech Lending Process',
              },
              {
                name: 'Balaji',
                role: 'CTO',
                company: 'Fleximart',
                avatar: new URL('../assets/testimonials/balaji.png', import.meta.url).href,
                quote: 'Lendingstack is Operating system for Distributors like us with Apps, Portals, Workflow, Rule engine, Lender Integrations',
              },
            ].map((testimonial, i) => (
              <div
                key={testimonial.name}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="h-full bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:shadow-blue/10 hover:-translate-y-3 transition-all duration-500 overflow-hidden flex flex-col">
                  {/* Avatar + Name Badge */}
                  <div className="relative flex flex-col items-center pt-10 pb-6">
                    {/* Decorative ring */}
                    <div className="absolute top-4 w-24 h-24 rounded-full border-2 border-dashed border-blue/20 group-hover:border-blue/40 group-hover:rotate-180 transition-all duration-1000"></div>
                    {/* Avatar */}
                    <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg group-hover:scale-110 transition-transform duration-500 z-10">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Name Badge */}
                    <div className="mt-4 bg-gradient-to-r from-blue to-blue-light text-white py-3 px-6 rounded-xl text-center shadow-lg shadow-blue/20 group-hover:shadow-blue/30 group-hover:scale-105 transition-all duration-500">
                      <div className="font-bold text-sm">{testimonial.name},</div>
                      <div className="text-white/80 text-xs">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="flex-1 px-8 pb-8 pt-2 relative">
                    {/* Large quote mark */}
                    <svg className="absolute top-0 left-6 w-10 h-10 text-blue/10 group-hover:text-blue/20 transition-colors duration-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                    </svg>
                    <p className="text-gray-600 leading-relaxed text-sm pl-4 italic relative z-10">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-1.5 bg-gradient-to-r from-navy via-blue to-blue-light opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
