import React from 'react';
import { Logo } from '../components/brand/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onBackToHome?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = 'Access Your Mining Node',
  subtitle = 'Secure authentication with cryptographic session validation',
  onBackToHome,
}) => {
  return (
    <div 
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-3 p-sm-4 position-relative"
      style={{
        background: 'linear-gradient(145deg, #071911 0%, #0c2b1e 50%, #06150e 100%)',
      }}
    >
      {/* Background Emerald Ambient Glow */}
      <div 
        className="position-absolute rounded-circle pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, rgba(249, 115, 22, 0.1) 50%, rgba(0,0,0,0) 70%)',
          filter: 'blur(60px)',
          top: '20%',
          zIndex: 0,
        }}
      />

      {/* Top Brand Link */}
      <div className="mb-4 text-center z-1">
        <button 
          onClick={onBackToHome}
          className="btn btn-link p-0 text-decoration-none"
        >
          <Logo size="lg" variant="light" showTagline />
        </button>
      </div>

      {/* Centered Premium Auth Card */}
      <div 
        className="card-minepro shadow-2-strong p-4 p-sm-5 bg-white w-100 z-1" 
        style={{ 
          maxWidth: 480, 
          borderRadius: '22px',
          border: '2px solid #bce1ca',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.5), 0 0 25px rgba(34, 197, 94, 0.15)'
        }}
      >
        <div className="text-center mb-4">
          <span 
            className="badge px-3 py-1 rounded-pill mb-2 fw-bold text-uppercase"
            style={{ backgroundColor: '#ffedd5', color: '#ea580c', fontSize: '0.72rem' }}
          >
            AUTHORITATIVE NODE ACCESS
          </span>
          <h3 className="fw-extrabold text-dark mb-1">{title}</h3>
          <p className="text-muted small mb-0 fw-semibold">{subtitle}</p>
        </div>

        {children}
      </div>

      {/* Disclaimer / Security Footer */}
      <div className="mt-4 text-center text-white-50 small z-1" style={{ maxWidth: 440 }}>
        <div className="d-flex align-items-center justify-content-center gap-2 mb-1 text-light">
          <i className="bi bi-shield-check text-success fs-6" />
          <span className="fw-semibold">256-bit TLS Session Encryption &bull; Hardware Hash Auth</span>
        </div>
        <div style={{ fontSize: '0.75rem' }} className="text-light text-opacity-75">
          &copy; {new Date().getFullYear()} MinePro Platform. Authoritative Mining &amp; Rewards Engine.
        </div>
      </div>
    </div>
  );
};
