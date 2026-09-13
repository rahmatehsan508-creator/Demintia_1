import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { NavigationTab, TextSize, ContrastTheme, Language } from '../types';
import { voiceCommander } from '../utils/speechRecognition';
import { speakText, stopSpeaking, soundEffects } from '../utils/audio';
import { getTranslation } from '../utils/i18n';

interface VoiceCommandBarProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenEmergency: () => void;
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  isAudioMuted: boolean;
  language: Language;
}

export const VoiceCommandBar: React.FC<VoiceCommandBarProps> = ({
  onNavigate,
  onOpenEmergency,
  textSize,
  contrastTheme,
  isAudioMuted,
  language,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [heardText, setHeardText] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const t = getTranslation(language);
  const isHighContrast = contrastTheme === 'high-contrast';

  useEffect(() => {
    setStatusMessage(t.voicePromptPlaceholder);
  }, [language, t.voicePromptPlaceholder]);

  // Localized quick voice commands tailored to each language
  const getQuickCommands = () => {
    if (language === 'as') {
      return [
        { label: t.cmdShowGames, text: 'খেল দেখুৱাওক' },
        { label: t.cmdReadRoutine, text: 'মোৰ নিয়ম আৰু ঔষধ পঢ়ক' },
        { label: t.cmdOpenPhotos, text: 'পৰিয়ালৰ স্মৃতি ফটো দেখুৱাওক' },
        { label: t.cmdTalkSaathi, text: 'মনৰ সংগীৰ লগত কথা পাতক' },
        { label: t.cmdEmergency, text: 'জৰুৰীকালীন সহায়' },
      ];
    }
    if (language === 'bn') {
      return [
        { label: t.cmdShowGames, text: 'ব্রেন গেম দেখাও' },
        { label: t.cmdReadRoutine, text: 'আমার রুটিন ও ওষুধ পড়ো' },
        { label: t.cmdOpenPhotos, text: 'পরিবারের ছবির বই খোলো' },
        { label: t.cmdTalkSaathi, text: 'মনের সঙ্গীর সাথে কথা বলি' },
        { label: t.cmdEmergency, text: 'জরুরি সাহায্য' },
      ];
    }
    if (language === 'hi') {
      return [
        { label: t.cmdShowGames, text: 'दिमागी खेल दिखाओ' },
        { label: t.cmdReadRoutine, text: 'मेरी दिनचर्या और दवाइयां बताओ' },
        { label: t.cmdOpenPhotos, text: 'परिवार की फोटो पुस्तक खोलो' },
        { label: t.cmdTalkSaathi, text: 'साथी से बात करो' },
        { label: t.cmdEmergency, text: 'आपातकालीन मदद' },
      ];
    }
    return [
      { label: t.cmdShowGames, text: 'Show brain games' },
      { label: t.cmdReadRoutine, text: 'Read my routine and medicines' },
      { label: t.cmdOpenPhotos, text: 'Open my family memory book' },
      { label: t.cmdTalkSaathi, text: 'I want to talk with Saathi' },
      { label: t.cmdEmergency, text: 'Emergency help' },
    ];
  };

  const handleProcessCommand = async (command: string) => {
    setIsProcessing(true);
    setStatusMessage(`${t.voiceProcessing} "${command}"`);

    try {
      // Call backend voice intent processor
      const res = await fetch('/api/gemini/voice-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spokenText: command, language }),
      });

      const data = await res.json();
      const reply = data.spokenReply || (language === 'as' ? "আপোনাক সেই পৃষ্ঠালৈ লৈ যোৱা হৈছে।" : language === 'bn' ? "আপনাকে সেখানে নিয়ে যাচ্ছি।" : language === 'hi' ? "आपको उस पृष्ठ पर ले जा रहे हैं।" : "Taking you there now.");
      setStatusMessage(reply);

      if (!isAudioMuted) {
        speakText(reply, language);
      }

      if (data.route === 'emergency') {
        onOpenEmergency();
      } else if (data.route && ['dashboard', 'routine', 'games', 'memory-book', 'companion'].includes(data.route)) {
        onNavigate(data.route as NavigationTab);
      }
    } catch {
      // Offline fallback rule parsing in all supported languages
      const text = command.toLowerCase();
      let fallbackRoute: NavigationTab | 'emergency' = 'dashboard';
      let reply = "Opening your dashboard.";

      if (
        text.includes('home') || text.includes('dashboard') || 
        text.includes('মূল') || text.includes('প্ৰধান') || text.includes('ডেশ্বব’ৰ্ড') ||
        text.includes('घर')
      ) {
        fallbackRoute = 'dashboard';
        reply = language === 'as' ? "মূল ডেশ্বব’ৰ্ড খোলি দিয়া হৈছে।" : language === 'bn' ? "মূল ড্যাশবোর্ড খোলা হচ্ছে।" : language === 'hi' ? "मुख्य डैशबोर्ड खोला जा रहा है।" : "Opening Home Dashboard.";
      } else if (
        text.includes('game') || text.includes('play') || 
        text.includes('খেল') || text.includes('গেম') || text.includes('খেলা') || 
        text.includes('खेल')
      ) {
        fallbackRoute = 'games';
        reply = language === 'as' ? "মগজুৰ খেল খোলি দিয়া হৈছে।" : language === 'bn' ? "ব্রেন এক্সারসাইজ খোলা হচ্ছে।" : language === 'hi' ? "दिमागी खेल खोले जा रहे हैं।" : "Opening Brain Exercises.";
      } else if (
        text.includes('routine') || text.includes('medicine') || text.includes('pill') ||
        text.includes('নিয়ম') || text.includes('ঔষধ') || text.includes('রুটিন') || text.includes('ওষুধ') ||
        text.includes('दवा') || text.includes('दिनचर्या')
      ) {
        fallbackRoute = 'routine';
        reply = language === 'as' ? "আপোনাৰ দৈনিক নিয়ম আৰু ঔষধ ইয়াত আছে।" : language === 'bn' ? "আপনার দৈনিক রুটিন ও ওষুধ এখানে রয়েছে।" : language === 'hi' ? "आपकी दैनिक दिनचर्या उपस्थित है।" : "Here is your routine for today.";
      } else if (
        text.includes('memory') || text.includes('family') || text.includes('photo') ||
        text.includes('স্মৃতি') || text.includes('পৰিয়াল') || text.includes('ফটো') || text.includes('ছবি') ||
        text.includes('परिवार') || text.includes('याद')
      ) {
        fallbackRoute = 'memory-book';
        reply = language === 'as' ? "আপোনাৰ মৰমৰ স্মৃতি পুথি খোলা হৈছে।" : language === 'bn' ? "আপনার প্রিয় স্মৃতির বই খোলা হচ্ছে।" : language === 'hi' ? "आपकी प्रिय स्मृति पुस्तक खोली जा रही है।" : "Opening Family and Doctor contacts.";
      } else if (
        text.includes('help') || text.includes('emergency') || text.includes('doctor') ||
        text.includes('জৰুৰী') || text.includes('সহায়') || text.includes('জরুরি') || text.includes('সাহায্য') ||
        text.includes('मदद') || text.includes('आपातकालीन')
      ) {
        fallbackRoute = 'emergency';
        reply = language === 'as' ? "জৰুৰীকালীন সহায়ৰ পৃষ্ঠাটো খোলা হৈছে।" : language === 'bn' ? "জরুরি সহায়তার পাতা খোলা হচ্ছে।" : language === 'hi' ? "आपातकालीन सहायता पृष्ठ खोला जा रहा है।" : "Opening emergency assistance.";
      } else if (
        text.includes('companion') || text.includes('talk') || text.includes('chat') || text.includes('saathi') ||
        text.includes('সংগী') || text.includes('কথা') || text.includes('সঙ্গী') ||
        text.includes('साथी') || text.includes('बात')
      ) {
        fallbackRoute = 'companion';
        reply = language === 'as' ? "মই আপোনাৰ লগতেই আছোঁ। কওক।" : language === 'bn' ? "আমি আপনার পাশেই আছি। বলুন।" : language === 'hi' ? "मैं आपके साथ ही हूँ। कहिए।" : "I am right here with you.";
      } else {
        reply = language === 'as' ? "আপোনাৰ ডেশ্বব’ৰ্ড সাজু আছে।" : language === 'bn' ? "আপনার ড্যাশবোর্ড প্রস্তুত।" : language === 'hi' ? "आपका डैशबोर्ड तैयार है।" : "Here is your dashboard.";
      }

      setStatusMessage(reply);
      if (!isAudioMuted) {
        speakText(reply, language);
      }

      if (fallbackRoute === 'emergency') {
        onOpenEmergency();
      } else {
        onNavigate(fallbackRoute);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMic = () => {
    soundEffects.playSoftTap();

    if (isListening) {
      voiceCommander.stop();
      setIsListening(false);
      setStatusMessage(language === 'as' ? 'শুননি বন্ধ কৰা হ\'ল।' : language === 'bn' ? 'শোনা বন্ধ করা হলো।' : language === 'hi' ? 'सुनना बंद किया गया।' : 'Voice listening paused.');
      return;
    }

    stopSpeaking();
    setHeardText('');
    setStatusMessage(t.voiceListening);

    const langCodeMap: Record<Language, string> = {
      en: 'en-IN',
      as: 'as-IN',
      bn: 'bn-IN',
      hi: 'hi-IN',
    };

    voiceCommander.start(
      {
        onStart: () => setIsListening(true),
        onResult: (transcript, isFinal) => {
          setHeardText(transcript);
          if (isFinal && transcript.trim()) {
            voiceCommander.stop();
            setIsListening(false);
            handleProcessCommand(transcript);
          }
        },
        onError: (err) => {
          setIsListening(false);
          setStatusMessage(err);
        },
        onEnd: () => {
          setIsListening(false);
        },
      },
      langCodeMap[language] || 'en-IN'
    );
  };

  const handleQuickCommandClick = (cmdText: string) => {
    soundEffects.playSoftTap();
    handleProcessCommand(cmdText);
  };

  return (
    <div
      id="hands-free-voice-bar"
      className={`border-b transition-colors ${
        isHighContrast
          ? 'bg-slate-900 border-amber-400/40 text-white'
          : 'bg-white/70 backdrop-blur-md border-emerald-200/70 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Main Voice Button & Dynamic Status Message */}
          <div className="flex items-center gap-3.5 w-full lg:w-auto">
            <button
              id="voice-microphone-toggle"
              type="button"
              onClick={toggleMic}
              aria-label={isListening ? t.voiceStopListening : t.voiceStartListening}
              className={`relative px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-extrabold flex items-center gap-2.5 transition-all transform active:scale-95 shadow-sm cursor-pointer ${
                isListening
                  ? 'bg-[#E64A19] text-white border-2 border-white animate-pulse shadow-md ring-4 ring-orange-300'
                  : isHighContrast
                  ? 'bg-amber-400 text-slate-950 border-2 border-white hover:bg-amber-300'
                  : 'bg-[#1A5B3B] text-white hover:bg-[#14472e] border border-emerald-400/60'
              }`}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" aria-hidden="true" />
              ) : (
                <Mic className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" aria-hidden="true" />
              )}
              <span className="text-sm sm:text-base font-black">
                {isListening ? t.voiceStopListening : t.voiceStartListening}
              </span>
            </button>

            {/* Live Audio Status Display */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    isListening
                      ? 'bg-orange-500 animate-ping'
                      : isProcessing
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-[#1F7D47]'
                  }`}
                />
                <p
                  className={`font-black truncate ${
                    textSize === 'extra-large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                  } ${isHighContrast ? 'text-amber-300' : 'text-[#1A5B3B]'}`}
                >
                  {isListening
                    ? t.voiceListening
                    : isProcessing
                    ? t.voiceProcessing
                    : statusMessage}
                </p>
              </div>

              {heardText && (
                <p
                  className={`text-xs sm:text-sm italic font-medium mt-0.5 truncate ${
                    isHighContrast ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  &ldquo;{heardText}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Quick-Action Voice Shortcut Chips */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full lg:w-auto justify-start lg:justify-end">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider hidden xl:inline-block mr-1 ${
                isHighContrast ? 'text-slate-400' : 'text-[#2D6A4F]/80'
              }`}
            >
              {t.quickCommandsTitle}
            </span>
            {getQuickCommands().map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickCommandClick(cmd.text)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isHighContrast
                    ? 'bg-slate-950 border-slate-700 hover:border-amber-400 text-slate-200'
                    : 'bg-white/90 border-emerald-200/80 hover:border-emerald-400 text-[#1A5B3B] shadow-2xs hover:bg-emerald-50'
                }`}
              >
                {cmd.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
