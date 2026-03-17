import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const navItems = [
  { label: 'Home', path: '/' },
  {
    label: 'Products',
    path: '/products',
    children: [
      {
        label: 'Lending',
        path: '/products/lending',
        children: [
          { label: 'Bc DS', path: '/products/lending/bc-ds' },
          { label: 'DSaaS', path: '/products/lending/dsaas' },
        ],
      },
      { label: 'OS Suite', path: '/products/os-suite' },
      { label: 'Stacks', path: '/products/stacks' },
    ],
  },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

function DropdownItem({ item, level = 0 }) {
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
        onClick={() => setIsOpen(false)}
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
          {level === 0 ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 min-w-[200px] bg-white rounded-xl shadow-2xl border border-gray-100 p-2 animate-fade-in-down
            ${level === 0 ? 'left-full top-0 ml-1' : 'left-full top-0 ml-1'}
          `}
          style={{ animationDuration: '0.25s' }}
        >
          {item.children.map((child) => (
            <DropdownItem key={child.path} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-navy/5 py-2'
          : 'bg-white/80 backdrop-blur-md py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Fingrid.ai"
              className="h-10 w-auto transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div key={item.label} className="relative">
                  {hasChildren ? (
                    <button
                      className={`relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-1.5
                        ${isActive
                          ? 'text-navy'
                          : 'text-gray-600 hover:text-navy'
                        }
                      `}
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {/* Active indicator */}
                      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue to-mint rounded-full transition-all duration-500 ${isActive ? 'w-8' : 'w-0'}`}></span>
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 block
                        ${isActive
                          ? 'text-navy'
                          : 'text-gray-600 hover:text-navy'
                        }
                      `}
                    >
                      {item.label}
                      {/* Active indicator line */}
                      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue to-mint rounded-full transition-all duration-500 ${isActive ? 'w-8' : 'w-0 group-hover:w-4'}`}></span>
                    </Link>
                  )}

                  {/* Dropdown */}
                  {hasChildren && activeDropdown === item.label && (
                    <div
                      className="absolute top-full left-0 mt-2 min-w-[220px] bg-white rounded-2xl shadow-2xl border border-gray-100/80 p-2.5 animate-fade-in-down"
                      style={{ animationDuration: '0.3s' }}
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="absolute -top-2 left-6 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100/80"></div>
                      {item.children.map((child) => (
                        <DropdownItem key={child.path} item={child} />
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
              className="relative px-6 py-2.5 bg-gradient-to-r from-navy to-blue text-white text-sm font-semibold rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-blue/25 hover:-translate-y-0.5"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue to-mint opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span className={`block h-0.5 bg-navy rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 bg-navy rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : ''}`}></span>
              <span className={`block h-0.5 bg-navy rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-100 p-4 shadow-xl">
            {navItems.map((item) => (
              <MobileNavItem key={item.label} item={item} />
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                to="/contact"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-navy to-blue text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
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
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue' : 'bg-gray-300'}`}></span>
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
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue' : 'bg-gray-300'}`}></span>
          {item.label}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        {item.children.map((child) => (
          <MobileNavItem key={child.path} item={child} level={level + 1} />
        ))}
      </div>
    </div>
  );
}
