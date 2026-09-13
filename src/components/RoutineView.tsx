import React, { useState } from 'react';
import { 
  CalendarCheck2, 
  Clock, 
  Pill, 
  Coffee, 
  Utensils, 
  Footprints, 
  Moon, 
  CheckCircle2, 
  Circle, 
  Volume2, 
  Plus, 
  Heart,
  Droplets,
  BellRing
} from 'lucide-react';
import { RoutineItem, TextSize, ContrastTheme, Language } from '../types';
import { soundEffects, speakText } from '../utils/audio';
import { getTranslation } from '../utils/i18n';
import { useAuth } from '../context/AuthContext';
import { CloudCheck } from 'lucide-react';

interface RoutineViewProps {
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  isAudioMuted: boolean;
  language: Language;
}

export const RoutineView: React.FC<RoutineViewProps> = ({
  textSize,
  contrastTheme,
  isAudioMuted,
  language,
}) => {
  const { routines, toggleRoutineCompleted, addCustomRoutine, currentUser } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('All');
  const [isAddingReminder, setIsAddingReminder] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('03:00 PM');
  const [newCategory, setNewCategory] = useState<RoutineItem['category']>('medication');

  const isHighContrast = contrastTheme === 'high-contrast';
  const t = getTranslation(language);

  const toggleComplete = (id: string) => {
    soundEffects.playSoftTap();
    const item = routines.find(r => r.id === id);
    if (item && !item.completed) {
      soundEffects.playGentleChime();
      if (!isAudioMuted) {
        const praise = language === 'as' ? `সম্পন্ন কৰা হ'ল: ${item.title}। বৰ ভাল কাম!` : language === 'bn' ? `সম্পন্ন হলো: ${item.title}। চমৎকার কাজ!` : language === 'hi' ? `पूरा हुआ: ${item.title}। बहुत बढ़िया!` : `Marked completed: ${item.title}. Great job!`;
        speakText(praise, language);
      }
    }
    toggleRoutineCompleted(id);
  };

  const handleReadItem = (item: RoutineItem) => {
    const statusText = item.completed
      ? (language === 'as' ? 'ইতিমধ্যে সম্পন্ন হ\'ল।' : language === 'bn' ? 'ইতিমধ্যে সম্পন্ন হয়েছে।' : language === 'hi' ? 'पहले ही पूरा हो चुका है।' : 'Already completed.')
      : (language === 'as' ? 'এতিয়াও বাকী আছে।' : language === 'bn' ? 'এখনও বাকি আছে।' : language === 'hi' ? 'अभी बाकी है।' : 'Not completed yet.');

    const announcement = `${item.time}: ${item.title}. ${item.description}. ${statusText}`;
    speakText(announcement, language);
  };

  const handleReadAllRoutines = () => {
    const pending = routines.filter((r) => !r.completed);
    if (pending.length === 0) {
      const allDone = language === 'as' ? 'বৰ আনন্দৰ কথা! আপোনাৰ আজিৰ সকলো নিয়ম আৰু ঔষধ সম্পন্ন হ\'ল।' : language === 'bn' ? 'দারুণ খবর! আপনার আজকের সব নিয়ম ও ওষুধ সম্পন্ন হয়েছে।' : language === 'hi' ? 'बहुत सुखद बात! आपकी आज की दिनचर्या व दवाइयां पूरी हो चुकी हैं।' : 'Wonderful news! You have completed all your daily routine tasks for today.';
      speakText(allDone, language);
    } else {
      const msg = language === 'as' ? `আপোনাৰ আজি ${pending.length} টা কাম বাকী আছে। পৰৱৰ্তী: ${pending[0].title}, সময়: ${pending[0].time}।` : language === 'bn' ? `আপনার আজ ${pending.length}টি কাজ বাকি আছে। পরবর্তী: ${pending[0].title}, সময়: ${pending[0].time}।` : language === 'hi' ? `आपके आज ${pending.length} कार्य शेष हैं। अगला: ${pending[0].title}, समय: ${pending[0].time}।` : `You have ${pending.length} pending items today. Next is ${pending[0].title} at ${pending[0].time}.`;
      speakText(msg, language);
    }
  };

  const handleAddReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundEffects.playGentleChime();
    await addCustomRoutine({
      time: newTime,
      period: 'Afternoon',
      title: newTitle,
      description: 'Custom reminder set for your care.',
      category: newCategory,
      pillColor: newCategory === 'medication' ? 'bg-emerald-600 text-white' : undefined,
    });

    setNewTitle('');
    setIsAddingReminder(false);
    if (!isAudioMuted) {
      speakText(`${language === 'as' ? 'নতুন সোঁৱৰণী যোগ কৰা হ\'ল' : language === 'bn' ? 'নতুন স্মারক যুক্ত হলো' : language === 'hi' ? 'नया रिमाइंडर जोड़ा गया' : 'Added reminder'}: ${newTitle}`, language);
    }
  };

  const filteredRoutines = routines.filter((r) => {
    if (selectedPeriod === 'All') return true;
    return r.period === selectedPeriod;
  });

  const completedCount = routines.filter((r) => r.completed).length;

  const getCategoryIcon = (category: RoutineItem['category']) => {
    switch (category) {
      case 'medication':
        return Pill;
      case 'meal':
        return Utensils;
      case 'hydration':
        return Droplets;
      case 'exercise':
        return Footprints;
      case 'rest':
        return Moon;
      default:
        return CalendarCheck2;
    }
  };

  const periods = [
    { key: 'All', label: language === 'as' ? 'সকলো' : language === 'bn' ? 'সব' : language === 'hi' ? 'सभी' : 'All' },
    { key: 'Morning', label: t.morning },
    { key: 'Afternoon', label: t.afternoon },
    { key: 'Evening', label: t.evening },
    { key: 'Night', label: t.night },
  ];

  return (
    <div className="space-y-6">
      {/* Daily Motivation & Anchor Banner */}
      <div
        className={`p-6 sm:p-8 rounded-[28px] border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          isHighContrast
            ? 'bg-slate-900 border-amber-400 text-white'
            : 'bg-[#E8F8EE] border-[#1F7D47]/30 text-slate-900 shadow-[0_10px_30px_-5px_rgba(31,125,71,0.1)]'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs uppercase font-black tracking-wider px-3 py-1 rounded-full border ${
                isHighContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-white text-[#1F7D47] border-[#1F7D47]/30'
              }`}
            >
              {language === 'as' ? 'আজিৰ সহজ সূচী' : language === 'bn' ? 'আজকের শান্ত সূচি' : language === 'hi' ? 'आज की सहज दिनचर्या' : "Today's Gentle Schedule"}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                isHighContrast
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                  : 'bg-white/80 text-[#1F7D47] border-[#1F7D47]/20'
              }`}
            >
              {completedCount} / {routines.length} {language === 'as' ? 'সম্পন্ন' : language === 'bn' ? 'সম্পন্ন' : language === 'hi' ? 'पूर्ण' : 'completed'}
            </span>
          </div>

          <h2
            className={`font-black tracking-tight ${
              isHighContrast ? 'text-white' : 'text-[#1F7D47]'
            } ${textSize === 'extra-large' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}
            style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
          >
            {t.routineTitle}
          </h2>

          <p
            className={`font-medium ${
              isHighContrast ? 'text-slate-300' : 'text-[#1F7D47]/90'
            } ${textSize === 'extra-large' ? 'text-xl' : 'text-lg'}`}
          >
            {t.routineSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReadAllRoutines}
            className={`px-5 py-3 rounded-2xl font-bold flex items-center gap-2 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-950 border-slate-700 text-amber-300'
                : 'bg-white border-[#1F7D47]/30 text-[#1F7D47] hover:bg-emerald-50'
            }`}
          >
            <Volume2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="text-base font-black">{t.readRoutineButton}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingReminder(!isAddingReminder)}
            className={`px-5 py-3 rounded-2xl font-black flex items-center gap-2 border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md ${
              isHighContrast
                ? 'bg-amber-400 border-white text-slate-950'
                : 'bg-[#1F7D47] hover:bg-[#186438] border-[#1F7D47] text-white'
            }`}
          >
            <Plus className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="text-base">{t.addReminderButton}</span>
          </button>
        </div>
      </div>

      {/* Add Reminder Panel */}
      {isAddingReminder && (
        <form
          onSubmit={handleAddReminderSubmit}
          className={`p-6 rounded-3xl border-3 space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
            isHighContrast
              ? 'bg-slate-900 border-amber-400 text-white'
              : 'bg-amber-50/90 border-amber-300 text-slate-900'
          }`}
        >
          <h3 className="text-xl font-black">{t.addReminderButton}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">
                {language === 'as' ? 'মনত পেলাবলগীয়া কাম' : language === 'bn' ? 'কী মনে রাখতে চান' : language === 'hi' ? 'क्या याद रखना है' : 'What would you like to remember?'}
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={language === 'as' ? 'যেনে: পানী খোৱা বা খোজ কঢ়া' : language === 'bn' ? 'যেমন: জল খাওয়া বা হাঁটা' : language === 'hi' ? 'जैसे: पानी पीना या सैर' : 'e.g., Evening walk in the courtyard'}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-400 bg-white text-slate-900 text-base font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">
                {language === 'as' ? 'সময়' : language === 'bn' ? 'সময়' : language === 'hi' ? 'समय' : 'Time'}
              </label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-400 bg-white text-slate-900 text-base font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">
                {language === 'as' ? 'বিভাগ' : language === 'bn' ? 'বিভাগ' : language === 'hi' ? 'श्रेणी' : 'Category'}
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-400 bg-white text-slate-900 text-base font-bold"
              >
                <option value="medication">{t.medication}</option>
                <option value="meal">{t.meal}</option>
                <option value="hydration">{t.hydration}</option>
                <option value="exercise">{t.exercise}</option>
                <option value="rest">{t.rest}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 text-white border-2 border-emerald-500 cursor-pointer"
            >
              {language === 'as' ? 'সংৰক্ষণ কৰক' : language === 'bn' ? 'সংরক্ষণ করুন' : language === 'hi' ? 'सहेजें' : 'Save Reminder'}
            </button>
            <button
              type="button"
              onClick={() => setIsAddingReminder(false)}
              className="px-5 py-2.5 rounded-xl font-bold bg-slate-200 text-slate-800 border cursor-pointer"
            >
              {language === 'as' ? 'বাতিল' : language === 'bn' ? 'বাতিল' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs by Day Period */}
      <div className="flex flex-wrap items-center gap-2">
        {periods.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => {
              soundEffects.playSoftTap();
              setSelectedPeriod(p.key);
            }}
            className={`px-4 py-2 rounded-full text-sm sm:text-base font-bold border transition-all cursor-pointer ${
              selectedPeriod === p.key
                ? isHighContrast
                  ? 'bg-amber-400 border-white text-slate-950 font-black'
                  : 'bg-[#1F7D47] border-[#1F7D47] text-white shadow-xs'
                : isHighContrast
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-amber-400'
                : 'bg-white/80 border-emerald-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Routine Cards List */}
      <div className="space-y-4">
        {filteredRoutines.map((item) => {
          const CategoryIcon = getCategoryIcon(item.category);
          return (
            <div
              key={item.id}
              className={`p-5 sm:p-6 rounded-[24px] border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                item.completed
                  ? isHighContrast
                    ? 'bg-slate-950 border-emerald-500/80 text-emerald-200'
                    : 'bg-[#E8F8EE]/60 border-[#1F7D47]/30 text-slate-800'
                  : isHighContrast
                  ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-white'
                  : 'bg-white hover:bg-[#E8F8EE]/30 border-emerald-200/80 hover:border-[#1F7D47] text-slate-900 shadow-[0_4px_16px_-2px_rgba(31,125,71,0.06)]'
              }`}
            >
              {/* Left Item Details */}
              <div className="flex items-start gap-4">
                {/* Complete Toggle Checkbox Button */}
                <button
                  type="button"
                  onClick={() => toggleComplete(item.id)}
                  className={`mt-1 w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                    item.completed
                      ? 'bg-[#1F7D47] border-[#1F7D47] text-white'
                      : isHighContrast
                      ? 'border-amber-400 text-slate-400 bg-slate-950'
                      : 'border-emerald-300 text-emerald-600 bg-emerald-50/50'
                  }`}
                  aria-label={`Mark ${item.title} as ${item.completed ? 'incomplete' : 'complete'}`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <Circle className="w-6 h-6" aria-hidden="true" />
                  )}
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-black px-3 py-0.5 rounded-full uppercase tracking-wide border ${
                        item.completed
                          ? 'bg-[#E8F8EE] text-[#1F7D47] border-[#1F7D47]/30'
                          : isHighContrast
                          ? 'bg-slate-950 text-amber-300 border-slate-700'
                          : 'bg-[#E8F8EE] text-[#1F7D47] border-[#1F7D47]/30'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      {item.time} ({item.period})
                    </span>

                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#1F7D47] border border-emerald-200">
                      {item.category}
                    </span>
                  </div>

                  <h3
                    className={`font-black mt-1.5 ${
                      item.completed ? 'line-through opacity-70 text-slate-500' : 'text-slate-900'
                    } ${textSize === 'extra-large' ? 'text-2xl' : 'text-xl'}`}
                    style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`font-medium text-sm sm:text-base mt-0.5 ${
                      isHighContrast ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Right Action: Read Aloud */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleReadItem(item)}
                  className={`p-3 rounded-2xl border transition-transform hover:scale-110 cursor-pointer ${
                    isHighContrast
                      ? 'bg-slate-950 border-slate-700 text-amber-300 hover:bg-slate-800'
                      : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-[#1F7D47]'
                  }`}
                  title="Read item aloud"
                  aria-label={`Read ${item.title} aloud`}
                >
                  <Volume2 className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
