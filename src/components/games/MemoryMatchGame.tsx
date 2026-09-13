import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Flower2, 
  Music, 
  Bird, 
  Sun, 
  Apple, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  ArrowLeft,
  Lightbulb,
  Eye,
  Star,
  Leaf,
  Bell,
  Heart,
  Smile
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TextSize, ContrastTheme, Language, GameDifficulty } from '../../types';
import { soundEffects, speakText } from '../../utils/audio';
import { getTranslation } from '../../utils/i18n';
import { GameLogo } from './GameLogo';

interface MemoryMatchGameProps {
  onBack: () => void;
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  isAudioMuted: boolean;
  language: Language;
  initialLevel?: number;
  initialDifficulty?: GameDifficulty;
}

interface CardItem {
  id: number;
  matchId: string;
  name: string;
  icon: any;
  colorClass: string;
  isFlipped: boolean;
  isMatched: boolean;
  isHinted?: boolean;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  onBack,
  textSize,
  contrastTheme,
  isAudioMuted,
  language,
  initialLevel = 1,
  initialDifficulty = 'easy',
}) => {
  const isHighContrast = contrastTheme === 'high-contrast';
  const t = getTranslation(language);

  // Difficulty & Infinite Level State
  const [difficulty, setDifficulty] = useState<GameDifficulty>(initialDifficulty);
  const [currentLevel, setCurrentLevel] = useState<number>(initialLevel || 1);

  // Localized card definitions pool (12 comforting cultural & nature symbols)
  const getCardDefinitions = () => [
    {
      matchId: 'chai',
      name: language === 'as' ? 'গৰম চাহ' : language === 'bn' ? 'গরম চা' : language === 'hi' ? 'गरम चाय' : 'Warm Chai',
      icon: Coffee,
      colorClass: 'bg-amber-100 text-amber-900 border-amber-400',
    },
    {
      matchId: 'flower',
      name: language === 'as' ? 'গেন্দা ফুল' : language === 'bn' ? 'গাঁদা ফুল' : language === 'hi' ? 'गेंदा फूल' : 'Marigold Flower',
      icon: Flower2,
      colorClass: 'bg-orange-100 text-orange-900 border-orange-400',
    },
    {
      matchId: 'flute',
      name: language === 'as' ? 'বাঁহী' : language === 'bn' ? 'বাঁশি' : language === 'hi' ? 'बांसुरी' : 'Bamboo Flute',
      icon: Music,
      colorClass: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    },
    {
      matchId: 'bird',
      name: language === 'as' ? 'চৰাই' : language === 'bn' ? 'পাখি' : language === 'hi' ? 'चिड़िया' : 'Songbird',
      icon: Bird,
      colorClass: 'bg-sky-100 text-sky-900 border-sky-400',
    },
    {
      matchId: 'sun',
      name: language === 'as' ? 'সোণালী সূৰ্য্য' : language === 'bn' ? 'সোনালী সূর্য' : language === 'hi' ? 'सुनहरा सूरज' : 'Golden Sun',
      icon: Sun,
      colorClass: 'bg-yellow-100 text-yellow-950 border-yellow-400',
    },
    {
      matchId: 'fruit',
      name: language === 'as' ? 'মিঠা ফল' : language === 'bn' ? 'মিষ্টি ফল' : language === 'hi' ? 'ताज़ा फल' : 'Fresh Fruit',
      icon: Apple,
      colorClass: 'bg-rose-100 text-rose-900 border-rose-400',
    },
    {
      matchId: 'leaf',
      name: language === 'as' ? 'তুলসী পাত' : language === 'bn' ? 'তুলসী পাতা' : language === 'hi' ? 'तुलसी पत्ता' : 'Tulsi Leaf',
      icon: Leaf,
      colorClass: 'bg-teal-100 text-teal-900 border-teal-400',
    },
    {
      matchId: 'bell',
      name: language === 'as' ? 'মন্দিৰৰ ঘণ্টা' : language === 'bn' ? 'মন্দিরের ঘণ্টা' : language === 'hi' ? 'मंदिर की घंटी' : 'Temple Bell',
      icon: Bell,
      colorClass: 'bg-indigo-100 text-indigo-900 border-indigo-400',
    },
    {
      matchId: 'heart',
      name: language === 'as' ? 'স্নেহময় হৃদয়' : language === 'bn' ? 'স্নেহময় হৃদয়' : language === 'hi' ? 'स्नेहिल दिल' : 'Loving Heart',
      icon: Heart,
      colorClass: 'bg-pink-100 text-pink-900 border-pink-400',
    },
    {
      matchId: 'star',
      name: language === 'as' ? 'উজ্জ্বল তৰা' : language === 'bn' ? 'উজ্জ্বল তারা' : language === 'hi' ? 'चमकता तारा' : 'Shining Star',
      icon: Star,
      colorClass: 'bg-amber-200 text-amber-950 border-amber-500',
    },
    {
      matchId: 'sparkle',
      name: language === 'as' ? 'সোণালী জ্যোতি' : language === 'bn' ? 'সোনালী প্রদীপ' : language === 'hi' ? 'दीपक ज्योति' : 'Golden Light',
      icon: Sparkles,
      colorClass: 'bg-purple-100 text-purple-900 border-purple-400',
    },
    {
      matchId: 'smile',
      name: language === 'as' ? 'মিঠা হাঁহি' : language === 'bn' ? 'মিষ্টি হাসি' : language === 'hi' ? 'मधुर मुस्कान' : 'Gentle Smile',
      icon: Smile,
      colorClass: 'bg-cyan-100 text-cyan-900 border-cyan-400',
    },
  ];

  const getPairsForDifficulty = (diff: GameDifficulty) => {
    if (diff === 'easy') return 3;
    if (diff === 'intermediate') return 4;
    return 6;
  };

  const pairCount = getPairsForDifficulty(difficulty);

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isPeeking, setIsPeeking] = useState<boolean>(false);
  const [encouragementText, setEncouragementText] = useState<string>('');

  const setupGame = (diff = difficulty, lvlNum = currentLevel) => {
    const pairsToUse = getPairsForDifficulty(diff);
    // Shuffle the definitions pool to pick random pairs for infinite variability
    const allDefs = [...getCardDefinitions()].sort(() => Math.random() - 0.5);
    const defs = allDefs.slice(0, pairsToUse);
    const deck: CardItem[] = [];

    defs.forEach((def, index) => {
      deck.push({
        id: index * 2,
        matchId: def.matchId,
        name: def.name,
        icon: def.icon,
        colorClass: def.colorClass,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: index * 2 + 1,
        matchId: def.matchId,
        name: def.name,
        icon: def.icon,
        colorClass: def.colorClass,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Gentle shuffle
    deck.sort(() => Math.random() - 0.5);

    setCards(deck);
    setSelectedCards([]);
    setMatchedPairs(0);
    setIsCompleted(false);
    setIsPeeking(false);
    setEncouragementText(t.memoryInstruction);

    if (!isAudioMuted) {
      speakText(`${t.memoryGameTitle}. ${t.level} ${lvlNum}. ${t.memoryInstruction}`, language);
    }
  };

  useEffect(() => {
    setupGame(difficulty, currentLevel);
  }, [language, difficulty, currentLevel]);

  const handleSelectDifficulty = (diff: GameDifficulty) => {
    soundEffects.playGentleChime();
    setDifficulty(diff);
    setIsCompleted(false);
  };

  const handleNextLevel = () => {
    soundEffects.playGentleChime();
    setCurrentLevel((prev) => prev + 1);
    setIsCompleted(false);
  };

  // Interactive Hint: Reveal one unmatched pair gently
  const handleGiveHint = () => {
    soundEffects.playGentleChime();
    // Find first unmatched card
    const unmatched = cards.filter((c) => !c.isMatched);
    if (unmatched.length < 2) return;

    const targetMatchId = unmatched[0].matchId;
    const hintedCards = cards.map((c) => {
      if (c.matchId === targetMatchId && !c.isMatched) {
        return { ...c, isHinted: true, isFlipped: true };
      }
      return c;
    });

    setCards(hintedCards);
    const hintMsg = language === 'as' ? 'ইঙ্গিত: এই দুখন কাৰ্ড একে!' : language === 'bn' ? 'ইঙ্গিত: এই দুটি কার্ড এক!' : language === 'hi' ? 'संकेत: ये दोनों कार्ड एक जैसे हैं!' : 'Hint: These two cards are a match!';
    setEncouragementText(hintMsg);

    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => (c.isHinted ? { ...c, isHinted: false, isFlipped: c.isMatched } : c))
      );
    }, 2400);
  };

  // Interactive Quick Peek: Shows all cards for 2 seconds to relieve anxiety
  const handleQuickPeek = () => {
    soundEffects.playSoftTap();
    setIsPeeking(true);
    setCards((prev) => prev.map((c) => ({ ...c, isFlipped: true })));

    setTimeout(() => {
      setCards((prev) => prev.map((c) => ({ ...c, isFlipped: c.isMatched })));
      setIsPeeking(false);
    }, 2000);
  };

  const handleCardClick = (cardIndex: number) => {
    if (isPeeking) return;
    const card = cards[cardIndex];

    // Ignore if already flipped, matched, or if 2 cards already open
    if (card.isFlipped || card.isMatched || selectedCards.length >= 2) {
      return;
    }

    soundEffects.playSoftTap();

    const newSelected = [...selectedCards, cardIndex];
    const newCards = [...cards];
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);
    setSelectedCards(newSelected);

    if (newSelected.length === 1) {
      const msg = language === 'as' ? `আপুনি "${card.name}" খুলিলে। এতিয়া দ্বিতীয়খন বিচাৰক।` : language === 'bn' ? `আপনি "${card.name}" খুললেন। এবার মিলটি খুঁজুন।` : language === 'hi' ? `आपने "${card.name}" खोला। अब दूसरा ढूंढें।` : `You found ${card.name}. Now find its match.`;
      setEncouragementText(msg);
    } else if (newSelected.length === 2) {
      const [firstIdx, secondIdx] = newSelected;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.matchId === secondCard.matchId) {
        // MATCH!
        soundEffects.playGentleChime();
        newCards[firstIdx].isMatched = true;
        newCards[secondIdx].isMatched = true;
        setCards(newCards);
        setSelectedCards([]);

        const nextMatchedCount = matchedPairs + 1;
        setMatchedPairs(nextMatchedCount);

        const praise = language === 'as' ? `বৰ সুন্দৰ! "${firstCard.name}"ৰ জোৰা মিলিল!` : language === 'bn' ? `দারুণ! "${firstCard.name}"-এর জোড়া মিলল!` : language === 'hi' ? `बहुत बढ़िया! "${firstCard.name}" का जोड़ा मिल गया!` : `Wonderful! You matched ${firstCard.name}!`;
        setEncouragementText(praise);
        if (!isAudioMuted) {
          speakText(praise, language);
        }

        if (nextMatchedCount >= pairCount) {
          setIsCompleted(true);
          const finishText = t.wellDone;
          setEncouragementText(finishText);
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
          if (!isAudioMuted) {
            speakText(finishText, language);
          }
        }
      } else {
        // No match - gentle flip back
        const notMatch = language === 'as' ? `এইখন ${secondCard.name}। শান্ত হওক, লাহেকৈ ঘূৰি যাব।` : language === 'bn' ? `এটি ${secondCard.name}। আস্তে আস্তে কার্ডটি ঘুরে যাবে।` : language === 'hi' ? `यह ${secondCard.name} है। धीरे से पलट जाएगा।` : `That is ${secondCard.name}. They will turn back gently.`;
        setEncouragementText(notMatch);
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setSelectedCards([]);
          setEncouragementText(t.memoryInstruction);
        }, 1500);
      }
    }
  };

  const handleReadInstructions = () => {
    speakText(`${t.memoryGameTitle}. ${t.memoryInstruction}`, language);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Back, Logo & Interactive Tools */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className={`px-5 py-3 rounded-2xl font-bold flex items-center gap-2 border-3 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            isHighContrast
              ? 'bg-slate-900 border-amber-400 text-amber-300 hover:bg-slate-800'
              : 'bg-white border-amber-300 text-slate-800 hover:bg-amber-50 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-6 h-6 shrink-0" aria-hidden="true" />
          <span className="text-lg">{t.backToGames}</span>
        </button>

        {/* Game Visual Logo Branding */}
        <GameLogo gameId="memory-cards" size="md" contrastTheme={contrastTheme} showText />

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Hint Button */}
          <button
            type="button"
            onClick={handleGiveHint}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-900 border-amber-400 text-amber-300'
                : 'bg-amber-100 border-amber-400 text-amber-950'
            }`}
          >
            <Lightbulb className="w-5 h-5 shrink-0 text-amber-600" aria-hidden="true" />
            <span className="text-sm font-extrabold">{t.needHint}</span>
          </button>

          {/* Quick Peek Button */}
          <button
            type="button"
            onClick={handleQuickPeek}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-900 border-slate-700 text-slate-200'
                : 'bg-white border-amber-300 text-slate-800'
            }`}
          >
            <Eye className="w-5 h-5 shrink-0 text-sky-600" aria-hidden="true" />
            <span className="text-sm font-extrabold">{t.revealCardsPeek}</span>
          </button>

          {/* Restart Button */}
          <button
            type="button"
            onClick={() => setupGame(difficulty, currentLevel)}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-amber-400 border-white text-slate-950 font-black'
                : 'bg-amber-600 border-amber-500 text-white shadow-sm'
            }`}
          >
            <RotateCcw className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="text-sm font-extrabold">{t.restartGame}</span>
          </button>
        </div>
      </div>

      {/* Level & Difficulty Bar */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isHighContrast
            ? 'bg-slate-900 border-amber-400/80 text-white'
            : 'bg-amber-50/80 border-amber-200/80 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
            {currentLevel}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {t.level} {currentLevel}
              </span>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-200/50 dark:bg-amber-900/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" aria-hidden="true" />
                <span>{t.infiniteLevels} (∞)</span>
              </span>
            </div>
            <span className="font-extrabold text-base sm:text-lg">
              {difficulty === 'easy'
                ? `${t.easy} • 3 ${t.memoryPairsFound} (${t.levelGentle})`
                : difficulty === 'hard'
                ? `${t.hard} • 6 ${t.memoryPairsFound} (${t.levelAdvanced})`
                : `${t.intermediate} • 4 ${t.memoryPairsFound} (${t.levelStandard})`}
            </span>
          </div>
        </div>

        {/* Difficulty Selection Buttons: Easy, Hard, Intermediate */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {([
            { key: 'easy' as const, label: t.easy, sub: t.levelGentle, stars: '★☆☆', pairs: '3 Pairs' },
            { key: 'hard' as const, label: t.hard, sub: t.levelAdvanced, stars: '★★☆', pairs: '6 Pairs' },
            { key: 'intermediate' as const, label: t.intermediate, sub: t.levelStandard, stars: '★★★', pairs: '4 Pairs' },
          ]).map(({ key, label, sub, stars, pairs }) => {
            const isSelected = difficulty === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectDifficulty(key)}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  isSelected
                    ? isHighContrast
                      ? 'bg-amber-400 border-white text-slate-950 font-black shadow-md scale-102'
                      : 'bg-amber-600 border-amber-500 text-white shadow-md scale-102'
                    : isHighContrast
                    ? 'bg-slate-950 border-slate-700 text-slate-300 hover:border-amber-400 hover:text-white'
                    : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100/60 hover:text-amber-950'
                }`}
                aria-pressed={isSelected}
              >
                <span>{label}</span>
                <span className="text-xs opacity-80 font-normal">({pairs})</span>
                <span className="text-xs text-amber-300 dark:text-amber-400 hidden sm:inline">{stars}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Encouragement & Score Banner */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border-3 flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isHighContrast
            ? 'bg-slate-900 border-amber-400 text-white'
            : 'bg-white border-amber-300 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              isCompleted
                ? 'bg-emerald-500 text-white animate-bounce'
                : isHighContrast
                ? 'bg-amber-400 text-slate-950'
                : 'bg-amber-200 text-amber-900'
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            ) : (
              <Sparkles className="w-8 h-8" aria-hidden="true" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40">
                {difficulty === 'easy' ? t.easy : difficulty === 'hard' ? t.hard : t.intermediate} • {t.level} {currentLevel}
              </span>
            </div>
            <h3
              className={`font-black mt-0.5 ${
                textSize === 'extra-large' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
              }`}
            >
              {encouragementText || t.memoryInstruction}
            </h3>
            <p
              className={`text-sm sm:text-base font-semibold mt-1 ${
                isHighContrast ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {t.memoryGameSubtitle}
            </p>
          </div>
        </div>

        {/* Pair Counter & Audio Listen */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`px-4 py-2 rounded-2xl border-2 text-center ${
              isHighContrast
                ? 'bg-slate-950 border-amber-400 text-amber-300'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider block">
              {t.memoryPairsFound}
            </span>
            <span className="text-2xl font-black">
              {matchedPairs} / {pairCount}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReadInstructions}
            className={`p-3 rounded-2xl border-2 cursor-pointer transition-transform hover:scale-110 ${
              isHighContrast
                ? 'bg-slate-950 border-slate-700 text-amber-300'
                : 'bg-amber-100 border-amber-300 text-amber-900'
            }`}
            title="Read Instructions"
            aria-label="Read Instructions Aloud"
          >
            <Volume2 className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        id="memory-cards-board"
        className={`grid gap-4 sm:gap-6 ${
          pairCount === 3
            ? 'grid-cols-2 sm:grid-cols-3 max-w-3xl mx-auto'
            : pairCount === 4
            ? 'grid-cols-2 sm:grid-cols-4 max-w-4xl mx-auto'
            : 'grid-cols-3 sm:grid-cols-4 max-w-5xl mx-auto'
        }`}
      >
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(idx)}
              disabled={card.isMatched || isPeeking}
              className={`relative aspect-square rounded-3xl border-4 p-4 sm:p-6 flex flex-col items-center justify-center transition-all duration-300 select-none cursor-pointer ${
                card.isMatched
                  ? isHighContrast
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 scale-95 opacity-90'
                    : 'bg-emerald-50 border-emerald-400 text-emerald-900 scale-95 shadow-inner'
                  : card.isHinted
                  ? 'ring-8 ring-amber-400 scale-105 animate-pulse bg-amber-100 border-amber-500'
                  : isRevealed
                  ? isHighContrast
                    ? 'bg-amber-400 border-white text-slate-950 shadow-xl scale-105'
                    : 'bg-white border-amber-500 text-slate-900 shadow-lg scale-105 ring-4 ring-amber-200'
                  : isHighContrast
                  ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-amber-400 hover:bg-slate-800'
                  : 'bg-amber-100/90 border-amber-300 hover:border-amber-500 text-amber-900 hover:bg-white hover:shadow-md'
              }`}
              aria-label={
                isRevealed
                  ? `${card.name} ${card.isMatched ? 'Matched' : 'Opened'}`
                  : `Card ${idx + 1}, hidden`
              }
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-center gap-2 animate-in zoom-in-75 duration-200">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border-2 shadow-sm ${
                      card.isMatched
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : card.colorClass
                    }`}
                  >
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12" aria-hidden="true" />
                  </div>
                  <span
                    className={`font-black text-center leading-tight tracking-tight ${
                      textSize === 'extra-large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                    }`}
                  >
                    {card.name}
                  </span>
                  {card.isMatched && (
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      ✓
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-current flex items-center justify-center opacity-60">
                    <Sparkles className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-75">
                    {language === 'as' ? 'স্পৰ্শ কৰক' : language === 'bn' ? 'স্পর্শ করুন' : language === 'hi' ? 'टैप करें' : 'Tap Card'}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Modal / Star Feedback Banner */}
      {isCompleted && (
        <div
          className={`p-8 rounded-3xl border-4 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 ${
            isHighContrast
              ? 'bg-slate-900 border-emerald-400 text-white'
              : 'bg-gradient-to-b from-amber-50 to-emerald-50 border-emerald-400 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className="w-10 h-10 text-amber-400 fill-amber-400 animate-bounce"
                style={{ animationDelay: `${star * 0.15}s` }}
                aria-hidden="true"
              />
            ))}
          </div>

          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-700 dark:text-emerald-300">
            {t.allLevelsCompleted} ({t.level} {currentLevel})
          </h3>

          <p className="text-lg sm:text-xl font-medium max-w-xl mx-auto">
            {t.completedGameMessage}
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={handleNextLevel}
              className="px-8 py-4 rounded-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{t.nextLevel} ({t.level} {currentLevel + 1})</span>
              <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={() => setupGame(difficulty, currentLevel)}
              className="px-7 py-4 rounded-2xl font-black bg-emerald-600 hover:bg-emerald-700 text-white text-lg shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {t.playAgain}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-4 rounded-2xl font-bold bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-100 text-lg shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {t.backToGames}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
