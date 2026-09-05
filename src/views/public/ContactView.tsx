import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/ui/FormInput';
import { Alert } from '../../components/ui/Alert';

interface ContactViewProps {
  onFaqClick?: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onFaqClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 700);
  };

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
                SUPPORT &amp; INQUIRIES
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Contact MinePro Support
              </h1>
              <p className="lead text-light-body fw-medium" style={{ maxWidth: 660, fontSize: '1.15rem', lineHeight: 1.65 }}>
                Have questions regarding mining node allocation, transaction verification, or affiliate partnerships? Our technical desk is ready to help.
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
                  <i className="bi bi-clock-fill fs-5 text-success" />
                  <span className="fw-bold text-white small text-uppercase">Typical Response Time</span>
                </div>
                <div className="text-light-body small fw-medium" style={{ lineHeight: 1.6 }}>
                  Average ticket response within 2-4 hours. All tickets are logged with cryptographic verification.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container-xl my-5">
        <div className="row g-4">
          {/* Contact Information & Channels */}
          <div className="col-12 col-lg-4">
            <div className="card-minepro p-4 bg-white h-100 d-flex flex-column gap-4">
              <div>
                <h4 className="fw-extrabold text-dark mb-3">Support Channels</h4>
                <p className="text-muted small fw-medium" style={{ lineHeight: 1.6 }}>
                  Reach out through our direct communication endpoints or check our documentation.
                </p>
              </div>

              <div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-light border">
                <div 
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center text-success"
                  style={{ backgroundColor: '#dcfce7', width: 44, height: 44 }}
                >
                  <i className="bi bi-envelope-fill fs-5" />
                </div>
                <div>
                  <small className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: '0.72rem' }}>
                    Direct Support Email
                  </small>
                  <a href="mailto:support@minepro.network" className="text-dark fw-bold text-decoration-none">
                    support@minepro.network
                  </a>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-light border">
                <div 
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center text-warning-emphasis"
                  style={{ backgroundColor: '#ffedd5', width: 44, height: 44 }}
                >
                  <i className="bi bi-telegram fs-5 text-orange" />
                </div>
                <div>
                  <small className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: '0.72rem' }}>
                    Community &amp; Announcements
                  </small>
                  <span className="text-dark fw-bold">@MineProOfficial</span>
                  <div className="text-muted small">Global Telegram Community</div>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-light border">
                <div 
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center text-dark"
                  style={{ backgroundColor: '#e2f0e7', width: 44, height: 44 }}
                >
                  <i className="bi bi-shield-check fs-5 text-success" />
                </div>
                <div>
                  <small className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: '0.72rem' }}>
                    Operational Hours
                  </small>
                  <span className="text-dark fw-bold">24/7 Continuous Node Ops</span>
                  <div className="text-muted small">Support team active across all UTC timezones</div>
                </div>
              </div>

              <div className="mt-auto p-3 rounded-3 border" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <h6 className="fw-bold text-dark mb-1 d-flex align-items-center gap-1">
                  <i className="bi bi-lightbulb-fill text-warning" /> Need quick help?
                </h6>
                <p className="small text-muted mb-2">
                  Common questions regarding plans, deposits, and 24h cycles are answered in our FAQ.
                </p>
                <button 
                  onClick={onFaqClick}
                  className="btn btn-sm btn-outline-success fw-bold py-1 px-3"
                >
                  Browse FAQ
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="col-12 col-lg-8">
            <div className="card-minepro p-4 p-lg-5 bg-white">
              <h3 className="fw-extrabold text-dark mb-2">Submit a Support Ticket</h3>
              <p className="text-muted small fw-medium mb-4" style={{ lineHeight: 1.6 }}>
                Please provide accurate details so our technical team can assist you efficiently.
              </p>

              {submittedSuccess ? (
                <div className="text-center py-5">
                  <div 
                    className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{ backgroundColor: '#dcfce7', color: '#16a34a', width: 72, height: 72 }}
                  >
                    <i className="bi bi-check2-circle fs-1" />
                  </div>
                  <h4 className="fw-extrabold text-dark mb-2">Ticket Successfully Dispatched</h4>
                  <p className="text-muted fw-medium small mx-auto mb-4" style={{ maxWidth: 440 }}>
                    Your inquiry has been registered with reference ID <code className="fw-bold text-success font-monospace">MP-{(Math.random()*900000+100000).toFixed(0)}</code>. Our desk will follow up at <strong>{email}</strong> shortly.
                  </p>
                  <Button
                    variant="black"
                    size="sm"
                    onClick={() => {
                      setSubmittedSuccess(false);
                      setName('');
                      setEmail('');
                      setSubject('');
                      setMessage('');
                    }}
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <FormInput
                        label="Full Name"
                        placeholder="e.g. Alex Morgan"
                        icon="bi-person"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <FormInput
                        label="Email Address"
                        type="email"
                        placeholder="alex@example.com"
                        icon="bi-envelope"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold text-dark mb-1">
                        Inquiry Category
                      </label>
                      <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="general">General Platform Inquiry</option>
                        <option value="plans">Mining Plans &amp; Cycles</option>
                        <option value="financial">Deposits &amp; Withdrawals</option>
                        <option value="referral">Affiliate &amp; Referral Program</option>
                        <option value="technical">Technical Issue or Bug Report</option>
                        <option value="compliance">Compliance &amp; Legal</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <FormInput
                        label="Subject"
                        placeholder="Brief summary of inquiry"
                        icon="bi-tag"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-dark mb-1">
                        Message Details
                      </label>
                      <textarea
                        className="form-control"
                        rows={5}
                        placeholder="Please describe your question or transaction details (TXID, network, timestamp)..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="contactConsent" required />
                        <label className="form-check-label small text-muted" htmlFor="contactConsent">
                          I acknowledge that MinePro support will use this information to respond to my technical inquiry in accordance with the Privacy Policy.
                        </label>
                      </div>
                    </div>

                    <div className="col-12 mt-4">
                      <Button
                        variant="orange"
                        size="md"
                        type="submit"
                        isLoading={isSubmitting}
                      >
                        Transmit Support Inquiry
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
