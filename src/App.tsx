import React, { useState } from 'react';
import { 
  NavigationTab, 
  TextSize, 
  ContrastTheme, 
  Language 
} from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { VoiceCommandBar } from './components/VoiceCommandBar';
import { DashboardView } from './components/DashboardView';
import { RoutineView } from './components/RoutineView';
import { GamesOverview } from './components/GamesOverview';
import { MemoryBookView } from './components/MemoryBookView';
import { CompanionView } from './components/CompanionView';
import { EmergencyModal } from './components/EmergencyModal';
import { PatientAuthModal } from './components/PatientAuthModal';
import { OrganicLeafAccents } from './components/OrganicLeafAccents';
import { MemoryomLogo } from './components/MemoryomLogo';
import { ShieldCheck, Sparkles, PhoneCall, ArrowLeft, Home } from 'lucide-react';
import { getTranslation } from './utils/i18n';
import { soundEffects } from './utils/audio';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [textSize, setTextSize] = useState<TextSize>('large');
  const [contrastTheme, setContrastTheme] = useState<ContrastTheme>('daylight');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');

  const isHighContrast = contrastTheme === 'high-contrast';
  const t = getTranslation(language);

  return (
    <AuthProvider>
      <div
        className={`min-h-screen relative transition-colors duration-300 flex flex-col justify-between selection:bg-emerald-200 ${
          isHighContrast
            ? 'bg-slate-950 text-white'
            : 'bg-gradient-to-br from-[#EAF5ED] via-[#E2F0E7] to-[#D8EEDF] text-slate-900'
        } ${textSize === 'extra-large' ? 'text-lg' : 'text-base'}`}
        style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        {/* Subtle organic botanical leaf background accents */}
        <OrganicLeafAccents isHighContrast={isHighContrast} />

        <div className="relative z-10">
          {/* Persistent Accessible Header with Memoryom Branding & Language Switcher */}
          <Header
            textSize={textSize}
            setTextSize={setTextSize}
            contrastTheme={contrastTheme}
            setContrastTheme={setContrastTheme}
            isAudioMuted={isAudioMuted}
            setIsAudioMuted={setIsAudioMuted}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            language={language}
            setLanguage={setLanguage}
          />

        {/* Simplified, Intuitive Main Navigation Tabs with Clear Icons & Labels */}
        <Navigation
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          textSize={textSize}
          contrastTheme={contrastTheme}
          language={language}
        />

        {/* Hands-Free Multilingual Voice Assistant Command Bar */}
        <VoiceCommandBar
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          textSize={textSize}
          contrastTheme={contrastTheme}
          isAudioMuted={isAudioMuted}
          language={language}
        />

        {/* Return to Dashboard Quick Header Pill when inside a subview */}
        {currentTab !== 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
            <button
              id="back-to-dashboard-pill"
              onClick={() => {
                soundEffects.playSoftTap();
                setCurrentTab('dashboard');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-white/90 hover:bg-white text-[#1A5B3B] border border-emerald-300/80 shadow-xs hover:shadow-sm transition-all hover:-translate-x-0.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#1F7D47]" />
              <Home className="w-4 h-4 text-[#1F7D47]" />
              <span>{t.backToDashboard}</span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main
          id="main-content-view"
          className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
        >
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              textSize={textSize}
              contrastTheme={contrastTheme}
              isAudioMuted={isAudioMuted}
              language={language}
            />
          )}

          {currentTab === 'routine' && (
            <RoutineView
              textSize={textSize}
              contrastTheme={contrastTheme}
              isAudioMuted={isAudioMuted}
              language={language}
            />
          )}

          {currentTab === 'games' && (
            <GamesOverview
              textSize={textSize}
              contrastTheme={contrastTheme}
              isAudioMuted={isAudioMuted}
              language={language}
            />
          )}

          {currentTab === 'memory-book' && (
            <MemoryBookView
              textSize={textSize}
              contrastTheme={contrastTheme}
              isAudioMuted={isAudioMuted}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              language={language}
            />
          )}

          {currentTab === 'companion' && (
            <CompanionView
              textSize={textSize}
              contrastTheme={contrastTheme}
              isAudioMuted={isAudioMuted}
              language={language}
            />
          )}
        </main>
      </div>

      {/* Reassuring Footer with Memoryom Identity & Elderly Accessibility Guarantee */}
      <footer
        className={`relative z-10 border-t py-8 px-4 sm:px-8 mt-12 transition-colors ${
          isHighContrast
            ? 'bg-slate-900 border-amber-400/40 text-slate-300'
            : 'bg-white/85 backdrop-blur-md border-emerald-200/80 text-slate-700 shadow-inner'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3.5">
            <MemoryomLogo size={44} isHighContrast={isHighContrast} />
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span 
                  className="font-black text-xl tracking-tight text-[#1A5B3B]"
                  style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
                >
                  Memoryom
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#2D6A4F]/80">
                  • MEMORY COMPANION
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                {language === 'as'
                  ? 'ডিমেনচিয়া আক্ৰান্ত জ্যেষ্ঠসকলৰ বাবে সহজ, মৰমীয়াল আৰু উচ্চ-দৃষ্টিগোচৰ স্মৃতি সেৱা'
                  : language === 'bn'
                  ? 'ডিমেনশিয়া আক্রান্ত প্রবীণদের জন্য সহজ, মমতাময় ও উচ্চ-বৈসাদৃশ্য মেমরি প্ল্যাটফর্ম'
                  : language === 'hi'
                  ? 'बुजुर्गों के लिए सहज, स्नेहमयी व उच्च-कंट्रास्ट स्मृति एवं मस्तिष्क स्वास्थ्य मंच'
                  : 'Accessible Eldercare & Dementia Memory Companion for Peace of Mind'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-[#1A5B3B] border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-[#1F7D47]" aria-hidden="true" /> WCAG AAA High-Contrast
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-100 text-[#1D6FB8] border border-sky-200">
              <Sparkles className="w-4 h-4 text-[#0275D8]" aria-hidden="true" /> {t.handsFreeVoiceAssistant}
            </span>
            <button
              type="button"
              onClick={() => setIsEmergencyOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF2E0] text-[#E64A19] border border-[#E64A19]/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer font-extrabold shadow-xs"
            >
              <PhoneCall className="w-4 h-4 text-[#E64A19]" aria-hidden="true" /> {t.caregiverAssistance}
            </button>
          </div>
        </div>
      </footer>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        textSize={textSize}
        contrastTheme={contrastTheme}
        language={language}
      />

      {/* Patient Cloud Sign In / Sign Up Modal */}
      <PatientAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        textSize={textSize}
        contrastTheme={contrastTheme}
        language={language}
      />
    </div>
    </AuthProvider>
  );
}
