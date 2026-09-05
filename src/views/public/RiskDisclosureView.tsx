import React from 'react';
import { Button } from '../../components/ui/Button';

interface RiskDisclosureViewProps {
  onBackToHome?: () => void;
  onExplorePlans?: () => void;
}

export const RiskDisclosureView: React.FC<RiskDisclosureViewProps> = ({
  onBackToHome,
  onExplorePlans,
}) => {
  return (
    <div className="pb-5">
      {/* Page Header */}
      <section 
        className="py-5 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #071911 0%, #0c2b1e 65%, #133a2a 100%)',
          borderBottom: '2px solid #ea580c',
        }}
      >
        <div className="container-xl py-4 position-relative z-1">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <span 
                className="badge px-3 py-1.5 rounded-pill mb-3 fw-bold text-uppercase"
                style={{ backgroundColor: '#ffedd5', color: '#ea580c', fontSize: '0.75rem', letterSpacing: '0.04em' }}
              >
                LEGAL &amp; COMPLIANCE NOTICE
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Risk Disclosure Statement
              </h1>
              <p className="lead text-light-body fw-medium" style={{ maxWidth: 660, fontSize: '1.15rem', lineHeight: 1.65 }}>
                Please read this Risk Disclosure carefully before accessing the MinePro platform, registering an account, or activating digital mining positions.
              </p>
            </div>
            <div className="col-12 col-lg-4 text-lg-end">
              <div 
                className="p-4 rounded-4 text-start d-inline-block w-100"
                style={{ 
                  backgroundColor: '#071d12', 
                  border: '1.5px solid #ea580c',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)' 
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-exclamation-triangle-fill fs-5 text-orange" />
                  <span className="fw-bold text-white small text-uppercase">Capital At Risk</span>
                </div>
                <div className="text-light-body small fw-medium" style={{ lineHeight: 1.6 }}>
                  Cryptographic mining activities involve financial risk. Never participate with capital you cannot afford to lose entirely.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Body */}
      <section className="container-xl my-5">
        <div className="policy-card">
          <div className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
            <div>
              <span className="text-muted small fw-bold text-uppercase">Document Version 2.4</span>
              <div className="text-dark fw-bold">Effective Date: January 1, {new Date().getFullYear()}</div>
            </div>
            <button 
              onClick={() => window.print()} 
              className="btn btn-sm btn-outline-secondary d-none d-sm-inline-flex align-items-center gap-1"
            >
              <i className="bi bi-printer" /> Print Statement
            </button>
          </div>

          <div className="policy-callout-warning">
            <h6 className="fw-bold mb-1">
              <i className="bi bi-exclamation-octagon-fill me-2" />
              EXPLICIT ABSENCE OF GUARANTEES
            </h6>
            <p className="small mb-0" style={{ lineHeight: 1.6 }}>
              MinePro does NOT guarantee profit, return on investment (ROI), or fixed yields of any kind. Past computational hashrate performance or illustrative calculator rates do not guarantee future results. Cryptocurrency asset values may fluctuate dramatically.
            </p>
          </div>

          {/* Section 1 */}
          <h4 className="policy-section-title">
            <i className="bi bi-1-circle text-success" /> 1. General Risk Warning &amp; Nature of Service
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            Participation in digital mining nodes and decentralized crypto asset networks involves substantial risk of financial loss. By registering an account with MinePro and funding mining positions, you acknowledge and agree that you are acting entirely of your own volition and have conducted independent financial, technological, and legal research.
          </p>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            MinePro is a technology platform that provides algorithmic mining allocation. We do not act as an investment fund, registered broker-dealer, custodian bank, or financial advisory institution.
          </p>

          {/* Section 2 */}
          <h4 className="policy-section-title">
            <i className="bi bi-2-circle text-success" /> 2. Market Volatility &amp; Digital Asset Risks
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            Cryptocurrencies—including USDT and underlying network tokens—are subject to extreme volatility driven by macroeconomic sentiment, global technological shifts, legislative actions, and liquidity constraints. While Tether (USDT) is architected as a fiat-pegged stablecoin, risks associated with collateralization, de-pegging, and issuer solvency remain external factors beyond MinePro&apos;s control.
          </p>

          {/* Section 3 */}
          <h4 className="policy-section-title">
            <i className="bi bi-3-circle text-success" /> 3. Computational Difficulty &amp; Mining Variance
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            Cryptographic proof-of-work hashrates and proof-of-stake node rewards are governed by consensus-level mathematical difficulty algorithms. As global hashrate escalates, unit rewards per terahash fluctuate. MinePro reserves the right to adjust configured plan parameters, minimum thresholds, and claim cadence in response to significant shifts in underlying network difficulty.
          </p>

          {/* Section 4 */}
          <h4 className="policy-section-title">
            <i className="bi bi-4-circle text-success" /> 4. Blockchain Network Risks (TRC20 &amp; BEP20)
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            All deposits and withdrawals depend on public decentralized blockchains (Tron and BNB Smart Chain). MinePro is not liable for:
          </p>
          <ul className="text-muted small fw-medium mb-3" style={{ lineHeight: 1.7 }}>
            <li>Funds transmitted to incorrect wallet addresses, unsupported smart contracts, or incompatible networks.</li>
            <li>Extended block confirmation latency during network congestion or hard-fork events.</li>
            <li>Spikes in network gas fees that impact withdrawal processing timelines.</li>
            <li>Unannounced protocol upgrades or chain reorganizations.</li>
          </ul>

          {/* Section 5 */}
          <h4 className="policy-section-title">
            <i className="bi bi-5-circle text-success" /> 5. Account Security &amp; Credential Custody
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            You are exclusively responsible for maintaining the confidentiality of your account credentials, password strength, and registered email address. MinePro support staff will NEVER ask for your password or private keys. Any transaction authenticated through your valid session credentials is mathematically authoritative and irreversible.
          </p>

          {/* Section 6 */}
          <h4 className="policy-section-title">
            <i className="bi bi-6-circle text-success" /> 6. Operational Timing &amp; Claim Windows
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            MinePro rewards execute in strict 86,400-second (24-hour) cycles tracked by database timestamps. When a cycle concludes, the participant must initiate a manual reward claim via the dashboard within the platform&apos;s configured claim window. Failure to claim within the window may result in state expiration according to system policy.
          </p>

          {/* Section 7 */}
          <h4 className="policy-section-title">
            <i className="bi bi-7-circle text-success" /> 7. Regulatory &amp; Jurisdictional Restrictions
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            The legal status of cryptocurrency mining and algorithmic rewards varies across jurisdictions. It is your sole obligation to verify that your participation conforms with local statutory, regulatory, and tax laws. MinePro prohibits access to residents of sanctioned territories or jurisdictions where digital mining platforms are legally proscribed.
          </p>

          <div className="policy-callout-info">
            <h6 className="fw-bold mb-1">
              <i className="bi bi-check-circle-fill me-2" />
              INQUIRIES &amp; CLARIFICATION
            </h6>
            <p className="small mb-0" style={{ lineHeight: 1.6 }}>
              For formal inquiries concerning our risk architecture or operational guidelines, contact our compliance desk at <strong>compliance@minepro.network</strong>.
            </p>
          </div>

          <div className="mt-5 pt-4 border-top d-flex flex-wrap gap-3 justify-content-between align-items-center">
            <Button
              variant="black"
              size="sm"
              onClick={onBackToHome}
            >
              <i className="bi bi-arrow-left me-1" /> Return to Homepage
            </Button>
            <Button
              variant="orange"
              size="sm"
              onClick={onExplorePlans}
            >
              Explore Mining Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
