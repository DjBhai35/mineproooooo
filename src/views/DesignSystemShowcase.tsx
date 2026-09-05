import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { Modal } from '../components/ui/Modal';
import { FormInput } from '../components/ui/FormInput';
import { EmptyState, ErrorState, Skeleton } from '../components/ui/StateFeedback';
import { DataTable, Column } from '../components/ui/DataTable';

interface DemoRow {
  id: string;
  txId: string;
  asset: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  date: string;
}

export const DesignSystemShowcase: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [btnLoading, setBtnLoading] = useState(false);

  const demoData: DemoRow[] = [
    { id: '1', txId: 'MP-89214', asset: 'USDT (TRC20)', amount: 500.0, status: 'COMPLETED', date: '2026-05-15 10:24' },
    { id: '2', txId: 'MP-89215', asset: 'USDT (BEP20)', amount: 150.0, status: 'PENDING', date: '2026-05-15 11:05' },
    { id: '3', txId: 'MP-89216', asset: 'Standard Plan Yield', amount: 15.0, status: 'COMPLETED', date: '2026-05-15 12:00' },
    { id: '4', txId: 'MP-89217', asset: 'Affiliate Tier 1', amount: 35.0, status: 'COMPLETED', date: '2026-05-15 13:42' },
    { id: '5', txId: 'MP-89218', asset: 'USDT (TRC20)', amount: 200.0, status: 'FAILED', date: '2026-05-15 14:10' },
  ];

  const columns: Column<DemoRow>[] = [
    { header: 'Reference', accessorKey: 'txId', className: 'font-monospace fw-bold text-dark' },
    { header: 'Type / Asset', accessorKey: 'asset' },
    {
      header: 'Amount',
      cell: (row) => (
        <span className="fw-bold text-dark">${row.amount.toFixed(2)}</span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => {
        if (row.status === 'COMPLETED') return <Badge variant="green" dot>Completed</Badge>;
        if (row.status === 'PENDING') return <Badge variant="orange" dot>Processing</Badge>;
        return <Badge variant="danger" dot>Failed</Badge>;
      },
    },
    { header: 'Timestamp', accessorKey: 'date', className: 'text-muted small' },
  ];

  return (
    <div className="d-flex flex-column gap-5 py-3">
      {/* Title & Theme Manifesto */}
      <div className="p-4 p-lg-5 rounded-4 text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #0c2419 0%, #15452e 100%)', border: '1px solid #1f573b' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="badge-minepro-orange">THEME FOUNDATION</span>
            <span className="badge bg-white bg-opacity-25 text-white">Bootstrap 5 Native</span>
          </div>
          <span className="text-success small fw-bold">MinePro Architectural Standard</span>
        </div>
        <h2 className="fw-extrabold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
          Green + Orange + Black + White
        </h2>
        <p className="text-light text-opacity-75 mb-0" style={{ maxWidth: 720 }}>
          Dominant fresh green environment, energetic orange accents for actions and rewards, premium black contrast buttons, and controlled crisp white content surfaces. Zero generic starter templates.
        </p>
      </div>

      {/* Palette Swatches */}
      <section>
        <h5 className="fw-bold text-forest mb-3">1. Color Palette Tokens</h5>
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <div className="card-minepro p-3 text-center">
              <div className="rounded-3 mb-2" style={{ height: 60, backgroundColor: '#22c55e' }} />
              <div className="fw-bold small text-dark">Fresh Green</div>
              <small className="text-muted font-monospace">#22c55e (Dominant)</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card-minepro p-3 text-center">
              <div className="rounded-3 mb-2" style={{ height: 60, backgroundColor: '#0c2419' }} />
              <div className="fw-bold small text-dark">Deep Forest</div>
              <small className="text-muted font-monospace">#0c2419 (Sidebar/Canvas)</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card-minepro p-3 text-center">
              <div className="rounded-3 mb-2" style={{ height: 60, backgroundColor: '#f97316' }} />
              <div className="fw-bold small text-dark">Energy Orange</div>
              <small className="text-muted font-monospace">#f97316 (Key Accent)</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card-minepro p-3 text-center">
              <div className="rounded-3 mb-2" style={{ height: 60, backgroundColor: '#0b0f0d' }} />
              <div className="fw-bold small text-dark">Premium Black</div>
              <small className="text-muted font-monospace">#0b0f0d (Primary CTAs)</small>
            </div>
          </div>
        </div>
      </section>

      {/* Reusable Buttons Showcase */}
      <section>
        <h5 className="fw-bold text-forest mb-3">2. Button Hierarchy (Bootstrap 5 Custom)</h5>
        <Card>
          <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
            <Button variant="black">Black Primary</Button>
            <Button variant="orange">Orange Energy</Button>
            <Button variant="green">Green Accent</Button>
            <Button variant="outline-black">Outline Black</Button>
            <Button variant="outline-orange">Outline Orange</Button>
            <Button variant="outline-green">Outline Green</Button>
            <Button
              variant="black"
              isLoading={btnLoading}
              onClick={() => {
                setBtnLoading(true);
                setTimeout(() => setBtnLoading(false), 1500);
              }}
            >
              {btnLoading ? 'Processing...' : 'Click for Loading State'}
            </Button>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-3 pt-3 border-top">
            <Button variant="black" size="sm" icon="bi-lightning-charge">Small Button</Button>
            <Button variant="orange" size="md" icon="bi-wallet2">Standard Medium</Button>
            <Button variant="green" size="lg" icon="bi-check-circle">Large CTA Button</Button>
            <Button variant="outline-orange" size="sm" icon="bi-play-circle" iconPosition="right">
              Trailing Icon
            </Button>
          </div>
        </Card>
      </section>

      {/* Badges & Status Indicators */}
      <section>
        <h5 className="fw-bold text-forest mb-3">3. Badges &amp; Status Indicators</h5>
        <Card>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Badge variant="green" dot>Active Mining Node</Badge>
            <Badge variant="orange" dot>24h Cycle Running</Badge>
            <Badge variant="black">VIP Tier</Badge>
            <Badge variant="success">Confirmed Deposit</Badge>
            <Badge variant="warning">Verification Pending</Badge>
            <Badge variant="danger">High Risk Alert</Badge>
            <Badge variant="info">TRC20 Network</Badge>
            <span className="badge-minepro-green">Custom Green Badge</span>
            <span className="badge-minepro-orange">Custom Orange Badge</span>
            <span className="badge-minepro-black">Custom Black Badge</span>
          </div>
        </Card>
      </section>

      {/* Reusable Card Variants */}
      <section>
        <h5 className="fw-bold text-forest mb-3">4. Card Surfaces</h5>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <Card title="Standard Card" subtitle="Controlled white surface">
              <p className="text-muted small mb-0">
                16px border-radius, clean subtle border, gentle shadow for financial data.
              </p>
            </Card>
          </div>
          <div className="col-12 col-md-4">
            <Card variant="green" title="Green Tint Card" subtitle="Soft ambient background">
              <p className="text-muted small mb-0">
                Gentle green gradient surface for featured statistics and active nodes.
              </p>
            </Card>
          </div>
          <div className="col-12 col-md-4">
            <Card variant="elevated" title="Elevated Card" subtitle="High priority modules">
              <p className="text-muted small mb-0">
                Deep elevation shadow with crisp border for primary conversion items.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section>
        <h5 className="fw-bold text-forest mb-3">5. Form Controls (Bootstrap 5)</h5>
        <Card>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <FormInput
                label="Wallet Address"
                placeholder="T... or 0x..."
                icon="bi-wallet"
                helperText="Supported: USDT (TRC20 & BEP20)"
              />
            </div>
            <div className="col-12 col-md-6">
              <FormInput
                label="Deposit Amount"
                type="number"
                placeholder="100.00"
                icon="bi-currency-dollar"
                rightAddon={<span className="fw-bold text-dark">USDT</span>}
              />
            </div>
            <div className="col-12 col-md-6">
              <FormInput
                label="Validation Error State"
                defaultValue="invalid-address"
                error="Invalid blockchain address format for selected network"
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold text-dark small mb-1">Blockchain Network</label>
              <select className="form-select">
                <option value="TRC20">TRON Network (TRC20) — Fast confirmation</option>
                <option value="BEP20">BNB Smart Chain (BEP20) — Low gas fees</option>
              </select>
            </div>
          </div>
        </Card>
      </section>

      {/* Alerts & System Feedback States (Section 25) */}
      <section>
        <h5 className="fw-bold text-forest mb-3">6. Alert &amp; Operational States</h5>
        <div className="d-flex flex-column gap-3">
          <Alert type="success" title="Reward Settled Successfully">
            Your 24-hour cycle yield of $15.00 has been credited to your wallet balance.
          </Alert>
          <Alert type="warning" title="Minimum Withdrawal Notice">
            Minimum withdrawal limit is set to $50.00 according to centralized platform settings.
          </Alert>
          <Alert type="danger" title="Network Confirmation Delay">
            Blockchain mempool congestion detected. Deposit approvals may take an extra 5 minutes.
          </Alert>
          <Alert type="processing" title="Authoritative Ledger Verification">
            Validating cryptographic signature against node cluster. Please stand by.
          </Alert>
        </div>
      </section>

      {/* Empty / Error / Skeleton States */}
      <section>
        <h5 className="fw-bold text-forest mb-3">7. Empty, Error, &amp; Skeleton States</h5>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <Card>
              <EmptyState
                title="No Active Investments"
                description="You haven't activated any mining plan yet."
                actionLabel="Explore Plans"
              />
            </Card>
          </div>
          <div className="col-12 col-md-4">
            <Card>
              <ErrorState
                title="Connection Timeout"
                message="Unable to reach the secondary validator node."
                onRetry={() => {}}
              />
            </Card>
          </div>
          <div className="col-12 col-md-4">
            <Card title="Skeleton Loading State">
              <div className="d-flex flex-column gap-2 py-2">
                <Skeleton height={20} width="60%" />
                <Skeleton height={14} width="90%" />
                <Skeleton height={14} width="75%" />
                <div className="pt-2 d-flex gap-2">
                  <Skeleton height={32} width={80} />
                  <Skeleton height={32} width={100} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Responsive Table & Modal Interactive Test */}
      <section>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold text-forest mb-0">8. Responsive Data Table &amp; Modal Test</h5>
          <Button variant="black" size="sm" icon="bi-window" onClick={() => setModalOpen(true)}>
            Open Test Modal
          </Button>
        </div>
        <Card bodyClassName="p-0">
          <DataTable
            columns={columns}
            data={demoData}
            keyExtractor={(row) => row.id}
            currentPage={currentPage}
            totalPages={3}
            onPageChange={setCurrentPage}
          />
        </Card>
      </section>

      {/* Interactive Modal Component */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="MinePro Bootstrap 5 Modal Verification"
        primaryActionLabel="Confirm Action"
        onPrimaryAction={() => setModalOpen(false)}
      >
        <p className="text-muted small mb-3">
          This modal demonstrates the native Bootstrap 5 overlay wrapped with MinePro&apos;s custom design guidelines, rounded corners, escape-key accessibility, and focus trapping.
        </p>
        <div className="p-3 bg-light rounded-3 border">
          <div className="d-flex justify-content-between text-dark small mb-1">
            <span>Authoritative Cycle:</span>
            <strong>24-Hour Settlement</strong>
          </div>
          <div className="d-flex justify-content-between text-dark small">
            <span>Primary Theme:</span>
            <span className="text-success fw-bold">Green + Orange + Black</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
