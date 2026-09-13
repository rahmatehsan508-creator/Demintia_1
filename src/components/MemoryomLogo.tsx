import React from 'react';

interface MemoryomLogoProps {
  size?: number;
  className?: string;
  isHighContrast?: boolean;
}

export const MemoryomLogo: React.FC<MemoryomLogoProps> = ({
  size = 48,
  className = '',
  isHighContrast = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Memoryom Logo"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Leaf Green Ribbon Gradient */}
          <linearGradient id="memoryom-green-grad" x1="15" y1="20" x2="65" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#48BB78" />
            <stop offset="45%" stopColor="#2E8B57" />
            <stop offset="100%" stopColor="#1A5B3B" />
          </linearGradient>

          {/* Soft Coral Ribbon Gradient */}
          <linearGradient id="memoryom-coral-grad" x1="85" y1="20" x2="35" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFA07A" />
            <stop offset="50%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#E64A19" />
          </linearGradient>

          {/* Soft Inner Shadow / Ambient Glow */}
          <filter id="soft-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Soft Background Plate */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill={isHighContrast ? '#0f172a' : '#FFFFFF'}
          stroke={isHighContrast ? '#fbbf24' : '#D1FAE5'}
          strokeWidth="2.5"
          filter="url(#soft-glow)"
        />

        {/* Intertwined Heart - Coral Right Loop (Back segment) */}
        <path
          d="M 50 78 C 50 78 78 62 82 42 C 86 24 71 14 58 17 C 52 18 47 24 45 29"
          stroke="url(#memoryom-coral-grad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Intertwined Heart - Leaf Green Left Loop (Intertwined Front/Through) */}
        <path
          d="M 50 78 C 50 78 22 62 18 42 C 14 24 29 14 42 17 C 48 18 53 24 55 29 C 58 35 62 48 50 63"
          stroke="url(#memoryom-green-grad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Coral Front Interlock Overlap Knot */}
        <path
          d="M 45 29 C 48 35 52 46 41 57"
          stroke="url(#memoryom-coral-grad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Gentle Vitality Dot / Sparkle at the heart juncture */}
        <circle cx="50" cy="40" r="3.5" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  );
};
