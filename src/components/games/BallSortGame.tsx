import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Lightbulb, 
  Undo2, 
  Star, 
  Sparkles,
  Heart,
  Diamond,
  Leaf,
  Sun,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TextSize, ContrastTheme, Language, GameDifficulty } from '../../types';
import { soundEffects, speakText } from '../../utils/audio';
import { getTranslation } from '../../utils/i18n';
import { GameLogo } from './GameLogo';

export interface BallSortGameProps {
  onBack: () => void;
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  isAudioMuted: boolean;
  language: Language;
  initialLevel?: number;
  initialDifficulty?: GameDifficulty;
}

export type BallColor = 'red' | 'blue' | 'green' | 'amber';

interface ColorDef {
  id: BallColor;
  name: Record<Language, string>;
  bgClass: string;
  borderClass: string;
  textClass: string;
  shadowClass: string;
  icon: React.ElementType;
}

const COLOR_DEFS: Record<BallColor, ColorDef> = {
  red: {
    id: 'red',
    name: {
      en: 'Ruby Red',
      hi: 'माणिक लाल',
      bn: 'লাল পদ্মরাগমণি',
      as: 'মণি ৰঙা',
    },
    bgClass: 'bg-rose-500',
    borderClass: 'border-rose-700',
    textClass: 'text-white',
    shadowClass: 'shadow-rose-300',
    icon: Heart,
  },
  blue: {
    id: 'blue',
    name: {
      en: 'Sapphire Blue',
      hi: 'नीलम नीला',
      bn: 'নীলমণি',
      as: 'নীলা মণি',
    },
    bgClass: 'bg-blue-600',
    borderClass: 'border-blue-800',
    textClass: 'text-white',
    shadowClass: 'shadow-blue-300',
    icon: Diamond,
  },
  green: {
    id: 'green',
    name: {
      en: 'Emerald Green',
      hi: 'पन्ना हरा',
      bn: 'পান্না সবুজ',
      as: 'পান্না সেউজীয়া',
    },
    bgClass: 'bg-emerald-600',
    borderClass: 'border-emerald-800',
    textClass: 'text-white',
    shadowClass: 'shadow-emerald-300',
    icon: Leaf,
  },
  amber: {
    id: 'amber',
    name: {
      en: 'Golden Amber',
      hi: 'सुनहरा अंबर',
      bn: 'সোনালী অম্বর',
      as: 'সোণালী হালধীয়া',
    },
    bgClass: 'bg-amber-400',
    borderClass: 'border-amber-600',
    textClass: 'text-slate-950',
    shadowClass: 'shadow-amber-300',
    icon: Sun,
  },
};

// Procedural generator for guaranteed-solvable ball sort puzzles
export const generateSolvableBallSortLevel = (
  diff: GameDifficulty,
  lvlNum: number
): { capacity: number; tubes: BallColor[][] } => {
  const capacity = 3;
  let colorsToUse: BallColor[] = [];
  let emptyCount = 1;

  if (diff === 'easy') {
    // 2 colors, 3 tubes (1 empty buffer)
    colorsToUse = ['red', 'blue'];
    emptyCount = 1;
  } else if (diff === 'intermediate') {
    // 3 colors, 4 tubes (1 empty buffer)
    colorsToUse = ['red', 'blue', 'green'];
    emptyCount = 1;
  } else {
    // Hard: 4 colors, 6 tubes (2 empty buffers)
    colorsToUse = ['red', 'blue', 'green', 'amber'];
    emptyCount = 2;
  }

  // 1. Begin with the pristine solved configuration
  const state: BallColor[][] = colorsToUse.map((c) => Array(capacity).fill(c));
  for (let i = 0; i < emptyCount; i++) {
    state.push([]);
  }

  // 2. Perform valid reverse moves to guarantee solvability
  const scrambleSteps = diff === 'easy' ? 12 + (lvlNum % 4) * 2 : diff === 'intermediate' ? 20 + (lvlNum % 5) * 2 : 28 + (lvlNum % 6) * 2;
  let lastFrom = -1;
  let lastTo = -1;

  for (let step = 0; step < scrambleSteps; step++) {
    const validMoves: Array<{ from: number; to: number }> = [];

    for (let f = 0; f < state.length; f++) {
      if (state[f].length === 0) continue;
      for (let t = 0; t < state.length; t++) {
        if (f === t) continue;
        // Avoid immediate backtrack loop
        if (f === lastTo && t === lastFrom) continue;
        if (state[t].length < capacity) {
          validMoves.push({ from: f, to: t });
        }
      }
    }

    if (validMoves.length === 0) break;
    const chosen = validMoves[Math.floor(Math.random() * validMoves.length)];
    const ball = state[chosen.from].pop()!;
    state[chosen.to].push(ball);
    lastFrom = chosen.from;
    lastTo = chosen.to;
  }

  return { capacity, tubes: state };
};

