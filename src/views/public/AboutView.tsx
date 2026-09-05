import React from 'react';
import { Button } from '../../components/ui/Button';

interface AboutViewProps {
  onGetStarted?: () => void;
  onExplorePlans?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onGetStarted,
  onExplorePlans,
}) => {
  return (
    <div className="pb-5">
      {/* Page Hero Header */}
      <section 
        className="py-5 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #071911 0%, #0c2b1e 65%, #133a2a 100%)',
          borderBottom: '2px solid #22c55e',
        }}
      >
        <div className="container-xl py-4 position-relative z-1">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <span 
                className="badge px-3 py-1.5 rounded-pill mb-3 fw-bold text-uppercase"
                style={{ backgroundColor: '#ffedd5', color: '#ea580c', fontSize: '0.75rem', letterSpacing: '0.04em' }}
              >
                ABOUT MINEPRO
              </span>
              <h1 
                className="display-4 fw-extrabold text-white mb-3"
                style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}
              >
                Built for Transparent, Deterministic Mining Operations
              </h1>
              <p className="lead text-light-body fw-medium" style={{ maxWidth: 680, fontSize: '1.15rem', lineHeight: 1.65 }}>
                MinePro was engineered to bridge computational digital mining infrastructure with an authoritative, transparent ledger architecture. We eliminate hardware maintenance friction through standardized, configurable reward tiers.
              </p>
            </div>
            <div className="col-12 col-lg-4 text-lg-end">
              <div 
                className="p-4 rounded-4 text-start d-inline-block w-100"
                style={{ 
                  backgroundColor: '#071d12', 
                  border: '1.5px solid #22c55e',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)' 
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-shield-check fs-4 text-success" />
                  <span className="fw-bold text-white small text-uppercase">Platform Principle</span>
                </div>
                <div className="text-light-body small fw-medium" style={{ lineHeight: 1.6 }}>
                  Authoritative timestamp sequencing, server-side ledger verification, and open settlement windows.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Philosophy Grid */}
      <section className="container-xl py-5">
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-6">
            <div className="card-minepro p-4 p-lg-5 h-100 bg-white">
              <div 
                className="rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-3"
                style={{ backgroundColor: '#dcfce7', color: '#15803d', width: 56, height: 56 }}
              >
                <i className="bi bi-bullseye fs-3" />
              </div>
              <h3 className="fw-bold text-dark mb-3">Our Core Mission</h3>
              <p className="text-muted fw-medium mb-3" style={{ lineHeight: 1.65 }}>
                Our mission is to provide an accessible digital mining management interface where participants can select predefined tiers, participate in structured 24-hour cycle settlements, and track transactions with complete cryptographic clarity.
              </p>
              <p className="text-muted fw-medium mb-0" style={{ lineHeight: 1.65 }}>
                Instead of managing noisy ASICs, dealing with volatile electricity contracts, or calibrating cooling systems individually, MinePro standardizes position allocation into intuitive, rule-governed digital plans.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card-minepro p-4 p-lg-5 h-100 bg-white">
              <div 
                className="rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-3"
                style={{ backgroundColor: '#ffedd5', color: '#c2410c', width: 56, height: 56 }}
              >
                <i className="bi bi-diagram-3-fill fs-3" />
              </div>
              <h3 className="fw-bold text-dark mb-3">Operational Philosophy</h3>
              <p className="text-muted fw-medium mb-3" style={{ lineHeight: 1.65 }}>
                We believe in mathematical predictability, architectural honesty, and strict policy enforcement. We do not make speculative financial promises or claim risk-free yields.
              </p>
              <p className="text-muted fw-medium mb-0" style={{ lineHeight: 1.65 }}>
                Every percentage rate, claim timeframe, and referral tier is strictly governed by authoritative backend configuration models, ensuring transparent records for every participant.
              </p>
            </div>
          </div>
        </div>

        {/* Why Users Choose MinePro - 4 Pillars */}
        <div className="text-center mb-5">
          <span className="badge-minepro-orange">&bull; THE MINEPRO ADVANTAGE &bull;</span>
          <h2 className="display-6 fw-extrabold text-dark mt-2 mb-2">Architectural Standards</h2>
          <p className="text-muted mx-auto fw-medium" style={{ maxWidth: 580 }}>
            Discover how MinePro combines fintech precision with modern distributed crypto operations.
          </p>
        </div>

        <div className="row g-4 mb-5">
          {[
            {
              icon: 'bi-clock-history',
              title: '24-Hour Deterministic Cycles',
              desc: 'Cycles operate on authoritative server timestamps rather than client timers, ensuring uniform settlement windows across all global timezones.',
              color: 'green'
            },
            {
              icon: 'bi-cpu-fill',
              title: 'Server-Side Ledger Integrity',
              desc: 'All balance calculations, transaction validations, and reward accruals take place securely on the server backend with audit logging.',
              color: 'orange'
            },
            {
              icon: 'bi-currency-exchange',
              title: 'Multi-Network Agility',
              desc: 'Native support for USDT on both TRC20 and BEP20 networks allows users to select their preferred blockchain with minimal transfer friction.',
              color: 'green'
            },
            {
              icon: 'bi-people-fill',
              title: 'Structured Multi-Level Rewards',
              desc: 'A transparent referral architecture (up to 5 configurable levels) allows community builders to earn commissions on active mining activations.',
              color: 'orange'
            }
          ].map((item, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-lg-3">
              <div className="feature-card-lift">
                <div 
                  className="rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ 
                    backgroundColor: item.color === 'green' ? '#dcfce7' : '#ffedd5', 
                    color: item.color === 'green' ? '#15803d' : '#c2410c',
                    width: 50,
                    height: 50
                  }}
                >
                  <i className={`bi ${item.icon} fs-4`} />
                </div>
                <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                <p className="text-muted small mb-0 fw-medium" style={{ lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Security & System Transparency */}
        <div 
          className="p-4 p-lg-5 rounded-4 border text-dark mb-5"
          style={{ backgroundColor: '#ffffff', borderColor: '#cfe5d7', boxShadow: '0 6px 20px rgba(7, 26, 17, 0.05)' }}
        >
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge-minepro-green">SECURITY FOUNDATION</span>
              </div>
              <h3 className="fw-extrabold text-dark mb-3">Enterprise Ledger &amp; Security Measures</h3>
              <p className="text-muted fw-medium mb-3" style={{ lineHeight: 1.65 }}>
                Our application implements strict parameter guards, prepared SQL queries via Prisma ORM, bcrypt password hashing, and session authentication. Sensitive credentials and administrative wallet addresses are safeguarded via server-side environment parameters.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <span className="badge bg-light text-dark border fw-bold px-3 py-2">
                  <i className="bi bi-shield-lock-fill text-success me-1" /> Session Encryption
                </span>
                <span className="badge bg-light text-dark border fw-bold px-3 py-2">
                  <i className="bi bi-database-fill-check text-success me-1" /> PostgreSQL Authoritative State
                </span>
                <span className="badge bg-light text-dark border fw-bold px-3 py-2">
                  <i className="bi bi-check-circle-fill text-success me-1" /> Rate-Limited API Endpoints
                </span>
              </div>
            </div>
            <div className="col-12 col-lg-4 text-center">
              <div 
                className="p-4 rounded-4"
                style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
              >
                <i className="bi bi-shield-shaded text-success fs-1 mb-2 d-block" />
                <h6 className="fw-extrabold text-dark mb-1">Zero Blind Guarantees</h6>
                <p className="small text-muted mb-0 fw-medium">
                  We believe clarity beats exaggerated marketing. Every transaction and operational rule is documented.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div 
          className="p-5 rounded-4 text-white text-center position-relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #071911 0%, #0e2d1f 60%, #15803d 100%)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.25)' 
          }}
        >
          <h2 className="display-6 fw-extrabold mb-3 text-white">Experience Modern Digital Mining</h2>
          <p className="lead text-light-body mx-auto mb-4 fw-medium" style={{ maxWidth: 540 }}>
            Create an account in minutes or explore our configurable mining tiers today.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Button
              variant="black"
              size="lg"
              onClick={onGetStarted}
              style={{ backgroundColor: '#060b08', border: '2px solid #22c55e' }}
            >
              Get Started Now
            </Button>
            <Button
              variant="orange"
              size="lg"
              onClick={onExplorePlans}
            >
              Explore Available Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
