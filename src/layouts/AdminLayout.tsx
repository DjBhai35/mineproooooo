import React, { useState } from 'react';
import { Logo } from '../components/brand/Logo';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onLogout?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeRoute,
  onNavigate,
  onLogout,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Section 12: Complete Admin Blueprint items
  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'admin-users', label: 'Users', icon: 'bi-people' },
    { id: 'admin-plans', label: 'Plans', icon: 'bi-box-seam' },
    { id: 'admin-investments', label: 'Investments', icon: 'bi-graph-up' },
    { id: 'admin-deposits', label: 'Deposits', icon: 'bi-arrow-down-circle' },
    { id: 'admin-withdrawals', label: 'Withdrawals', icon: 'bi-arrow-up-circle' },
    { id: 'admin-rewards', label: 'Mining / Claims', icon: 'bi-lightning-charge' },
    { id: 'admin-referrals', label: 'Referrals', icon: 'bi-diagram-3' },
    { id: 'admin-transactions', label: 'Transactions', icon: 'bi-receipt' },
    { id: 'admin-payments', label: 'Payment Settings', icon: 'bi-credit-card' },
    { id: 'admin-settings', label: 'System Settings', icon: 'bi-sliders' },
    { id: 'admin-admins', label: 'Admins', icon: 'bi-shield-check' },
    { id: 'admin-logs', label: 'Activity Logs', icon: 'bi-journal-text' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileSidebarOpen(false);
  };

  const AdminSidebarContent = (
    <div className="d-flex flex-column h-100 py-3">
      {/* Admin Logo with tag */}
      <div className="px-3 mb-3 pb-3 border-bottom border-secondary border-opacity-25">
        <Logo size="md" variant="light" badge="ADMIN" />
      </div>

      {/* Navigation Links */}
      <div className="flex-grow-1 overflow-y-auto px-2">
        <div className="small text-uppercase px-3 mb-2 text-warning fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
          Platform Management
        </div>
        <ul className="nav nav-pills flex-column gap-1">
          {adminMenuItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <li className="nav-item" key={item.id}>
                <button
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={`nav-link w-100 text-start border-0 ${isActive ? 'active' : ''}`}
                >
                  <i className={`bi ${item.icon} fs-6`} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Admin Logout */}
      <div className="px-3 pt-3 mt-auto border-top border-secondary border-opacity-25">
        <button
          onClick={onLogout}
          className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="bi bi-box-arrow-right" />
          <span>Exit Admin Panel</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#edf7f1' }}>
      {/* Desktop Admin Sidebar */}
      <aside className="d-none d-lg-block sidebar-minepro flex-shrink-0 sticky-top" style={{ height: '100vh', backgroundColor: '#091a12' }}>
        {AdminSidebarContent}
      </aside>

      {/* Mobile Offcanvas */}
      {mobileSidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none" 
          style={{ backgroundColor: 'rgba(9, 26, 18, 0.75)', zIndex: 1040 }}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div 
            className="sidebar-minepro h-100 position-relative shadow-lg"
            style={{ width: '280px', backgroundColor: '#091a12' }}
            onClick={(e) => e.stopPropagation()}
          >
            {AdminSidebarContent}
          </div>
        </div>
      )}

      {/* Main Admin Area */}
      <div className="d-flex flex-column flex-grow-1 min-vw-0">
        <header className="topbar-minepro sticky-top d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-light border d-lg-none py-1 px-2"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Admin Menu"
            >
              <i className="bi bi-list fs-5" />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-dark">MinePro Control Center</span>
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                  Super Admin
                </span>
              </div>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                PostgreSQL & Prisma Ledger Authoritative Sync
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="badge-minepro-green">
              <i className="bi bi-shield-lock me-1" /> RBAC Protected
            </span>
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{ width: 36, height: 36, background: '#ea580c' }}
            >
              AD
            </div>
          </div>
        </header>

        <main className="flex-grow-1 p-3 p-md-4">
          <div className="container-fluid p-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
