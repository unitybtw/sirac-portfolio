import React from 'react';
import { useTranslation } from 'react-i18next';
import { Gamepad2, Cpu, Sparkles, Box, Terminal, Activity, Layers } from 'lucide-react';

export default function DeveloperEngineCard() {
  const { t } = useTranslation();

  return (
    <div className="hero-engine-card" role="region" aria-label="Game Developer Engine Inspector">
      {/* ── Window Header Bar ── */}
      <div className="engine-card-header">
        <div className="engine-window-dots">
          <span className="window-dot dot-close" />
          <span className="window-dot dot-min" />
          <span className="window-dot dot-max" />
        </div>
        <div className="engine-tab-title">
          <Terminal size={13} className="engine-tab-icon" />
          <span>EngineCore.cs</span>
        </div>
        <div className="engine-live-badge">
          <span className="live-status-dot" />
          <span>60 FPS</span>
        </div>
      </div>

      {/* ── Viewport Visualizer (Vector 3D Mesh / Game Space) ── */}
      <div className="engine-viewport-scene">
        <svg
          viewBox="0 0 340 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="engine-vector-svg"
          aria-hidden="true"
        >
          <defs>
            {/* Grid Radial Glow */}
            <radialGradient id="meshCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent-cta, #2563eb)" stopOpacity="0.22" />
              <stop offset="70%" stopColor="var(--accent-cta, #2563eb)" stopOpacity="0.04" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-cta, #2563eb)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
            </linearGradient>

            <pattern id="isoGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Background Ambient Glow & Grid */}
          <rect width="100%" height="100%" fill="url(#isoGrid)" />
          <circle cx="170" cy="110" r="95" fill="url(#meshCenterGlow)" />

          {/* Perspective Ground Grid (Isometric Plane) */}
          <g className="engine-isometric-plane" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1">
            <line x1="70" y1="170" x2="270" y2="170" />
            <line x1="90" y1="185" x2="250" y2="185" />
            <line x1="170" y1="90" x2="60" y2="195" />
            <line x1="170" y1="90" x2="280" y2="195" />
            <line x1="170" y1="90" x2="170" y2="200" strokeDasharray="3 3" />
          </g>

          {/* Floating Geometric Wireframe Polytope (Rotating Game Asset) */}
          <g className="engine-polytope-mesh">
            {/* Faces */}
            <polygon points="170,45 225,85 170,120 115,85" fill="url(#polyGrad)" opacity="0.2" />
            <polygon points="115,85 170,120 170,175 115,140" fill="var(--accent-cta, #2563eb)" opacity="0.28" />
            <polygon points="225,85 170,120 170,175 225,140" fill="currentColor" opacity="0.15" />

            {/* Wireframe Edges */}
            <path
              d="M 170 45 L 225 85 L 225 140 L 170 175 L 115 140 L 115 85 Z"
              stroke="var(--accent-cta, #2563eb)"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <line x1="170" y1="45" x2="170" y2="120" stroke="var(--accent-cta, #2563eb)" strokeWidth="1.5" />
            <line x1="115" y1="85" x2="170" y2="120" stroke="var(--accent-cta, #2563eb)" strokeWidth="1.5" />
            <line x1="225" y1="85" x2="170" y2="120" stroke="var(--accent-cta, #2563eb)" strokeWidth="1.5" />
            <line x1="170" y1="120" x2="170" y2="175" stroke="var(--accent-cta, #2563eb)" strokeWidth="1.8" />

            {/* Glowing Vertex Dots */}
            <circle cx="170" cy="45" r="3.5" fill="#10b981" />
            <circle cx="225" cy="85" r="3" fill="var(--accent-cta, #2563eb)" />
            <circle cx="115" cy="85" r="3" fill="var(--accent-cta, #2563eb)" />
            <circle cx="170" cy="120" r="4" fill="#ffffff" stroke="var(--accent-cta, #2563eb)" strokeWidth="1.5" />
            <circle cx="170" cy="175" r="3.5" fill="#10b981" />
          </g>

          {/* Coordinate Axes Indicators */}
          <g className="engine-axes" transform="translate(30, 40)">
            <line x1="0" y1="0" x2="20" y2="0" stroke="#ef4444" strokeWidth="1.5" />
            <text x="24" y="3" fill="#ef4444" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="700">X</text>
            <line x1="0" y1="0" x2="0" y2="-20" stroke="#10b981" strokeWidth="1.5" />
            <text x="-3" y="-23" fill="#10b981" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="700">Y</text>
            <line x1="0" y1="0" x2="-14" y2="14" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="-24" y="22" fill="#3b82f6" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="700">Z</text>
          </g>

          {/* Floating Live Telemetry Chips */}
          <g className="engine-chip-1" transform="translate(232, 35)">
            <rect width="84" height="20" rx="6" fill="var(--bg-card, #ffffff)" stroke="var(--border-subtle, #e4e4e7)" strokeWidth="1" />
            <circle cx="10" cy="10" r="2.5" fill="#10b981" />
            <text x="18" y="13" fill="currentColor" fontSize="7.5" fontFamily="ui-monospace, monospace" fontWeight="600">URP · VBO 60k</text>
          </g>

          <g className="engine-chip-2" transform="translate(24, 180)">
            <rect width="88" height="20" rx="6" fill="var(--bg-card, #ffffff)" stroke="var(--border-subtle, #e4e4e7)" strokeWidth="1" />
            <circle cx="10" cy="10" r="2.5" fill="var(--accent-cta, #2563eb)" />
            <text x="18" y="13" fill="currentColor" fontSize="7.5" fontFamily="ui-monospace, monospace" fontWeight="600">DRAW CALL: 14</text>
          </g>
        </svg>

        {/* Floating Stack Badges */}
        <div className="engine-floating-tags">
          <span className="engine-badge-tag">
            <Gamepad2 size={12} color="#10b981" /> Unity 6 · C#
          </span>
          <span className="engine-badge-tag">
            <Cpu size={12} color="#3b82f6" /> Electron · TS
          </span>
          <span className="engine-badge-tag">
            <Box size={12} color="#f59e0b" /> Blender · URP
          </span>
        </div>
      </div>

      {/* ── Bottom Identity & Telemetry Bar ── */}
      <div className="engine-card-footer">
        <div className="engine-footer-meta">
          <div className="engine-footer-name">Sıraç Göktuğ Şimşek</div>
          <div className="engine-footer-role">{t('hero_title')}</div>
        </div>
        <div className="engine-footer-status">
          <span className="live-status-dot" />
          <span>İstanbul, TR</span>
        </div>
      </div>
    </div>
  );
}
