import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Volume2, 
  CheckCircle2, 
  Sparkles,
  Circle,
  Square,
  Star,
  Diamond,
  Heart,
  Triangle,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TextSize, ContrastTheme, Language, GameDifficulty } from '../../types';
import { soundEffects, speakText } from '../../utils/audio';
import { getTranslation } from '../../utils/i18n';
import { GameLogo } from './GameLogo';

interface ColorShapeGameProps {
  onBack: () => void;
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  isAudioMuted: boolean;
  language: Language;
  initialLevel?: number;
  initialDifficulty?: GameDifficulty;
}

interface ShapeItem {
  id: string;
  name: string;
  colorName: string;
  icon: any;
  borderClass: string;
  bgClass: string;
  textClass: string;
}

export const ColorShapeGame: React.FC<ColorShapeGameProps> = ({
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

  const [difficulty, setDifficulty] = useState<GameDifficulty>(initialDifficulty);
  const [currentLevel, setCurrentLevel] = useState<number>(initialLevel || 1);

  const getTargetScore = (diff: GameDifficulty) => {
    return diff === 'easy' ? 3 : diff === 'intermediate' ? 4 : 5;
  };

  const getAllShapes = (): ShapeItem[] => [
    {
      id: 'gold-circle',
      name: language === 'as' ? 'ঘূৰণীয়া (Circle)' : language === 'bn' ? 'গোল (Circle)' : language === 'hi' ? 'गोल (Circle)' : 'Circle',
      colorName: language === 'as' ? 'সোণালী হালধীয়া' : language === 'bn' ? 'সোনালী হলুদ' : language === 'hi' ? 'सुनहरा पीला' : 'Golden Yellow',
      icon: Circle,
      borderClass: 'border-yellow-500',
      bgClass: 'bg-yellow-400',
      textClass: 'text-yellow-950',
    },
    {
      id: 'sapphire-square',
      name: language === 'as' ? 'চাৰিচুকীয়া (Square)' : language === 'bn' ? 'চারকোণা (Square)' : language === 'hi' ? 'चौकोर (Square)' : 'Square',
      colorName: language === 'as' ? 'সাগৰীয় নীলা' : language === 'bn' ? 'সমুদ্র নীল' : language === 'hi' ? 'नीलम नीला' : 'Ocean Blue',
      icon: Square,
      borderClass: 'border-blue-600',
      bgClass: 'bg-blue-500',
      textClass: 'text-white',
    },
    {
      id: 'ruby-star',
      name: language === 'as' ? 'তৰা (Star)' : language === 'bn' ? 'তারা (Star)' : language === 'hi' ? 'तारा (Star)' : 'Star',
      colorName: language === 'as' ? 'মণি ৰঙা' : language === 'bn' ? 'লাল পদ্মরাগমণি' : language === 'hi' ? 'माणिक लाल' : 'Ruby Red',
      icon: Star,
      borderClass: 'border-rose-600',
      bgClass: 'bg-rose-500',
      textClass: 'text-white',
    },
    {
      id: 'emerald-diamond',
      name: language === 'as' ? 'হীৰা (Diamond)' : language === 'bn' ? 'হীরা (Diamond)' : language === 'hi' ? 'हीरा (Diamond)' : 'Diamond',
      colorName: language === 'as' ? 'পান্না সেউজীয়া' : language === 'bn' ? 'পান্না সবুজ' : language === 'hi' ? 'पन्ना हरा' : 'Emerald Green',
      icon: Diamond,
      borderClass: 'border-emerald-600',
      bgClass: 'bg-emerald-500',
      textClass: 'text-white',
    },
    {
      id: 'coral-heart',
      name: language === 'as' ? 'হৃদয় (Heart)' : language === 'bn' ? 'হৃদয় (Heart)' : language === 'hi' ? 'दिल (Heart)' : 'Heart',
      colorName: language === 'as' ? 'গোলাপী মৰম' : language === 'bn' ? 'গোলাপী স্নিগ্ধ' : language === 'hi' ? 'गुलाबी रंग' : 'Coral Pink',
      icon: Heart,
      borderClass: 'border-pink-500',
      bgClass: 'bg-pink-400',
      textClass: 'text-white',
    },
    {
      id: 'amethyst-triangle',
      name: language === 'as' ? 'তিনিচুকীয়া (Triangle)' : language === 'bn' ? 'ত্রিকোণ (Triangle)' : language === 'hi' ? 'त्रिकोण (Triangle)' : 'Triangle',
      colorName: language === 'as' ? 'বেগুনীয়া' : language === 'bn' ? 'উজ্জ্বল বেগুনি' : language === 'hi' ? 'बैंगनी रंग' : 'Amethyst Purple',
      icon: Triangle,
      borderClass: 'border-purple-600',
      bgClass: 'bg-purple-500',
      textClass: 'text-white',
    },
  ];

  const getShapesForDifficulty = (diff: GameDifficulty) => {
    const all = getAllShapes();
    const count = diff === 'easy' ? 3 : diff === 'intermediate' ? 4 : 6;
    return all.slice(0, count);
  };

  const shapes = getShapesForDifficulty(difficulty);

  const [targetIdx, setTargetIdx] = useState<number>(0);
  const targetShape = shapes[targetIdx] || shapes[0];
  const [score, setScore] = useState<number>(0);
  const [isHintActive, setIsHintActive] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>(
    `${t.colorInstruction}: ${targetShape?.colorName} ${targetShape?.name}`
  );
  const [isLevelCompleted, setIsLevelCompleted] = useState<boolean>(false);

  const targetScore = getTargetScore(difficulty);

  const startNextRound = (currentActiveShapes = shapes) => {
    const nextIdx = Math.floor(Math.random() * currentActiveShapes.length);
    setTargetIdx(nextIdx);
    setIsHintActive(false);
    const nextShape = currentActiveShapes[nextIdx] || currentActiveShapes[0];
    const prompt = `${t.colorInstruction}: ${nextShape.colorName} ${nextShape.name}`;
    setFeedback(prompt);
    if (!isAudioMuted) {
      speakText(prompt, language);
    }
  };

  const handleSelectDifficulty = (diff: GameDifficulty) => {
    soundEffects.playGentleChime();
    setDifficulty(diff);
    setScore(0);
    setIsLevelCompleted(false);
    const diffShapes = getShapesForDifficulty(diff);
    startNextRound(diffShapes);
  };

  const handleNextLevel = () => {
    soundEffects.playGentleChime();
    setCurrentLevel((prev) => prev + 1);
    setScore(0);
    setIsLevelCompleted(false);
    startNextRound(shapes);
  };

  const handleRestartGame = () => {
    soundEffects.playGentleChime();
    setScore(0);
    setIsLevelCompleted(false);
    startNextRound(shapes);
  };

  useEffect(() => {
    const diffShapes = getShapesForDifficulty(difficulty);
    startNextRound(diffShapes);
  }, [language, difficulty]);

  const handleShapeSelect = (shape: ShapeItem) => {
    if (shape.id === targetShape.id) {
      soundEffects.playGentleChime();
      const nextScore = score + 1;
      setScore(nextScore);

      const praise = language === 'as' ? `বৰ ধুনীয়া! সেইটো ${shape.colorName} ${shape.name} হয়!` : language === 'bn' ? `দারুণ! ওটি সত্যি ${shape.colorName} ${shape.name}!` : language === 'hi' ? `बहुत खूब! वह ${shape.colorName} ${shape.name} ही था!` : `Great eye! That is the ${shape.colorName} ${shape.name}!`;
      setFeedback(praise);
      confetti({ particleCount: 60, spread: 50 });

      if (nextScore >= targetScore) {
        setIsLevelCompleted(true);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } else {
        setTimeout(() => {
          startNextRound();
        }, 1600);
      }

      if (!isAudioMuted) {
        speakText(praise, language);
      }
    } else {
      soundEffects.playSoftTap();
      const encouragement = language === 'as' ? `সেইটো ${shape.colorName} ${shape.name} আছিল। আকৌ চেষ্টা কৰক!` : language === 'bn' ? `ওটি ${shape.colorName} ${shape.name} ছিল। আরেকবার চেষ্টা করুন!` : language === 'hi' ? `वह ${shape.colorName} ${shape.name} था। दोबारा कोशिश करें!` : `That is the ${shape.colorName} ${shape.name}. Look for the ${targetShape.colorName} ${targetShape.name}.`;
      setFeedback(encouragement);
      if (!isAudioMuted) {
        speakText(encouragement, language);
      }
    }
  };

  const handleGiveHint = () => {
    soundEffects.playGentleChime();
    setIsHintActive(true);
    const hintMsg = language === 'as' ? `সংকেত: মনোযোগেৰে চাওক, আনবোৰ ধূসৰ কৰা হৈছে!` : language === 'bn' ? `সংকেত: লক্ষ্য করুন, অন্যগুলো হালকা করা হয়েছে!` : language === 'hi' ? `संकेत: ध्यान से देखें, अन्य आकृतियों को धुंधला किया गया है!` : `Hint: Focus on the glowing shape!`;
    setFeedback(hintMsg);
  };

  const TargetIcon = targetShape.icon;

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
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

        {/* Game Logo */}
        <GameLogo gameId="color-shape" size="md" contrastTheme={contrastTheme} showText />

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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

          <button
            type="button"
            onClick={handleRestartGame}
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

      {/* Level Selection & Progress Bar */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isHighContrast
            ? 'bg-slate-900 border-amber-400/80 text-white'
            : 'bg-amber-50/80 border-amber-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
            {currentLevel}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {t.level} {currentLevel} • {score} / {targetScore} {language === 'as' ? 'সঠিক' : language === 'bn' ? 'সঠিক' : language === 'hi' ? 'सही' : 'Solved'}
              </span>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" aria-hidden="true" />
                <span>{t.infiniteLevels} (∞)</span>
              </span>
            </div>
            <span className="font-extrabold text-base sm:text-lg">
              {difficulty === 'easy'
                ? `${t.easy} • 3 Shapes (${t.levelGentle})`
                : difficulty === 'hard'
                ? `${t.hard} • 6 Shapes (${t.levelAdvanced})`
                : `${t.intermediate} • 4 Shapes (${t.levelStandard})`}
            </span>
          </div>
        </div>

        {/* Difficulty Selection Buttons: Easy, Hard, Intermediate */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {([
            { key: 'easy' as const, label: t.easy, shapes: '3 Shapes', stars: '★☆☆' },
            { key: 'hard' as const, label: t.hard, shapes: '6 Shapes', stars: '★★☆' },
            { key: 'intermediate' as const, label: t.intermediate, shapes: '4 Shapes', stars: '★★★' },
          ]).map(({ key, label, shapes: shapeCount, stars }) => {
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
                <span className="text-xs opacity-80 font-normal hidden md:inline">({shapeCount})</span>
                <span className="text-xs text-amber-300 dark:text-amber-400 hidden sm:inline">{stars}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Clue Stage */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-4 text-center space-y-4 shadow-md ${
          isHighContrast
            ? 'bg-slate-900 border-amber-400 text-white'
            : 'bg-gradient-to-b from-amber-50 via-white to-orange-50 border-amber-300 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              isHighContrast ? 'bg-amber-950 text-amber-300 border-amber-400' : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            {t.colorGameTagline}
          </span>

          <div className="flex items-center gap-2 font-black text-amber-600">
            <Sparkles className="w-5 h-5" />
            <span>
              {language === 'as' ? `স্কোৰ: ${score}` : language === 'bn' ? `স্কোর: ${score}` : language === 'hi' ? `स्कोर: ${score}` : `Score: ${score}`}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${targetShape.bgClass} ${targetShape.borderClass} ${targetShape.textClass}`}
          >
            <TargetIcon className="w-14 h-14 sm:w-16 sm:h-16" aria-hidden="true" />
          </div>

          <h3
            className={`font-black ${
              textSize === 'extra-large' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            {feedback}
          </h3>
        </div>
      </div>

      {/* Shape Choices Grid */}
      <div
        className={`grid gap-4 sm:gap-6 ${
          currentLevel === 1
            ? 'grid-cols-1 sm:grid-cols-3 max-w-3xl mx-auto'
            : currentLevel === 2
            ? 'grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {shapes.map((shape) => {
          const ShapeIcon = shape.icon;
          const isTarget = shape.id === targetShape.id;
          const isDimmed = isHintActive && !isTarget;

          return (
            <button
              key={shape.id}
              type="button"
              onClick={() => handleShapeSelect(shape)}
              className={`p-6 sm:p-8 rounded-3xl border-4 flex flex-col items-center justify-center gap-4 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md select-none ${
                isDimmed
                  ? 'opacity-30 grayscale scale-95 border-slate-300'
                  : isTarget && isHintActive
                  ? 'ring-8 ring-amber-400 scale-105 animate-pulse'
                  : ''
              } ${
                isHighContrast
                  ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-white'
                  : 'bg-white border-amber-200 hover:border-amber-500 text-slate-900'
              }`}
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-3 flex items-center justify-center shadow-md ${shape.bgClass} ${shape.borderClass} ${shape.textClass}`}
              >
                <ShapeIcon className="w-12 h-12 sm:w-14 sm:h-14" aria-hidden="true" />
              </div>

              <div className="text-center">
                <span className="block font-black text-xl">{shape.name}</span>
                <span className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {shape.colorName}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Level Completion Modal */}
      {isLevelCompleted && (
        <div
          className={`p-8 rounded-3xl border-4 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 ${
            isHighContrast
              ? 'bg-slate-900 border-amber-400 text-white'
              : 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-400 text-slate-900'
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

          <h3 className="text-3xl font-black text-amber-700 dark:text-amber-300">
            {t.allLevelsCompleted} ({t.level} {currentLevel})
          </h3>
          <p className="text-lg font-medium max-w-xl mx-auto">
            {t.completedGameMessage}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleNextLevel}
              className="px-8 py-3.5 rounded-2xl font-black bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{t.nextLevel} ({t.level} {currentLevel + 1})</span>
              <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={handleRestartGame}
              className="px-7 py-3.5 rounded-2xl font-black bg-amber-600 hover:bg-amber-700 text-white text-lg shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {t.playAgain}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3.5 rounded-2xl font-bold bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-100 text-lg shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {t.backToGames}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
