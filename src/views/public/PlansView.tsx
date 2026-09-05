import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { DEFAULT_PLANS } from '../../config/platformSettings';

interface PlansViewProps {
  onSelectPlan?: (planId: string) => void;
  onGetStarted?: () => void;
}

export const PlansView: React.FC<PlansViewProps> = ({
  onSelectPlan,
  onGetStarted,
}) => {
  // Interactive Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(500);

  // Determine which plan tier matches calcAmount
  const activeCalcPlan = DEFAULT_PLANS.find(
    (p) => calcAmount >= p.minDeposit && calcAmount <= p.maxDeposit
  ) || DEFAULT_PLANS[DEFAULT_PLANS.length - 1];

  const dailyEstReward = (calcAmount * activeCalcPlan.dailyRatePct) / 100;
  const weeklyEstReward = dailyEstReward * 7;
  const monthlyEstReward = dailyEstReward * 30;

  return (
    <div className="pb-5">
      {/* Page Hero */}
      <section 
        className="py-5 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #071911 0%, #0c2b1e 65%, #133a2a 100%)',
          borderBottom: '2px solid #f97316',
        }}
      >
        <div className="container-xl py-4 position-relative z-1">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <span 
                className="badge px-3 py-1.5 rounded-pill mb-3 fw-bold text-uppercase"
                style={{ backgroundColor: '#ffedd5', color: '#ea580c', fontSize: '0.75rem', letterSpacing: '0.04em' }}
              >
                CONFIGURABLE MINING TIERS
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Transparent Digital Mining Plans
              </h1>
              <p className="lead text-light-body fw-medium" style={{ maxWidth: 660, fontSize: '1.15rem', lineHeight: 1.65 }}>
                Choose an authoritative mining tier that matches your capacity. Every plan operates on a standardized 24-hour cycle with deterministic settlement parameters.
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
                  <i className="bi bi-clock-history fs-5 text-orange" />
                  <span className="fw-bold text-white small text-uppercase">Uniform Cycle</span>
                </div>
                <div className="text-light-body small fw-medium" style={{ lineHeight: 1.6 }}>
                  All plans execute a synchronized 24-hour settlement cadence with claim windows governed by server ledger timestamps.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mining Reward Estimator */}
      <section className="container-xl my-5">
        <div 
          className="p-4 p-lg-5 rounded-4 bg-white border shadow-sm"
          style={{ borderColor: '#cfe5d7', boxShadow: '0 10px 30px rgba(7, 26, 17, 0.05)' }}
        >
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <div className="d-inline-flex align-items-center gap-1 mb-2">
                <span className="badge-minepro-green">&bull; REWARD CALCULATOR &bull;</span>
              </div>
              <h3 className="fw-extrabold text-dark mb-2">Simulate Potential Daily Yield</h3>
              <p className="text-muted fw-medium small mb-4" style={{ lineHeight: 1.6 }}>
                Adjust the investment amount below to preview estimated rewards across available tiers based on configured platform parameters.
              </p>

              {/* Slider & Input */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label htmlFor="depositRange" className="form-label fw-bold text-dark small mb-0">
                    Deposit Amount (USDT)
                  </label>
                  <span className="fs-4 fw-extrabold text-success font-monospace">
                    ${calcAmount.toLocaleString()}
                  </span>
                </div>

                <input
                  id="depositRange"
                  type="range"
                  className="form-range"
                  min="10"
                  max="10000"
                  step="10"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                />

                <div className="d-flex justify-content-between small text-muted fw-semibold">
                  <span>Min: $10</span>
                  <span>Mid: $5,000</span>
                  <span>Max: $10,000</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="d-flex flex-wrap gap-2">
                {[50, 100, 500, 1500, 5000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setCalcAmount(preset)}
                    className={`btn btn-sm fw-bold rounded-pill px-3 py-1 ${
                      calcAmount === preset ? 'btn-success text-white fw-extrabold shadow-sm' : 'btn-outline-dark fw-bold'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculation Output Card */}
            <div className="col-12 col-lg-6">
              <div 
                className="p-4 rounded-4"
                style={{ 
                  backgroundColor: '#071d12', 
                  border: '2px solid #22c55e',
                  boxShadow: '0 8px 24px rgba(7, 26, 17, 0.25)' 
                }}
              >
                <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom border-success border-opacity-25">
                  <div>
                    <span className="badge bg-warning text-dark fw-bold px-2 py-1 mb-1">
                      MATCHED TIER: {activeCalcPlan.name.toUpperCase()}
                    </span>
                    <h4 className="fw-extrabold text-white mb-0">{activeCalcPlan.name} Plan</h4>
                  </div>
                  <div className="text-end">
                    <span className="text-light-body small d-block fw-bold">Configured Rate</span>
                    <span className="fs-3 fw-extrabold text-orange">{activeCalcPlan.dailyRatePct.toFixed(2)}% / Day</span>
                  </div>
                </div>

                <div className="row g-3 text-center mb-4">
                  <div className="col-4">
                    <div className="p-2.5 rounded-3" style={{ backgroundColor: '#05140c', border: '1.5px solid #1a422d' }}>
                      <small className="text-light-body d-block fw-bold" style={{ fontSize: '0.74rem' }}>24h Reward</small>
                      <strong className="fs-5 text-success font-monospace">+${dailyEstReward.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2.5 rounded-3" style={{ backgroundColor: '#05140c', border: '1.5px solid #1a422d' }}>
                      <small className="text-light-body d-block fw-bold" style={{ fontSize: '0.74rem' }}>7-Day Projected</small>
                      <strong className="fs-5 text-white font-monospace">+${weeklyEstReward.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2.5 rounded-3" style={{ backgroundColor: '#05140c', border: '1.5px solid #1a422d' }}>
                      <small className="text-light-body d-block fw-bold" style={{ fontSize: '0.74rem' }}>30-Day Projected</small>
                      <strong className="fs-5 text-orange font-monospace">+${monthlyEstReward.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                <Button
                  variant="orange"
                  size="md"
                  fullWidth
                  onClick={() => onSelectPlan?.(activeCalcPlan.id)}
                >
                  Activate {activeCalcPlan.name} Position
                </Button>

                <small className="text-light-subtle d-block text-center mt-2.5 fw-medium" style={{ fontSize: '0.74rem' }}>
                  *Illustrative computation based on configured daily rate. Not a financial guarantee.
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Plans Grid (5 Configurable Tiers) */}
      <section className="container-xl my-5">
        <div className="text-center mb-5">
          <span className="badge-minepro-orange">&bull; ALL TIERS &bull;</span>
          <h2 className="display-6 fw-extrabold text-dark mt-2 mb-2">Compare Mining Positions</h2>
          <p className="text-muted mx-auto fw-medium" style={{ maxWidth: 580 }}>
            Select an active tier tailored to your capital profile. All accounts receive automated 24-hour cycle tracking and multi-network withdrawal capability.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {DEFAULT_PLANS.map((plan) => {
            const isFeatured = plan.slug === 'standard';
            const isOrangeVariant = plan.colorVariant === 'orange';

            return (
              <div key={plan.id} className="col-12 col-md-6 col-lg-4 col-xl">
                <div 
                  className={`card-minepro h-100 p-4 bg-white d-flex flex-column ${
                    isFeatured ? 'shadow-lg border-2' : ''
                  }`}
                  style={{
                    borderTop: `6px solid ${isOrangeVariant ? '#f97316' : '#22c55e'}`,
                    borderColor: isFeatured ? '#16a34a' : undefined,
                    transform: isFeatured ? 'scale(1.02)' : undefined,
                    position: 'relative',
                  }}
                >
                  {isFeatured && (
                    <div 
                      className="position-absolute top-0 start-50 translate-middle badge px-3 py-1 text-uppercase fw-extrabold shadow-sm"
                      style={{ backgroundColor: '#15803d', color: '#ffffff', fontSize: '0.7rem', letterSpacing: '0.05em' }}
                    >
                      Most Popular
                    </div>
                  )}

                  {/* Tier Title */}
                  <div className="text-center mb-3">
                    <span 
                      className="badge px-3 py-1 rounded-pill fw-bold text-uppercase"
                      style={{ 
                        backgroundColor: isOrangeVariant ? '#ffedd5' : '#dcfce7',
                        color: isOrangeVariant ? '#c2410c' : '#15803d',
                        fontSize: '0.8rem' 
                      }}
                    >
                      {plan.name}
                    </span>
                  </div>

                  {/* Icon Emblem */}
                  <div 
                    className="mx-auto my-2 rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm"
                    style={{ 
                      width: 58, 
                      height: 58, 
                      background: isOrangeVariant 
                        ? 'linear-gradient(135deg, #fb923c, #ea580c)' 
                        : 'linear-gradient(135deg, #22c55e, #15803d)' 
                    }}
                  >
                    <i className={`bi ${
                      plan.slug === 'starter' ? 'bi-rocket-takeoff-fill' :
                      plan.slug === 'basic' ? 'bi-layers-fill' :
                      plan.slug === 'standard' ? 'bi-gem' :
                      plan.slug === 'advanced' ? 'bi-crown-fill' : 'bi-star-fill'
                    } fs-4`} />
                  </div>

                  {/* Range limits */}
                  <div className="my-3 py-2 border-top border-bottom border-light text-center">
                    <div className="fw-bold text-dark fs-5">Min: ${plan.minDeposit}</div>
                    <small className="text-muted fw-semibold">Max: ${plan.maxDeposit.toLocaleString()}</small>
                  </div>

                  {/* Daily Reward & Duration */}
                  <div className="text-center mb-4">
                    <small className="text-muted d-block fw-bold" style={{ fontSize: '0.78rem' }}>Daily Reward</small>
                    <div className={`fs-2 fw-extrabold ${isOrangeVariant ? 'text-orange' : 'text-success'}`}>
                      {plan.dailyRatePct.toFixed(2)}%
                    </div>
                    <span className="badge bg-light text-dark border small mt-2 fw-semibold">
                      24h Settlement &bull; Lifetime
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="list-unstyled small mb-4 flex-grow-1 d-flex flex-column gap-2 text-dark">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="d-flex align-items-center gap-2">
                        <i className="bi bi-check-circle-fill text-success flex-shrink-0" />
                        <span className="fw-medium text-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action CTA */}
                  <div className="mt-auto">
                    <Button
                      variant={isFeatured ? 'orange' : 'black'}
                      size="sm"
                      fullWidth
                      onClick={() => onSelectPlan?.(plan.id)}
                    >
                      Select {plan.name}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Matrix Table */}
      <section className="container-xl my-5">
        <div className="card-minepro p-4 p-lg-5 bg-white">
          <h4 className="fw-extrabold text-dark mb-4 text-center">Comprehensive Plan Specifications</h4>
          <div className="table-responsive">
            <table className="table table-minepro table-bordered align-middle mb-0">
              <thead>
                <tr>
                  <th>Plan Tier</th>
                  <th>Deposit Range</th>
                  <th>Daily Reward</th>
                  <th>Cycle Interval</th>
                  <th>Withdrawal Network</th>
                  <th>Affiliate Tier</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {DEFAULT_PLANS.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong className="text-dark">{p.name}</strong>
                    </td>
                    <td className="fw-bold text-dark font-monospace">${p.minDeposit} - ${p.maxDeposit.toLocaleString()}</td>
                    <td>
                      <span className="badge bg-success-subtle text-success fw-bold font-monospace">
                        {p.dailyRatePct.toFixed(2)}% / 24h
                      </span>
                    </td>
                    <td>24 Hours (Authoritative)</td>
                    <td>TRC20 &amp; BEP20 USDT</td>
                    <td>Active (Level 1-3)</td>
                    <td>
                      <button
                        onClick={() => onSelectPlan?.(p.id)}
                        className="btn btn-sm btn-dark py-1 px-3 fw-bold"
                      >
                        Choose
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Disclaimer Callout */}
      <section className="container-xl mt-4">
        <div className="policy-callout-warning small fw-medium">
          <strong>Important Regulatory &amp; Platform Notice:</strong> Plan percentages reflect configured platform algorithm settings and are governed by strict database timestamps. Computational mining yields are subject to pool difficulty parameters. Users should only allocate discretionary capital.
        </div>
      </section>
    </div>
  );
};
