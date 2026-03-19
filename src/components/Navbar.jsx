import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const navItems = [
  { label: 'Home', path: '/' },
  {
    label: 'Products',
    path: '/products',
    children: [
      { label: 'FinGrid Studio', path: '/products/studio' },
      {
        label: 'FinGrid Stacks',
        path: '/products/stacks',
        children: [
          { label: 'Marketing', path: '/products/stacks/marketing' },
          { label: 'Sales', path: '/products/stacks/sales' },
          { label: 'Credit', path: '/products/stacks/credit' },
          { label: 'Loan Life Cycle', path: '/products/stacks/loan-lifecycle' },
          { label: 'Collections', path: '/products/stacks/collections' },
          { label: 'Accounting', path: '/products/stacks/accounting' },
        ],
      },
      {
        label: 'FinGrid OS',
        path: '/products/os',
        children: [
          { label: 'LenderOS', path: '/products/os/lender-os' },
          { label: 'BcOS', path: '/products/os/bc-os' },
          { label: 'DsaOS', path: '/products/os/dsa-os' },
          { label: 'LspOS', path: '/products/os/lsp-os' },
          { label: 'AgencyOS', path: '/products/os/agency-os' },
          { label: 'AutoDealerOS', path: '/products/os/auto-dealer-os' },
        ],
      },
      {
        label: 'FinGrid Network',
        path: '/products/network',
        children: [
          { label: 'Register', path: '/products/network/register' },
          { label: 'Profile Due Diligence', path: '/products/network/profile-due-diligence' },
          { label: 'Discover', path: '/products/network/discover' },
          { label: 'Network', path: '/products/network/network' },
          { label: 'Deal Room', path: '/products/network/deal-room' },
          { label: 'Integrate', path: '/products/network/integrate' },
        ],
      },
      { label: 'FinGrid AI', path: '/products/agentic-ai' },
    ],
  },
  { label: 'Innovation', path: '/innovation' },
  { label: 'GTM Strategy', path: '/gtm-strategy' },
  { label: 'About', path: '/about' },
];

