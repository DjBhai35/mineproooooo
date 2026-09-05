import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';

interface FaqViewProps {
  onContactClick?: () => void;
  onGetStarted?: () => void;
}

interface FaqItem {
  id: string;
  category: 'general' | 'plans' | 'financial' | 'referral' | 'security';
  question: string;
  answer: string;
}

export const FaqView: React.FC<FaqViewProps> = ({
  onContactClick,
  onGetStarted,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openId, setOpenId] = useState<string>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'general',
      question: 'What is MinePro and what service does it provide?',
      answer: 'MinePro is a digital mining management platform that allows participants to acquire virtual computational positions across standardized plan tiers. Instead of procuring and maintaining physical ASIC hardware, users participate through standardized daily reward cycles governed by authoritative server ledger timestamps.'
    },
    {
      id: 'faq-2',
      category: 'general',
      question: 'How do I start participating on MinePro?',
      answer: 'Getting started requires three simple steps: 1) Register a free user account with your username and email; 2) Select an active mining tier matching your capacity (starting from $10 USDT); 3) Complete your deposit using TRC20 or BEP20. Once verified, your 24-hour reward cycle initiates automatically.'
    },
    {
      id: 'faq-3',
      category: 'plans',
      question: 'How do mining plans differ across tiers?',
      answer: 'MinePro offers 5 distinct tiers: Starter ($10-$99), Basic ($100-$499), Standard ($500-$1,499), Advanced ($1,500-$4,999), and Premium ($5,000-$9,999). Each tier features a higher daily reward rate (from 2.0% to 4.0% per 24 hours), increased node allocation priority, and expanded affiliate depth.'
    },
    {
      id: 'faq-4',
      category: 'plans',
      question: 'What is a 24-hour reward cycle and how does it execute?',
      answer: 'A cycle represents an exact 86,400-second operational window. When a position is activated, the server logs the exact start timestamp. The user dashboard displays an interactive countdown. When the countdown completes, the state transitions to "Eligible for Claim", allowing the user to claim that period\'s reward.'
    },
    {
      id: 'faq-5',
      category: 'plans',
      question: 'When can a reward be claimed and what happens if I miss a claim?',
      answer: 'Rewards become claimable immediately when the 24-hour timer reaches zero. Platform rules provide a generous claim window (typically 48 hours). If a claim is not performed within the window, the platform logs the missed event and prepares the next cycle according to system policy.'
    },
    {
      id: 'faq-6',
      category: 'financial',
      question: 'Which payment networks and cryptocurrencies are supported?',
      answer: 'MinePro supports Tether (USDT) on two prominent blockchains: Tron (TRC20) and Binance Smart Chain (BEP20). Both networks were selected for their low transfer friction, rapid block confirmations, and wide global accessibility.'
    },
    {
      id: 'faq-7',
      category: 'financial',
      question: 'What are the minimum deposit and withdrawal amounts?',
      answer: 'The minimum deposit threshold is $10.00 USDT. The minimum withdrawal threshold is $50.00 USDT, with a maximum per-transaction cap of $25,000.00 USDT. Withdrawals incur a transparent 2.0% platform processing allocation to cover blockchain gas and operational reconciliation.'
    },
    {
      id: 'faq-8',
      category: 'financial',
      question: 'How quickly are deposits and withdrawals processed?',
      answer: 'Deposits are credited automatically as soon as the required on-chain block confirmations are reached on Tron or BSC (usually 2 to 10 minutes). Withdrawals undergo automated ledger sanity checks before being broadcast to the blockchain network.'
    },
    {
      id: 'faq-9',
      category: 'referral',
      question: 'How does the multi-level referral program work?',
      answer: 'MinePro features a transparent tiered affiliate architecture. You earn commissions when participants registered through your referral link activate a mining position: Level 1 (direct) earns 7.0%, Level 2 earns 3.0%, and Level 3 earns 1.5%. Commissions are credited directly to your balance in real time.'
    },
    {
      id: 'faq-10',
      category: 'security',
      question: 'Are rewards, earnings, or capital returns guaranteed?',
      answer: 'No. MinePro strictly states that rewards and income are NOT guaranteed. Digital mining depends on overall network difficulty, operational rig uptime, and crypto market dynamics. All figures displayed on plans represent configured algorithmic target rates. Never allocate funds you cannot afford to risk.'
    },
    {
      id: 'faq-11',
      category: 'security',
      question: 'Where can I audit my complete transaction history?',
      answer: 'Every financial event—including deposits, plan activations, 24-hour cycle reward claims, referral commissions, and withdrawal payouts—is permanently logged in your account Transaction Ledger with unique transaction IDs and precise timestamps.'
    },
    {
      id: 'faq-12',
      category: 'security',
      question: 'How does MinePro safeguard user accounts and data?',
      answer: 'User passwords are encrypted with industry-standard bcrypt hashing. Sessions are protected through secure cookies and authentication guards. Sensitive financial operations require server-side state confirmation to prevent client-side parameter manipulation.'
    }
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

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
                KNOWLEDGE BASE
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Frequently Asked Questions
              </h1>
              <p className="lead text-light-body fw-medium" style={{ maxWidth: 660, fontSize: '1.15rem', lineHeight: 1.65 }}>
                Clear, transparent answers about our mining tiers, 24-hour cycles, supported networks, deposits, withdrawals, and platform security.
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
                  <i className="bi bi-question-circle-fill fs-5 text-success" />
                  <span className="fw-bold text-white small text-uppercase">Need Help?</span>
                </div>
                <div className="text-light-body small fw-medium mb-3" style={{ lineHeight: 1.6 }}>
                  Can&apos;t find what you are looking for? Our support desk is available to assist.
                </div>
                <button 
                  onClick={onContactClick}
                  className="btn btn-sm btn-outline-light fw-bold py-1.5 px-3"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="container-xl my-5">
        <div className="card-minepro p-4 bg-white mb-4">
          <div className="row g-3 align-items-center justify-content-between">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search questions (e.g. withdrawal, 24h cycle, TRC20)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="d-flex flex-wrap gap-1 justify-content-md-end">
                {[
                  { id: 'all', label: 'All Questions' },
                  { id: 'general', label: 'General' },
                  { id: 'plans', label: 'Plans & Cycles' },
                  { id: 'financial', label: 'Deposits & Withdrawals' },
                  { id: 'referral', label: 'Referrals' },
                  { id: 'security', label: 'Security' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`btn btn-sm py-1.5 px-3 rounded-pill fw-bold ${
                      activeCategory === tab.id
                        ? 'btn-dark text-white'
                        : 'btn-light text-dark border'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div className="accordion accordion-minepro" id="faqAccordion">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="accordion-item">
                  <h2 className="accordion-header" id={`heading-${faq.id}`}>
                    <button
                      className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => setOpenId(isOpen ? '' : faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`collapse-${faq.id}`}
                    >
                      <span className="me-3 text-success fw-bold">
                        <i className="bi bi-patch-question me-1" />
                      </span>
                      {faq.question}
                    </button>
                  </h2>
                  <div
                    id={`collapse-${faq.id}`}
                    className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                    aria-labelledby={`heading-${faq.id}`}
                  >
                    <div className="accordion-body">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="card-minepro p-5 text-center bg-white">
              <i className="bi bi-search fs-1 text-muted mb-2 d-block" />
              <h5 className="fw-bold text-dark">No matching questions found</h5>
              <p className="text-muted small mb-3">Try altering your search keywords or choosing another category.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="btn btn-sm btn-outline-dark px-3 py-1 fw-bold"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Need More Assistance Banner */}
      <section className="container-xl mt-5">
        <div 
          className="p-5 rounded-4 text-white text-center"
          style={{ 
            background: 'linear-gradient(135deg, #071911 0%, #0e2f20 60%, #ea580c 100%)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.25)' 
          }}
        >
          <h3 className="fw-extrabold text-white mb-2">Have Additional Inquiries?</h3>
          <p className="lead text-light-body mx-auto mb-4 fw-medium" style={{ maxWidth: 500, fontSize: '1.05rem' }}>
            Reach out to our operational team or register your personal account to test the platform.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="black"
              size="md"
              onClick={onContactClick}
              style={{ backgroundColor: '#060b08', border: '1.5px solid #22c55e' }}
            >
              Contact Support
            </Button>
            <Button
              variant="orange"
              size="md"
              onClick={onGetStarted}
            >
              Sign Up Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