export const BallSortGame: React.FC<BallSortGameProps> = ({
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
  const [tubes, setTubes] = useState<BallColor[][]>([]);
  const [history, setHistory] = useState<BallColor[][][]>([]);
  const [selectedTubeIndex, setSelectedTubeIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>(t.ballSortInstruction);
  const [isLevelCompleted, setIsLevelCompleted] = useState<boolean>(false);
  const [hintMove, setHintMove] = useState<{ from: number; to: number } | null>(null);

  const capacity = 3;

  // Check if puzzle is solved
  const checkVictory = (currentTubes: BallColor[][]) => {
    for (const tube of currentTubes) {
      if (tube.length === 0) continue;
      if (tube.length !== capacity) return false;
      const firstColor = tube[0];
      if (!tube.every((c) => c === firstColor)) return false;
    }
    return true;
  };

  const loadLevel = (diff: GameDifficulty, lvlNum: number) => {
    soundEffects.playGentleChime();
    const config = generateSolvableBallSortLevel(diff, lvlNum);
    setTubes(config.tubes.map((t) => [...t]));
    setHistory([]);
    setSelectedTubeIndex(null);
    setHintMove(null);
    setIsLevelCompleted(false);
    setFeedback(t.ballSortInstruction);
  };

  useEffect(() => {
    loadLevel(difficulty, currentLevel);
  }, [difficulty, currentLevel]);

  const handleSelectDifficulty = (diff: GameDifficulty) => {
    soundEffects.playGentleChime();
    setDifficulty(diff);
  };

  const handleNextLevel = () => {
    soundEffects.playGentleChime();
    setCurrentLevel((prev) => prev + 1);
  };

  // Handle tube selection and ball transfer
  const handleTubeClick = (tubeIndex: number) => {
    if (isLevelCompleted) return;
    setHintMove(null);

    // If no tube selected yet: attempt to pick up top ball
    if (selectedTubeIndex === null) {
      if (tubes[tubeIndex].length === 0) {
        setFeedback(
          language === 'as' ? 'এই পাত্ৰটো খালী। আন এটা পাত্ৰ বাছক।' :
          language === 'bn' ? 'এই পাত্রটি খালি। অন্য পাত্রে স্পর্শ করুন।' :
          language === 'hi' ? 'यह शीशी खाली है। दूसरी शीशी चुनें।' :
          'This vial is empty. Tap a vial with balls to pick one up.'
        );
        return;
      }
      setSelectedTubeIndex(tubeIndex);
      soundEffects.playGentleChime();
      const topColor = tubes[tubeIndex][tubes[tubeIndex].length - 1];
      const colorName = COLOR_DEFS[topColor].name[language];
      setFeedback(
        language === 'as' ? `${colorName} বল বাছি লোৱা হ'ল। এতিয়া ৰাখিবলগীয়া পাত্ৰটো বাছক।` :
        language === 'bn' ? `${colorName} বলটি তোলা হয়েছে। এবার রাখার পাত্রটি স্পর্শ করুন।` :
        language === 'hi' ? `${colorName} गेंद चुनी गई। अब दूसरी शीशी छुएं।` :
        `Picked up ${colorName} ball. Now tap where you want to drop it.`
      );
      return;
    }

    // If clicking the same tube again: put ball back down
    if (selectedTubeIndex === tubeIndex) {
      setSelectedTubeIndex(null);
      setFeedback(t.ballSortInstruction);
      return;
    }

    // Trying to transfer from selectedTubeIndex to tubeIndex
    const sourceTube = tubes[selectedTubeIndex];
    const targetTube = tubes[tubeIndex];
    const movingBall = sourceTube[sourceTube.length - 1];

    // Check if target is full
    if (targetTube.length >= capacity) {
      soundEffects.playGentleChime();
      setFeedback(
        language === 'as' ? 'এই পাত্ৰটো সম্পূৰ্ণ ভৰ্তি। আন এটা পাত্ৰ বাছক।' :
        language === 'bn' ? 'এই পাত্রটি সম্পূর্ণ ভর্তি। অন্য পাত্রে চেষ্টা করুন।' :
        language === 'hi' ? 'यह शीशी पूरी तरह भरी है। दूसरी शीशी चुनें।' :
        'That vial is full! Tap an empty or matching vial.'
      );
      return;
    }

    // Check if target has a ball and if it matches
    if (targetTube.length > 0) {
      const targetTopBall = targetTube[targetTube.length - 1];
      if (targetTopBall !== movingBall) {
        soundEffects.playGentleChime();
        setFeedback(
          language === 'as' ? 'ৰং মিলিব লাগিব! একে ৰঙৰ ওপৰত বা খালী পাত্ৰতহে বল ৰাখিব পাৰি।' :
          language === 'bn' ? 'রং এক হতে হবে! একই রঙের ওপরে বা খালি পাত্রে বল রাখা যায়।' :
          language === 'hi' ? 'रंग मेल खाना चाहिए! गेंद उसी रंग की गेंद पर या खाली शीशी में ही जा सकती है।' :
          'Colors must match! Place this ball on the same color or in an empty vial.'
        );
        return;
      }
    }

    // Valid move! Save history
    setHistory((prev) => [...prev, tubes.map((t) => [...t])]);

    // Apply move
    const newTubes = tubes.map((t, idx) => {
      if (idx === selectedTubeIndex) {
        return t.slice(0, t.length - 1);
      }
      if (idx === tubeIndex) {
        return [...t, movingBall];
      }
      return [...t];
    });

    setTubes(newTubes);
    setSelectedTubeIndex(null);
    soundEffects.playGentleChime();

    // Check if victory
    if (checkVictory(newTubes)) {
      setIsLevelCompleted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      const praise =
        language === 'as' ? 'অসাধাৰণ! আপুনি আটাইবোৰ বল সুন্দৰকৈ সজাই তুলিলে!' :
        language === 'bn' ? 'অসাধারণ! আপনি সমস্ত বল সুন্দরভাবে সাজিয়েছেন!' :
        language === 'hi' ? 'शाबाश! आपने सभी गेंदों को बिल्कुल सही छांट लिया!' :
        'Wonderful! All colors are sorted with peaceful harmony!';
      setFeedback(praise);
      if (!isAudioMuted) {
        speakText(praise, language);
      }
    } else {
      setFeedback(
        language === 'as' ? 'সুন্দৰ চাল! পৰৱৰ্তী বলটো বাছক।' :
        language === 'bn' ? 'সুন্দর চাল! পরবর্তী বলটি স্পর্শ করুন।' :
        language === 'hi' ? 'बहुत अच्छा! अगली गेंद चुनें।' :
        'Great move! Tap the next ball to sort.'
      );
    }
  };

  // Undo move
  const handleUndo = () => {
    if (history.length === 0 || isLevelCompleted) return;
    const lastState = history[history.length - 1];
    setTubes(lastState);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setSelectedTubeIndex(null);
    setHintMove(null);
    soundEffects.playGentleChime();
    setFeedback(t.undoMove);
  };

  // Provide a friendly hint
  const handleHint = () => {
    if (isLevelCompleted) return;
    soundEffects.playGentleChime();

    // Search for a valid, sensible move
    for (let from = 0; from < tubes.length; from++) {
      if (tubes[from].length === 0) continue;
      // Don't move if tube is already solved
      if (tubes[from].length === capacity && tubes[from].every((c) => c === tubes[from][0])) {
        continue;
      }
      const ball = tubes[from][tubes[from].length - 1];

      for (let to = 0; to < tubes.length; to++) {
        if (from === to) continue;
        if (tubes[to].length >= capacity) continue;

        if (tubes[to].length === 0) {
          // Move to empty tube
          setHintMove({ from, to });
          const colorName = COLOR_DEFS[ball].name[language];
          setFeedback(
            language === 'as' ? `সংকেত: ${colorName} বল পাত্ৰ #${from + 1}ৰ পৰা পাত্ৰ #${to + 1}লৈ নিয়ক।` :
            language === 'bn' ? `সংকেত: ${colorName} বলটি পাত্র #${from + 1} থেকে পাত্র #${to + 1}-এ নিন।` :
            language === 'hi' ? `संकेत: शीशी #${from + 1} से गेंद को शीशी #${to + 1} में डालें।` :
            `Hint: Move the ${colorName} ball from vial #${from + 1} into vial #${to + 1}.`
          );
          return;
        } else if (tubes[to][tubes[to].length - 1] === ball) {
          // Match top color
          setHintMove({ from, to });
          const colorName = COLOR_DEFS[ball].name[language];
          setFeedback(
            language === 'as' ? `সংকেত: ${colorName} বল পাত্ৰ #${from + 1}ৰ পৰা পাত্ৰ #${to + 1}ৰ একে ৰঙৰ ওপৰত পেলাওক।` :
            language === 'bn' ? `সংকেত: ${colorName} বলটি পাত্র #${from + 1} থেকে পাত্র #${to + 1}-এ মেলান।` :
            language === 'hi' ? `संकेत: शीशी #${from + 1} की गेंद को शीशी #${to + 1} के समान रंग पर रखें।` :
            `Hint: Match the ${colorName} ball from vial #${from + 1} with the same color in vial #${to + 1}.`
          );
          return;
        }
      }
    }

    setFeedback(
      language === 'as' ? 'আপুনি যিকোনো বল তুলি খালী পাত্ৰত ৰাখি নতুন পথ উলিয়াব পাৰে!' :
      language === 'bn' ? 'যেকোনো বল তুলে খালি পাত্রে রেখে নতুন উপায় তৈরি করুন!' :
      language === 'hi' ? 'किसी भी गेंद को खाली शीशी में रखकर नया रास्ता बनाएं!' :
      'Try placing a top ball into an empty vial to open up lower colors!'
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div
        className={`p-4 sm:p-6 rounded-3xl border-2 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isHighContrast
            ? 'bg-slate-900 border-emerald-400 text-white'
            : 'bg-white/90 backdrop-blur-xs border-emerald-100 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className={`p-3 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-950 border-white text-white hover:bg-slate-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
            }`}
            aria-label={t.backToGames}
          >
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </button>

          <GameLogo gameId="ball-sort" size="md" contrastTheme={contrastTheme} showText />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">{t.ballSortTitle}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                {t.ballSortTagline}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {t.ballSortSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => speakText(`${t.ballSortTitle}. ${feedback}`, language)}
            className={`p-3 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-950 border-emerald-400 text-emerald-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
            }`}
            title="Read aloud"
          >
            {isAudioMuted ? (
              <VolumeX className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0 || isLevelCompleted}
            className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
              history.length === 0 || isLevelCompleted
                ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400'
                : isHighContrast
                ? 'bg-slate-950 border-white text-white hover:bg-slate-800'
                : 'bg-white border-emerald-200 text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Undo2 className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-bold">{t.undoMove}</span>
          </button>

          <button
            type="button"
            onClick={handleHint}
            disabled={isLevelCompleted}
            className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-amber-400 border-white text-slate-950 font-black'
                : 'bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-bold">{t.needHint}</span>
          </button>

          <button
            type="button"
            onClick={() => loadLevel(difficulty, currentLevel)}
            className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-950 border-white text-white hover:bg-slate-800'
                : 'bg-white border-emerald-300 text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-bold">{t.restartGame}</span>
          </button>
        </div>
      </div>

      {/* Level & Difficulty Bar */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isHighContrast
            ? 'bg-slate-900 border-emerald-400/80 text-white'
            : 'bg-emerald-50/80 border-emerald-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
            {currentLevel}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {t.level} {currentLevel}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-900/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                <span>{t.infiniteLevels} (∞)</span>
              </span>
            </div>
            <span className="font-extrabold text-base sm:text-lg">
              {difficulty === 'easy'
                ? `${t.easy} • 2 Colours (${t.levelGentle})`
                : difficulty === 'hard'
                ? `${t.hard} • 4 Colours (${t.levelAdvanced})`
                : `${t.intermediate} • 3 Colours (${t.levelStandard})`}
            </span>
          </div>
        </div>

        {/* Difficulty Selection Buttons: Easy, Hard, Intermediate */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {([
            { key: 'easy' as const, label: t.easy, stars: '★☆☆', count: '2 Colours' },
            { key: 'hard' as const, label: t.hard, stars: '★★☆', count: '4 Colours' },
            { key: 'intermediate' as const, label: t.intermediate, stars: '★★★', count: '3 Colours' },
          ]).map(({ key, label, stars, count }) => {
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
                      : 'bg-emerald-600 border-emerald-500 text-white shadow-md scale-102'
                    : isHighContrast
                    ? 'bg-slate-950 border-slate-700 text-slate-300 hover:border-emerald-400 hover:text-white'
                    : 'bg-white border-emerald-200 text-slate-700 hover:bg-emerald-100/60 hover:text-emerald-950'
                }`}
                aria-pressed={isSelected}
              >
                <span>{label}</span>
                <span className="text-xs opacity-80 font-normal">({count})</span>
                <span className="text-xs text-amber-300 dark:text-amber-400 hidden sm:inline">{stars}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spoken Feedback Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border-2 text-center text-base sm:text-lg font-bold transition-all shadow-xs ${
          isHighContrast
            ? 'bg-slate-950 border-emerald-400 text-emerald-200'
            : 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
        }`}
        aria-live="polite"
      >
        <p>{feedback}</p>
      </div>

      {/* Vials Stage */}
      <div
        className={`p-6 sm:p-10 rounded-3xl border-2 shadow-inner min-h-[380px] flex items-end justify-center gap-4 sm:gap-8 flex-wrap ${
          isHighContrast
            ? 'bg-slate-950 border-slate-800'
            : 'bg-gradient-to-b from-slate-50 via-emerald-50/40 to-slate-100 border-slate-200'
        }`}
      >
        {tubes.map((tube, tubeIdx) => {
          const isSelected = selectedTubeIndex === tubeIdx;
          const isHintSource = hintMove?.from === tubeIdx;
          const isHintTarget = hintMove?.to === tubeIdx;

          // Check if tube is solved (full with all same color)
          const isTubeSolved =
            tube.length === capacity && tube.every((c) => c === tube[0]);

          return (
            <div key={tubeIdx} className="flex flex-col items-center gap-2">
              {/* Floating selected ball hovering above vial */}
              <div className="h-14 flex items-center justify-center">
                {isSelected && tube.length > 0 && (
                  <div
                    className={`w-12 h-12 rounded-full border-3 flex items-center justify-center shadow-lg animate-bounce transition-all ${
                      COLOR_DEFS[tube[tube.length - 1]].bgClass
                    } ${COLOR_DEFS[tube[tube.length - 1]].borderClass} text-white`}
                    title="Selected Ball"
                  >
                    {React.createElement(COLOR_DEFS[tube[tube.length - 1]].icon, {
                      className: 'w-6 h-6',
                    })}
                  </div>
                )}
                {isTubeSolved && !isSelected && (
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-black animate-pulse">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Solved</span>
                  </div>
                )}
              </div>

              {/* Glass Vial Container */}
              <button
                type="button"
                onClick={() => handleTubeClick(tubeIdx)}
                className={`relative w-20 sm:w-24 rounded-b-3xl border-4 transition-all duration-200 cursor-pointer flex flex-col-reverse items-center p-2.5 gap-2 group ${
                  capacity === 3 ? 'h-52 sm:h-56' : 'h-64 sm:h-70'
                } ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-4 ring-emerald-400/50 scale-105'
                    : isHintSource
                    ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/40 ring-4 ring-amber-400/60 animate-pulse'
                    : isHintTarget
                    ? 'border-sky-400 bg-sky-50/50 dark:bg-sky-950/40 ring-4 ring-sky-400/60 animate-pulse'
                    : isHighContrast
                    ? 'border-slate-600 bg-slate-900/90 hover:border-emerald-400'
                    : 'border-slate-300 hover:border-emerald-400 bg-white/70 hover:bg-white shadow-sm'
                }`}
                aria-label={`Vial ${tubeIdx + 1}, contains ${tube.length} of ${capacity} balls`}
              >
                {/* Balls inside the vial */}
                {tube.map((color, ballIdx) => {
                  const isTopBallAndSelected =
                    isSelected && ballIdx === tube.length - 1;
                  const def = COLOR_DEFS[color];
                  const Icon = def.icon;

                  if (isTopBallAndSelected) {
                    // Render translucent ghost placeholder while hovering above
                    return (
                      <div
                        key={ballIdx}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-emerald-400/60 bg-emerald-100/20"
                      />
                    );
                  }

                  return (
                    <div
                      key={ballIdx}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 flex items-center justify-center shadow-md transition-transform group-hover:scale-102 ${def.bgClass} ${def.borderClass} ${def.textClass}`}
                    >
                      <Icon className="w-6 h-6 opacity-90" aria-hidden="true" />
                    </div>
                  );
                })}

                {/* Empty slots placeholders */}
                {Array.from({ length: capacity - tube.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700/50"
                  />
                ))}
              </button>

              {/* Vial Label */}
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                #{tubeIdx + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Completion Modal */}
      {isLevelCompleted && (
        <div
          className={`p-8 rounded-3xl border-4 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 ${
            isHighContrast
              ? 'bg-slate-900 border-emerald-400 text-white'
              : 'bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-400 text-slate-900'
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

          <h3 className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
            {t.allLevelsCompleted} ({t.level} {currentLevel})
          </h3>
          <p className="text-lg font-medium max-w-xl mx-auto">
            {t.completedGameMessage}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleNextLevel}
              className="px-8 py-3.5 rounded-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{t.nextLevel} ({t.level} {currentLevel + 1})</span>
              <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={() => loadLevel(difficulty, currentLevel)}
              className="px-7 py-3.5 rounded-2xl font-black bg-emerald-600 hover:bg-emerald-700 text-white text-lg shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
