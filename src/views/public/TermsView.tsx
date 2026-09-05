import React from 'react';
import { Button } from '../../components/ui/Button';

interface TermsViewProps {
  onBackToHome?: () => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onBackToHome }) => {
  return (
    <div className="pb-5">
      {/* Page Header */}
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
                LEGAL AGREEMENT
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Terms of Service
              </h1>
              <p className="lead text-light-body fw-medium" style={{ maxWidth: 660, fontSize: '1.15rem', lineHeight: 1.65 }}>
                These Terms of Service constitute a legally binding agreement between you and MinePro governing your access to and use of our digital platform.
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
                  <i className="bi bi-file-earmark-text-fill fs-5 text-success" />
                  <span className="fw-bold text-white small text-uppercase">Binding Agreement</span>
                </div>
                <div className="text-light-body small fw-medium" style={{ lineHeight: 1.6 }}>
                  By accessing or registering on MinePro, you unconditionally agree to comply with all outlined platform policies.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Content */}
      <section className="container-xl my-5">
        <div className="policy-card">
          <div className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
            <div>
              <span className="text-muted small fw-bold text-uppercase">Revision 3.1</span>
              <div className="text-dark fw-bold">Last Updated: January 2026</div>
            </div>
            <button 
              onClick={() => window.print()} 
              className="btn btn-sm btn-outline-secondary d-none d-sm-inline-flex align-items-center gap-1"
            >
              <i className="bi bi-printer" /> Print Agreement
            </button>
          </div>

          {/* Section 1 */}
          <h4 className="policy-section-title">
            <i className="bi bi-check-circle-fill text-success" /> 1. Eligibility &amp; Account Creation
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            To utilize MinePro services, you must be at least 18 years of age (or the legal age of majority in your jurisdiction) and possess full legal capacity to enter into binding agreements. Each natural person or legal entity is permitted to register a single primary account. Multiple or automated bot account creations violate these terms and are subject to immediate termination.
          </p>

          {/* Section 2 */}
          <h4 className="policy-section-title">
            <i className="bi bi-check-circle-fill text-success" /> 2. Computational Position Allocation
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            Acquisition of a mining plan on MinePro grants the user temporary digital rights to simulated computational hashrate allocation according to the selected tier specifications. It does NOT convey physical ownership, title, or physical custody over server racks, ASICs, or electrical infrastructure.
          </p>

          {/* Section 3 */}
          <h4 className="policy-section-title">
            <i className="bi bi-check-circle-fill text-success" /> 3. 24-Hour Cycle Execution &amp; Reward Claims
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            Reward cycles operate on a strict 86,400-second timeline validated by database server clocks. Rewards are not credited automatically to liquid balance; the participant must execute an authenticated claim request via the client dashboard during the active claim window. The platform makes no warranties regarding guaranteed profit or fixed income.
          </p>

          {/* Section 4 */}
          <h4 className="policy-section-title">
            <i className="bi bi-check-circle-fill text-success" /> 4. Deposits, Withdrawals &amp; Processing Fees
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            All financial operations are settled in USDT via supported networks (TRC20 and BEP20). The user is solely responsible for ensuring blockchain transaction destination accuracy. Withdrawals incur a dynamic 2.0% platform processing fee and are subject to security verification prior to on-chain broadcast.
          </p>

          {/* Section 5 */}
          <h4 className="policy-section-title">
            <i className="bi bi-check-circle-fill text-success" /> 5. Multi-Level Referral Program
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            The referral program allows participants to earn commissions on verified downstream position activations across active levels (Level 1: 7%, Level 2: 3%, Level 3: 1.5%). Creating artificial self-referral structures (sybil attacks), spamming promotional materials, or making false claims regarding guaranteed yields constitutes a breach of these Terms.
          </p>

          {/* Section 6 */}
          <h4 className="policy-section-title">
            <i className="bi bi-check-circle-fill text-success" /> 6. Prohibited Activities
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            Users agree NOT to engage in:
          </p>
          <ul className="text-muted small fw-medium mb-3" style={{ lineHeight: 1.7 }}>
            <li>Exploiting software vulnerabilities, race conditions, or unauthorized API endpoints.</li>
            <li>Deploying automated scrapers, denial-of-service tools, or packet flooding mechanisms.</li>
            <li>Laundering illicit funds or violating international financial sanctions.</li>
            <li>Impersonating MinePro staff, administrators, or network operators.</li>
          </ul>

          {/* Section 7 */}
          <h4 className="policy-section-title">
            <i className="bi bi-check-circle-fill text-success" /> 7. Limitation of Liability
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            To the maximum extent permitted by law, MinePro and its affiliates shall not be liable for any indirect, punitive, consequential, or exemplary damages, including loss of profits, loss of data, or blockchain network disruptions arising from or in connection with the use of the service.
          </p>

          {/* Section 8 */}
          <h4 className="policy-section-title">
            <i className="bi bi-check-circle-fill text-success" /> 8. Governing Law &amp; Dispute Resolution
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            These Terms shall be interpreted and governed in accordance with international digital commerce principles. Any dispute arising out of or related to these terms shall be subject to binding confidential arbitration prior to any formal judicial proceedings.
          </p>

          <div className="mt-5 pt-4 border-top">
            <Button
              variant="black"
              size="sm"
              onClick={onBackToHome}
            >
              <i className="bi bi-arrow-left me-1" /> Back to Homepage
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
