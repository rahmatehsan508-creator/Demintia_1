import React, { useState } from 'react';
import { 
  ArrowRight, 
  Brain, 
  CalendarCheck, 
  Users, 
  PhoneCall, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Heart, 
  Clock, 
  CheckCircle2, 
  Smile,
  Pill,
  Sun
} from 'lucide-react';
import { NavigationTab, TextSize, ContrastTheme, Language } from '../types';
import { getTranslation } from '../utils/i18n';
import { soundEffects, speakText, stopSpeaking } from '../utils/audio';
import { useAuth } from '../context/AuthContext';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenEmergency: () => void;
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  isAudioMuted: boolean;
  language: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenEmergency,
  textSize,
  contrastTheme,
  isAudioMuted,
  language,
}) => {
  const { currentUser, userProfile } = useAuth();
  const t = getTranslation(language);
  const isHighContrast = contrastTheme === 'high-contrast';
  const isXL = textSize === 'extra-large';
  const [isPlayingInspiration, setIsPlayingInspiration] = useState<boolean>(false);

  // Sound handler
  const handleCardClick = (tab: NavigationTab) => {
    soundEffects.playSoftTap();
    onNavigate(tab);
  };

  const handleSosClick = () => {
    soundEffects.playGentleChime();
    onOpenEmergency();
  };

  const handleToggleInspirationAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingInspiration) {
      stopSpeaking();
      setIsPlayingInspiration(false);
    } else {
      soundEffects.playGentleChime();
      setIsPlayingInspiration(true);
      speakText(
        `${t.cardInspirationTitle}. ${t.cardInspirationQuote}`,
        language,
        () => setIsPlayingInspiration(false)
      );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Welcome & Orientation Banner */}
      <div 
        id="dashboard-orientation-banner"
        className={`rounded-[28px] p-5 sm:p-6 transition-all duration-300 ${
          isHighContrast
            ? 'bg-slate-900 border-2 border-amber-400 text-white shadow-lg'
            : 'bg-white/80 backdrop-blur-md border border-emerald-200/70 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] text-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100/90 text-[#1A5B3B] flex items-center justify-center shrink-0 shadow-inner">
              <Sun className="w-7 h-7 sm:w-8 sm:h-8 animate-spin-slow text-[#1F7D47]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-emerald-100 text-[#1A5B3B]">
                  <ShieldCheck className="w-4 h-4 text-[#1F7D47]" />
                  {t.safeAtHome}
                </span>
                {currentUser && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Cloud Synced: {userProfile?.displayName || 'Patient'}
                  </span>
                )}
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  {t.badgeSih}
                </span>
              </div>
              <h2 
                className={`font-black tracking-tight text-[#1E293B] mt-1 ${
                  isXL ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                }`}
                style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
              >
                {currentUser && userProfile?.displayName
                  ? (language === 'as' ? `নমস্কাৰ, শ্ৰদ্ধাৰ ${userProfile.displayName} ডাঙৰীয়া` : language === 'bn' ? `নমস্কার, শ্রদ্ধেয় ${userProfile.displayName}` : language === 'hi' ? `नमस्ते, आदरणीय ${userProfile.displayName} जी` : `Welcome, dear ${userProfile.displayName}`)
                  : t.appSubtitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="dashboard-voice-guide-btn"
              onClick={() => speakText(`${t.appName}. ${t.cardInspirationQuote}`, language)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#1A5B3B] font-bold text-sm border border-emerald-200 transition-colors shadow-sm"
              title="Listen to introduction"
            >
              <Volume2 className="w-4 h-4 text-[#1F7D47]" />
              <span>{t.listenInspiration}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Flagship Cards 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
        
        {/* CARD 1: Brain Exercises (Sky Blue / Cyan #E2F3FD) */}
        <div
          id="card-brain-exercises"
          onClick={() => handleCardClick('games')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick('games'); }}
          tabIndex={0}
          role="button"
          aria-label={t.cardBrainExercisesTitle}
          className={`group relative overflow-hidden rounded-[28px] p-6 sm:p-7 text-left cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#1D6FB8]/40 ${
            isHighContrast
              ? 'bg-slate-950 border-2 border-[#1D6FB8] text-white shadow-xl hover:border-sky-300'
              : 'bg-[#E2F3FD] border-[1.5px] border-[#1D6FB8]/35 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_32px_-6px_rgba(29,111,184,0.15)] hover:-translate-y-1'
          }`}
        >
          {/* Subtle decorative background water ripple */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-[#1D6FB8]/10 pointer-events-none transition-transform group-hover:scale-125 duration-500" />
          
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 text-[#1D6FB8] shadow-sm">
                  <Brain className="w-4 h-4 text-[#1D6FB8]" />
                  {t.cardBrainExercisesBadge}
                </span>
                <span className="text-xs font-semibold text-[#1D6FB8]/80 bg-[#1D6FB8]/10 px-2.5 py-0.5 rounded-full">
                  {t.difficultyGentle}
                </span>
              </div>

              {/* Title & Description */}
              <h3 
                className={`font-black text-[#1E293B] group-hover:text-[#1D6FB8] transition-colors ${
                  isXL ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                }`}
                style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
              >
                {t.cardBrainExercisesTitle}
              </h3>
              <p className={`mt-2 text-[#475569] leading-relaxed font-medium ${isXL ? 'text-lg' : 'text-base'}`}>
                {t.cardBrainExercisesSub}
              </p>

              {/* Gentle exercise chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-2.5 py-1 rounded-lg bg-white/70 text-xs font-bold text-[#1D6FB8] border border-[#1D6FB8]/20">
                  🌸 Memory Match
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/70 text-xs font-bold text-[#1D6FB8] border border-[#1D6FB8]/20">
                  🔔 Sound Chimes
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/70 text-xs font-bold text-[#1D6FB8] border border-[#1D6FB8]/20">
                  ☀️ Daily Sequence
                </span>
              </div>
            </div>

            {/* Bottom Row with 48px Vibrant Blue Arrow Button */}
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-[#1D6FB8]/15">
              <span className="text-sm font-bold text-[#1D6FB8]">
                {t.gamesNoScoreNotice}
              </span>
              <button
                id="btn-arrow-brain"
                aria-label={`Open ${t.cardBrainExercisesTitle}`}
                tabIndex={-1}
                className="w-12 h-12 rounded-full bg-[#0275D8] text-white flex items-center justify-center shadow-md transition-all duration-200 group-hover:scale-110 group-hover:bg-[#0262b8] group-hover:shadow-lg shrink-0"
              >
                <ArrowRight className="w-6 h-6 stroke-[2.5] text-white transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: Daily Routine (Fresh Mint / Sage Green #E8F8EE) */}
        <div
          id="card-daily-routine"
          onClick={() => handleCardClick('routine')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick('routine'); }}
          tabIndex={0}
          role="button"
          aria-label={t.cardRoutineTitle}
          className={`group relative overflow-hidden rounded-[28px] p-6 sm:p-7 text-left cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#1F7D47]/40 ${
            isHighContrast
              ? 'bg-slate-950 border-2 border-[#1F7D47] text-white shadow-xl hover:border-emerald-300'
              : 'bg-[#E8F8EE] border-[1.5px] border-[#1F7D47]/35 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_32px_-6px_rgba(31,125,71,0.15)] hover:-translate-y-1'
          }`}
        >
          {/* Decorative leaf circle */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-[#1F7D47]/10 pointer-events-none transition-transform group-hover:scale-125 duration-500" />
          
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 text-[#1F7D47] shadow-sm">
                  <CalendarCheck className="w-4 h-4 text-[#1F7D47]" />
                  {t.cardRoutineBadge}
                </span>
                <span className="text-xs font-semibold text-[#1F7D47]/80 bg-[#1F7D47]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {t.morning}
                </span>
              </div>

              {/* Title & Description */}
              <h3 
                className={`font-black text-[#1E293B] group-hover:text-[#1F7D47] transition-colors ${
                  isXL ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                }`}
                style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
              >
                {t.cardRoutineTitle}
              </h3>
              <p className={`mt-2 text-[#475569] leading-relaxed font-medium ${isXL ? 'text-lg' : 'text-base'}`}>
                {t.cardRoutineSub}
              </p>

              {/* Routine highlight preview */}
              <div className="mt-4 p-3 rounded-xl bg-white/80 border border-[#1F7D47]/20 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-[#1F7D47] flex items-center justify-center shrink-0">
                    <Pill className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">BP Tablet & Morning Tea</p>
                    <p className="text-[11px] text-slate-500">8:30 AM • With light breakfast</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
            </div>

            {/* Bottom Row with 48px Forest Green Action Button */}
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-[#1F7D47]/15">
              <span className="text-sm font-bold text-[#1F7D47]">
                {t.navRoutineSub}
              </span>
              <button
                id="btn-arrow-routine"
                aria-label={`Open ${t.cardRoutineTitle}`}
                tabIndex={-1}
                className="w-12 h-12 rounded-full bg-[#1F7D47] text-white flex items-center justify-center shadow-md transition-all duration-200 group-hover:scale-110 group-hover:bg-[#186338] group-hover:shadow-lg shrink-0"
              >
                <ArrowRight className="w-6 h-6 stroke-[2.5] text-white transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CARD 3: Family & Doctor (Soft Lavender / Periwinkle #F2ECFD) */}
        <div
          id="card-family-doctor"
          onClick={() => handleCardClick('memory-book')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick('memory-book'); }}
          tabIndex={0}
          role="button"
          aria-label={t.cardFamilyTitle}
          className={`group relative overflow-hidden rounded-[28px] p-6 sm:p-7 text-left cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#5B259E]/40 ${
            isHighContrast
              ? 'bg-slate-950 border-2 border-[#5B259E] text-white shadow-xl hover:border-purple-300'
              : 'bg-[#F2ECFD] border-[1.5px] border-[#5B259E]/35 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_32px_-6px_rgba(91,37,158,0.15)] hover:-translate-y-1'
          }`}
        >
          {/* Decorative lavender orb */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-[#5B259E]/10 pointer-events-none transition-transform group-hover:scale-125 duration-500" />
          
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 text-[#5B259E] shadow-sm">
                  <Users className="w-4 h-4 text-[#5B259E]" />
                  {t.cardFamilyBadge}
                </span>
                <span className="text-xs font-semibold text-[#5B259E]/80 bg-[#5B259E]/10 px-2.5 py-0.5 rounded-full">
                  3 Contacts
                </span>
              </div>

              {/* Title & Description */}
              <h3 
                className={`font-black text-[#1E293B] group-hover:text-[#5B259E] transition-colors ${
                  isXL ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                }`}
                style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
              >
                {t.cardFamilyTitle}
              </h3>
              <p className={`mt-2 text-[#475569] leading-relaxed font-medium ${isXL ? 'text-lg' : 'text-base'}`}>
                {t.cardFamilySub}
              </p>

              {/* Loved ones photo avatar stack */}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex -space-x-3 overflow-hidden p-0.5">
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                    alt="Priya (Daughter)"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80"
                    alt="Dr. Barua"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                    alt="Aarav (Grandson)"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-800">Priya &amp; Dr. Barua</p>
                  <p className="text-slate-500">Tap to call or view stories</p>
                </div>
              </div>
            </div>

            {/* Bottom Row with 48px Rich Purple Round Button */}
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-[#5B259E]/15">
              <span className="text-sm font-bold text-[#5B259E]">
                {t.navMemorySub}
              </span>
              <button
                id="btn-arrow-family"
                aria-label={`Open ${t.cardFamilyTitle}`}
                tabIndex={-1}
                className="w-12 h-12 rounded-full bg-[#5B259E] text-white flex items-center justify-center shadow-md transition-all duration-200 group-hover:scale-110 group-hover:bg-[#481d7e] group-hover:shadow-lg shrink-0"
              >
                <ArrowRight className="w-6 h-6 stroke-[2.5] text-white transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CARD 4: Emergency SOS (Warm Creamy Peach-Amber #FFF2E0) */}
        <div
          id="card-emergency-sos"
          onClick={handleSosClick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSosClick(); }}
          tabIndex={0}
          role="button"
          aria-label={t.cardEmergencyTitle}
          className={`group relative overflow-hidden rounded-[28px] p-6 sm:p-7 text-left cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#E64A19]/40 ${
            isHighContrast
              ? 'bg-slate-950 border-2 border-[#E64A19] text-white shadow-xl hover:border-amber-400'
              : 'bg-[#FFF2E0] border-[1.5px] border-[#E64A19]/35 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_32px_-6px_rgba(230,74,25,0.2)] hover:-translate-y-1 ring-2 ring-[#E64A19]/10'
          }`}
        >
          {/* Decorative amber glow */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-[#E64A19]/10 pointer-events-none transition-transform group-hover:scale-125 duration-500" />
          
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 text-[#E64A19] shadow-sm">
                  <PhoneCall className="w-4 h-4 text-[#E64A19] animate-bounce-subtle" />
                  {t.cardEmergencyBadge}
                </span>
                <span className="text-xs font-black text-[#E64A19] bg-[#E64A19]/15 px-3 py-1 rounded-full uppercase tracking-wider">
                  108 &amp; Family
                </span>
              </div>

              {/* Title & Description */}
              <h3 
                className={`font-black text-[#E64A19] group-hover:text-[#bf360c] transition-colors ${
                  isXL ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                }`}
                style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
              >
                {t.cardEmergencyTitle}
              </h3>
              <p className={`mt-2 text-[#7c2d12] leading-relaxed font-semibold ${isXL ? 'text-lg' : 'text-base'}`}>
                {t.cardEmergencySub}
              </p>

              {/* Safety notice reassurance */}
              <div className="mt-4 p-3 rounded-xl bg-white/90 border border-[#E64A19]/25 flex items-center gap-2.5 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#E64A19] shrink-0" />
                <p className="text-xs font-bold text-[#7c2d12]">
                  {t.safeAtHome} • Always ready
                </p>
              </div>
            </div>

            {/* Bottom Row with 48px Bold Orange-Red Call Button */}
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-[#E64A19]/20">
              <span className="text-sm font-black text-[#E64A19]">
                {t.emergencyCall}
              </span>
              <button
                id="btn-arrow-emergency"
                aria-label={`Trigger ${t.cardEmergencyTitle}`}
                tabIndex={-1}
                className="w-12 h-12 rounded-full bg-[#E64A19] text-white flex items-center justify-center shadow-md transition-all duration-200 group-hover:scale-110 group-hover:bg-[#d84315] group-hover:shadow-lg shrink-0 ring-4 ring-[#E64A19]/20"
              >
                <PhoneCall className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Progress & Wellbeing Tracker (Weekly Sunshine & Activity Journal) */}
      <a
        id="card-sunshine-journal"
        href="/progress-tracker.html"
        className={`group relative overflow-hidden rounded-[28px] p-6 sm:p-7 text-left block transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 ${
          isHighContrast
            ? 'bg-slate-950 border-2 border-emerald-400 text-white shadow-xl hover:border-amber-300'
            : 'bg-gradient-to-r from-[#EAF5ED] via-[#D8EEDF] to-[#E0F4F7] border-[1.5px] border-emerald-600/30 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_32px_-6px_rgba(42,110,64,0.15)] hover:-translate-y-0.5'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/90 text-2xl flex items-center justify-center shadow-xs border border-emerald-300 shrink-0">
              🌻
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 text-emerald-800 shadow-xs border border-emerald-300">
                  Weekly Sunshine &amp; Activity Journal
                </span>
                <span className="text-xs font-semibold text-emerald-900/80 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  Elder &amp; Doctor Views
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Progress &amp; Wellbeing Tracker
              </h3>
              <p className="text-sm font-medium text-slate-700 mt-1 max-w-2xl">
                View your 7-day blooming garden streak with zero stress, or enter caregiver PIN (1234) for clinical reaction latency and sundowning logs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-black text-sm bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-all group-hover:scale-105">
              <span>Open Journal 🌻</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </a>

      {/* CARD 5: Inspiration Card (Soft Sunset Gradient: Pale Yellow fading into Gentle Aqua Blue #FDF6E2 to #E0F4F7) */}
      <div
        id="card-inspiration-sunset"
        className={`group relative overflow-hidden rounded-[28px] p-6 sm:p-8 text-left transition-all duration-300 ${
          isHighContrast
            ? 'bg-slate-950 border-2 border-amber-300 text-white shadow-xl'
            : 'bg-gradient-to-r from-[#FDF6E2] via-[#F4F9ED] to-[#E0F4F7] border-[1.5px] border-slate-300/60 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_32px_-6px_rgba(0,0,0,0.08)]'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 text-slate-800 shadow-sm border border-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {t.cardInspirationTitle}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {t.cardInspirationAuthor}
              </span>
            </div>

            <blockquote 
              className={`font-extrabold text-[#0F172A] italic leading-relaxed ${
                isXL ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
              }`}
              style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
            >
              {t.cardInspirationQuote}
            </blockquote>

            <p className="text-sm font-medium text-[#334155] flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>You are always cared for and cherished. Have a calm and peaceful day.</span>
            </p>
          </div>

          {/* Action buttons on inspiration card */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            <button
              id="btn-listen-inspiration"
              onClick={handleToggleInspirationAudio}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm transition-all duration-200 shadow-sm ${
                isPlayingInspiration
                  ? 'bg-rose-600 text-white hover:bg-rose-700 ring-2 ring-rose-300'
                  : 'bg-white/90 hover:bg-white text-slate-800 hover:text-slate-950 border border-slate-300 hover:shadow-md'
              }`}
              title="Listen to soothing reading"
            >
              {isPlayingInspiration ? (
                <>
                  <VolumeX className="w-4 h-4 text-white animate-pulse" />
                  <span>Stop Reading</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>{t.listenInspiration}</span>
                </>
              )}
            </button>

            {/* Circular button to talk to Saathi Companion */}
            <button
              id="btn-companion-from-inspiration"
              onClick={() => handleCardClick('companion')}
              title={t.cardInspirationAction}
              className="w-12 h-12 rounded-full bg-[#0F172A] text-white flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 hover:bg-slate-800 active:scale-95 group-hover:shadow-lg shrink-0"
            >
              <ArrowRight className="w-6 h-6 stroke-[2.5] text-white transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
