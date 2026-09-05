import React, { useState } from 'react';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';

interface PublicLayoutProps {
  children: React.ReactNode;
  activeNav?: string;
  onNavigate?: (route: string) => void;
  onAuthClick?: (mode: 'login' | 'register') => void;
  onOpenBlueprint?: (mode: string) => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  activeNav = 'home',
  onNavigate,
  onAuthClick,
  onOpenBlueprint,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'plans', label: 'Plans' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f4f7f5' }}>
      {/* Primary Public Header - Single, High-Contrast, Deep Forest & Emerald */}
      <header 
        className="sticky-top border-bottom"
        style={{ 
          backgroundColor: '#071911', 
          borderColor: '#163e28',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          zIndex: 1040 
        }}
      >
        <div className="container-xl py-2.5 d-flex align-items-center justify-content-between" style={{ minHeight: '64px' }}>
          {/* Brand Logo */}
          <div 
            className="cursor-pointer d-flex align-items-center" 
            onClick={() => onNavigate?.('home')} 
            role="button" 
            tabIndex={0}
          >
            <Logo size="md" variant="light" />
          </div>

          {/* Desktop Navigation Links (High Contrast, Bold, Emerald Active Highlight) */}
          <nav className="d-none d-lg-flex align-items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className={`btn btn-link text-decoration-none px-3 py-1.5 rounded-pill fw-bold ${
                    isActive ? 'text-white' : 'text-light-body'
                  }`}
                  style={{ 
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 800 : 600,
                    backgroundColor: isActive ? 'rgba(34, 197, 94, 0.18)' : 'transparent',
                    color: isActive ? '#4ade80' : '#e2e8f0',
                    border: isActive ? '1px solid rgba(74, 222, 128, 0.45)' : '1px solid transparent',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#4ade80';
                      e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Auth Action Buttons (Secondary Orange + Primary Black/Emerald CTA) */}
          <div className="d-none d-sm-flex align-items-center gap-2.5">
            {/* Secondary CTA: Login (Orange Accent) */}
            <button
              type="button"
              onClick={() => onAuthClick?.('login')}
              className="btn btn-sm fw-bold px-3 py-1.5 rounded-3 d-inline-flex align-items-center gap-1.5"
              style={{
                backgroundColor: 'transparent',
                color: '#fb923c',
                border: '1.5px solid #ea580c',
                fontSize: '0.88rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(234, 88, 12, 0.15)';
                e.currentTarget.style.color = '#fdba74';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#fb923c';
              }}
            >
              <i className="bi bi-box-arrow-in-right" />
              <span>Login</span>
            </button>

            {/* Primary CTA: Sign Up / Register (Black surface + white text + crisp emerald border) */}
            <button
              type="button"
              onClick={() => onAuthClick?.('register')}
              className="btn btn-sm fw-bold px-3.5 py-1.5 rounded-3 text-white d-inline-flex align-items-center gap-1.5"
              style={{
                backgroundColor: '#060b08',
                color: '#ffffff',
                border: '1.5px solid #22c55e',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5), 0 0 10px rgba(34, 197, 94, 0.25)',
                fontSize: '0.88rem',
                fontWeight: 800,
                letterSpacing: '0.01em',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0b1610';
                e.currentTarget.style.borderColor = '#4ade80';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.6), 0 0 16px rgba(74, 222, 128, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#060b08';
                e.currentTarget.style.borderColor = '#22c55e';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.5), 0 0 10px rgba(34, 197, 94, 0.25)';
              }}
            >
              <i className="bi bi-person-plus-fill text-success" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="btn btn-sm d-lg-none border p-2 text-white"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            style={{
              backgroundColor: '#0c261a',
              borderColor: '#22c55e',
              minHeight: '44px',
              minWidth: '44px',
            }}
          >
            <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-5 text-white`} />
          </button>
        </div>

        {/* Mobile Dropdown Menu (Single unified mobile menu) */}
        {mobileMenuOpen && (
          <div 
            className="d-lg-none border-top px-3 py-3 shadow-lg"
            style={{ backgroundColor: '#071911', borderColor: '#19452b' }}
          >
            <div className="d-flex flex-column gap-2 mb-3">
              {navItems.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate?.(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className="btn text-start py-2.5 px-3 fw-bold rounded-3"
                    style={{
                      backgroundColor: isActive ? '#16a34a' : '#0d2b1e',
                      color: '#ffffff',
                      border: isActive ? '1px solid #22c55e' : '1px solid #19452b',
                      minHeight: '44px',
                      fontSize: '0.95rem',
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="d-flex gap-2 pt-2 border-top" style={{ borderColor: '#19452b' }}>
              <button
                className="btn btn-sm py-2.5 fw-bold w-50 rounded-3 text-orange"
                style={{
                  backgroundColor: 'transparent',
                  border: '1.5px solid #ea580c',
                  minHeight: '44px',
                }}
                onClick={() => {
                  onAuthClick?.('login');
                  setMobileMenuOpen(false);
                }}
              >
                <i className="bi bi-box-arrow-in-right me-1" /> Login
              </button>
              <button
                className="btn btn-sm py-2.5 fw-bold w-50 rounded-3 text-white"
                style={{
                  backgroundColor: '#060b08',
                  border: '1.5px solid #22c55e',
                  minHeight: '44px',
                }}
                onClick={() => {
                  onAuthClick?.('register');
                  setMobileMenuOpen(false);
                }}
              >
                <i className="bi bi-person-plus-fill text-success me-1" /> Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content View */}
      <main className="flex-grow-1">
        {children}
      </main>

      {/* Public Footer (Deep Forest Luxury Background) */}
      <footer className="mt-auto border-top text-white" style={{ backgroundColor: '#071810', borderColor: '#163825' }}>
        <div className="container-xl py-5">
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <Logo size="md" variant="light" showTagline />
              <p className="small text-light-body mt-3 fw-medium" style={{ maxWidth: 330, lineHeight: 1.65 }}>
                Next-generation smart mining node distribution and automated reward calculation platform powered by authoritative cryptographic ledger verification.
              </p>
              <div className="d-flex gap-2 mt-3">
                <span className="badge bg-success text-white border border-success fw-bold px-2.5 py-1.5">
                  <i className="bi bi-shield-check me-1" /> TRC20 Ready
                </span>
                <span className="badge bg-warning text-dark border border-warning fw-bold px-2.5 py-1.5">
                  <i className="bi bi-cpu me-1" /> BEP20 Ready
                </span>
              </div>
            </div>

            <div className="col-6 col-md-2">
              <h6 className="fw-extrabold text-white small text-uppercase tracking-wider mb-3">Platform</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 text-light-body fw-medium">
                <li>
                  <button 
                    onClick={() => onNavigate?.('plans')} 
                    className="btn btn-link p-0 text-light-body text-decoration-none hover-white small"
                  >
                    Mining Plans
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('how-it-works')} 
                    className="btn btn-link p-0 text-light-body text-decoration-none hover-white small"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('about')} 
                    className="btn btn-link p-0 text-light-body text-decoration-none hover-white small"
                  >
                    About Platform
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('faq')} 
                    className="btn btn-link p-0 text-light-body text-decoration-none hover-white small"
                  >
                    FAQ Database
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('contact')} 
                    className="btn btn-link p-0 text-light-body text-decoration-none hover-white small"
                  >
                    Contact Support
                  </button>
                </li>
              </ul>
            </div>

            <div className="col-6 col-md-2">
              <h6 className="fw-extrabold text-white small text-uppercase tracking-wider mb-3">Governance</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 text-light-body fw-medium">
                <li>
                  <button 
                    onClick={() => onNavigate?.('risk-disclosure')} 
                    className="btn btn-link p-0 text-warning fw-bold text-decoration-none hover-white small"
                  >
                    Risk Disclosure
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('terms')} 
                    className="btn btn-link p-0 text-light-body text-decoration-none hover-white small"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('privacy')} 
                    className="btn btn-link p-0 text-light-body text-decoration-none hover-white small"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onAuthClick?.('register')} 
                    className="btn btn-link p-0 text-success fw-bold text-decoration-none small"
                  >
                    Sign Up Account
                  </button>
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-4">
              <h6 className="fw-extrabold text-white small text-uppercase tracking-wider mb-3">Operational Compliance</h6>
              <div className="p-3 rounded-3" style={{ backgroundColor: '#0e261a', border: '1.5px solid #1f4f34' }}>
                <p className="small text-light-body mb-0 fw-medium" style={{ fontSize: '0.84rem', lineHeight: '1.6' }}>
                  MinePro enforces transparent financial parameters. All reward rates and cycles are dependent on active network nodes and server-side rules. No returns or income are guaranteed.
                </p>
              </div>
            </div>
          </div>

          <div className="border-top pt-4 d-flex flex-column flex-sm-row align-items-center justify-content-between text-light-subtle small" style={{ borderColor: '#1b3d2c' }}>
            <div>&copy; {new Date().getFullYear()} MinePro Network. All rights reserved.</div>
            <div className="mt-2 mt-sm-0 d-flex gap-3">
              <span className="text-success fw-bold"><i className="bi bi-circle-fill fs-8 me-1" /> Node Network Active (99.98%)</span>
            </div>
          </div>

          {/* Blueprint & Architecture Direct Access (For Reviewers) */}
          {onOpenBlueprint && (
            <div className="mt-3 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2 text-white-50 small" style={{ borderColor: '#153123', fontSize: '0.78rem' }}>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-dark border border-success border-opacity-50 text-success fw-bold font-monospace">
                  STAGE VERIFICATION
                </span>
                <span>System blueprints &amp; interactive workspaces:</span>
              </div>
              <div className="d-flex gap-2">
                <button 
                  onClick={() => onOpenBlueprint('user')}
                  className="btn btn-link text-white-50 text-decoration-none p-0 hover-white small"
                >
                  <i className="bi bi-speedometer2 text-success me-1" /> User Dashboard
                </button>
                <span className="text-secondary">&bull;</span>
                <button 
                  onClick={() => onOpenBlueprint('admin')}
                  className="btn btn-link text-white-50 text-decoration-none p-0 hover-white small"
                >
                  <i className="bi bi-shield-lock text-warning me-1" /> Admin Panel
                </button>
                <span className="text-secondary">&bull;</span>
                <button 
                  onClick={() => onOpenBlueprint('blueprint')}
                  className="btn btn-link text-white-50 text-decoration-none p-0 hover-white small"
                >
                  <i className="bi bi-diagram-3 text-info me-1" /> System Architecture
                </button>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
