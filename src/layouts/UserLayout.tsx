import React, { useState } from 'react';
import { Logo } from '../components/brand/Logo';

interface UserLayoutProps {
  children: React.ReactNode;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onLogout?: () => void;
  userName?: string;
}

export const UserLayout: React.FC<UserLayoutProps> = ({
  children,
  activeRoute,
  onNavigate,
  onLogout,
  userName = 'Ahmad Sikander',
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Future Navigation Blueprint from Section 11
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { id: 'mining', label: 'Mining', icon: 'bi-cpu-fill' },
    { id: 'investments', label: 'Investments', icon: 'bi-graph-up-arrow' },
    { id: 'wallet', label: 'Wallet', icon: 'bi-wallet2' },
    { id: 'deposit', label: 'Deposit', icon: 'bi-box-arrow-in-down' },
    { id: 'withdraw', label: 'Withdraw', icon: 'bi-box-arrow-up' },
    { id: 'transactions', label: 'Transactions', icon: 'bi-arrow-left-right' },
    { id: 'referrals', label: 'Referrals', icon: 'bi-people-fill' },
    { id: 'profile', label: 'Profile', icon: 'bi-person-badge-fill' },
    { id: 'security', label: 'Security', icon: 'bi-shield-lock-fill' },
    { id: 'support', label: 'Support', icon: 'bi-headset' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileSidebarOpen(false);
  };

  const SidebarContent = (
    <div className="d-flex flex-column h-100 py-3">
      {/* Sidebar Logo */}
      <div className="px-3 mb-4 pb-2 border-bottom border-success border-opacity-25">
        <Logo size="md" variant="light" showTagline />
      </div>

      {/* Navigation Links */}
      <div className="flex-grow-1 overflow-y-auto px-2">
        <div className="small text-uppercase px-3 mb-2 text-success text-opacity-75 fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
          User Navigation
        </div>
        <ul className="nav nav-pills flex-column gap-1">
          {menuItems.map((item) => {
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

      {/* Logout Action */}
      <div className="px-3 pt-3 mt-auto border-top border-success border-opacity-25">
        <button
          onClick={onLogout}
          className="btn btn-link text-decoration-none text-danger-emphasis w-100 d-flex align-items-center gap-2 px-3 py-2 rounded"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
        >
          <i className="bi bi-box-arrow-right fs-6" />
          <span className="fw-semibold small">Logout Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#edf7f1' }}>
      {/* Desktop Sidebar */}
      <aside className="d-none d-lg-block sidebar-minepro flex-shrink-0 sticky-top" style={{ height: '100vh' }}>
        {SidebarContent}
      </aside>

      {/* Mobile Offcanvas Sidebar */}
      {mobileSidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none" 
          style={{ backgroundColor: 'rgba(11, 24, 18, 0.65)', zIndex: 1040 }}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div 
            className="sidebar-minepro h-100 position-relative shadow-lg"
            style={{ width: '280px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Main App Container */}
      <div className="d-flex flex-column flex-grow-1 min-vw-0">
        {/* Topbar */}
        <header className="topbar-minepro sticky-top d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              className="btn btn-light border d-lg-none py-1 px-2"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Sidebar Menu"
            >
              <i className="bi bi-list fs-5" />
            </button>

            {/* Greeting */}
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-dark">Welcome Back, {userName}</span>
                <span className="badge-minepro-green d-none d-sm-inline-flex">
                  <i className="bi bi-shield-check me-1" /> Verified Node
                </span>
              </div>
              <small className="text-muted d-none d-md-block" style={{ fontSize: '0.78rem' }}>
                Let&apos;s grow your mining journey with authoritative 24-hour cycles
              </small>
            </div>
          </div>

          {/* User Right Tools */}
          <div className="d-flex align-items-center gap-3">
            {/* Notification Bell */}
            <div className="position-relative cursor-pointer p-2 rounded-circle hover-bg-light">
              <i className="bi bi-bell-fill text-secondary fs-5" />
              <span className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.62rem' }}>
                3
              </span>
            </div>

            {/* User Profile Pill */}
            <div className="d-flex align-items-center gap-2 ps-2 border-start">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #16a34a, #0c2419)' }}
              >
                AS
              </div>
              <div className="d-none d-sm-block text-start">
                <div className="fw-bold text-dark small leading-none">{userName}</div>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Member Tier</small>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow-1 p-3 p-md-4">
          <div className="container-fluid p-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
