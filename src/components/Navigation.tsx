import React from 'react';
import { 
  LayoutDashboard,
  Brain, 
  CalendarCheck2, 
  Users, 
  MessageSquareHeart
} from 'lucide-react';
import { NavigationTab, TextSize, ContrastTheme, Language } from '../types';
import { soundEffects } from '../utils/audio';
import { getTranslation } from '../utils/i18n';

interface NavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  language: Language;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  textSize,
  contrastTheme,
  language,
}) => {
  const isHighContrast = contrastTheme === 'high-contrast';
  const t = getTranslation(language);

  const navItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: t.navDashboard,
      sublabel: t.navDashboardSub,
      icon: LayoutDashboard,
      badge: 'Home',
      accentColor: '#1A5B3B',
      activeBg: 'bg-emerald-50 border-[#1A5B3B] text-[#1A5B3B]',
      iconActiveBg: 'bg-[#1A5B3B] text-white',
      iconInactiveBg: 'bg-emerald-100/70 text-[#1A5B3B]',
    },
    {
      id: 'games' as NavigationTab,
      label: t.cardBrainExercisesTitle,
      sublabel: t.navGamesSub,
      icon: Brain,
      badge: '4 Games',
      accentColor: '#1D6FB8',
      activeBg: 'bg-[#E2F3FD] border-[#1D6FB8] text-[#1D6FB8]',
      iconActiveBg: 'bg-[#0275D8] text-white',
      iconInactiveBg: 'bg-sky-100 text-[#1D6FB8]',
    },
    {
      id: 'routine' as NavigationTab,
      label: t.cardRoutineTitle,
      sublabel: t.navRoutineSub,
      icon: CalendarCheck2,
      badge: 'Schedule',
      accentColor: '#1F7D47',
      activeBg: 'bg-[#E8F8EE] border-[#1F7D47] text-[#1F7D47]',
      iconActiveBg: 'bg-[#1F7D47] text-white',
      iconInactiveBg: 'bg-emerald-100 text-[#1F7D47]',
    },
    {
      id: 'memory-book' as NavigationTab,
      label: t.cardFamilyTitle,
      sublabel: t.navMemorySub,
      icon: Users,
      badge: 'Family',
      accentColor: '#5B259E',
      activeBg: 'bg-[#F2ECFD] border-[#5B259E] text-[#5B259E]',
      iconActiveBg: 'bg-[#5B259E] text-white',
      iconInactiveBg: 'bg-purple-100 text-[#5B259E]',
    },
    {
      id: 'companion' as NavigationTab,
      label: t.navCompanion,
      sublabel: t.navCompanionSub,
      icon: MessageSquareHeart,
      badge: 'AI Friend',
      accentColor: '#B45309',
      activeBg: 'bg-amber-50 border-amber-600 text-amber-900',
      iconActiveBg: 'bg-amber-600 text-white',
      iconInactiveBg: 'bg-amber-100 text-amber-800',
    },
  ];

  const handleTabClick = (tabId: NavigationTab) => {
    soundEffects.playSoftTap();
    onSelectTab(tabId);
  };

  return (
    <nav
      id="main-navigation-tabs"
      aria-label="Main sections"
      className={`border-b transition-colors ${
        isHighContrast
          ? 'bg-slate-900 border-amber-400/50'
          : 'bg-white/70 backdrop-blur-sm border-emerald-200/60 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-button-${item.id}`}
                type="button"
                onClick={() => handleTabClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-2.5 p-3 rounded-[20px] border-[1.5px] transition-all text-left group min-h-[76px] cursor-pointer ${
                  isActive
                    ? isHighContrast
                      ? 'bg-amber-400 border-white text-slate-950 shadow-lg ring-4 ring-amber-300/40 scale-[1.02]'
                      : `${item.activeBg} shadow-sm ring-2 ring-emerald-400/20 scale-[1.02]`
                    : isHighContrast
                    ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-400/70 hover:bg-slate-800'
                    : 'bg-white/80 border-slate-200/80 text-slate-700 hover:bg-white hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                {/* Icon Container */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-xs ${
                    isActive
                      ? isHighContrast
                        ? 'bg-slate-950 text-amber-400'
                        : item.iconActiveBg
                      : isHighContrast
                      ? 'bg-slate-900 text-amber-300 border border-slate-700'
                      : item.iconInactiveBg
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`block font-black tracking-tight leading-tight truncate ${
                      textSize === 'extra-large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                    } ${
                      isActive
                        ? isHighContrast ? 'text-slate-950' : 'text-[#1E293B]'
                        : 'text-[#1E293B]'
                    }`}
                    style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`block text-xs truncate mt-0.5 font-medium ${
                      isActive
                        ? isHighContrast
                          ? 'text-slate-900 font-bold'
                          : 'text-[#475569]'
                        : isHighContrast
                        ? 'text-slate-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.sublabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
