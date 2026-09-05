import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export const AdminPanelBlueprint: React.FC = () => {
  // Authoritative datasets matching reference image
  const recentDeposits = [
    { id: '1', user: 'Ahmad Khan', amount: 100.00, network: 'TRC20', txHash: 'TX6F...8923', status: 'Pending', date: '15 May 2026, 10:30 AM' },
    { id: '2', user: 'Ali Raza', amount: 250.00, network: 'BEP20', txHash: 'TX9A...1234', status: 'Pending', date: '15 May 2026, 10:28 AM' },
    { id: '3', user: 'Usman Malik', amount: 500.00, network: 'TRC20', txHash: 'TX7B...5678', status: 'Pending', date: '15 May 2026, 10:15 AM' },
    { id: '4', user: 'Hamza J.', amount: 1000.00, network: 'BEP20', txHash: 'TX9C...8765', status: 'Pending', date: '15 May 2026, 10:05 AM' },
  ];

  const recentWithdrawals = [
    { id: '1', user: 'Sara Khan', amount: 150.00, network: 'TRC20', txHash: 'TW8F...8923', status: 'Pending', date: '15 May 2026, 10:30 AM' },
    { id: '2', user: 'Bilal Ahmed', amount: 300.00, network: 'BEP20', txHash: 'TW9A...1234', status: 'Pending', date: '15 May 2026, 10:28 AM' },
    { id: '3', user: 'Zain Ali', amount: 200.00, network: 'TRC20', txHash: 'TW7B...5678', status: 'Pending', date: '15 May 2026, 10:15 AM' },
    { id: '4', user: 'Noor Fatima', amount: 500.00, network: 'BEP20', txHash: 'TW9C...8765', status: 'Pending', date: '15 May 2026, 10:05 AM' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Blueprint Header Alert */}
      <Alert
        type="warning"
        title="STEP 1 — Admin Architecture Blueprint"
        className="mb-0 shadow-sm"
      >
        This blueprint lays out the exact administration matrix and ledger controls. Complete CRUD user moderation, dynamic plan editing, payment wallet settings, and audit trails will be fully wired in <strong>STEP 6</strong>.
      </Alert>

      {/* 6 High-Contrast Metric Widgets */}
      <div className="row g-3">
        {/* Total Users */}
        <div className="col-6 col-lg-4 col-xl-2">
          <div className="stat-widget">
            <div>
              <span className="text-muted fw-bold d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.02em' }}>
                Total Users
              </span>
              <h4 className="fw-extrabold mb-0 text-dark">12,458</h4>
            </div>
            <div 
              className="stat-icon-wrapper" 
              style={{ 
                width: 44, 
                height: 44, 
                backgroundColor: '#d1fae5', 
                color: '#065f46',
                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' 
              }}
            >
              <i className="bi bi-people-fill fs-5" />
            </div>
          </div>
        </div>

        {/* Total Deposits */}
        <div className="col-6 col-lg-4 col-xl-2">
          <div className="stat-widget">
            <div>
              <span className="text-muted fw-bold d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.02em' }}>
                Total Deposits
              </span>
              <h4 className="fw-extrabold mb-0 text-dark">$1.24M</h4>
            </div>
            <div 
              className="stat-icon-wrapper" 
              style={{ 
                width: 44, 
                height: 44, 
                backgroundColor: '#ffedd5', 
                color: '#ea580c',
                boxShadow: '0 4px 10px rgba(249, 115, 22, 0.25)' 
              }}
            >
              <i className="bi bi-safe-fill fs-5" />
            </div>
          </div>
        </div>

        {/* Total Withdrawals */}
        <div className="col-6 col-lg-4 col-xl-2">
          <div className="stat-widget">
            <div>
              <span className="text-muted fw-bold d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.02em' }}>
                Withdrawals
              </span>
              <h4 className="fw-extrabold mb-0 text-dark">$845K</h4>
            </div>
            <div 
              className="stat-icon-wrapper" 
              style={{ 
                width: 44, 
                height: 44, 
                backgroundColor: '#d1fae5', 
                color: '#065f46',
                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' 
              }}
            >
              <i className="bi bi-bank fs-5" />
            </div>
          </div>
        </div>

        {/* Pending Deposits */}
        <div className="col-6 col-lg-4 col-xl-2">
          <div className="stat-widget">
            <div>
              <span className="text-muted fw-bold d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.02em' }}>
                Pending Dep.
              </span>
              <h4 className="fw-extrabold mb-0 text-orange">42</h4>
            </div>
            <div 
              className="stat-icon-wrapper" 
              style={{ 
                width: 44, 
                height: 44, 
                backgroundColor: '#ffedd5', 
                color: '#ea580c',
                boxShadow: '0 4px 10px rgba(249, 115, 22, 0.25)' 
              }}
            >
              <i className="bi bi-hourglass-split fs-5" />
            </div>
          </div>
        </div>

        {/* Pending Withdrawals */}
        <div className="col-6 col-lg-4 col-xl-2">
          <div className="stat-widget">
            <div>
              <span className="text-muted fw-bold d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.02em' }}>
                Pending Wdr.
              </span>
              <h4 className="fw-extrabold mb-0 text-danger">18</h4>
            </div>
            <div 
              className="stat-icon-wrapper" 
              style={{ 
                width: 44, 
                height: 44, 
                backgroundColor: '#fee2e2', 
                color: '#dc2626',
                boxShadow: '0 4px 10px rgba(220, 38, 38, 0.2)' 
              }}
            >
              <i className="bi bi-arrow-up-circle fs-5" />
            </div>
          </div>
        </div>

        {/* Today's Claims */}
        <div className="col-6 col-lg-4 col-xl-2">
          <div className="stat-widget">
            <div>
              <span className="text-muted fw-bold d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.02em' }}>
                Today Claims
              </span>
              <h4 className="fw-extrabold mb-0 text-success">856</h4>
            </div>
            <div 
              className="stat-icon-wrapper" 
              style={{ 
                width: 44, 
                height: 44, 
                backgroundColor: '#f3e8ff', 
                color: '#7e22ce',
                boxShadow: '0 4px 10px rgba(126, 34, 206, 0.2)' 
              }}
            >
              <i className="bi bi-cpu fs-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Ledger Row (Recent Deposits & Withdrawals Tables) */}
      <div className="row g-4">
        {/* Recent Deposits Table */}
        <div className="col-12 col-xl-6">
          <Card
            title="Recent Deposits Queue"
            action={<span className="badge-minepro-orange">4 Pending</span>}
          >
            <div className="table-responsive">
              <table className="table table-minepro table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Network</th>
                    <th>TX Hash</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeposits.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold text-dark">{item.user}</td>
                      <td className="fw-extrabold text-success">${item.amount.toFixed(2)}</td>
                      <td>
                        <span className="badge bg-light text-dark border fw-bold">{item.network}</span>
                      </td>
                      <td className="font-monospace text-muted small fw-semibold">{item.txHash}</td>
                      <td>
                        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle fw-bold">
                          {item.status}
                        </span>
                      </td>
                      <td className="text-muted small fw-semibold">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Recent Withdrawals Table */}
        <div className="col-12 col-xl-6">
          <Card
            title="Recent Withdrawals Queue"
            action={<span className="badge-minepro-orange">4 Pending</span>}
          >
            <div className="table-responsive">
              <table className="table table-minepro table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Network</th>
                    <th>TX Hash</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {recentWithdrawals.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold text-dark">{item.user}</td>
                      <td className="fw-extrabold text-dark">${item.amount.toFixed(2)}</td>
                      <td>
                        <span className="badge bg-light text-dark border fw-bold">{item.network}</span>
                      </td>
                      <td className="font-monospace text-muted small fw-semibold">{item.txHash}</td>
                      <td>
                        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle fw-bold">
                          {item.status}
                        </span>
                      </td>
                      <td className="text-muted small fw-semibold">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Plan Distribution & System Settings Snapshot */}
      <div className="row g-4">
        <div className="col-12 col-md-6 col-lg-4">
          <Card title="Plan Distribution">
            <div className="text-center py-2">
              <div className="position-relative d-inline-block">
                <svg width="150" height="150" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#e2f0e7" strokeWidth="16" />
                  <circle
                    cx="70"
                    cy="70"
                    r="54"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="16"
                    strokeDasharray="339"
                    strokeDashoffset="55"
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="54"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="16"
                    strokeDasharray="339"
                    strokeDashoffset="300"
                    strokeLinecap="round"
                    transform="rotate(60 70 70)"
                  />
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <span className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem' }}>Total Plans</span>
                  <span className="fs-3 fw-extrabold text-dark">7</span>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-4 mt-3 small fw-bold">
                <div className="d-flex align-items-center gap-1">
                  <span className="rounded-circle d-inline-block bg-success" style={{ width: 10, height: 10 }} />
                  <span className="text-dark">Active: <strong>6</strong></span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span className="rounded-circle d-inline-block bg-warning" style={{ width: 10, height: 10 }} />
                  <span className="text-dark">Inactive: <strong>1</strong></span>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="black" size="sm" fullWidth icon="bi-plus-circle">
                  Add New Plan Tier
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Centralized System Settings Preview */}
        <div className="col-12 col-md-6 col-lg-8">
          <Card
            title="Dynamic Financial Settings Blueprint"
            subtitle="Centralized configuration without code redeployment (Section 20)"
          >
            <div className="row g-3 small">
              <div className="col-12 col-sm-6">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="text-muted fw-bold d-block mb-1">Deposit Limits (Configurable)</span>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted fw-semibold">Minimum Deposit:</span>
                    <strong className="text-dark fs-6">$10.00</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted fw-semibold">Maximum Deposit:</span>
                    <strong className="text-dark fs-6">$50,000.00</strong>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="text-muted fw-bold d-block mb-1">Withdrawal Limits (Configurable)</span>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted fw-semibold">Minimum Withdrawal:</span>
                    <strong className="text-dark fs-6">$50.00</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted fw-semibold">Withdrawal Fee:</span>
                    <strong className="text-orange fs-6">2.00%</strong>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="text-muted fw-bold d-block mb-1">24-Hour Mining Engine Policy</span>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted fw-semibold">Cycle Duration:</span>
                    <strong className="text-dark">24 Hours (Authoritative)</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted fw-semibold">Claim Window:</span>
                    <strong className="text-dark">48 Hours</strong>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="text-muted fw-bold d-block mb-1">Affiliate / Referral Hierarchy</span>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted fw-semibold">Active Tiers:</span>
                    <strong className="text-success">Levels 1-3 Enabled (Max 5)</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted fw-semibold">Commission Rates:</span>
                    <strong className="text-dark">L1: 7%, L2: 3%, L3: 1.5%</strong>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