function DropdownItem({ item, level = 0, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!hasChildren) {
    return (
      <Link
        to={item.path}
        className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap
          ${isActive
            ? 'bg-gradient-to-r from-blue to-mint text-white shadow-md'
            : 'text-gray-700 hover:bg-blue/5 hover:text-navy'
          }
        `}
        onClick={() => { setIsOpen(false); onClose?.(); }}
      >
        <span className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-white scale-125' : 'bg-blue/40'}`}></span>
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 w-full
          ${isActive
            ? 'bg-blue/10 text-navy'
            : 'text-gray-700 hover:bg-blue/5 hover:text-navy'
          }
        `}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-blue scale-125' : 'bg-blue/40'}`}></span>
        {item.label}
        <svg
          className={`w-3.5 h-3.5 ml-auto transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Sub-dropdown with smooth transition (always mounted) */}
      <div
        className={`absolute z-50 min-w-[200px] bg-white rounded-xl shadow-2xl border border-gray-100 p-2 left-full top-0 ml-1
          transition-all duration-300 ease-out origin-top-left
          ${isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
          }
        `}
      >
        {item.children.map((child) => (
          <DropdownItem key={child.path} item={child} level={level + 1} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownEnter = useCallback((label) => {
    clearTimeout(hoverTimeoutRef.current);
    setActiveDropdown(label);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        padding: scrolled ? '0' : '16px 16px 0 16px',
      }}
    >
      <nav
        className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] backdrop-blur-xl"
        style={{
          maxWidth: scrolled ? '100%' : '1280px',
          margin: '0 auto',
          backgroundColor: scrolled ? 'rgba(1, 52, 124, 0.97)' : 'rgba(255, 255, 255, 0.97)',
          borderRadius: scrolled ? '0' : '16px',
          boxShadow: scrolled
            ? '0 4px 30px rgba(0,0,0,0.15)'
            : '0 4px 20px rgba(0,0,0,0.05)',
          padding: scrolled ? '12px 24px' : '12px 24px',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Fingrid.ai"
              className="h-10 w-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              style={{
                filter: scrolled ? 'brightness(0) invert(1)' : 'none',
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              const hasChildren = item.children && item.children.length > 0;
              const isDropdownOpen = activeDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && handleDropdownEnter(item.label)}
                  onMouseLeave={() => hasChildren && handleDropdownLeave()}
                >
                  {hasChildren ? (
                    <button
                      className="relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-500 ease-out flex items-center gap-1.5"
                      style={{
                        color: scrolled
                          ? (isActive ? '#ffffff' : 'rgba(209,213,219,1)')
                          : (isActive ? '#01347c' : 'rgba(75,85,99,1)'),
                      }}
                      onClick={() => setActiveDropdown(isDropdownOpen ? null : item.label)}
                    >
                      {item.label}
                      <svg
                        className="w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {/* Active indicator */}
                      <span
                        className="absolute bottom-0 left-1/2 h-0.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          transform: 'translateX(-50%)',
                          width: isActive ? '32px' : '0px',
                          background: scrolled
                            ? '#35ea95'
                            : 'linear-gradient(to right, #3284ff, #35ea95)',
                        }}
                      ></span>
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className="relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-500 ease-out block group/link"
                      style={{
                        color: scrolled
                          ? (isActive ? '#ffffff' : 'rgba(209,213,219,1)')
                          : (isActive ? '#01347c' : 'rgba(75,85,99,1)'),
                      }}
                      onMouseEnter={() => {
                        // Close any open dropdown when hovering non-dropdown items
                        clearTimeout(hoverTimeoutRef.current);
                        setActiveDropdown(null);
                      }}
                    >
                      {item.label}
                      {/* Active indicator line */}
                      <span
                        className="absolute bottom-0 left-1/2 h-0.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:w-4"
                        style={{
                          transform: 'translateX(-50%)',
                          width: isActive ? '32px' : undefined,
                          background: scrolled
                            ? '#35ea95'
                            : 'linear-gradient(to right, #3284ff, #35ea95)',
                        }}
                      ></span>
                    </Link>
                  )}

                  {/* Dropdown — always mounted for exit animations */}
                  {hasChildren && (
                    <div
                      className={`
                        absolute top-full left-0 mt-2 min-w-[220px] bg-white rounded-2xl shadow-2xl border border-gray-100/80 p-2.5
                        transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] origin-top
                        ${isDropdownOpen
                          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                        }
                      `}
                      onMouseEnter={() => handleDropdownEnter(item.label)}
                      onMouseLeave={() => handleDropdownLeave()}
                    >
                      {/* Caret arrow */}
                      <div
                        className="absolute -top-2 left-6 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100/80 transition-opacity duration-300"
                        style={{ opacity: isDropdownOpen ? 1 : 0 }}
                      ></div>
                      {item.children.map((child) => (
                        <DropdownItem key={child.path} item={child} onClose={() => setActiveDropdown(null)} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              className="relative px-6 py-2.5 text-sm font-semibold rounded-xl overflow-hidden group transition-all duration-500 ease-out hover:-translate-y-0.5"
              style={{
                backgroundColor: scrolled ? '#ffffff' : undefined,
                backgroundImage: scrolled ? undefined : 'linear-gradient(to right, #01347c, #3284ff)',
                color: scrolled ? '#01347c' : '#ffffff',
                boxShadow: scrolled ? undefined : '0 4px 15px rgba(50,132,255,0.25)',
              }}
            >
              <span className="relative z-10">Contact Us</span>
              {!scrolled && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue to-mint opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-500 ${
              scrolled ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span
                className="block h-0.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  backgroundColor: scrolled ? '#fff' : '#01347c',
                  transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
                  width: mobileOpen ? '100%' : '100%',
                }}
              ></span>
              <span
                className="block h-0.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  backgroundColor: scrolled ? '#fff' : '#01347c',
                  opacity: mobileOpen ? 0 : 1,
                  transform: mobileOpen ? 'scaleX(0)' : 'scaleX(1)',
                }}
              ></span>
              <span
                className="block h-0.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  backgroundColor: scrolled ? '#fff' : '#01347c',
                  transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
                  width: mobileOpen ? '100%' : '100%',
                }}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu — grid-rows transition for smooth height */}
        <div
          className="lg:hidden grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            gridTemplateRows: mobileOpen ? '1fr' : '0fr',
          }}
        >
          <div className="overflow-hidden">
            <div
              className={`
                mt-4 rounded-2xl border p-4 shadow-xl
                transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                ${scrolled
                  ? 'bg-white/95 backdrop-blur-xl border-white/10'
                  : 'bg-white/95 backdrop-blur-xl border-gray-100'
                }
              `}
            >
              {navItems.map((item) => (
                <MobileNavItem key={item.label} item={item} />
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to="/contact"
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-navy to-blue text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

function MobileNavItem({ item, level = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = location.pathname === item.path;

  if (!hasChildren) {
    return (
      <Link
        to={item.path}
        className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300
          ${isActive
            ? 'bg-gradient-to-r from-blue/10 to-mint/10 text-navy font-semibold'
            : 'text-gray-600 hover:bg-gray-50 hover:text-navy'
          }
        `}
        style={{ paddingLeft: `${(level + 1) * 16}px` }}
      >
        <span className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-blue' : 'bg-gray-300'}`}></span>
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <div>
      <button
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300
          ${isActive
            ? 'bg-blue/5 text-navy font-semibold'
            : 'text-gray-600 hover:bg-gray-50 hover:text-navy'
          }
        `}
        style={{ paddingLeft: `${(level + 1) * 16}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-blue' : 'bg-gray-300'}`}></span>
          {item.label}
        </span>
        <svg
          className="w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* Smooth grid-rows expand/collapse */}
      <div
        className="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
        }}
      >
        <div className="overflow-hidden">
          <div
            className={`transition-all duration-400 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          >
            {item.children.map((child) => (
              <MobileNavItem key={child.path} item={child} level={level + 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
