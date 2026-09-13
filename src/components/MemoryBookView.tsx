import React, { useState } from 'react';
import { 
  BookHeart, 
  Heart, 
  Volume2, 
  Phone, 
  Plus, 
  MapPin, 
  Sparkles, 
  UserCheck, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { MemoryPerson, TextSize, ContrastTheme, Language } from '../types';
import { soundEffects, speakText } from '../utils/audio';
import { getTranslation } from '../utils/i18n';
import { useAuth } from '../context/AuthContext';

interface MemoryBookViewProps {
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  isAudioMuted: boolean;
  onOpenEmergency: () => void;
  language: Language;
}

export const MemoryBookView: React.FC<MemoryBookViewProps> = ({
  textSize,
  contrastTheme,
  isAudioMuted,
  onOpenEmergency,
  language,
}) => {
  const { memories, addCustomMemory, currentUser } = useAuth();
  const [isAddingMemory, setIsAddingMemory] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newRelation, setNewRelation] = useState<string>('');
  const [newStory, setNewStory] = useState<string>('');
  const [newKeyMemory, setNewKeyMemory] = useState<string>('');

  const isHighContrast = contrastTheme === 'high-contrast';
  const t = getTranslation(language);

  const handleReadStory = (person: MemoryPerson) => {
    soundEffects.playSoftTap();
    const narrative = `${person.name}, ${person.relation}. ${person.story}. ${person.keyMemory}`;
    speakText(narrative, language);
  };

  const handleReadIntroduction = () => {
    speakText(
      `${t.memoryBookTitle}. ${t.memoryBookSubtitle}`,
      language
    );
  };

  const handleAddMemorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRelation.trim()) return;

    soundEffects.playGentleChime();
    await addCustomMemory({
      name: newName,
      relation: newRelation,
      location: 'Safe with you',
      story: newStory || `${newName} cares for you deeply.`,
      keyMemory: newKeyMemory || 'Loves seeing your warm smile.',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    });

    setNewName('');
    setNewRelation('');
    setNewStory('');
    setNewKeyMemory('');
    setIsAddingMemory(false);
    if (!isAudioMuted) {
      speakText(`${newName} - ${language === 'as' ? 'স্মৃতি পুথিত যোগ কৰা হ\'ল।' : language === 'bn' ? 'স্মৃতির বইয়ে যুক্ত হলো।' : language === 'hi' ? 'स्मृति पुस्तक में जोड़ा गया।' : 'added to memory book.'}`, language);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className={`p-6 sm:p-8 rounded-[28px] border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          isHighContrast
            ? 'bg-slate-900 border-amber-400 text-white'
            : 'bg-[#F2ECFD] border-[#5B259E]/30 text-slate-900 shadow-[0_10px_30px_-5px_rgba(91,37,158,0.1)]'
        }`}
      >
        <div className="flex items-start gap-5">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
              isHighContrast
                ? 'bg-amber-400 text-slate-950 border-white'
                : 'bg-white text-[#5B259E] border-[#5B259E]/20 shadow-xs'
            }`}
          >
            <BookHeart className="w-9 h-9" aria-hidden="true" />
          </div>
          <div>
            <span
              className={`text-xs uppercase font-black tracking-wider px-3 py-1 rounded-full border ${
                isHighContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-white text-[#5B259E] border-[#5B259E]/30'
              }`}
            >
              {language === 'as' ? 'আপোনজনৰ সোঁৱৰণী আৰু স্মৃতি' : language === 'bn' ? 'প্রিয়জন ও সুখস্মৃতির আধার' : language === 'hi' ? 'अपनों की सुखद यादें' : 'Reminiscence Therapy & Memory Wallet'}
            </span>
            <h2
              className={`font-black tracking-tight mt-2 ${
                isHighContrast ? 'text-white' : 'text-[#5B259E]'
              } ${textSize === 'extra-large' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}
              style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
            >
              {t.memoryBookTitle}
            </h2>
            <p
              className={`font-medium mt-1 max-w-2xl ${
                isHighContrast ? 'text-slate-300' : 'text-[#5B259E]/90'
              } ${textSize === 'extra-large' ? 'text-xl' : 'text-lg'}`}
            >
              {t.memoryBookSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReadIntroduction}
            className={`p-3.5 rounded-2xl font-bold border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center ${
              isHighContrast
                ? 'bg-slate-950 border-slate-700 text-amber-300'
                : 'bg-white border-[#5B259E]/30 text-[#5B259E] hover:bg-purple-50'
            }`}
            title="Read introduction aloud"
            aria-label="Read memory book introduction aloud"
          >
            <Volume2 className="w-6 h-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setIsAddingMemory(true)}
            className={`px-5 py-3 rounded-2xl font-black flex items-center gap-2 border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md ${
              isHighContrast
                ? 'bg-amber-400 border-white text-slate-950'
                : 'bg-[#5B259E] hover:bg-[#4a1c82] border-[#5B259E] text-white'
            }`}
          >
            <Plus className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="text-base">{t.addMemoryButton}</span>
          </button>
        </div>
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {memories.map((person) => (
          <div
            key={person.id}
            className={`p-6 sm:p-7 rounded-[28px] border-2 flex flex-col justify-between gap-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
              isHighContrast
                ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-white'
                : 'bg-[#F2ECFD]/80 hover:bg-[#F2ECFD] border-[#5B259E]/30 hover:border-[#5B259E] text-slate-900 shadow-[0_8px_24px_-4px_rgba(91,37,158,0.08)]'
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Person Image */}
              <div className="relative shrink-0 mx-auto sm:mx-0">
                <img
                  src={person.imageUrl}
                  alt={person.name}
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl border-2 border-[#5B259E]/30 shadow-md"
                />
                <span className="absolute -bottom-2 -right-2 p-2 rounded-full bg-[#5B259E] text-white shadow-xs">
                  <Heart className="w-4 h-4 fill-current" />
                </span>
              </div>

              {/* Information */}
              <div className="space-y-2 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span
                    className={`text-xs font-black px-3 py-0.5 rounded-full uppercase tracking-wider border ${
                      isHighContrast
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : 'bg-white text-[#5B259E] border-[#5B259E]/30'
                    }`}
                  >
                    {person.relation}
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#5B259E]" />
                    {person.location}
                  </span>
                </div>

                <h3
                  className={`font-black tracking-tight ${
                    isHighContrast ? 'text-white' : 'text-[#5B259E]'
                  } ${
                    textSize === 'extra-large' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                  }`}
                  style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
                >
                  {person.name}
                </h3>

                <p
                  className={`font-medium ${
                    isHighContrast ? 'text-slate-300' : 'text-slate-700'
                  } text-base`}
                >
                  {person.story}
                </p>

                {/* Key Memory Highlight */}
                <div
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
                    isHighContrast
                      ? 'bg-slate-950 border-slate-700 text-amber-300'
                      : 'bg-white border-[#5B259E]/20 text-[#5B259E]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-[#5B259E]" />
                  <span>{person.keyMemory}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#5B259E]/15 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleReadStory(person)}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 border transition-all hover:scale-102 active:scale-98 cursor-pointer ${
                  isHighContrast
                    ? 'bg-slate-800 border-amber-400 text-amber-300 hover:bg-slate-700'
                    : 'bg-white hover:bg-purple-50 text-[#5B259E] border-[#5B259E]/30'
                }`}
              >
                <Volume2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span className="text-base font-bold">{t.listenStoryButton}</span>
              </button>

              {person.phoneNumber && (
                <a
                  href={`tel:${person.phoneNumber}`}
                  className="py-3 px-5 rounded-2xl font-black flex items-center justify-center gap-2 bg-[#5B259E] hover:bg-[#4a1c82] text-white border border-[#5B259E] transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-xs"
                >
                  <Phone className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="text-base">{t.callFamily}</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {isAddingMemory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div
            className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border-4 space-y-6 shadow-2xl ${
              isHighContrast
                ? 'bg-slate-900 border-amber-400 text-white'
                : 'bg-white border-amber-400 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black flex items-center gap-2">
                <Heart className="w-7 h-7 text-rose-500" aria-hidden="true" />
                {t.addMemoryButton}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingMemory(false)}
                className="text-2xl font-black px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemorySubmit} className="space-y-4">
              <div>
                <label className="block text-base font-bold mb-1">
                  {language === 'as' ? 'নাম' : language === 'bn' ? 'নাম' : language === 'hi' ? 'नाम' : 'Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`w-full p-4 rounded-2xl border-2 font-bold text-lg ${
                    isHighContrast
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-base font-bold mb-1">
                  {language === 'as' ? 'সম্পৰ্ক' : language === 'bn' ? 'সম্পর্ক' : language === 'hi' ? 'संबंध' : 'Relationship'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Loving Brother, Daughter"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className={`w-full p-4 rounded-2xl border-2 font-bold text-lg ${
                    isHighContrast
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-base font-bold mb-1">
                  {language === 'as' ? 'মৰমৰ কাহিনী' : language === 'bn' ? 'স্মৃতি বা গল্প' : language === 'hi' ? 'सुखद कहानी' : 'Warm Story'}
                </label>
                <textarea
                  rows={3}
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  className={`w-full p-4 rounded-2xl border-2 font-bold text-base ${
                    isHighContrast
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-base font-bold mb-1">
                  {language === 'as' ? 'সোঁৱৰণীৰ কথা' : language === 'bn' ? 'মনে রাখার কথা' : language === 'hi' ? 'याद रखने योग्य बात' : 'Key Memory to Remember'}
                </label>
                <input
                  type="text"
                  value={newKeyMemory}
                  onChange={(e) => setNewKeyMemory(e.target.value)}
                  className={`w-full p-4 rounded-2xl border-2 font-bold text-base ${
                    isHighContrast
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xl border-2 border-amber-400 cursor-pointer"
                >
                  {language === 'as' ? 'সংৰক্ষণ কৰক' : language === 'bn' ? 'সংরক্ষণ করুন' : language === 'hi' ? 'सहेजें' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingMemory(false)}
                  className="py-4 px-6 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-lg cursor-pointer"
                >
                  {language === 'as' ? 'বাতিল' : language === 'bn' ? 'বাতিল' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
