import React from 'react';
import { Button } from '../../components/ui/Button';

interface PrivacyViewProps {
  onBackToHome?: () => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onBackToHome }) => {
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
                DATA GOVERNANCE &amp; SECURITY
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Privacy Policy
              </h1>
              <p className="lead text-light-body fw-medium" style={{ maxWidth: 660, fontSize: '1.15rem', lineHeight: 1.65 }}>
                Learn how MinePro collects, safeguards, and processes account telemetry and transaction data across our decentralized mining ecosystem.
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
                  <i className="bi bi-shield-lock-fill fs-5 text-success" />
                  <span className="fw-bold text-white small text-uppercase">Data Encryption</span>
                </div>
                <div className="text-light-body small fw-medium" style={{ lineHeight: 1.6 }}>
                  We implement cryptographic salted password hashing and end-to-end TLS 1.3 transport security.
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
              <span className="text-muted small fw-bold text-uppercase">Privacy Framework v2.2</span>
              <div className="text-dark fw-bold">Effective: January 2026</div>
            </div>
            <button 
              onClick={() => window.print()} 
              className="btn btn-sm btn-outline-secondary d-none d-sm-inline-flex align-items-center gap-1"
            >
              <i className="bi bi-printer" /> Print Policy
            </button>
          </div>

          {/* Section 1 */}
          <h4 className="policy-section-title">
            <i className="bi bi-database-lock text-success" /> 1. Data Controller &amp; Scope
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            MinePro functions as the data controller for personal telemetry and credential records processed through our web portal. This policy clarifies our practices regarding the acquisition, preservation, and transmission of user information.
          </p>

          {/* Section 2 */}
          <h4 className="policy-section-title">
            <i className="bi bi-database-lock text-success" /> 2. Information We Collect
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            We collect the minimum necessary data to maintain authenticated sessions and authoritative financial ledgers:
          </p>
          <ul className="text-muted small fw-medium mb-3" style={{ lineHeight: 1.7 }}>
            <li><strong>Account Identifiers:</strong> Username, email address, salted password hash (we never store plain text passwords).</li>
            <li><strong>Financial Telemetry:</strong> Public blockchain wallet addresses, transaction hashes (TXIDs), deposit/withdrawal amounts, and claim timestamps.</li>
            <li><strong>Technical Diagnostics:</strong> IP address, browser type, operating system, and session tokens used strictly to safeguard against brute-force attacks and session hijacking.</li>
          </ul>

          {/* Section 3 */}
          <h4 className="policy-section-title">
            <i className="bi bi-database-lock text-success" /> 3. How Data Is Utilized
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            Collected telemetry is utilized strictly for:
          </p>
          <ul className="text-muted small fw-medium mb-3" style={{ lineHeight: 1.7 }}>
            <li>Executing 24-hour cycle computations and authoritative claim balance credits.</li>
            <li>Verifying on-chain deposit confirmations and dispatching withdrawal payments.</li>
            <li>Auditing affiliate referral structures and distributing accurate commission tiers.</li>
            <li>Complying with anti-fraud security protocols and anomaly detection.</li>
          </ul>

          {/* Section 4 */}
          <h4 className="policy-section-title">
            <i className="bi bi-database-lock text-success" /> 4. Cryptographic Data Protection
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            We deploy multiple layers of digital defense: all credentials are encrypted using bcrypt hashing; all server communications utilize HTTPS/TLS 1.3; database instances are segregated in secure private cloud VPC environments with strict least-privilege access rules.
          </p>

          {/* Section 5 */}
          <h4 className="policy-section-title">
            <i className="bi bi-database-lock text-success" /> 5. Cookies &amp; Local Storage
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            MinePro utilizes strictly necessary session cookies to maintain your login state and preserve client-side interface preferences (such as dashboard layout and filter configurations). We do NOT employ third-party behavioral advertising trackers.
          </p>

          {/* Section 6 */}
          <h4 className="policy-section-title">
            <i className="bi bi-database-lock text-success" /> 6. User Rights &amp; Data Erasure
          </h4>
          <p className="text-muted fw-medium small" style={{ lineHeight: 1.7 }}>
            Participants have the right to request access to their account record, rectify outdated details, or request account closure. Note that decentralized blockchain transactions (such as public block records of completed withdrawals) are immutable and cannot be altered or purged.
          </p>

          <div className="policy-callout-info">
            <h6 className="fw-bold mb-1">
              <i className="bi bi-envelope-at-fill me-2" />
              PRIVACY INQUIRIES
            </h6>
            <p className="small mb-0" style={{ lineHeight: 1.6 }}>
              To exercise your data privacy rights or submit a data inquiry, contact our Data Protection Officer at <strong>privacy@minepro.network</strong>.
            </p>
          </div>

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
