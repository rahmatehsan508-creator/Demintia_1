import React from 'react';
import { 
  PhoneCall, 
  MapPin, 
  ShieldAlert, 
  X, 
  Volume2 
} from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/initialData';
import { TextSize, ContrastTheme, Language } from '../types';
import { soundEffects, speakText } from '../utils/audio';
import { getTranslation } from '../utils/i18n';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  language: Language;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  textSize,
  contrastTheme,
  language,
}) => {
  if (!isOpen) return null;

  const isHighContrast = contrastTheme === 'high-contrast';
  const t = getTranslation(language);

  const handleReadAddress = () => {
    const speech = language === 'as'
      ? "আপোনাৰ বৰ্তমান ঠিকনা: ঘৰ নং ১৪, অৰ্কিড হিল ৰোড, উজানবজাৰ, গুৱাহাটী, অসম। জীয়াৰী প্ৰিয়া বৰুৱা আপোনাৰ প্ৰাথমিক যত্নকাৰী। সহায়ৰ বাবে যিকোনো বুটামত স্পৰ্শ কৰক।"
      : language === 'bn'
      ? "আপনার বর্তমান ঠিকানা: বাড়ি নং ১৪, অর্কিড হিল রোড, উজানবাজার, গুয়াহাটি, আসাম। মেয়ে প্রিয়া আপনার প্রাথমিক অভিভাবক। ফোনে কথা বলতে স্পর্শ করুন।"
      : language === 'hi'
      ? "आपका पता: मकान नं 14, ऑर्किड हिल रोड, गुवाहाटी, असम। बेटी प्रिया आपकी देखभालकर्ता हैं। संपर्क करने के लिए बटन दबाएं।"
      : "Your current location is House Number 14, Orchid Hill Road, Guwahati, Assam. Daughter Priya Barua is your primary caregiver. Tap any button to call immediately.";
    speakText(speech, language);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className={`w-full max-w-2xl p-6 sm:p-8 rounded-[32px] border-2 space-y-6 shadow-2xl my-8 ${
          isHighContrast
            ? 'bg-slate-900 border-amber-400 text-white'
            : 'bg-[#FFF2E0] border-[#E64A19]/30 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#E64A19]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#E64A19] text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldAlert className="w-8 h-8" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="emergency-dialog-title"
                className={`font-black tracking-tight ${
                  isHighContrast ? 'text-amber-300' : 'text-[#E64A19]'
                } ${textSize === 'extra-large' ? 'text-3xl' : 'text-2xl'}`}
                style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
              >
                {t.emergencyModalTitle}
              </h2>
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                {t.emergencyModalSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-3 rounded-2xl bg-white text-slate-700 font-black text-xl hover:scale-105 cursor-pointer shadow-xs border border-[#E64A19]/20"
            aria-label="Close emergency modal"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Current Physical Address Anchor */}
        <div
          className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isHighContrast
              ? 'bg-slate-900 border-amber-400 text-amber-200'
              : 'bg-white border-[#E64A19]/30 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-start gap-3">
            <MapPin className="w-7 h-7 text-[#E64A19] shrink-0 mt-1" aria-hidden="true" />
            <div>
              <span className="text-xs uppercase font-black tracking-wider block text-[#E64A19]">
                {language === 'as' ? 'আপোনাৰ ঘৰৰ ঠিকনা (সহায়ৰ বাবে):' : language === 'bn' ? 'আপনার বর্তমান ঠিকানা (সাহায্যের জন্য):' : language === 'hi' ? 'घर का पता (सहायता हेतु):' : 'Your Home Address (For Help):'}
              </span>
              <p className="text-lg sm:text-xl font-black">
                House #14, Orchid Hill Road, Near Uzanbazar, Guwahati, Assam - 781001
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReadAddress}
            className="px-4 py-2.5 rounded-xl bg-[#FFF2E0] text-[#E64A19] border border-[#E64A19]/40 hover:bg-orange-100 font-black text-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" aria-hidden="true" />
            <span>{language === 'as' ? 'ঠিকনা শুনক' : language === 'bn' ? 'ঠিকানা শুনুন' : language === 'hi' ? 'पता सुनें' : 'Read Location'}</span>
          </button>
        </div>

        {/* Emergency Contacts List */}
        <div className="space-y-4">
          <span className="text-sm uppercase font-black tracking-wider text-slate-700 block">
            {language === 'as' ? 'স্পৰ্শ কৰি পোনে পোনে ফোন কৰক:' : language === 'bn' ? 'এক স্পর্শে ফোন করুন:' : language === 'hi' ? 'सीधे कॉल करने के लिए टैप करें:' : 'One-Tap Dial Contacts:'}
          </span>

          {EMERGENCY_CONTACTS.map((contact) => (
            <div
              key={contact.id}
              className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs ${
                contact.isPrimary
                  ? isHighContrast
                    ? 'bg-emerald-950/60 border-emerald-400'
                    : 'bg-white border-[#E64A19]/40'
                  : isHighContrast
                  ? 'bg-slate-900 border-slate-700'
                  : 'bg-white/80 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    contact.isPrimary
                      ? 'bg-[#E64A19] text-white'
                      : 'bg-orange-600 text-white'
                  }`}
                >
                  <PhoneCall className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">{contact.name}</h3>
                    {contact.isPrimary && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E64A19] text-white font-bold">
                        {language === 'as' ? 'মুখ্য যত্নকাৰী' : language === 'bn' ? 'প্রধান অভিভাবক' : language === 'hi' ? 'मुख्य देखभालकर्ता' : 'Primary Caregiver'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-600">{contact.role}</p>
                </div>
              </div>

              <a
                href={`tel:${contact.phoneNumber}`}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  contact.isPrimary
                    ? 'bg-[#E64A19] hover:bg-[#c93c10] text-white'
                    : 'bg-[#E64A19] hover:bg-[#c93c10] text-white'
                }`}
              >
                <PhoneCall className="w-5 h-5" aria-hidden="true" />
                <span>{language === 'as' ? 'ফোন কৰক' : language === 'bn' ? 'কল করুন' : language === 'hi' ? 'कॉल करें' : 'Call'} ({contact.phoneNumber})</span>
              </a>
            </div>
          ))}
        </div>

        {/* Dismiss Footer */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-base hover:scale-105 transition-transform cursor-pointer"
          >
            {language === 'as' ? 'ঘূৰি যাওক' : language === 'bn' ? 'ফিরে যান' : language === 'hi' ? 'वापस जाएँ' : 'Back to Safety'}
          </button>
        </div>
      </div>
    </div>
  );
};
