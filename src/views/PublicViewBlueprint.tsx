import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { HeroMiningVisual } from '../components/visuals/HeroMiningVisual';
import { DEFAULT_PLANS } from '../config/platformSettings';

interface PublicViewBlueprintProps {
  onNavigate?: (route: string) => void;
  onSelectPlan?: (planId: string) => void;
  onGetStarted?: () => void;
  onExplorePlans?: () => void;
}

export const PublicViewBlueprint: React.FC<PublicViewBlueprintProps> = ({
  onNavigate,
  onSelectPlan,
  onGetStarted,
  onExplorePlans,
}) => {
  const [openFaq, setOpenFaq] = useState<string>('hfaq-1');

  const homeFaqs = [
    {
      id: 'hfaq-1',
      q: 'What is MinePro and how does it operate?',
      a: 'MinePro is an authoritative digital mining platform that enables users to participate in standardized cloud mining positions. Users choose a plan tier, deposit via TRC20 or BEP20 USDT, and engage in automated 24-hour reward cycles tracked by database timestamps.'
    },
    {
      id: 'hfaq-2',
      q: 'How does the 24-hour reward cycle execute?',
      a: 'When an eligible mining position is activated, the server logs an exact start timestamp. Over the next 86,400 seconds, participants can monitor real-time cycle status. Upon completion, rewards become claimable directly to the user balance.'
    },
    {
      id: 'hfaq-3',
      q: 'What blockchain payment networks are supported?',
      a: 'MinePro natively supports Tether (USDT) on Tron (TRC20) and BNB Smart Chain (BEP20) for minimal gas overhead and rapid on-chain confirmations.'
    },
    {
      id: 'hfaq-4',
      q: 'How does the referral commission program work?',
      a: 'Participants can share their unique referral code or link. When downline users activate an eligible mining position, multi-level rewards (Level 1: 7%, Level 2: 3%, Level 3: 1.5%) credit automatically to the sponsor account.'
    },
    {
      id: 'hfaq-5',
      q: 'Are returns or mining yields guaranteed?',
      a: 'No. Mining yields depend on global network difficulty and operational node uptime. All rates displayed on plans represent configurable target rates. There is no guaranteed income or risk-free return.'
    }
  ];

  return (
    <div className="pb-5">
      {/* 1. HERO SECTION: High-Impact Split (40% Content / 60% Visual) */}
      <section 
        className="pt-2 pt-md-3 pb-5 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #071911 0%, #0c2b1e 30%, #113825 60%, #edf7f1 100%)',
        }}
      >
        <div className="container-xl pt-1 pt-lg-2 pb-4 pb-lg-5 position-relative">
          <div className="row align-items-center g-4 g-lg-5">
            {/* Left Column: 40% Supporting Content & Direct Value Proposition */}
            <div className="col-12 col-lg-5 text-center text-lg-start z-1">
              {/* Tag Pill */}
              <div 
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 shadow-sm"
                style={{ 
                  backgroundColor: 'rgba(7, 24, 16, 0.88)', 
                  border: '1.5px solid rgba(74, 222, 128, 0.45)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <span 
                  className="badge px-2 py-0.5 rounded-pill fw-bold text-uppercase"
                  style={{ backgroundColor: '#f97316', color: '#ffffff', fontSize: '0.72rem' }}
                >
                  <i className="bi bi-cpu-fill me-1" /> DIGITAL MINING
                </span>
                <span className="small fw-bold text-white">
                  24h Deterministic Reward Cycles
                </span>
              </div>

              {/* Exact Requested Hero Headline */}
              <h1 
                className="display-4 fw-extrabold mb-3 text-white"
                style={{ 
                  letterSpacing: '-0.035em', 
                  lineHeight: 1.12,
                  textShadow: '0 4px 18px rgba(0, 0, 0, 0.5)' 
                }}
              >
                Powering Smarter <br />
                <span 
                  style={{ 
                    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: 'none'
                  }}
                >
                  Digital Mining
                </span>
              </h1>

              {/* High Contrast Sharp Subtitle */}
              <p 
                className="lead mb-4 fw-medium"
                style={{ 
                  color: '#e2e8f0',
                  fontSize: '1.12rem', 
                  maxWidth: 520,
                  lineHeight: 1.65 
                }}
              >
                Standardized mining tier allocation, verifiable 24-hour reward cycles, and rapid multi-network cryptocurrency settlement powered by authoritative ledger rules.
              </p>

              {/* Primary CTAs */}
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mb-4">
                <Button
                  variant="black"
                  size="lg"
                  icon="bi-lightning-charge-fill"
                  onClick={onGetStarted}
                  style={{ 
                    backgroundColor: '#060b08', 
                    color: '#ffffff',
                    border: '2px solid #22c55e',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6), 0 0 16px rgba(34, 197, 94, 0.35)',
                    fontWeight: 800
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="orange"
                  size="lg"
                  icon="bi-grid-fill"
                  onClick={onExplorePlans || (() => onNavigate?.('plans'))}
                  style={{
                    fontWeight: 700
                  }}
                >
                  Explore Plans
                </Button>
              </div>

              {/* Quick Feature Pillars */}
              <div className="row g-2 pt-2 text-start">
                <div className="col-6">
                  <div 
                    className="p-2.5 px-3 rounded-3 h-100 d-flex align-items-center gap-2"
                    style={{ 
                      backgroundColor: '#ffffff', 
                      border: '1.5px solid #bce1ca',
                      boxShadow: '0 4px 12px rgba(6, 20, 13, 0.08)' 
                    }}
                  >
                    <i className="bi bi-clock-history text-success fs-5" />
                    <div>
                      <div className="fw-bold text-dark small" style={{ fontSize: '0.82rem' }}>24h Sync Cycle</div>
                      <small className="text-muted d-block" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Deterministic claims</small>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div 
                    className="p-2.5 px-3 rounded-3 h-100 d-flex align-items-center gap-2"
                    style={{ 
                      backgroundColor: '#ffffff', 
                      border: '1.5px solid #fed7aa',
                      boxShadow: '0 4px 12px rgba(6, 20, 13, 0.08)' 
                    }}
                  >
                    <i className="bi bi-currency-bitcoin text-orange fs-5" />
                    <div>
                      <div className="fw-bold text-dark small" style={{ fontSize: '0.82rem' }}>TRC20 &amp; BEP20</div>
                      <small className="text-muted d-block" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Dual network USDT</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 60% Dominant Primary Visual */}
            <div className="col-12 col-lg-7 d-flex justify-content-center">
              <HeroMiningVisual />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / HIGHLIGHT BAR (Feature-based Trust, NO FAKE NUMBERS) */}
      <section className="container-xl my-4">
        <div 
          className="p-4 rounded-4 shadow-sm border"
          style={{ 
            backgroundColor: '#ffffff', 
            borderColor: '#cfe5d7',
            boxShadow: '0 8px 24px rgba(7, 26, 17, 0.06)' 
          }}
        >
          <div className="row g-3 text-center align-items-center">
            <div className="col-6 col-md">
              <div className="d-flex flex-column align-items-center">
                <i className="bi bi-clock-history text-success fs-3 mb-1" />
                <strong className="text-dark small">Transparent 24h Cycles</strong>
                <small className="text-muted" style={{ fontSize: '0.74rem' }}>Synchronized server clocks</small>
              </div>
            </div>

            <div className="col-6 col-md border-start-md">
              <div className="d-flex flex-column align-items-center">
                <i className="bi bi-shield-lock-fill text-success fs-3 mb-1" />
                <strong className="text-dark small">Secure Architecture</strong>
                <small className="text-muted" style={{ fontSize: '0.74rem' }}>PostgreSQL ledger state</small>
              </div>
            </div>

            <div className="col-6 col-md border-start-md">
              <div className="d-flex flex-column align-items-center">
                <i className="bi bi-currency-exchange text-orange fs-3 mb-1" />
                <strong className="text-dark small">Multi-Network Support</strong>
                <small className="text-muted" style={{ fontSize: '0.74rem' }}>USDT via TRC20 &amp; BEP20</small>
              </div>
            </div>

            <div className="col-6 col-md border-start-md">
              <div className="d-flex flex-column align-items-center">
                <i className="bi bi-speedometer2 text-success fs-3 mb-1" />
                <strong className="text-dark small">Real-Time Tracking</strong>
                <small className="text-muted" style={{ fontSize: '0.74rem' }}>Active node telemetry</small>
              </div>
            </div>

            <div className="col-6 col-md border-start-md">
              <div className="d-flex flex-column align-items-center">
                <i className="bi bi-phone-fill text-orange fs-3 mb-1" />
                <strong className="text-dark small">Responsive Platform</strong>
                <small className="text-muted" style={{ fontSize: '0.74rem' }}>Desktop, tablet &amp; mobile</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT / INTRODUCTION SECTION */}
      <section className="container-xl my-5 py-4">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-6">
            <span className="badge-minepro-green">&bull; ABOUT MINEPRO &bull;</span>
            <h2 className="display-6 fw-extrabold text-dark mt-2 mb-3">
              Standardized Node Allocation Without Hardware Friction
            </h2>
            <p className="text-muted fw-medium mb-3" style={{ lineHeight: 1.65 }}>
              Traditional cryptocurrency mining demands expensive equipment, cooling maintenance, continuous electricity contracts, and technical rig monitoring. MinePro replaces operational complexity with intuitive, rule-governed digital mining plans.
            </p>
            <p className="text-muted fw-medium mb-4" style={{ lineHeight: 1.65 }}>
              Every participant receives predictable, mathematically defined computational allocation. All transactions, reward claims, and affiliate commissions are tracked permanently in an auditable ledger.
            </p>
            <div className="d-flex gap-3">
              <button
                onClick={() => onNavigate?.('about')}
                className="btn btn-outline-dark fw-bold px-3 py-2"
              >
                Read Full About Story <i className="bi bi-arrow-right ms-1" />
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div 
              className="p-4 p-lg-5 rounded-4 border text-white"
              style={{ 
                background: 'linear-gradient(135deg, #071911 0%, #0c2b1e 70%, #15803d 100%)',
                boxShadow: '0 12px 32px rgba(7, 26, 17, 0.15)' 
              }}
            >
              <h4 className="fw-extrabold text-white mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-shield-check text-warning" /> Our Commitment to Clarity
              </h4>
              <p className="text-light-body small fw-medium mb-4" style={{ lineHeight: 1.7 }}>
                We reject opaque promises and speculative claims. MinePro operates on verifiable server parameters, transparent 2.0% withdrawal allocations, and clear 86,400-second settlement cadence.
              </p>
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 rounded-3" style={{ backgroundColor: '#091c13', border: '1.5px solid #1f4f34' }}>
                    <div className="text-warning fw-extrabold fs-4">$10.00</div>
                    <small className="text-light-body fw-bold">Configured Min Deposit</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-3" style={{ backgroundColor: '#091c13', border: '1.5px solid #1f4f34' }}>
                    <div className="text-success fw-extrabold fs-4">24 Hours</div>
                    <small className="text-light-body fw-bold">Settlement Window</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS PREVIEW (5 Authoritative Steps) */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container-xl">
          <div className="text-center mb-5">
            <span className="badge-minepro-orange">&bull; SIMPLE 5-STEP PROCESS &bull;</span>
            <h2 className="display-6 fw-extrabold text-dark mt-2 mb-2">How MinePro Works</h2>
            <p className="text-muted mx-auto fw-medium" style={{ maxWidth: 540 }}>
              From initial registration to collecting daily rewards in five structured, transparent stages.
            </p>
          </div>

          <div className="row g-4 text-center">
            {[
              { num: '01', title: 'Create Your Account', desc: 'Register with username & email. Secure your credentials.', icon: 'bi-person-plus-fill' },
              { num: '02', title: 'Choose an Available Plan', desc: 'Select from 5 mining tiers based on your capital capacity.', icon: 'bi-grid-fill' },
              { num: '03', title: 'Activate Position', desc: 'Deposit USDT via TRC20 or BEP20 for prompt on-chain crediting.', icon: 'bi-wallet-fill' },
              { num: '04', title: 'Monitor Your Cycle', desc: 'Follow the authoritative 24-hour countdown in your dashboard.', icon: 'bi-clock-history' },
              { num: '05', title: 'Claim Available Rewards', desc: 'Claim completed daily rewards directly to your liquid balance.', icon: 'bi-award-fill' },
            ].map((step, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg">
                <div className="card-minepro p-4 h-100 bg-white">
                  <div 
                    className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm"
                    style={{ 
                      width: 54, 
                      height: 54, 
                      background: idx % 2 === 0 
                        ? 'linear-gradient(135deg, #22c55e, #15803d)' 
                        : 'linear-gradient(135deg, #fb923c, #ea580c)' 
                    }}
                  >
                    <i className={`bi ${step.icon} fs-5`} />
                  </div>
                  <span className="badge bg-light text-dark border fw-bold px-2 py-0.5 mb-2 font-monospace">
                    STEP {step.num}
                  </span>
                  <h6 className="fw-bold text-dark mb-1">{step.title}</h6>
                  <p className="text-muted small mb-0 fw-medium" style={{ lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => onNavigate?.('how-it-works')}
              className="btn btn-link text-decoration-none text-success fw-bold"
            >
              Explore Detailed Operational Blueprint <i className="bi bi-arrow-right ms-1" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. PLANS PREVIEW (Consuming DEFAULT_PLANS) */}
      <section className="py-5 container-xl">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
          <div>
            <span className="badge-minepro-orange">&bull; MINING TIERS &bull;</span>
            <h2 className="display-6 fw-extrabold text-dark mt-2 mb-1">Available Mining Plans</h2>
            <p className="text-muted fw-medium mb-0">Standardized tiers governed by authoritative platform parameters.</p>
          </div>
          <div className="mt-3 mt-md-0">
            <Button
              variant="outline-green"
              size="sm"
              onClick={onExplorePlans || (() => onNavigate?.('plans'))}
            >
              View All Plans &amp; Calculator <i className="bi bi-arrow-right ms-1" />
            </Button>
          </div>
        </div>

        <div className="row g-3 justify-content-center">
          {DEFAULT_PLANS.slice(0, 4).map((plan) => {
            const isFeatured = plan.slug === 'standard';
            const isOrangeVariant = plan.colorVariant === 'orange';

            return (
              <div key={plan.id} className="col-12 col-sm-6 col-lg-3">
                <div 
                  className={`card-minepro h-100 p-4 text-center bg-white d-flex flex-column ${
                    isFeatured ? 'shadow border-2' : ''
                  }`}
                  style={{
                    borderTop: `5px solid ${isOrangeVariant ? '#f97316' : '#22c55e'}`,
                    borderColor: isFeatured ? '#16a34a' : undefined,
                  }}
                >
                  <div className="mb-2">
                    <span 
                      className="badge px-3 py-1 rounded-pill fw-bold text-uppercase"
                      style={{ 
                        backgroundColor: isOrangeVariant ? '#ffedd5' : '#dcfce7',
                        color: isOrangeVariant ? '#c2410c' : '#15803d',
                        fontSize: '0.78rem' 
                      }}
                    >
                      {plan.name}
                    </span>
                  </div>

                  <div className="my-2 py-2 border-top border-bottom border-light">
                    <div className="fw-bold text-dark fs-5">${plan.minDeposit} - ${plan.maxDeposit.toLocaleString()}</div>
                    <small className="text-muted fw-semibold">USDT Deposit Range</small>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block fw-bold" style={{ fontSize: '0.74rem' }}>Daily Reward</small>
                    <div className={`fs-2 fw-extrabold ${isOrangeVariant ? 'text-orange' : 'text-success'}`}>
                      {plan.dailyRatePct.toFixed(2)}%
                    </div>
                    <small className="text-muted fw-semibold" style={{ fontSize: '0.72rem' }}>24h Cycle &bull; Lifetime</small>
                  </div>

                  <div className="mt-auto">
                    <Button
                      variant={isFeatured ? 'orange' : 'black'}
                      size="sm"
                      fullWidth
                      onClick={() => onSelectPlan?.(plan.id)}
                    >
                      Choose Plan
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FEATURE SECTION (8 Comprehensive Features) */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container-xl">
          <div className="text-center mb-5">
            <span className="badge-minepro-green">&bull; CORE CAPABILITIES &bull;</span>
            <h2 className="display-6 fw-extrabold text-dark mt-2 mb-2">Engineered for Reliability</h2>
            <p className="text-muted mx-auto fw-medium" style={{ maxWidth: 540 }}>
              Explore the architectural features powering the MinePro platform experience.
            </p>
          </div>

          <div className="row g-4">
            {[
              { icon: 'bi-clock-history', title: 'Transparent Cycle Tracking', desc: 'Real-time countdown and node status telemetry tied to authoritative server timestamps.', color: 'green' },
              { icon: 'bi-shield-lock-fill', title: 'Secure Account Architecture', desc: 'Bcrypt hashed passwords, protected session cookies, and prepared query database layers.', color: 'orange' },
              { icon: 'bi-currency-exchange', title: 'Multiple Network Support', desc: 'Fast, reliable USDT funding and withdrawals via Tron TRC20 and BSC BEP20 blockchains.', color: 'green' },
              { icon: 'bi-journal-check', title: 'Transaction History & Ledger', desc: 'Permanent chronological audit records for every deposit, reward claim, and payout.', color: 'orange' },
              { icon: 'bi-people-fill', title: 'Multi-Level Referral Tracking', desc: 'Configurable affiliate commissions across multiple tiers with transparent downline telemetry.', color: 'green' },
              { icon: 'bi-speedometer2', title: 'Responsive Dashboard', desc: 'Unified experience engineered seamlessly across mobile smartphones, tablets, and desktops.', color: 'orange' },
              { icon: 'bi-sliders', title: 'Configurable Platform Rules', desc: 'No hardcoded financial parameters; limits and rates adapt safely through administrative controls.', color: 'green' },
              { icon: 'bi-bell-fill', title: 'Real-Time System Alerts', desc: 'Instant feedback states for cycle completions, successful claims, and network confirmations.', color: 'orange' },
            ].map((f, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <div className="feature-card-lift">
                  <div 
                    className="rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ 
                      backgroundColor: f.color === 'green' ? '#dcfce7' : '#ffedd5', 
                      color: f.color === 'green' ? '#15803d' : '#ea580c',
                      width: 48, 
                      height: 48 
                    }}
                  >
                    <i className={`bi ${f.icon} fs-4`} />
                  </div>
                  <h6 className="fw-bold text-dark mb-1">{f.title}</h6>
                  <p className="text-muted small mb-0 fw-medium" style={{ lineHeight: 1.55 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. REWARD / CYCLE VISUAL (Visualizing 24-Hour Lifecycle) */}
      <section className="py-5 container-xl">
        <div 
          className="p-4 p-lg-5 rounded-4 text-white"
          style={{ 
            background: 'linear-gradient(135deg, #071911 0%, #0c2b1e 70%, #15803d 100%)',
            boxShadow: '0 12px 32px rgba(7, 26, 17, 0.2)' 
          }}
        >
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <span className="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-2">
                SYNCHRONIZED CYCLES
              </span>
              <h3 className="fw-extrabold text-white mb-3">Deterministic 24-Hour Settlement</h3>
              <p className="text-light-body fw-medium mb-4" style={{ lineHeight: 1.65 }}>
                When you activate a mining plan, an authoritative 86,400-second countdown begins on the server. Unlike platforms that calculate yields on unpredictable intervals, MinePro provides clarity at every step.
              </p>

              <div className="d-flex flex-column gap-2 small text-light-body fw-medium">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-arrow-right-circle-fill text-warning fs-6" />
                  <span>1. Position Activated &bull; Server logs cryptographic start timestamp.</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-arrow-right-circle-fill text-warning fs-6" />
                  <span>2. 24-Hour Run &bull; Real-time countdown visible on user dashboard.</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-arrow-right-circle-fill text-warning fs-6" />
                  <span>3. Claim Reward &bull; Manual claim moves daily yield to liquid balance.</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-arrow-right-circle-fill text-warning fs-6" />
                  <span>4. Subsequent Cycle &bull; Plan position continues seamlessly.</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6 text-center">
              <div 
                className="p-4 rounded-4 d-inline-block w-100"
                style={{ backgroundColor: '#06130b', border: '1.5px solid #22c55e' }}
              >
                <div className="mining-circle-container my-3" style={{ width: 170, height: 170 }}>
                  <svg className="mining-circle-svg" viewBox="0 0 100 100">
                    <circle className="mining-circle-bg" cx="50" cy="50" r="42" style={{ stroke: '#143825' }} />
                    <circle
                      className="mining-circle-progress"
                      cx="50"
                      cy="50"
                      r="42"
                      strokeDasharray="264"
                      strokeDashoffset="75"
                      style={{ stroke: '#22c55e' }}
                    />
                  </svg>
                  <div className="position-absolute text-center">
                    <div className="fs-4 fw-extrabold text-white font-monospace">21:14:08</div>
                    <small className="text-light-body text-uppercase fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>
                      Time Remaining
                    </small>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-2 mt-2">
                  <span className="badge bg-success text-white border border-success fw-bold px-2.5 py-1.5">
                    Hashrate Synchronized
                  </span>
                  <span className="badge bg-warning text-dark border border-warning fw-bold px-2.5 py-1.5">
                    Next Claim Ready in 2h 45m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. REFERRAL SECTION */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container-xl">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <span className="badge-minepro-orange">&bull; COMMUNITY GROWTH &bull;</span>
              <h2 className="display-6 fw-extrabold text-dark mt-2 mb-3">Multi-Tier Referral Architecture</h2>
              <p className="text-muted fw-medium mb-3" style={{ lineHeight: 1.65 }}>
                Share your personal MinePro referral link or sponsor code to earn automated commission bonuses when your network activates eligible mining tiers.
              </p>
              <div className="row g-3 mb-4">
                <div className="col-4">
                  <div className="p-3 rounded-3 bg-light border text-center">
                    <span className="badge bg-success text-white px-2.5 py-1 mb-1 fw-bold">Level 1</span>
                    <div className="fs-3 fw-extrabold text-success">7.0%</div>
                    <small className="text-dark fw-bold" style={{ fontSize: '0.74rem' }}>Direct Referrals</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 rounded-3 bg-light border text-center">
                    <span className="badge bg-warning text-dark px-2.5 py-1 mb-1 fw-bold">Level 2</span>
                    <div className="fs-3 fw-extrabold text-orange">3.0%</div>
                    <small className="text-dark fw-bold" style={{ fontSize: '0.74rem' }}>Second Tier</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 rounded-3 bg-light border text-center">
                    <span className="badge bg-dark text-white px-2.5 py-1 mb-1 fw-bold">Level 3</span>
                    <div className="fs-3 fw-extrabold text-dark">1.5%</div>
                    <small className="text-dark fw-bold" style={{ fontSize: '0.74rem' }}>Third Tier</small>
                  </div>
                </div>
              </div>
              <Button
                variant="black"
                size="md"
                onClick={onGetStarted}
              >
                Create Your Account &amp; Get Referral Code
              </Button>
            </div>

            <div className="col-12 col-lg-6">
              <div 
                className="p-4 rounded-4"
                style={{ backgroundColor: '#edf7f1', border: '1.5px solid #a9d6bb' }}
              >
                <h5 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-gift-fill text-success" />
                  Instant Commission Credit
                </h5>
                <p className="text-muted small mb-3 fw-medium" style={{ lineHeight: 1.6 }}>
                  Referral rewards credit directly to your available balance in USDT the moment an invited user funds their active mining tier. You can withdraw or re-allocate these earnings at any time.
                </p>
                <div className="p-3 rounded-3 bg-white border" style={{ borderColor: '#cfe5d7' }}>
                  <div className="d-flex justify-content-between text-dark small fw-bold mb-1">
                    <span>Sample Affiliate Link Format:</span>
                    <span className="text-success fw-bold">Live Referral ID</span>
                  </div>
                  <div className="p-2.5 rounded border font-monospace text-dark small fw-bold" style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}>
                    https://minepro.network/register?ref=YOUR_CODE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SECURITY / TRANSPARENCY SECTION */}
      <section className="container-xl my-5">
        <div className="card-minepro p-4 p-lg-5 bg-white">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <span className="badge-minepro-green">&bull; SECURITY &amp; INTEGRITY &bull;</span>
              <h3 className="fw-extrabold text-dark mt-2 mb-3">Enterprise Security Architecture</h3>
              <p className="text-muted fw-medium small mb-3" style={{ lineHeight: 1.65 }}>
                MinePro strictly adheres to secure software development practices. Our infrastructure employs encrypted session handling, server-side parameter verification, and immutable ledger logging to eliminate unauthorized balance modifications.
              </p>
              <div className="row g-2">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success" />
                    <span className="text-dark small fw-bold">Bcrypt Salted Password Hashing</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success" />
                    <span className="text-dark small fw-bold">Server-Side Ledger Verification</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success" />
                    <span className="text-dark small fw-bold">2.0% Transparent Network Payout Fee</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success" />
                    <span className="text-dark small fw-bold">TRC20 &amp; BEP20 Block Confirmations</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4 text-center">
              <div 
                className="p-4 rounded-4"
                style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
              >
                <i className="bi bi-shield-shaded text-success fs-1 mb-2 d-block" />
                <h6 className="fw-extrabold text-dark mb-1">Auditability &amp; Safety</h6>
                <p className="small text-muted mb-0 fw-medium">
                  Zero hidden rules. Every financial action generates a timestamped ledger entry for complete transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION (Accordion) */}
      <section className="container-xl my-5">
        <div className="text-center mb-5">
          <span className="badge-minepro-orange">&bull; FREQUENT QUESTIONS &bull;</span>
          <h2 className="display-6 fw-extrabold text-dark mt-2 mb-2">Common Questions</h2>
          <p className="text-muted mx-auto fw-medium" style={{ maxWidth: 520 }}>
            Quick answers regarding mining tiers, cycles, and cryptocurrency networks.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-9">
            <div className="accordion accordion-minepro">
              {homeFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div key={faq.id} className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? '' : faq.id)}
                      >
                        <i className="bi bi-question-circle text-success me-2" />
                        {faq.q}
                      </button>
                    </h2>
                    <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                      <div className="accordion-body">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-3">
              <button
                onClick={() => onNavigate?.('faq')}
                className="btn btn-sm btn-outline-dark fw-bold px-3 py-2"
              >
                View Complete FAQ Database <i className="bi bi-arrow-right ms-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. RISK DISCLOSURE SUMMARY CALLOUT */}
      <section className="container-xl my-4">
        <div 
          className="p-4 rounded-4 border"
          style={{ backgroundColor: '#fff7ed', borderColor: '#fed7aa' }}
        >
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div className="d-flex align-items-start gap-3">
              <i className="bi bi-exclamation-triangle-fill text-orange fs-3 flex-shrink-0" />
              <div>
                <h6 className="fw-bold text-dark mb-1">Mandatory Risk Disclosure Summary</h6>
                <p className="text-muted small mb-0 fw-medium" style={{ lineHeight: 1.6 }}>
                  Cryptocurrency mining involves technical and market risks. Stated tier percentages represent configured mathematical models and do NOT constitute guaranteed income, profits, or capital protection.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.('risk-disclosure')}
              className="btn btn-sm btn-outline-danger fw-bold text-nowrap px-3 py-1.5"
            >
              Read Risk Disclosure
            </button>
          </div>
        </div>
      </section>

      {/* 12. BOTTOM CONVERSION CTA BANNER */}
      <section className="container-xl my-5">
        <div 
          className="p-5 rounded-4 text-white text-center position-relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #071911 0%, #0e2d1f 60%, #15803d 100%)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.25)' 
          }}
        >
          <h2 className="display-6 fw-extrabold mb-3 text-white">Power Your Mining Journey with MinePro</h2>
          <p className="lead text-light-body mx-auto mb-4 fw-medium" style={{ maxWidth: 540 }}>
            Join users globally on a platform built for transparency, deterministic cycles, and cryptographic security.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Button
              variant="black"
              size="lg"
              onClick={onGetStarted}
              style={{ backgroundColor: '#060b08', border: '2px solid #22c55e' }}
            >
              Get Started
            </Button>
            <Button
              variant="orange"
              size="lg"
              onClick={onExplorePlans || (() => onNavigate?.('plans'))}
            >
              Explore Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
