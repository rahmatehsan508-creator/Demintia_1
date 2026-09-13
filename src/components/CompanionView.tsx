import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquareHeart, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Heart, 
  RotateCcw,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { ChatMessage, TextSize, ContrastTheme, Language } from '../types';
import { voiceCommander } from '../utils/speechRecognition';
import { soundEffects, speakText, stopSpeaking } from '../utils/audio';
import { getTranslation } from '../utils/i18n';

interface CompanionViewProps {
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  isAudioMuted: boolean;
  language: Language;
}

export const CompanionView: React.FC<CompanionViewProps> = ({
  textSize,
  contrastTheme,
  isAudioMuted,
  language,
}) => {
  const t = getTranslation(language);
  const isHighContrast = contrastTheme === 'high-contrast';

  const getInitialMessage = (): ChatMessage => ({
    id: 'msg-1',
    sender: 'saathi',
    text: t.companionWelcome,
    timestamp: 'Just now',
  });

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([getInitialMessage()]);
  }, [language]);

  const getQuickPrompts = () => {
    if (language === 'as') {
      return [
        { label: '🏡 "মই এতিয়া ক\'ত আছোঁ?"', text: 'মই এতিয়া ক\'ত আছোঁ?' },
        { label: '🌸 "মোৰ জীয়াৰী প্ৰিয়াৰ কথা কোৱাচোন"', text: 'মোৰ জীয়াৰী প্ৰিয়াৰ কথা অলপ কোৱাচোন' },
        { label: '🍵 "মোৰ আজিৰ পৰৱৰ্তী নিয়ম কি?"', text: 'মোৰ আজিৰ পৰৱৰ্তী নিয়ম কি আছে?' },
        { label: '🎶 "ব্ৰহ্মপুত্ৰ আৰু অসমৰ এটা মিঠা সাধু কোৱা"', text: 'ব্ৰহ্মপুত্ৰ আৰু শান্ত অসমৰ এটা মিঠা সাধু কোৱা' },
        { label: '🕊️ "মোৰ মনটো আজি অলপ অস্থিৰ লাগিছে"', text: 'মোৰ মনটো আজি অলপ অস্থিৰ লাগিছে' },
      ];
    }
    if (language === 'bn') {
      return [
        { label: '🏡 "আমি এখন কোথায় আছি?"', text: 'আমি এখন কোথায় আছি?' },
        { label: '🌸 "আমার মেয়ে প্রিয়ার কথা বলো"', text: 'আমার মেয়ে প্রিয়ার কথা একটু বলো' },
        { label: '🍵 "আমার পরবর্তী রুটিন কী?"', text: 'আমার পরবর্তী রুটিন কী আছে?' },
        { label: '🎶 "একটি শান্ত সুন্দর গল্প বলো"', text: 'একটি শান্ত ও সুন্দর গল্প বলো' },
        { label: '🕊️ "আমার মনটা একটু হারিয়ে যাচ্ছে"', text: 'আমার মনটা কেমন যেন হারিয়ে যাচ্ছে' },
      ];
    }
    if (language === 'hi') {
      return [
        { label: '🏡 "मैं अभी कहाँ हूँ?"', text: 'मैं अभी कहाँ हूँ?' },
        { label: '🌸 "मेरी बेटी प्रिया के बारे में बताओ"', text: 'मेरी बेटी प्रिया के बारे में कुछ बताओ' },
        { label: '🍵 "मेरी अगली दिनचर्या क्या है?"', text: 'मेरी अगली दिनचर्या क्या है?' },
        { label: '🎶 "मुझे एक मधुर शांतिदायक कहानी सुनाओ"', text: 'मुझे एक मधुर शांतिदायक कहानी सुनाओ' },
        { label: '🕊️ "मुझे आज थोड़ा अकेलापन लग रहा है"', text: 'मुझे आज थोड़ा अकेलापन लग रहा है' },
      ];
    }
    return [
      { label: '🏡 "Where am I right now?"', text: 'Where am I right now?' },
      { label: '🌸 "Tell me about my daughter Priya"', text: 'Tell me about my daughter Priya' },
      { label: '🍵 "What is next on my routine?"', text: 'What is next on my daily routine?' },
      { label: '🎶 "Tell me a soothing story of Assam"', text: 'Tell me a soothing story of Assam and the Brahmaputra' },
      { label: '🕊️ "I feel a little lost today"', text: 'I feel a little lost and anxious today' },
    ];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    soundEffects.playSoftTap();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageContent,
          patientName: 'Shanti',
          language,
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        (language === 'as' ? 'আপুনি আপোনাৰ মৰমৰ ঘৰতে সুৰক্ষিত আছে। মই আপোনাৰ লগতেই আছোঁ।' :
         language === 'bn' ? 'আপনি আপনার নিরাপদ ঘরে আছেন। আমি আপনার পাশেই আছি।' :
         language === 'hi' ? 'आप अपने घर में पूर्णतः सुरक्षित हैं। मैं आपके साथ ही हूँ।' :
         'You are safe and surrounded by love, Shanti. I am right here with you.');

      const botMessage: ChatMessage = {
        id: `saathi-${Date.now()}`,
        sender: 'saathi',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (!isAudioMuted) {
        speakText(replyText, language);
      }
    } catch {
      const fallbackReply =
        language === 'as' ? 'আপুনি ঘৰতে আছে, বাইদেউ। সকলো শান্ত আৰু সুৰক্ষিত। আপোনাৰ পৰিয়ালে আপোনাক বহুত ভাল পায়।' :
        language === 'bn' ? 'আপনি ঘরেই আছেন। সবকিছু শান্ত ও নিরাপদ। পরিবার আপনাকে ভীষণ ভালোবাসে।' :
        language === 'hi' ? 'आप घर पर ही हैं। सब कुछ शांत और सुरक्षित है। आपका परिवार आपसे बहुत प्यार करता है।' :
        'You are at home, Shanti. Everything is calm and safe. Your family loves you, and I am here anytime you need to speak.';

      const botMessage: ChatMessage = {
        id: `saathi-${Date.now()}`,
        sender: 'saathi',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);

      if (!isAudioMuted) {
        speakText(fallbackReply, language);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeechInput = () => {
    soundEffects.playSoftTap();

    if (isListening) {
      voiceCommander.stop();
      setIsListening(false);
      return;
    }

    stopSpeaking();

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
          setInputText(transcript);
          if (isFinal && transcript.trim()) {
            voiceCommander.stop();
            setIsListening(false);
            handleSendMessage(transcript);
          }
        },
        onError: () => {
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        },
      },
      langCodeMap[language] || 'en-IN'
    );
  };

  const handleRepeatMessage = (text: string) => {
    soundEffects.playSoftTap();
    speakText(text, language);
  };

  return (
    <div className="space-y-6">
      {/* Intro Anchor Banner */}
      <div
        className={`p-6 sm:p-8 rounded-[28px] border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          isHighContrast
            ? 'bg-slate-900 border-amber-400 text-white'
            : 'bg-gradient-to-r from-[#FDF6E2] to-[#E0F4F7] border-[#1F7D47]/20 text-slate-900 shadow-[0_10px_30px_-5px_rgba(31,125,71,0.08)]'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
              isHighContrast
                ? 'bg-amber-400 text-slate-950 border-white'
                : 'bg-white text-[#1F7D47] border-[#1F7D47]/20 shadow-xs'
            }`}
          >
            <MessageSquareHeart className="w-9 h-9" aria-hidden="true" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs uppercase font-black tracking-wider px-3 py-1 rounded-full border ${
                  isHighContrast
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-white text-[#1F7D47] border-[#1F7D47]/20'
                }`}
              >
                {t.companionTagline}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#1F7D47] px-2.5 py-1 rounded-full bg-white/70">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.companionStatusOnline}
              </span>
            </div>

            <h2
              className={`font-black tracking-tight mt-2 ${
                isHighContrast ? 'text-white' : 'text-[#1F7D47]'
              } ${textSize === 'extra-large' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}
              style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
            >
              {t.companionTitle}
            </h2>

            <p
              className={`font-medium max-w-2xl mt-0.5 ${
                isHighContrast ? 'text-slate-300' : 'text-slate-700'
              } ${textSize === 'extra-large' ? 'text-xl' : 'text-base'}`}
            >
              {t.companionSubtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEffects.playSoftTap();
            setMessages([getInitialMessage()]);
          }}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 border text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            isHighContrast
              ? 'bg-slate-950 border-slate-700 text-slate-300'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{language === 'as' ? 'বাৰ্তালাপ পুনৰ আৰম্ভ' : language === 'bn' ? 'কথোপকথন নতুন করে শুরু' : language === 'hi' ? 'बातचीत पुनः शुरू' : 'Start Fresh'}</span>
        </button>
      </div>

      {/* Suggested Comfort Prompt Pills */}
      <div className="space-y-2">
        <span
          className={`text-xs font-black uppercase tracking-wider ${
            isHighContrast ? 'text-slate-400' : 'text-[#1F7D47]'
          }`}
        >
          {language === 'as' ? 'সহজ প্ৰশ্ন বা কথা কোৱাৰ বাবে স্পৰ্শ কৰক:' : language === 'bn' ? 'কথা বলার জন্য যেকোনো বাক্যে স্পর্শ করুন:' : language === 'hi' ? 'बातचीत शुरू करने के लिए किसी भी वाक्य पर टैप करें:' : 'Tap any thought to ask or talk:'}
        </span>
        <div className="flex flex-wrap gap-2">
          {getQuickPrompts().map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(p.text)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isHighContrast
                  ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-200'
                  : 'bg-white border-emerald-200 hover:border-[#1F7D47] text-slate-800 hover:bg-[#E8F8EE] shadow-xs'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div
        id="companion-chat-scroll"
        className={`p-6 sm:p-8 rounded-[28px] border-2 min-h-[420px] max-h-[520px] overflow-y-auto space-y-4 transition-colors ${
          isHighContrast
            ? 'bg-slate-950 border-slate-800'
            : 'bg-white/80 border-[#1F7D47]/20 shadow-inner'
        }`}
      >
        {messages.map((msg) => {
          const isSaathi = msg.sender === 'saathi';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isSaathi ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-xs font-bold text-slate-500">
                  {isSaathi ? `Saathi (${t.navCompanion})` : 'You (Shanti)'} • {msg.timestamp}
                </span>
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-5 rounded-[24px] border text-lg sm:text-xl font-semibold leading-relaxed shadow-sm transition-all ${
                  isSaathi
                    ? isHighContrast
                      ? 'bg-slate-900 border-amber-400 text-white rounded-tl-sm'
                      : 'bg-[#F4FAF6] border-[#1F7D47]/30 text-slate-900 rounded-tl-sm'
                    : isHighContrast
                    ? 'bg-amber-400 border-white text-slate-950 rounded-tr-sm font-black'
                    : 'bg-[#1F7D47] border-[#1F7D47] text-white rounded-tr-sm shadow-md'
                }`}
              >
                <p>{msg.text}</p>

                {isSaathi && (
                  <div className="flex justify-end mt-2 pt-2 border-t border-[#1F7D47]/15 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleRepeatMessage(msg.text)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer ${
                        isHighContrast
                          ? 'text-amber-300 hover:bg-slate-800'
                          : 'text-[#1F7D47] hover:bg-emerald-100'
                      }`}
                      title="Listen again"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{t.listenStoryButton}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 w-fit">
            <span className="w-3 h-3 rounded-full bg-[#1F7D47] animate-bounce" />
            <span className="w-3 h-3 rounded-full bg-[#1F7D47] animate-bounce [animation-delay:0.2s]" />
            <span className="w-3 h-3 rounded-full bg-[#1F7D47] animate-bounce [animation-delay:0.4s]" />
            <span className="text-sm font-bold text-[#1F7D47]">
              {language === 'as' ? 'সংগীয়ে উত্তৰ সাজু কৰিছে...' : language === 'bn' ? 'সঙ্গী উত্তর প্রস্তুত করছে...' : language === 'hi' ? 'साथी उत्तर तैयार कर रहा है...' : 'Saathi is thinking warmly...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Message & Microphone Control Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <button
          type="button"
          onClick={toggleSpeechInput}
          className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 border-2 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
            isListening
              ? 'bg-red-600 text-white border-white animate-pulse'
              : isHighContrast
              ? 'bg-amber-400 text-slate-950 border-white font-black'
              : 'bg-[#E8F8EE] text-[#1F7D47] border-[#1F7D47]/40 hover:bg-emerald-100'
          }`}
          title="Speak your message aloud"
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          <span className="text-base sm:text-lg">
            {isListening ? t.voiceStopListening : t.speakMessageButton}
          </span>
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.companionInputPlaceholder}
          className={`flex-1 w-full px-5 py-4 rounded-2xl border-2 font-semibold text-lg transition-all ${
            isHighContrast
              ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400'
              : 'bg-white border-[#1F7D47]/30 text-slate-900 placeholder-slate-400 focus:border-[#1F7D47] shadow-xs'
          }`}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 border transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
            !inputText.trim() || isLoading
              ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-600 border-slate-300'
              : isHighContrast
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-white'
              : 'bg-[#1F7D47] hover:bg-[#186438] text-white border-[#1F7D47]'
          }`}
        >
          <Send className="w-6 h-6" />
          <span>{t.sendMessageButton}</span>
        </button>
      </form>
    </div>
  );
};
