import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark'; // light text on dark bg, or dark text on light bg
  showTagline?: boolean;
  badge?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTagline = false,
  badge,
  className = '',
}) => {
  const iconSizes = {
    sm: 26,
    md: 34,
    lg: 44,
    xl: 56,
  };

  const textSizes = {
    sm: 'fs-5',
    md: 'fs-4',
    lg: 'fs-3',
    xl: 'fs-2',
  };

  const isLightText = variant === 'light';
  const px = iconSizes[size];

  return (
    <div className={`d-inline-flex align-items-center gap-2 text-decoration-none ${className}`}>
      {/* Precision Geometric Mining Hexagon Emblem */}
      <div 
        className="position-relative d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: px, height: px }}
      >
        <svg
          width={px}
          height={px}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer faceted mining hexagon */}
          <path
            d="M24 4L42 14.5V35.5L24 46L6 35.5V14.5L24 4Z"
            fill="url(#mpGreenGrad)"
            stroke="#16a34a"
            strokeWidth="1.5"
          />
          {/* Inner crystal facet / block */}
          <path
            d="M24 12L34 18V30L24 36L14 30V18L24 12Z"
            fill="url(#mpOrangeGrad)"
          />
          {/* Mining Node Core pickaxe / dynamic slash */}
          <path
            d="M21 17L27 23M27 17L21 23M24 24V32"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="mpGreenGrad" x1="6" y1="4" x2="42" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22c55e" />
              <stop offset="1" stopColor="#0f4a2b" />
            </linearGradient>
            <linearGradient id="mpOrangeGrad" x1="14" y1="12" x2="34" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fb923c" />
              <stop offset="1" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="d-flex flex-column leading-none">
        <div className="d-flex align-items-center gap-1">
          <span className={`fw-bolder ${textSizes[size]} m-0 ${isLightText ? 'text-white' : 'text-forest'}`} style={{ letterSpacing: '-0.03em' }}>
            Mine<span className="text-orange">Pro</span>
          </span>
          {badge && (
            <span 
              className="badge ms-1 text-uppercase"
              style={{
                fontSize: '0.65rem',
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                color: '#f97316',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                padding: '0.2rem 0.45rem',
                borderRadius: '6px'
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {showTagline && (
          <small 
            style={{ 
              fontSize: '0.72rem', 
              color: isLightText ? '#a7f3d0' : '#526359',
              marginTop: '-2px',
              letterSpacing: '0.02em',
              fontWeight: 500
            }}
          >
            Smart Mining & Reward Platform
          </small>
        )}
      </div>
    </div>
  );
};
