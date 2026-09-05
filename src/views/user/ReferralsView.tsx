import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { apiClient, ReferralSummaryResponse, ReferralTreeNode } from '../../services/apiClient';

export const ReferralsView: React.FC = () => {
  const [data, setData] = useState<ReferralSummaryResponse['data'] | null>(null);
  const [treeData, setTreeData] = useState<ReferralTreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tree' | 'ledger'>('overview');

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const [summaryRes, treeRes] = await Promise.all([
        apiClient.getReferralSummary(),
        apiClient.getReferralTree(),
      ]);
      if (summaryRes.success) {
        setData(summaryRes.data);
      }
      if (treeRes.success) {
        setTreeData(treeRes.data);
      }
    } catch (err) {
      console.error('Failed to load referral data:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, isLink: boolean) => {
    navigator.clipboard.writeText(text);
    if (isLink) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading && !data) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading referral engine...</span>
        </div>
      </div>
    );
  }

  const referralCode = data?.referralCode || 'MINE-PRO-77';
  const referralLink = data?.referralLink || `https://minepro.network/register?ref=${referralCode}`;
  const totalEarnings = parseFloat(data?.totalReferralEarnings || '100.00');

  return (
    <div className="d-flex flex-column gap-4">
      {/* Top Header Banner */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-4 rounded-3 bg-white border border-light-subtle shadow-sm">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h3 className="fw-extrabold mb-0 text-dark" style={{ letterSpacing: '-0.02em' }}>
              Referral Rewards Network
            </h3>
            <span className="badge bg-success-subtle text-success fw-bold">
              Multi-Level Up to 5 Tiers
            </span>
          </div>
          <p className="text-muted mb-0 small">
            Share your node referral code to earn instant commissions on downline hardware activations. All rewards settle atomically to your wallet.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            onClick={fetchReferralData}
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 fw-bold"
          >
            <i className="bi bi-arrow-clockwise" /> Refresh Ledger
          </button>
        </div>
      </div>

      {/* Referral Code & Link Sharing Card */}
      <Card title="Your Affiliate Credentials" subtitle="Share with prospective miners to automatically link upline hierarchy">
        <div className="row g-3 align-items-center">
          {/* Referral Code Box */}
          <div className="col-12 col-md-5">
            <label className="form-label text-muted fw-bold small text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
              Unique Referral Code
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-white border-dark font-monospace fw-bold">
                <i className="bi bi-qr-code" />
              </span>
              <input
                type="text"
                readOnly
                value={referralCode}
                className="form-control font-monospace fw-extrabold fs-5 text-dark bg-light border-dark-subtle"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(referralCode, false)}
                className={`btn ${copiedCode ? 'btn-success' : 'btn-dark'} fw-bold px-3 d-flex align-items-center gap-1`}
              >
                <i className={`bi ${copiedCode ? 'bi-check-lg' : 'bi-clipboard'}`} />
                {copiedCode ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Referral Link Box */}
          <div className="col-12 col-md-7">
            <label className="form-label text-muted fw-bold small text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
              Direct Invitation Link
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-light-subtle text-muted">
                <i className="bi bi-link-45deg fs-5" />
              </span>
              <input
                type="text"
                readOnly
                value={referralLink}
                className="form-control text-muted bg-light border-light-subtle small font-monospace"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(referralLink, true)}
                className={`btn ${copiedLink ? 'btn-success' : 'btn-outline-success'} fw-bold px-3 d-flex align-items-center gap-1`}
              >
                <i className={`bi ${copiedLink ? 'bi-check-lg' : 'bi-clipboard-check'}`} />
                {copiedLink ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 4 Referral High-Contrast Stat Metrics */}
      <div className="row g-3">
        {/* Total Earnings */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-widget">
            <div>
              <span className="text-muted fw-bold small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                Total Referral Yield
              </span>
              <h3 className="fw-extrabold mb-0 text-success" style={{ letterSpacing: '-0.02em' }}>
                ${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <small className="text-muted fw-semibold" style={{ fontSize: '0.72rem' }}>Credited to wallet ledger</small>
            </div>
            <div 
              className="stat-icon-wrapper" 
              style={{ 
                backgroundColor: '#d1fae5', 
                color: '#065f46',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' 
              }}
            >
              <i className="bi bi-cash-stack" />
            </div>
          </div>
        </div>

        {/* Total Network Referrals */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-widget">
            <div>
              <span className="text-muted fw-bold small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                Total Network
              </span>
              <h3 className="fw-extrabold mb-0 text-dark" style={{ letterSpacing: '-0.02em' }}>
                {data?.totalReferrals || 3} Members
              </h3>
              <small className="text-muted fw-semibold" style={{ fontSize: '0.72rem' }}>All active tiers</small>
            </div>
            <div 
              className="stat-icon-wrapper" 
              style={{ 
                backgroundColor: '#ffedd5', 
                color: '#ea580c',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)' 
              }}
            >
              <i className="bi bi-people-fill" />
            </div>
          </div>
        </div>

        {/* Active Nodes */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-widget">
            <div>
              <span className="text-muted fw-bold small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                Active Node Miners
              </span>
              <h3 className="fw-extrabold mb-0 text-dark" style={{ letterSpacing: '-0.02em' }}>
                {data?.activeReferrals || 3}
              </h3>
              <small className="text-muted fw-semibold" style={{ fontSize: '0.72rem' }}>Qualified with active plan</small>
            </div>
            <div 
              className="stat-icon-wrapper" 
              style={{ 
                backgroundColor: '#d1fae5', 
                color: '#065f46',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' 
              }}
            >
              <i className="bi bi-cpu-fill" />
            </div>
          </div>
        </div>

        {/* Active Levels */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-widget">
            <div>
              <span className="text-muted fw-bold small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                System Config
              </span>
              <h3 className="fw-extrabold mb-0 text-dark" style={{ letterSpacing: '-0.02em' }}>
                {data?.activeLevels || 3} Tiers Active
              </h3>
              <small className="text-muted fw-semibold" style={{ fontSize: '0.72rem' }}>Configurable (Level 1–5)</small>
            </div>
            <div 
              className="stat-icon-wrapper" 
              style={{ 
                backgroundColor: '#ffedd5', 
                color: '#ea580c',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)' 
              }}
            >
              <i className="bi bi-diagram-3-fill" />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Level Tier Configuration Grid (5 Levels) */}
      <Card
        title="Multi-Level Commission Structure"
        subtitle="Configured commission rates applied to all qualified downline investment activities"
      >
        <div className="row g-3">
          {[
            {
              level: 1,
              name: 'Level 1 (Direct)',
              pct: data?.levelPercentages.level1 || 7.0,
              count: data?.levelCounts.level1 || 2,
              active: true,
              desc: 'Direct invitations',
              badgeColor: 'success',
            },
            {
              level: 2,
              name: 'Level 2 (Tier 2)',
              pct: data?.levelPercentages.level2 || 3.0,
              count: data?.levelCounts.level2 || 1,
              active: true,
              desc: 'Invited by your Level 1',
              badgeColor: 'warning',
            },
            {
              level: 3,
              name: 'Level 3 (Tier 3)',
              pct: data?.levelPercentages.level3 || 1.5,
              count: data?.levelCounts.level3 || 0,
              active: true,
              desc: 'Invited by your Level 2',
              badgeColor: 'info',
            },
            {
              level: 4,
              name: 'Level 4 (Tier 4)',
              pct: data?.levelPercentages.level4 || 0.5,
              count: data?.levelCounts.level4 || 0,
              active: (data?.activeLevels || 3) >= 4,
              desc: 'Deep network node',
              badgeColor: 'secondary',
            },
            {
              level: 5,
              name: 'Level 5 (Tier 5)',
              pct: data?.levelPercentages.level5 || 0.25,
              count: data?.levelCounts.level5 || 0,
              active: (data?.activeLevels || 3) >= 5,
              desc: 'Enterprise tier',
              badgeColor: 'secondary',
            },
          ].map((tier) => (
            <div key={tier.level} className="col-12 col-sm-6 col-lg">
              <div 
                className={`p-3 rounded-3 border h-100 ${tier.active ? 'bg-white border-light-subtle shadow-sm' : 'bg-light border-dashed opacity-60'}`}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="small text-muted fw-bold">Tier {tier.level}</span>
                  <span className={`badge bg-${tier.badgeColor}-subtle text-${tier.badgeColor} fw-bold`}>
                    {tier.active ? `${tier.pct.toFixed(2)}%` : 'Disabled'}
                  </span>
                </div>
                <h5 className="fw-extrabold text-dark mb-1">{tier.name}</h5>
                <p className="text-muted small mb-3" style={{ fontSize: '0.75rem' }}>{tier.desc}</p>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light">
                  <span className="small text-muted fw-semibold">Downlines:</span>
                  <span className="fw-bold text-dark font-monospace">{tier.count} Members</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs for Tree Visualization vs Reward History Ledger */}
      <div className="d-flex gap-2 border-bottom border-light-subtle pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`btn btn-sm ${activeTab === 'overview' ? 'btn-dark' : 'btn-light'} fw-bold px-3`}
        >
          <i className="bi bi-clock-history me-1" /> Reward History Ledger ({data?.history.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('tree')}
          className={`btn btn-sm ${activeTab === 'tree' ? 'btn-dark' : 'btn-light'} fw-bold px-3`}
        >
          <i className="bi bi-diagram-3 me-1" /> Network Hierarchy Tree
        </button>
      </div>

      {/* TAB 1: Complete Auditable Ledger Table */}
      {activeTab === 'overview' && (
        <Card
          title="Referral Commission Ledger"
          subtitle="Immutable transaction audit log of all multi-level rewards credited to your account"
        >
          {(!data?.history || data.history.length === 0) ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-journal-x fs-1 text-secondary mb-2 d-block" />
              <h6 className="fw-bold">No referral rewards recorded yet</h6>
              <p className="small">Commission records will appear here as your referrals activate mining plans.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="small text-uppercase fw-bold text-muted py-3">Timestamp</th>
                    <th className="small text-uppercase fw-bold text-muted py-3">Tier</th>
                    <th className="small text-uppercase fw-bold text-muted py-3">Source Member</th>
                    <th className="small text-uppercase fw-bold text-muted py-3">Qualifying Base</th>
                    <th className="small text-uppercase fw-bold text-muted py-3">Rate</th>
                    <th className="small text-uppercase fw-bold text-muted py-3">Commission</th>
                    <th className="small text-uppercase fw-bold text-muted py-3">Audit Reference</th>
                    <th className="small text-uppercase fw-bold text-muted py-3 text-end">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.history.map((item) => (
                    <tr key={item.id}>
                      <td className="small text-muted font-monospace">
                        {new Date(item.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td>
                        <span className={`badge ${item.level === 1 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'} fw-bold`}>
                          Level {item.level}
                        </span>
                      </td>
                      <td className="fw-bold text-dark font-monospace small">
                        <i className="bi bi-person-fill text-muted me-1" />
                        {item.sourceUsername}
                      </td>
                      <td className="fw-semibold text-dark font-monospace small">
                        ${parseFloat(item.baseAmount).toFixed(2)}
                      </td>
                      <td className="fw-bold text-muted font-monospace small">
                        {parseFloat(item.percentage).toFixed(2)}%
                      </td>
                      <td className="fw-extrabold text-success font-monospace">
                        +${parseFloat(item.rewardAmount).toFixed(2)}
                      </td>
                      <td className="small font-monospace text-muted">
                        <span className="badge bg-light text-dark border">
                          {item.reference}
                        </span>
                      </td>
                      <td className="text-end">
                        <span className="badge bg-success text-white fw-bold">
                          <i className="bi bi-check-circle-fill me-1" />
                          COMPLETED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* TAB 2: Multi-Level Referral Network Tree */}
      {activeTab === 'tree' && (
        <Card
          title="Hierarchical Network Tree"
          subtitle="Real-time multi-level referral topology down to configured depth limit"
        >
          <div className="p-3 bg-light rounded-3 border border-light-subtle">
            {treeData ? (
              <div className="referral-tree-container">
                {/* Root Node: Ahmad */}
                <div className="card-minepro p-3 bg-white mb-4 border border-success shadow-sm" style={{ maxWidth: 420 }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-dark text-white fw-bold">YOU (NODE ROOT)</span>
                    <span className="badge bg-success-subtle text-success fw-bold">Active Miner</span>
                  </div>
                  <h6 className="fw-extrabold text-dark mb-0 font-monospace">{treeData.username}</h6>
                  <small className="text-muted">Total Invested: ${treeData.totalInvested}</small>
                </div>

                {/* Level 1 & Downlines */}
                <div className="ps-4 border-start border-2 border-success d-flex flex-column gap-3">
                  <div className="small fw-bold text-success text-uppercase" style={{ letterSpacing: '0.05em' }}>
                    <i className="bi bi-arrow-return-right me-1" /> Level 1 Direct Referrals (7.00% Commission Tier)
                  </div>

                  {treeData.children && treeData.children.length > 0 ? (
                    treeData.children.map((l1Child) => (
                      <div key={l1Child.id} className="d-flex flex-column gap-2">
                        <div className="card-minepro p-3 bg-white border border-light-subtle shadow-sm" style={{ maxWidth: 380 }}>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="badge bg-success-subtle text-success fw-bold">Level 1</span>
                            <span className="badge bg-success text-white fw-bold">Standard Node</span>
                          </div>
                          <h6 className="fw-extrabold text-dark mb-0 font-monospace">{l1Child.username}</h6>
                          <div className="d-flex justify-content-between text-muted small mt-1">
                            <span>Status: {l1Child.status}</span>
                            <span className="fw-bold text-dark font-monospace">${l1Child.totalInvested}</span>
                          </div>
                        </div>

                        {/* Level 2 Children */}
                        {l1Child.children && l1Child.children.length > 0 && (
                          <div className="ps-4 border-start border-2 border-warning d-flex flex-column gap-2 my-1">
                            <div className="small fw-bold text-warning-emphasis text-uppercase" style={{ letterSpacing: '0.05em' }}>
                              <i className="bi bi-arrow-return-right me-1" /> Level 2 Referrals (3.00% Commission Tier)
                            </div>
                            {l1Child.children.map((l2Child) => (
                              <div key={l2Child.id} className="card-minepro p-2.5 px-3 bg-white border border-warning-subtle shadow-sm" style={{ maxWidth: 340 }}>
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="badge bg-warning-subtle text-warning-emphasis fw-bold">Level 2</span>
                                  <span className="badge bg-success-subtle text-success fw-bold">Active</span>
                                </div>
                                <h6 className="fw-extrabold text-dark mb-0 font-monospace small">{l2Child.username}</h6>
                                <div className="d-flex justify-content-between text-muted small mt-1" style={{ fontSize: '0.72rem' }}>
                                  <span>Referred by: {l1Child.username}</span>
                                  <span className="fw-bold text-dark font-monospace">${l2Child.totalInvested}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-muted small">No direct downlines found.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-muted small">Loading network topology...</div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
