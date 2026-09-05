import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';

export const ArchitectureBlueprint: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'db' | 'cycle' | 'referral' | 'settings'>('roadmap');

  const roadmapSteps = [
    { num: 1, title: 'Foundation + Design System + Blueprint', status: 'ACTIVE / COMPLETE', desc: 'Theme, layouts, Prisma PostgreSQL schema, centralized config, reusable components.', current: true },
    { num: 2, title: 'Public Homepage + Website', status: 'UPCOMING (STEP 2)', desc: 'Interactive landing page, plan explorer, how-it-works, FAQ, contact.', current: false },
    { num: 3, title: 'Authentication + User Dashboard', status: 'UPCOMING (STEP 3)', desc: 'Session tokens, login/register, user profile, dashboard widgets.', current: false },
    { num: 4, title: 'Mining Cycle + Claim + Referral System', status: 'UPCOMING (STEP 4)', desc: 'Authoritative 24h timer, server-side claim validation, 5-level referral tree.', current: false },
    { num: 5, title: 'Deposit + Withdrawal + Wallet System', status: 'UPCOMING (STEP 5)', desc: 'TRC20 & BEP20 handling, transaction ledger, payout queue.', current: false },
    { num: 6, title: 'Complete Admin Panel', status: 'UPCOMING (STEP 6)', desc: 'User moderation, plan CRUD, financial settings, audit logs.', current: false },
    { num: 7, title: 'Full Integration + Testing + Production', status: 'UPCOMING (STEP 7)', desc: 'Security auditing, rate limits, performance optimizations.', current: false },
  ];

  const dbModels = [
    { name: 'User', fields: 'id, email, username, passwordHash, role, status, referralCode, referredById', note: 'Role-Based Access (User, Admin, Super Admin)' },
    { name: 'Plan', fields: 'id, slug, name, tierBadge, minDeposit, maxDeposit, dailyRatePct, cycleDurationHours', note: 'Configurable investment tiers with lifetime/fixed days' },
    { name: 'Investment', fields: 'id, userId, planId, amount, dailyReward, totalEarned, status, nextClaimAt', note: 'Authoritative activation timestamps' },
    { name: 'Wallet', fields: 'id, userId, balance, totalDeposited, totalWithdrawn, totalEarned', note: 'Decimal(18, 8) high precision crypto balances' },
    { name: 'RewardCycle', fields: 'id, userId, investmentId, cycleNumber, rewardAmount, cycleEndsAt, status', note: 'Authoritative server timestamps for claims' },
    { name: 'Transaction', fields: 'id, reference, userId, type, amount, fee, status, metadata', note: 'Immutable double-entry financial ledger' },
    { name: 'Deposit', fields: 'id, userId, network (TRC20/BEP20), amount, toAddress, txHash, status', note: 'Manual & automated blockchain verification' },
    { name: 'Withdrawal', fields: 'id, userId, network, amount, fee, netPayout, walletAddress, status', note: 'Admin approval workflow and payout queue' },
    { name: 'ReferralRelationship', fields: 'id, uplineUserId, downlineUserId, level (1 to 5)', note: 'Configurable multi-tier affiliate hierarchy' },
    { name: 'ReferralReward', fields: 'id, beneficiaryId, triggerUserId, level, rewardRatePct, rewardAmount', note: 'Authoritative calculation tied to qualifying events' },
    { name: 'Notification', fields: 'id, userId, type, title, message, isRead, createdAt', note: 'In-app real-time event messaging' },
    { name: 'PaymentMethod', fields: 'id, name, network, walletAddress, minDeposit, isActive', note: 'Configurable crypto addresses without code edits' },
    { name: 'SystemSetting', fields: 'id, key, value, type, category, isPublic, updatedBy', note: 'Dynamic runtime platform parameters' },
    { name: 'AdminActivityLog', fields: 'id, adminId, action, entityType, previousValue, newValue, ipAddress', note: 'Full compliance audit trail' },
  ];

  return (
    <div className="d-flex flex-column gap-4 py-3">
      {/* Overview Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-4 bg-white rounded-4 border shadow-sm">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-success text-white">STEP 1 ARCHITECTURE</span>
            <span className="badge-minepro-orange">Prisma &amp; PostgreSQL Ready</span>
          </div>
          <h3 className="fw-bold text-dark mb-1">System Blueprint &amp; Technical Foundation</h3>
          <p className="text-muted small mb-0">
            Comprehensive roadmap, database architecture, and authoritative business logic rules.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills gap-2 bg-light p-2 rounded-3 border">
        <li className="nav-item">
          <button
            className={`nav-link small fw-bold ${activeTab === 'roadmap' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('roadmap')}
          >
            <i className="bi bi-diagram-2 me-1" /> 7-Step Development Roadmap
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link small fw-bold ${activeTab === 'db' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('db')}
          >
            <i className="bi bi-database me-1" /> Database Models (14)
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link small fw-bold ${activeTab === 'cycle' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('cycle')}
          >
            <i className="bi bi-clock-history me-1" /> 24h Reward Cycle Engine
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link small fw-bold ${activeTab === 'referral' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('referral')}
          >
            <i className="bi bi-people me-1" /> Multi-Level Referral Tree
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link small fw-bold ${activeTab === 'settings' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="bi bi-sliders me-1" /> Dynamic System Settings
          </button>
        </li>
      </ul>

      {/* Tab 1: Roadmap */}
      {activeTab === 'roadmap' && (
        <Card title="7 Controlled Stages of MinePro Development">
          <div className="d-flex flex-column gap-3">
            {roadmapSteps.map((step) => (
              <div
                key={step.num}
                className={`p-3 rounded-3 border d-flex flex-wrap align-items-center justify-content-between gap-3 ${
                  step.current ? 'bg-success-subtle border-success' : 'bg-white'
                }`}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                      step.current ? 'bg-success text-white' : 'bg-light text-muted border'
                    }`}
                    style={{ width: 44, height: 44 }}
                  >
                    0{step.num}
                  </div>
                  <div>
                    <div className="fw-bold text-dark">{step.title}</div>
                    <small className="text-muted">{step.desc}</small>
                  </div>
                </div>
                <Badge variant={step.current ? 'green' : 'secondary'}>
                  {step.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 2: Database Models */}
      {activeTab === 'db' && (
        <Card
          title="Prisma PostgreSQL Schema Foundation (prisma/schema.prisma)"
          subtitle="Designed with timestamps, relational integrity, indexes, and high precision decimals"
        >
          <div className="table-responsive">
            <table className="table table-minepro table-sm mb-0">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Primary Fields &amp; Relations</th>
                  <th>Architectural Role</th>
                </tr>
              </thead>
              <tbody>
                {dbModels.map((m) => (
                  <tr key={m.name}>
                    <td className="fw-bold text-forest">
                      <i className="bi bi-table me-2 text-success" />
                      {m.name}
                    </td>
                    <td className="font-monospace text-muted small" style={{ fontSize: '0.8rem' }}>
                      {m.fields}
                    </td>
                    <td className="small text-dark">{m.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: Authoritative Cycle */}
      {activeTab === 'cycle' && (
        <Card title="Authoritative 24-Hour Reward Cycle Engine">
          <Alert type="warning" title="Section 13 &amp; 18 Security Directive" className="mb-4">
            The browser countdown must <strong>never</strong> be the source of truth. 
            All financial claims and cycle eligibility are calculated strictly against server-side PostgreSQL timestamps.
          </Alert>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <h6 className="fw-bold text-dark mb-3">Cycle Lifecycle Sequence</h6>
              <ol className="list-group list-group-numbered small">
                <li className="list-group-item">User activates plan via confirmed deposit or wallet balance.</li>
                <li className="list-group-item">Server computes <code>cycleStartedAt = NOW()</code> and <code>cycleEndsAt = NOW() + 24 HOURS</code>.</li>
                <li className="list-group-item">Client displays countdown derived from server timestamp.</li>
                <li className="list-group-item">At zero, user triggers <code>POST /api/claims/execute</code> with investment token.</li>
                <li className="list-group-item">Server validates in transaction: <code>NOW() &gt;= cycleEndsAt</code> and <code>status == RUNNING</code>.</li>
                <li className="list-group-item">Atomic credit to <code>Wallet.balance</code> &amp; creation of <code>Transaction</code> record.</li>
                <li className="list-group-item">Immediate scheduling of subsequent 24-hour cycle.</li>
              </ol>
            </div>

            <div className="col-12 col-md-6">
              <div className="p-4 bg-light rounded-3 border h-100">
                <h6 className="fw-bold text-dark mb-2">Tamper Prevention Specs</h6>
                <ul className="text-muted small d-flex flex-column gap-2 mb-0 ps-3">
                  <li><strong>Cryptographic Timestamps:</strong> Stored as UTC in PostgreSQL.</li>
                  <li><strong>Decimal Precision:</strong> Calculated using <code>Decimal(18, 8)</code> to prevent IEEE 754 floating-point inaccuracies.</li>
                  <li><strong>Idempotency:</strong> Unique constraint <code>@@unique([investmentId, cycleNumber])</code> prevents double-claim exploits.</li>
                  <li><strong>Audit Trails:</strong> IP address and user-agent recorded for every claim execution.</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Referral System */}
      {activeTab === 'referral' && (
        <Card title="Dynamic Multi-Level Referral Architecture (Levels 1 to 5)">
          <Alert type="info" title="Section 14 Directive" className="mb-4">
            Referral levels are dynamic and configurable by the administrator via system settings. 
            Zero misleading recruitment messaging or hardcoded commission percentages.
          </Alert>

          <div className="table-responsive">
            <table className="table table-minepro mb-0">
              <thead>
                <tr>
                  <th>Tier Level</th>
                  <th>Default Percentage</th>
                  <th>Current State</th>
                  <th>Configurable Parameters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-bold text-dark">Level 1 (Direct Referrals)</td>
                  <td className="fw-bold text-success">7.00%</td>
                  <td><Badge variant="green">Enabled</Badge></td>
                  <td className="text-muted small">Admin editable in System Settings</td>
                </tr>
                <tr>
                  <td className="fw-bold text-dark">Level 2 (Secondary Network)</td>
                  <td className="fw-bold text-success">3.00%</td>
                  <td><Badge variant="green">Enabled</Badge></td>
                  <td className="text-muted small">Admin editable in System Settings</td>
                </tr>
                <tr>
                  <td className="fw-bold text-dark">Level 3 (Tertiary Network)</td>
                  <td className="fw-bold text-success">1.50%</td>
                  <td><Badge variant="green">Enabled</Badge></td>
                  <td className="text-muted small">Admin editable in System Settings</td>
                </tr>
                <tr>
                  <td className="fw-bold text-dark">Level 4 (Extended Network)</td>
                  <td className="fw-bold text-muted">0.50%</td>
                  <td><Badge variant="secondary">Disabled (Standby)</Badge></td>
                  <td className="text-muted small">Toggleable in Admin Panel</td>
                </tr>
                <tr>
                  <td className="fw-bold text-dark">Level 5 (VIP Network)</td>
                  <td className="fw-bold text-muted">0.25%</td>
                  <td><Badge variant="secondary">Disabled (Standby)</Badge></td>
                  <td className="text-muted small">Toggleable in Admin Panel</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 5: Dynamic System Settings */}
      {activeTab === 'settings' && (
        <Card title="Centralized Configuration Architecture (Section 20)">
          <p className="text-muted small mb-4">
            No important business or financial value requires source-code editing. All limits, fees, networks, and timers are managed through dynamic configuration records.
          </p>

          <div className="row g-3">
            {[
              { key: 'MIN_DEPOSIT', value: '$10.00', cat: 'Financial', desc: 'Minimum allowed deposit across TRC20/BEP20' },
              { key: 'MAX_DEPOSIT', value: '$50,000.00', cat: 'Financial', desc: 'Single deposit limit per transaction' },
              { key: 'MIN_WITHDRAWAL', value: '$50.00', cat: 'Financial', desc: 'Threshold required for payout request' },
              { key: 'WITHDRAWAL_FEE_PCT', value: '2.00%', cat: 'Financial', desc: 'Platform liquidity processing fee' },
              { key: 'CYCLE_DURATION_HOURS', value: '24 Hours', cat: 'Mining Engine', desc: 'Settlement frequency for rewards' },
              { key: 'TRC20_ENABLED', value: 'TRUE', cat: 'Networks', desc: 'TRON USDT payment channel status' },
              { key: 'BEP20_ENABLED', value: 'TRUE', cat: 'Networks', desc: 'BSC USDT payment channel status' },
              { key: 'MAINTENANCE_MODE', value: 'FALSE', cat: 'General', desc: 'Emergency gateway lockdown switch' },
            ].map((setting) => (
              <div key={setting.key} className="col-12 col-sm-6 col-lg-3">
                <div className="p-3 bg-light rounded-3 border h-100">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="badge bg-secondary-subtle text-secondary small" style={{ fontSize: '0.68rem' }}>{setting.cat}</span>
                    <span className="fw-bold text-forest">{setting.value}</span>
                  </div>
                  <div className="font-monospace fw-bold text-dark small mb-1">{setting.key}</div>
                  <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>{setting.desc}</small>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
