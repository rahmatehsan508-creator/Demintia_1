import React from 'react';
import { GameId, ContrastTheme } from '../../types';
import { Sparkles, Shapes, Layers, Star, CircleDot, FlaskConical, Leaf, Smile } from 'lucide-react';

interface GameLogoProps {
  gameId: GameId;
  size?: 'sm' | 'md' | 'lg';
  contrastTheme: ContrastTheme;
  showText?: boolean;
}

export const GameLogo: React.FC<GameLogoProps> = ({
  gameId,
  size = 'md',
  contrastTheme,
  showText = false,
}) => {
  const isHighContrast = contrastTheme === 'high-contrast';

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
  }[size];

  // Specific visual logo configurations
  const configs = {
    'memory-cards': {
      title: 'MemoPair',
      code: 'MP-01',
      badge: 'MEMORY',
      bgLight: 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white',
      borderLight: 'border-amber-600',
      glow: 'shadow-amber-200',
      icon: Sparkles,
      subIcon: Layers,
      decorSymbol: '✦',
    },
    'ball-sort': {
      title: 'BallSort',
      code: 'BS-02',
      badge: 'LOGIC',
      bgLight: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white',
      borderLight: 'border-emerald-700',
      glow: 'shadow-emerald-200',
      icon: FlaskConical,
      subIcon: CircleDot,
      decorSymbol: '●',
    },
    'gentle-snake': {
      title: 'GardenPath',
      code: 'GP-03',
      badge: 'MOTOR',
      bgLight: 'bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white',
      borderLight: 'border-sky-700',
      glow: 'shadow-sky-200',
      icon: Leaf,
      subIcon: Smile,
      decorSymbol: '✿',
    },
    'color-shape': {
      title: 'ShapeCraft',
      code: 'SC-04',
      badge: 'SHAPES',
      bgLight: 'bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-600 text-white',
      borderLight: 'border-rose-700',
      glow: 'shadow-rose-200',
      icon: Shapes,
      subIcon: Star,
      decorSymbol: '★',
    },
  }[gameId];

  const MainIcon = configs.icon;
  const SubIcon = configs.subIcon;

  return (
    <div className="inline-flex items-center gap-3">
      {/* Visual Emblem Badge */}
      <div className="relative group/logo">
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center relative overflow-hidden border-3 shadow-lg transition-transform group-hover/logo:scale-105 select-none ${
            isHighContrast
              ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/30'
              : `${configs.bgLight} ${configs.borderLight} ring-4 ring-black/5`
          }`}
        >
          {/* Subtle concentric decorative ring pattern */}
          <div className="absolute inset-0.5 rounded-xl border border-white/30 pointer-events-none" />
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/20 blur-xs pointer-events-none" />

          {/* Primary Centered Icon */}
          <MainIcon className={`${iconSizes} drop-shadow-md`} aria-hidden="true" />

          {/* Secondary mini corner emblem */}
          <div
            className={`absolute bottom-1 right-1 p-0.5 rounded-full border ${
              isHighContrast
                ? 'bg-slate-950 text-amber-400 border-amber-300'
                : 'bg-black/30 text-white border-white/40'
            }`}
          >
            <SubIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
          </div>
        </div>

        {/* Small badge chip on top */}
        <div
          className={`absolute -top-2 -left-2 px-1.5 py-0.2 rounded-md font-mono text-[9px] font-black uppercase tracking-wider border shadow-xs ${
            isHighContrast
              ? 'bg-slate-950 text-amber-300 border-amber-400'
              : 'bg-white text-slate-900 border-slate-300'
          }`}
        >
          {configs.badge}
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-tight text-lg sm:text-xl ${
              isHighContrast ? 'text-white' : 'text-slate-900'
            }`}
          >
            {configs.title}
          </span>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isHighContrast ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            Monorom Cognitive Series • {configs.code}
          </span>
        </div>
      )}
    </div>
  );
};
