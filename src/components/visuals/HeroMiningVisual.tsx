import React from 'react';

export const HeroMiningVisual: React.FC = () => {
  return (
    <div className="position-relative w-100 d-flex justify-content-center align-items-center">
      {/* Ambient Emerald & Gold Radial Glows behind visual */}
      <div 
        className="position-absolute rounded-circle pointer-events-none"
        style={{
          width: '85%',
          height: '85%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.35) 0%, rgba(249, 115, 22, 0.15) 50%, rgba(0, 0, 0, 0) 75%)',
          filter: 'blur(45px)',
          zIndex: 0,
          transform: 'scale(1.1)',
        }}
      />

      {/* Main Visual Container */}
      <div 
        className="position-relative z-1 w-100 rounded-4 overflow-hidden shadow-2-strong border border-2"
        style={{
          maxWidth: '720px',
          background: 'linear-gradient(145deg, #071a11 0%, #0d2e1f 55%, #08170f 100%)',
          borderColor: 'rgba(74, 222, 128, 0.35)',
          boxShadow: '0 25px 60px -15px rgba(5, 25, 15, 0.5), 0 0 35px rgba(34, 197, 94, 0.2)',
        }}
      >
        {/* Top Telemetry Header Bar */}
        <div 
          className="d-flex flex-wrap align-items-center justify-content-between px-3 px-md-4 py-3 border-bottom"
          style={{ 
            backgroundColor: 'rgba(5, 20, 13, 0.75)', 
            borderColor: 'rgba(74, 222, 128, 0.25)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span className="position-relative d-flex" style={{ width: 10, height: 10 }}>
              <span className="position-absolute w-100 h-100 rounded-circle bg-success opacity-75 animate-ping" />
              <span className="position-relative rounded-circle bg-success w-100 h-100" />
            </span>
            <span className="fw-bold text-success small font-monospace tracking-wide">
              NODE CLUSTER // ACTIVE RUNTIME
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span 
              className="badge px-2 py-1 text-white fw-bold rounded-pill"
              style={{ backgroundColor: '#ea580c', fontSize: '0.72rem' }}
            >
              <i className="bi bi-speedometer2 me-1" /> 142.8 TH/s
            </span>
            <span 
              className="badge bg-dark bg-opacity-75 text-success border border-success border-opacity-50 px-2 py-1 rounded-pill small"
              style={{ fontSize: '0.72rem' }}
            >
              UPTIME 99.98%
            </span>
          </div>
        </div>

        {/* Central 3D Hardware Rig & Crypto Emblem Stage */}
        <div className="p-3 p-md-4 position-relative">
          {/* Detailed SVG Illustration of Enterprise Mining Tower Rig with Glowing Circuit Waves */}
          <div className="position-relative w-100 text-center" style={{ minHeight: '320px' }}>
            <svg 
              viewBox="0 0 600 360" 
              className="w-100 h-100" 
              style={{ maxHeight: '380px', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))' }}
            >
              <defs>
                {/* Gold Coin Gradient */}
                <linearGradient id="goldCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="35%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>

                {/* Emerald Circuit Glow */}
                <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#15803d" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#22c55e" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#15803d" stopOpacity="0.2" />
                </linearGradient>

                {/* Server Rack Body Gradient */}
                <linearGradient id="rackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0a1811" />
                  <stop offset="50%" stopColor="#152b20" />
                  <stop offset="100%" stopColor="#08140e" />
                </linearGradient>

                {/* Server Blade Accent */}
                <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#163827" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#163827" />
                </linearGradient>

                {/* Floor Platform Gradient */}
                <radialGradient id="floorGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#15803d" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#0c2317" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#07150d" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Holographic Ground Grid & Isometric Pedestal */}
              <ellipse cx="300" cy="300" rx="270" ry="50" fill="url(#floorGrad)" />
              <ellipse cx="300" cy="300" rx="240" ry="42" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,6" opacity="0.6" />
              <ellipse cx="300" cy="300" rx="180" ry="32" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="4,8" opacity="0.8" />
              <ellipse cx="300" cy="300" rx="120" ry="22" fill="none" stroke="#22c55e" strokeWidth="2.5" opacity="0.9" />

              {/* Data Circuit Lines Running Across Floor */}
              <path d="M 60 300 L 160 285 L 240 285 L 300 300" fill="none" stroke="url(#circuitGrad)" strokeWidth="2" />
              <path d="M 540 300 L 440 285 L 360 285 L 300 300" fill="none" stroke="url(#circuitGrad)" strokeWidth="2" />

              {/* Left Enterprise Server Blade Tower */}
              <g transform="translate(110, 80)">
                {/* Tower Outer Chassis */}
                <rect x="0" y="0" width="90" height="195" rx="8" fill="url(#rackGrad)" stroke="#22c55e" strokeWidth="1.5" />
                {/* Top Cooling Fan Grill */}
                <circle cx="45" cy="22" r="14" fill="#06120b" stroke="#16a34a" strokeWidth="1" />
                <circle cx="45" cy="22" r="6" fill="#22c55e" opacity="0.8" />
                
                {/* Modular Blade Units with Green Pulse LEDs */}
                {[45, 75, 105, 135, 165].map((yOffset, idx) => (
                  <g key={`left-blade-${idx}`}>
                    <rect x="8" y={yOffset} width="74" height="22" rx="3" fill="#0b1e15" stroke="#165335" strokeWidth="1" />
                    {/* Status LEDs */}
                    <circle cx="16" cy={yOffset + 11} r="2.5" fill="#22c55e" />
                    <circle cx="24" cy={yOffset + 11} r="2.5" fill="#f97316" />
                    {/* Heat Sink Ventilation Slots */}
                    <line x1="34" y1={yOffset + 7} x2="72" y2={yOffset + 7} stroke="#22c55e" strokeWidth="1.5" opacity="0.4" />
                    <line x1="34" y1={yOffset + 11} x2="72" y2={yOffset + 11} stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
                    <line x1="34" y1={yOffset + 15} x2="72" y2={yOffset + 15} stroke="#22c55e" strokeWidth="1.5" opacity="0.4" />
                  </g>
                ))}
              </g>

              {/* Right Enterprise Server Blade Tower */}
              <g transform="translate(400, 80)">
                {/* Tower Outer Chassis */}
                <rect x="0" y="0" width="90" height="195" rx="8" fill="url(#rackGrad)" stroke="#22c55e" strokeWidth="1.5" />
                {/* Top Cooling Fan Grill */}
                <circle cx="45" cy="22" r="14" fill="#06120b" stroke="#16a34a" strokeWidth="1" />
                <circle cx="45" cy="22" r="6" fill="#f97316" opacity="0.9" />

                {/* Modular Blade Units */}
                {[45, 75, 105, 135, 165].map((yOffset, idx) => (
                  <g key={`right-blade-${idx}`}>
                    <rect x="8" y={yOffset} width="74" height="22" rx="3" fill="#0b1e15" stroke="#165335" strokeWidth="1" />
                    {/* Status LEDs */}
                    <circle cx="16" cy={yOffset + 11} r="2.5" fill="#22c55e" />
                    <circle cx="24" cy={yOffset + 11} r="2.5" fill="#22c55e" />
                    {/* Heat Sink Ventilation Slots */}
                    <line x1="34" y1={yOffset + 7} x2="72" y2={yOffset + 7} stroke="#f97316" strokeWidth="1.5" opacity="0.5" />
                    <line x1="34" y1={yOffset + 11} x2="72" y2={yOffset + 11} stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
                    <line x1="34" y1={yOffset + 15} x2="72" y2={yOffset + 15} stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />
                  </g>
                ))}
              </g>

              {/* Center Holographic Beams from Towers to Center Coin */}
              <line x1="200" y1="170" x2="260" y2="180" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="4,4" opacity="0.8" />
              <line x1="400" y1="170" x2="340" y2="180" stroke="#f97316" strokeWidth="2.5" strokeDasharray="4,4" opacity="0.8" />

              {/* Central Glowing MinePro Core Bitcoin / Crypto Coin */}
              <g transform="translate(300, 175)">
                {/* Ambient Halo Behind Coin */}
                <circle cx="0" cy="0" r="75" fill="radial-gradient(circle, rgba(245,158,11,0.4) 0%, rgba(0,0,0,0) 70%)" />
                <circle cx="0" cy="0" r="62" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="10,5" opacity="0.85" />
                <circle cx="0" cy="0" r="54" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.7" />
                
                {/* 3D Coin Body */}
                <ellipse cx="0" cy="5" rx="46" ry="46" fill="#78350f" />
                <circle cx="0" cy="0" r="46" fill="url(#goldCoinGrad)" stroke="#fef08a" strokeWidth="3" />
                <circle cx="0" cy="0" r="38" fill="none" stroke="#b45309" strokeWidth="1.5" strokeDasharray="3,3" />

                {/* Coin Inner MinePro Pickaxe & Crypto Insignia */}
                <path 
                  d="M -12 -16 L 12 -16 L 12 -10 L 4 -10 L 4 16 L -4 16 L -4 -10 L -12 -10 Z" 
                  fill="#78350f" 
                />
                <path 
                  d="M -14 -18 L 14 -18 L 14 -12 L 5 -12 L 5 18 L -5 18 L -5 -12 L -14 -12 Z" 
                  fill="#ffffff" 
                  opacity="0.95" 
                />
                <path 
                  d="M -2 -14 L 2 -14 L 2 14 L -2 14 Z" 
                  fill="#f59e0b" 
                />
              </g>

              {/* Floating Crypto Nodes (TRC20 & BEP20 Orbs) */}
              <g transform="translate(200, 75)">
                <circle cx="0" cy="0" r="22" fill="#082317" stroke="#22c55e" strokeWidth="2" />
                <text x="0" y="5" fill="#4ade80" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">TRC20</text>
              </g>

              <g transform="translate(400, 65)">
                <circle cx="0" cy="0" r="22" fill="#1b1706" stroke="#f97316" strokeWidth="2" />
                <text x="0" y="5" fill="#fb923c" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">BEP20</text>
              </g>

              {/* Energy Sparks Floating */}
              <circle cx="270" cy="110" r="3" fill="#fde047" opacity="0.9" />
              <circle cx="335" cy="115" r="2.5" fill="#4ade80" opacity="0.85" />
              <circle cx="230" cy="230" r="2" fill="#fb923c" opacity="0.8" />
              <circle cx="370" cy="225" r="3" fill="#22c55e" opacity="0.9" />
            </svg>

            {/* Overlaid Floating Glassmorphism Data Badges */}
            <div 
              className="position-absolute top-0 end-0 m-2 m-md-3 p-2 px-3 rounded-3 text-start shadow"
              style={{
                backgroundColor: 'rgba(7, 24, 16, 0.85)',
                border: '1.5px solid rgba(74, 222, 128, 0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-clock-history text-orange" />
                <span className="small fw-bold text-white font-monospace" style={{ fontSize: '0.78rem' }}>
                  24H CYCLE SETTLEMENT
                </span>
              </div>
              <div className="fw-extrabold text-success fs-5 font-monospace mb-0">
                +3.00% <span className="small text-white-50 fw-normal" style={{ fontSize: '0.72rem' }}>DAILY YIELD</span>
              </div>
            </div>

            <div 
              className="position-absolute bottom-0 start-0 m-2 m-md-3 p-2 px-3 rounded-3 text-start shadow"
              style={{
                backgroundColor: 'rgba(7, 24, 16, 0.85)',
                border: '1.5px solid rgba(249, 115, 22, 0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="small text-white-50 mb-1" style={{ fontSize: '0.72rem' }}>
                <i className="bi bi-shield-check text-success me-1" />
                LEDGER VERIFICATION
              </div>
              <div className="fw-bold text-white small font-monospace">
                POSTGRESQL AUTHORITATIVE
              </div>
            </div>
          </div>
        </div>

        {/* Lower Real-Time Telemetry Bar (3 Key Columns) */}
        <div 
          className="row g-0 border-top text-center"
          style={{ 
            backgroundColor: 'rgba(5, 18, 12, 0.9)', 
            borderColor: 'rgba(74, 222, 128, 0.25)' 
          }}
        >
          <div className="col-4 py-3 border-end" style={{ borderColor: 'rgba(74, 222, 128, 0.2)' }}>
            <span className="d-block text-white-50 small fw-semibold" style={{ fontSize: '0.75rem' }}>
              TOTAL NETWORK POWER
            </span>
            <span className="fw-extrabold text-white fs-5 font-monospace">942.5 TH/s</span>
          </div>

          <div className="col-4 py-3 border-end" style={{ borderColor: 'rgba(74, 222, 128, 0.2)' }}>
            <span className="d-block text-orange small fw-bold" style={{ fontSize: '0.75rem' }}>
              CURRENT CYCLE PROGRESS
            </span>
            <span className="fw-extrabold text-orange fs-5 font-monospace">78.4%</span>
          </div>

          <div className="col-4 py-3">
            <span className="d-block text-success small fw-bold" style={{ fontSize: '0.75rem' }}>
              NEXT REWARD SETTLEMENT
            </span>
            <span className="fw-extrabold text-success fs-5 font-monospace">05h : 18m : 42s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
