import React from 'react';

interface OrganicLeafAccentsProps {
  isHighContrast?: boolean;
}

export const OrganicLeafAccents: React.FC<OrganicLeafAccentsProps> = ({ isHighContrast = false }) => {
  if (isHighContrast) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {/* Top Right Gentle Leaf Branch */}
      <svg
        className="absolute -top-12 -right-12 w-80 h-80 text-[#2D6A4F] opacity-[0.06] transition-transform duration-1000 ease-out"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <path d="M180,10 C140,20 110,60 100,100 C95,120 90,140 70,160 C90,150 110,145 130,135 C170,115 190,70 180,10 Z" />
        <path d="M140,40 C110,50 85,75 75,105 C95,95 115,80 130,65 Z" opacity="0.8" />
        <path d="M165,85 C145,100 120,115 105,140 C125,130 145,115 155,100 Z" opacity="0.8" />
        <circle cx="95" cy="105" r="4" opacity="0.5" />
      </svg>

      {/* Bottom Left Calming Organic Tea Leaf Accent */}
      <svg
        className="absolute -bottom-16 -left-16 w-96 h-96 text-[#1A5B3B] opacity-[0.05] transition-transform duration-1000 ease-out"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <path d="M20,180 C50,170 90,130 110,90 C120,70 130,45 150,20 C130,35 110,50 85,70 C45,105 15,140 20,180 Z" />
        <path d="M60,140 C85,120 110,90 125,60 C105,75 85,95 70,115 Z" opacity="0.7" />
        <path d="M35,160 C55,145 75,125 90,100 C75,115 55,135 45,150 Z" opacity="0.7" />
      </svg>

      {/* Mid Right Floating Calming Leaf */}
      <svg
        className="absolute top-1/2 -right-8 w-44 h-44 text-[#38A169] opacity-[0.04]"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M90,20 C60,35 40,65 30,90 C45,80 60,65 75,45 C85,35 90,25 90,20 Z" />
      </svg>
    </div>
  );
};
