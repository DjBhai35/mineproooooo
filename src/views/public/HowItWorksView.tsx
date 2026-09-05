import React from 'react';
import { Button } from '../../components/ui/Button';

interface HowItWorksViewProps {
  onGetStarted?: () => void;
  onExplorePlans?: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  onGetStarted,
  onExplorePlans,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Create Your Account',
      desc: 'Sign up with your username, email, and secure credentials. Optional sponsor referral codes link you directly to multi-tier affiliate rewards.',
      icon: 'bi-person-plus-fill',
      badge: 'Step 1'
    },
    {
      num: '02',
      title: 'Choose an Available Plan',
      desc: 'Select from 5 standardized mining tiers ranging from Starter ($10) to Premium ($5,000+). Each tier specifies daily rate, deposit boundaries, and node allocation.',
      icon: 'bi-grid-fill',
      badge: 'Step 2'
    },
    {
      num: '03',
      title: 'Activate Position via Crypto',
      desc: 'Fund your active position with USDT via high-speed TRC20 or low-fee BEP20 networks. Your funds are verified on-chain and registered to the server ledger.',
      icon: 'bi-wallet2',
      badge: 'Step 3'
    },
    {
      num: '04',
      title: '24-Hour Cycle Starts',
      desc: 'Upon activation, an authoritative 24-hour countdown initializes on the server. You can monitor the real-time circular progress from your user dashboard.',
      icon: 'bi-hourglass-split',
      badge: 'Step 4'
    },
    {
      num: '05',
      title: 'Claim Available Rewards',
      desc: 'When the 24-hour cycle completes, the position status flips to "Eligible for Claim". Click the claim button to credit daily rewards directly to your wallet balance.',
      icon: 'bi-award-fill',
      badge: 'Step 5'
    },
    {
      num: '06',
      title: 'Initiate Next Cycle or Withdraw',
      desc: 'Your position continues seamlessly into the subsequent 24-hour cycle. Accumulate your rewards or submit a withdrawal directly to your personal crypto address.',
      icon: 'bi-arrow-repeat',
      badge: 'Step 6'
    }
  ];

  return (
    <div className="pb-5">
      {/* Page Hero */}
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
                style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.75rem', letterSpacing: '0.04em' }}
              >
                OPERATIONAL BLUEPRINT
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                How MinePro Works
              </h1>
              <p className="lead text-light-body fw-medium" style={{ maxWidth: 660, fontSize: '1.15rem', lineHeight: 1.65 }}>
                Understand the complete lifecycle of account registration, digital plan activation, 24-hour cycle execution, and transparent reward settlement.
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
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-diagram-2-fill fs-5 text-success" />
                  <span className="fw-bold text-white small text-uppercase">Structured Cycle</span>
                </div>
                <div className="text-light-body small fw-medium" style={{ lineHeight: 1.6 }}>
                  Zero hidden steps. Simple registration, prompt network deposit verification, deterministic daily claim cadence.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Journey Grid */}
      <section className="container-xl my-5">
        <div className="text-center mb-5">
          <span className="badge-minepro-green">&bull; STEP BY STEP JOURNEY &bull;</span>
          <h2 className="display-6 fw-extrabold text-dark mt-2 mb-2">From Registration to Daily Claims</h2>
          <p className="text-muted mx-auto fw-medium" style={{ maxWidth: 580 }}>
            Follow the transparent pathway of every mining allocation on the MinePro network.
          </p>
        </div>

        <div className="row g-4">
          {steps.map((s, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-4">
              <div className="cycle-step-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="cycle-step-number">{s.num}</span>
                  <span className="badge bg-light text-success border fw-bold px-3 py-1">
                    {s.badge}
                  </span>
                </div>

                <div 
                  className="rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ backgroundColor: '#dcfce7', color: '#16a34a', width: 50, height: 50 }}
                >
                  <i className={`bi ${s.icon} fs-4`} />
                </div>

                <h5 className="fw-bold text-dark mb-2">{s.title}</h5>
                <p className="text-muted small mb-0 fw-medium" style={{ lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Visual Cycle Flow */}
      <section className="container-xl my-5">
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
                CORE TIMING ARCHITECTURE
              </span>
              <h3 className="fw-extrabold text-white mb-3">The 24-Hour Settlement Rhythm</h3>
              <p className="text-light-body fw-medium mb-4" style={{ lineHeight: 1.65 }}>
                Unlike traditional platforms with opaque background calculations, MinePro enforces a clear, visible 24-hour cycle. When you activate your position, an authoritative server timer initiates.
              </p>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: '#071b12', border: '1.5px solid #1f5035' }}>
                  <i className="bi bi-clock-fill fs-3 text-warning" />
                  <div>
                    <strong className="text-white d-block">86,400 Seconds Duration</strong>
                    <small className="text-light-body fw-medium">Exactly 24 hours between activation and eligible claim window.</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: '#071b12', border: '1.5px solid #1f5035' }}>
                  <i className="bi bi-hand-index-thumb-fill fs-3 text-success" />
                  <div>
                    <strong className="text-white d-block">Manual User Claim Verification</strong>
                    <small className="text-light-body fw-medium">Click claim once the cycle completes to credit rewards to your liquid wallet balance.</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: '#071b12', border: '1.5px solid #1f5035' }}>
                  <i className="bi bi-arrow-clockwise fs-3 text-orange" />
                  <div>
                    <strong className="text-white d-block">Subsequent Auto-Renewal</strong>
                    <small className="text-light-body fw-medium">The position remains active for continuous consecutive cycles during plan lifetime.</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6 text-center">
              <div 
                className="p-4 rounded-4 d-inline-block w-100"
                style={{ backgroundColor: '#06140c', border: '1.5px solid #22c55e' }}
              >
                <div className="mining-circle-container my-3" style={{ width: 180, height: 180 }}>
                  <svg className="mining-circle-svg" viewBox="0 0 100 100">
                    <circle className="mining-circle-bg" cx="50" cy="50" r="42" style={{ stroke: '#153d26' }} />
                    <circle
                      className="mining-circle-progress"
                      cx="50"
                      cy="50"
                      r="42"
                      strokeDasharray="264"
                      strokeDashoffset="66"
                      style={{ stroke: '#f97316' }}
                    />
                  </svg>
                  <div className="position-absolute text-center">
                    <div className="fs-3 fw-extrabold text-white font-monospace">18:42:15</div>
                    <small className="text-light-body text-uppercase fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                      Cycle In Progress
                    </small>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-2 mt-3">
                  <span className="badge bg-success text-white px-3 py-1.5 fw-bold">Active Mining Node</span>
                  <span className="badge bg-warning text-dark px-3 py-1.5 fw-bold">75% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Operations: Deposits & Withdrawals */}
      <section className="container-xl my-5">
        <div className="row g-4">
          {/* Deposit Architecture */}
          <div className="col-12 col-md-6">
            <div className="card-minepro p-4 p-lg-5 h-100 bg-white">
              <div 
                className="rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-3"
                style={{ backgroundColor: '#dcfce7', color: '#16a34a', width: 52, height: 52 }}
              >
                <i className="bi bi-box-arrow-in-down fs-3" />
              </div>
              <h4 className="fw-bold text-dark mb-3">Deposit Verification</h4>
              <p className="text-muted fw-medium small mb-3" style={{ lineHeight: 1.6 }}>
                Deposits are supported via USDT across two dominant blockchains. To maintain absolute safety, every transaction requires standard on-chain block confirmations.
              </p>
              <ul className="list-unstyled small d-flex flex-column gap-2 text-dark mb-4">
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success" />
                  <span><strong>TRC20 (Tron):</strong> Fast, low-friction blockchain confirmations.</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success" />
                  <span><strong>BEP20 (BSC):</strong> High throughput Binance Smart Chain standard.</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success" />
                  <span><strong>Configurable Minimum:</strong> $10.00 minimum deposit threshold.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Withdrawal Architecture */}
          <div className="col-12 col-md-6">
            <div className="card-minepro p-4 p-lg-5 h-100 bg-white">
              <div 
                className="rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-3"
                style={{ backgroundColor: '#ffedd5', color: '#ea580c', width: 52, height: 52 }}
              >
                <i className="bi bi-box-arrow-up-right fs-3" />
              </div>
              <h4 className="fw-bold text-dark mb-3">Withdrawal Settlements</h4>
              <p className="text-muted fw-medium small mb-3" style={{ lineHeight: 1.6 }}>
                Users can withdraw available balances directly to their personal cryptocurrency wallet. Withdrawals are processed against strict ledger rules to prevent unauthorized fund leakage.
              </p>
              <ul className="list-unstyled small d-flex flex-column gap-2 text-dark mb-4">
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-warning" />
                  <span><strong>Minimum Withdrawal:</strong> $50.00 threshold per request.</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-warning" />
                  <span><strong>Transparent Network Fee:</strong> 2.0% dynamic processing allocation.</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-warning" />
                  <span><strong>Security Verification:</strong> Automated risk check prior to blockchain broadcast.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Level Referral Architecture */}
      <section className="container-xl my-5">
        <div className="card-minepro p-4 p-lg-5 bg-white">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7">
              <span className="badge-minepro-orange">&bull; AFFILIATE NETWORK &bull;</span>
              <h3 className="fw-extrabold text-dark mt-2 mb-3">Multi-Tier Referral Structure</h3>
              <p className="text-muted fw-medium small mb-4" style={{ lineHeight: 1.65 }}>
                Share your unique MinePro referral code or link to earn automated commission bonuses when your invited network activates mining positions. Commissions credit instantly upon verified plan activation.
              </p>

              <div className="row g-3">
                <div className="col-4">
                  <div className="p-3 rounded-3 bg-light border text-center">
                    <span className="badge bg-success text-white px-2.5 py-1 mb-1 fw-bold">Tier 1</span>
                    <div className="fs-3 fw-extrabold text-success">7.0%</div>
                    <small className="text-dark fw-bold" style={{ fontSize: '0.74rem' }}>Direct Invitees</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 rounded-3 bg-light border text-center">
                    <span className="badge bg-warning text-dark px-2.5 py-1 mb-1 fw-bold">Tier 2</span>
                    <div className="fs-3 fw-extrabold text-orange">3.0%</div>
                    <small className="text-dark fw-bold" style={{ fontSize: '0.74rem' }}>Secondary Network</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 rounded-3 bg-light border text-center">
                    <span className="badge bg-dark text-white px-2.5 py-1 mb-1 fw-bold">Tier 3</span>
                    <div className="fs-3 fw-extrabold text-dark">1.5%</div>
                    <small className="text-dark fw-bold" style={{ fontSize: '0.74rem' }}>Tier 3 Community</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5 text-center">
              <div 
                className="p-4 rounded-4"
                style={{ backgroundColor: '#edf7f1', border: '1.5px solid #a9d6bb' }}
              >
                <i className="bi bi-people-fill text-success fs-1 mb-2 d-block" />
                <h5 className="fw-bold text-dark mb-2">Affiliate Best Practices</h5>
                <p className="small text-muted mb-3 fw-medium">
                  We reward genuine community building. Spamming, misleading financial claims, and fraudulent self-referrals are strictly prohibited.
                </p>
                <Button
                  variant="black"
                  size="sm"
                  onClick={onGetStarted}
                >
                  Join Affiliate Program
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Footer */}
      <section className="container-xl mt-5 text-center">
        <div 
          className="p-5 rounded-4 text-white"
          style={{ 
            background: 'linear-gradient(135deg, #071911 0%, #0e2d1f 60%, #15803d 100%)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.25)' 
          }}
        >
          <h2 className="display-6 fw-extrabold mb-3 text-white">Ready to Initialize Your Mining Node?</h2>
          <p className="lead text-light-body mx-auto mb-4 fw-medium" style={{ maxWidth: 500 }}>
            Join participants worldwide and experience deterministic daily rewards today.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="orange"
              size="lg"
              onClick={onGetStarted}
            >
              Get Started Now
            </Button>
            <Button
              variant="black"
              size="lg"
              onClick={onExplorePlans}
              style={{ backgroundColor: '#060b08', border: '2px solid #22c55e' }}
            >
              View Plan Catalog
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
