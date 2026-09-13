import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  Type, 
  SunMedium, 
  Moon, 
  Clock, 
  Calendar,
  Home,
  Languages,
  Check,
  ShieldCheck,
  ChevronDown,
  User,
  LogIn
} from 'lucide-react';
import { TextSize, ContrastTheme, Language } from '../types';
import { soundEffects } from '../utils/audio';
import { getTranslation, LANGUAGE_OPTIONS } from '../utils/i18n';
import { MemoryomLogo } from './MemoryomLogo';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  contrastTheme: ContrastTheme;
  setContrastTheme: (theme: ContrastTheme) => void;
  isAudioMuted: boolean;
  setIsAudioMuted: (muted: boolean) => void;
  onOpenEmergency: () => void;
  onOpenAuth: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  textSize,
  setTextSize,
  contrastTheme,
  setContrastTheme,
  isAudioMuted,
  setIsAudioMuted,
  onOpenEmergency,
  onOpenAuth,
  language,
  setLanguage,
}) => {
  const { currentUser, userProfile } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [periodKey, setPeriodKey] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);

  const t = getTranslation(language);
  const isHighContrast = contrastTheme === 'high-contrast';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );

      // Localized date formatting
      const localeMap: Record<Language, string> = {
        en: 'en-US',
        as: 'as-IN',
        bn: 'bn-IN',
        hi: 'hi-IN',
      };
      try {
        setCurrentDate(
          now.toLocaleDateString(localeMap[language] || 'en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
        );
      } catch {
        setCurrentDate(now.toDateString());
      }

      const hours = now.getHours();
      if (hours < 12) setPeriodKey('morning');
      else if (hours < 17) setPeriodKey('afternoon');
      else if (hours < 21) setPeriodKey('evening');
      else setPeriodKey('night');
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [language]);

  const toggleTextSize = () => {
    soundEffects.playSoftTap();
    setTextSize(textSize === 'large' ? 'extra-large' : 'large');
  };

  const toggleContrast = () => {
    soundEffects.playSoftTap();
    setContrastTheme(contrastTheme === 'daylight' ? 'high-contrast' : 'daylight');
  };

  const toggleAudio = () => {
    soundEffects.playSoftTap();
    setIsAudioMuted(!isAudioMuted);
  };

  const handleSelectLanguage = (newLang: Language) => {
    soundEffects.playSoftTap();
    setLanguage(newLang);
    setIsLangMenuOpen(false);
  };

  const nativeAppNameMap: Record<Language, string> = {
    en: 'Memoryom',
    as: 'মেমৰিয়াম (Memoryom)',
    bn: 'মেমরিয়ম (Memoryom)',
    hi: 'मेमरियम (Memoryom)',
  };

  return (
    <header
      id="main-app-header"
      className={`relative z-40 border-b transition-colors duration-200 ${
        isHighContrast
          ? 'bg-slate-950 border-amber-400 text-white'
          : 'bg-white/95 backdrop-blur-md border-emerald-200/80 text-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]'
      }`}
    >
      {/* Top Banner: Dementia Time-Space Orientation Anchor */}
      <div
        id="dementia-orientation-bar"
        className={`px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-sm sm:text-base font-semibold border-b ${
          isHighContrast
            ? 'bg-slate-900 border-amber-400/40 text-amber-300'
            : 'bg-[#E8F8EE] border-[#1F7D47]/20 text-[#1A5B3B]'
        }`}
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-[#1F7D47]" aria-hidden="true" />
          <span className="font-extrabold tracking-wide">
            {currentDate || 'Saturday, September 13, 2026'}
          </span>
          <span className="hidden md:inline-block opacity-40">•</span>
          <span className="hidden md:inline-flex items-center gap-1.5 font-bold text-[#1F7D47]">
            <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
            {currentTime} ({t[periodKey]})
          </span>
        </div>

        {/* Safety Anchor Badge */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
              isHighContrast
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-400'
                : 'bg-white text-[#1A5B3B] border border-emerald-300/80 shadow-xs'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#1F7D47]" aria-hidden="true" />
            {t.safeAtHome}
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Identity: Memoryom */}
        <div className="flex items-center gap-3.5">
          <MemoryomLogo size={52} isHighContrast={isHighContrast} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1
                id="app-title"
                className={`font-black tracking-tight ${
                  isHighContrast ? 'text-amber-400' : 'text-[#1A5B3B]'
                } ${textSize === 'extra-large' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}
                style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
              >
                Memoryom
              </h1>
              <span
                className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider border ${
                  isHighContrast
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-emerald-100 text-[#1A5B3B] border-emerald-300'
                }`}
              >
                {t.badgeSih}
              </span>
            </div>
            <p
              className={`text-xs sm:text-sm font-black tracking-widest uppercase ${
                isHighContrast ? 'text-slate-300' : 'text-[#2D6A4F]/80'
              }`}
            >
              MEMORY COMPANION
            </p>
          </div>
        </div>

        {/* Accessibility Controls & Language Selector & Emergency SOS */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Multi-Language Selector Dropdown / Chips */}
          <div className="relative shrink-0">
            <button
              id="language-selector-button"
              type="button"
              onClick={() => {
                soundEffects.playSoftTap();
                setIsLangMenuOpen(!isLangMenuOpen);
              }}
              className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-2 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 ${
                isHighContrast
                  ? 'bg-slate-900 border-amber-400 text-amber-300 hover:bg-slate-800'
                  : 'bg-white border-emerald-300/80 text-[#1F7D47] hover:bg-emerald-50 shadow-xs'
              }`}
              title="Change Language / ভাষা সলনি কৰক / भाषा बदलें"
              aria-label="Select Language"
              aria-expanded={isLangMenuOpen}
            >
              <Languages className={`w-5 h-5 shrink-0 ${isHighContrast ? 'text-amber-300' : 'text-[#1F7D47]'}`} aria-hidden="true" />
              <span className="text-sm font-extrabold whitespace-nowrap">
                {LANGUAGE_OPTIONS.find((l) => l.code === language)?.nativeLabel || 'English'}
              </span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                  isLangMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {/* Language Menu Overlay with Backdrop */}
            {isLangMenuOpen && (
              <>
                {/* Transparent Backdrop to close on outside click and prevent overlap trap */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangMenuOpen(false)}
                  aria-hidden="true"
                />

                <div
                  className={`absolute left-0 mt-2 w-56 rounded-2xl border-2 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    isHighContrast
                      ? 'bg-slate-900 border-amber-400 text-white'
                      : 'bg-white border-emerald-300 text-slate-900 shadow-xl'
                  }`}
                >
                  <div className="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-emerald-100 dark:border-slate-800 mb-1">
                    {t.languageSelect}
                  </div>
                  {LANGUAGE_OPTIONS.map((opt) => {
                    const isSelected = language === opt.code;
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => {
                          handleSelectLanguage(opt.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition-all my-0.5 cursor-pointer ${
                          isSelected
                            ? isHighContrast
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : 'bg-[#1F7D47] text-white shadow-xs'
                            : isHighContrast
                            ? 'hover:bg-slate-800 text-slate-200'
                            : 'hover:bg-emerald-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{opt.flag}</span>
                          <div>
                            <span className="block text-base leading-tight">{opt.nativeLabel}</span>
                            <span className="text-xs opacity-75 font-normal">{opt.label}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-5 h-5 shrink-0" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Text Size Toggle */}
          <button
            id="toggle-text-size-button"
            type="button"
            onClick={toggleTextSize}
            className={`px-3 py-2.5 rounded-xl font-bold flex items-center gap-1.5 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-900 border-amber-400 text-amber-300 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
            }`}
            title="Increase or decrease text size"
            aria-label="Toggle text size"
          >
            <Type className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="text-sm font-bold">
              {textSize === 'large' ? t.textSizeLarge : t.textSizeExtraLarge}
            </span>
          </button>

          {/* High Contrast Toggle */}
          <button
            id="toggle-contrast-button"
            type="button"
            onClick={toggleContrast}
            className={`px-3 py-2.5 rounded-xl font-bold flex items-center gap-1.5 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-amber-400 border-white text-slate-950 hover:bg-amber-300'
                : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
            }`}
            title="Toggle contrast mode"
            aria-label="Toggle high contrast mode"
          >
            {isHighContrast ? (
              <SunMedium className="w-5 h-5 shrink-0 text-slate-950" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5 shrink-0 text-slate-700" aria-hidden="true" />
            )}
            <span className="text-sm font-bold">
              {isHighContrast ? t.daylightMode : t.highContrast}
            </span>
          </button>

          {/* Weekly Sunshine & Progress Journal Link */}
          <a
            id="header-sunshine-journal-btn"
            href="/progress-tracker.html"
            className={`px-3 py-2.5 rounded-xl font-bold flex items-center gap-1.5 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-emerald-950 border-emerald-400 text-emerald-300 hover:bg-emerald-900'
                : 'bg-emerald-100/80 border-emerald-300 text-emerald-900 hover:bg-emerald-200'
            }`}
            title="Open Weekly Sunshine & Progress Tracker"
            aria-label="Open Weekly Sunshine & Progress Tracker"
          >
            <span className="text-base">🌻</span>
            <span className="text-sm font-black hidden sm:inline">Journal</span>
          </a>

          {/* Sound Toggle */}
          <button
            id="toggle-sound-button"
            type="button"
            onClick={toggleAudio}
            className={`p-2.5 rounded-xl font-bold border-2 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title={isAudioMuted ? 'Unmute sounds' : 'Mute sounds'}
            aria-label={isAudioMuted ? 'Unmute audio effects' : 'Mute audio effects'}
          >
            {isAudioMuted ? (
              <>
                <VolumeX className="w-5 h-5 text-red-500" aria-hidden="true" />
                <span className="text-xs font-bold">{t.soundMuted}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                <span className="text-xs font-bold">{t.soundOn}</span>
              </>
            )}
          </button>

          {/* Patient Account Sign In / Profile Button */}
          <button
            id="patient-auth-button"
            type="button"
            onClick={() => {
              soundEffects.playSoftTap();
              onOpenAuth();
            }}
            className={`px-3 py-2.5 rounded-xl font-black flex items-center gap-1.5 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              currentUser
                ? isHighContrast
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-400 text-[#1A5B3B] shadow-xs'
                : isHighContrast
                ? 'bg-slate-900 border-amber-400 text-amber-300'
                : 'bg-white border-emerald-300 text-slate-800 shadow-xs'
            }`}
            title={currentUser ? `Signed in as ${userProfile?.displayName || 'Patient'}` : 'Patient Sign In / Register'}
            aria-label={currentUser ? `Signed in as ${userProfile?.displayName || 'Patient'}` : 'Patient Sign In'}
          >
            {currentUser ? (
              <>
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                  {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'P'}
                </div>
                <span className="text-xs sm:text-sm font-black max-w-[90px] sm:max-w-[120px] truncate">
                  {userProfile?.displayName || 'Patient'}
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-emerald-700" />
                <span className="text-xs sm:text-sm font-black whitespace-nowrap">Sign In</span>
              </>
            )}
          </button>

          {/* Red Emergency / Call Family SOS Button */}
          <button
            id="emergency-sos-button"
            type="button"
            onClick={() => {
              soundEffects.playGentleChime();
              onOpenEmergency();
            }}
            className="px-4 sm:px-5 py-2.5 rounded-xl font-black flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white border-2 border-red-300 shadow-md transition-all hover:scale-105 active:scale-95 text-base sm:text-lg animate-pulse cursor-pointer"
            aria-label={t.emergencySos}
          >
            <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">{t.emergencySos}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
