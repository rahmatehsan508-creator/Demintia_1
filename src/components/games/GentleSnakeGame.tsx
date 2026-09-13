import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft as ArrowLeftIcon, 
  ArrowRight as ArrowRightIcon,
  Star, 
  Footprints,
  Sparkles,
  Flower2,
  Heart,
  Smile
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TextSize, ContrastTheme, Language, GameDifficulty } from '../../types';
import { soundEffects, speakText } from '../../utils/audio';
import { getTranslation } from '../../utils/i18n';
import { GameLogo } from './GameLogo';

export interface GentleSnakeGameProps {
  onBack: () => void;
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  isAudioMuted: boolean;
  language: Language;
  initialLevel?: number;
  initialDifficulty?: GameDifficulty;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 10;

const getSnakeSettings = (diff: GameDifficulty, lvlNum: number) => {
  if (diff === 'easy') {
    return {
      targetFlowers: Math.min(8, 4 + Math.floor((lvlNum - 1) / 2)),
      speedMs: Math.max(500, 650 - (lvlNum % 5) * 20),
      wrapEdges: true,
    };
  }
  if (diff === 'intermediate') {
    return {
      targetFlowers: Math.min(10, 6 + Math.floor((lvlNum - 1) / 2)),
      speedMs: Math.max(420, 520 - (lvlNum % 5) * 20),
      wrapEdges: true,
    };
  }
  return {
    targetFlowers: Math.min(12, 8 + Math.floor((lvlNum - 1) / 2)),
    speedMs: Math.max(340, 420 - (lvlNum % 5) * 20),
    wrapEdges: false,
  };
};

export const GentleSnakeGame: React.FC<GentleSnakeGameProps> = ({
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
  const [snake, setSnake] = useState<Position[]>([
    { x: 4, y: 5 },
    { x: 3, y: 5 },
    { x: 2, y: 5 },
  ]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [flowerPos, setFlowerPos] = useState<Position>({ x: 7, y: 5 });
  const [collectedCount, setCollectedCount] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLevelCompleted, setIsLevelCompleted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>(t.snakeInstruction);

  // Store direction in ref to avoid rapid-key reverse collision
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<number | null>(null);

  const settings = getSnakeSettings(difficulty, currentLevel);

  // Helper to spawn a flower not on snake body
  const spawnFlower = useCallback((currentSnake: Position[]): Position => {
    let newPos: Position;
    let collision = true;
    while (collision) {
      newPos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      collision = currentSnake.some((seg) => seg.x === newPos.x && seg.y === newPos.y);
      if (!collision) return newPos;
    }
    return { x: 0, y: 0 };
  }, []);

  // Initialize or reset a level
  const loadLevel = useCallback(
    (diff: GameDifficulty, lvlNum: number) => {
      soundEffects.playGentleChime();
      const startSnake: Position[] = [
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 2, y: 5 },
      ];
      setSnake(startSnake);
      setDirection('RIGHT');
      nextDirectionRef.current = 'RIGHT';
      setCollectedCount(0);
      setIsPaused(false);
      setIsLevelCompleted(false);
      setFlowerPos(spawnFlower(startSnake));
      setFeedback(t.snakeInstruction);
    },
    [spawnFlower, t.snakeInstruction]
  );

  useEffect(() => {
    loadLevel(difficulty, currentLevel);
  }, [difficulty, currentLevel, loadLevel]);

  const handleSelectDifficulty = (diff: GameDifficulty) => {
    soundEffects.playGentleChime();
    setDifficulty(diff);
  };

  const handleNextLevel = () => {
    soundEffects.playGentleChime();
    setCurrentLevel((prev) => prev + 1);
  };

  // Turn direction safely
  const handleDirectionChange = (newDir: Direction) => {
    const current = direction;
    // Disallow 180-degree instant reversal into body
    if (
      (newDir === 'UP' && current === 'DOWN') ||
      (newDir === 'DOWN' && current === 'UP') ||
      (newDir === 'LEFT' && current === 'RIGHT') ||
      (newDir === 'RIGHT' && current === 'LEFT')
    ) {
      return;
    }
    nextDirectionRef.current = newDir;
    setDirection(newDir);
    soundEffects.playGentleChime();
  };

  // Keyboard arrow listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        handleDirectionChange('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        handleDirectionChange('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        handleDirectionChange('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        handleDirectionChange('RIGHT');
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Main game tick step
  const stepSnake = useCallback(() => {
    if (isPaused || isLevelCompleted) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const dir = nextDirectionRef.current;
      let nextX = head.x;
      let nextY = head.y;

      if (dir === 'UP') nextY -= 1;
      else if (dir === 'DOWN') nextY += 1;
      else if (dir === 'LEFT') nextX -= 1;
      else if (dir === 'RIGHT') nextX += 1;

      // Check boundary handling
      if (settings.wrapEdges) {
        if (nextX < 0) nextX = GRID_SIZE - 1;
        if (nextX >= GRID_SIZE) nextX = 0;
        if (nextY < 0) nextY = GRID_SIZE - 1;
        if (nextY >= GRID_SIZE) nextY = 0;
      } else {
        // Soft edge turning in Level 3 without game over
        if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
          // Bounce/turn safely
          soundEffects.playGentleChime();
          setFeedback(
            language === 'as' ? 'বাগানৰ সীমনাত পাইছে! ধীৰে ঘুৰি আন দিশলৈ যাওক।' :
            language === 'bn' ? 'বাগানের প্রান্তে এসেছেন! ধীরে ঘুরে অন্য দিকে যান।' :
            language === 'hi' ? 'बगीचे का किनारा आ गया! आराम से दूसरी दिशा में मुड़ें।' :
            'Reached the garden edge! Softly turning around.'
          );
          // Auto wrap or bounce
          nextX = (nextX + GRID_SIZE) % GRID_SIZE;
          nextY = (nextY + GRID_SIZE) % GRID_SIZE;
        }
      }

      // Check if flower collected
      const ateFlower = nextX === flowerPos.x && nextY === flowerPos.y;
      const newHead = { x: nextX, y: nextY };

      if (ateFlower) {
        soundEffects.playGentleChime();
        const newCount = collectedCount + 1;
        setCollectedCount(newCount);

        if (newCount >= settings.targetFlowers) {
          setIsLevelCompleted(true);
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          const victoryText =
            language === 'as' ? 'অভিনন্দন! আপুনি লক্ষ্যৰ আটাইবোৰ ফুল বুটলিলে!' :
            language === 'bn' ? 'দারুণ! আপনি লক্ষ্যের সব কয়টি ফুল কুড়িয়েছেন!' :
            language === 'hi' ? 'शाबाश! आपने सभी ताज़े फूल एकत्र कर लिए!' :
            'Wonderful! You gathered all beautiful garden blossoms!';
          setFeedback(victoryText);
          if (!isAudioMuted) {
            speakText(victoryText, language);
          }
          return [newHead, ...prevSnake];
        } else {
          setFeedback(
            language === 'as' ? `সুন্দৰ! ${newCount} / ${settings.targetFlowers} পাহ ফুল পোৱা গ'ল!` :
            language === 'bn' ? `চমৎকার! ${newCount} / ${settings.targetFlowers} টি ফুল পাওয়া গেছে!` :
            language === 'hi' ? `बहुत सुंदर! ${newCount} / ${settings.targetFlowers} फूल मिल गए!` :
            `Lovely! ${newCount} of ${settings.targetFlowers} blossoms gathered!`
          );
          setFlowerPos(spawnFlower([newHead, ...prevSnake]));
          // Grow snake
          return [newHead, ...prevSnake];
        }
      }

      // Normal step: add head, drop tail
      return [newHead, ...prevSnake.slice(0, prevSnake.length - 1)];
    });
  }, [
    isPaused,
    isLevelCompleted,
    flowerPos,
    collectedCount,
    settings,
    language,
    isAudioMuted,
    spawnFlower,
  ]);

  // Tick timer
  useEffect(() => {
    if (isPaused || isLevelCompleted) return;
    const interval = window.setInterval(stepSnake, settings.speedMs);
    return () => window.clearInterval(interval);
  }, [stepSnake, isPaused, isLevelCompleted, settings.speedMs]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div
        className={`p-4 sm:p-6 rounded-3xl border-2 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isHighContrast
            ? 'bg-slate-900 border-sky-400 text-white'
            : 'bg-white/90 backdrop-blur-xs border-sky-100 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className={`p-3 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-950 border-white text-white hover:bg-slate-800'
                : 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100'
            }`}
            aria-label={t.backToGames}
          >
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </button>

          <GameLogo gameId="gentle-snake" size="md" contrastTheme={contrastTheme} showText />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">{t.snakeGameTitle}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700">
                {t.snakeGameTagline}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {t.snakeGameSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => speakText(`${t.snakeGameTitle}. ${feedback}`, language)}
            className={`p-3 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-950 border-sky-400 text-sky-300'
                : 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100'
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
            onClick={() => setIsPaused((p) => !p)}
            className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-950 border-white text-white hover:bg-slate-800'
                : 'bg-white border-sky-200 text-sky-900 hover:bg-sky-50'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="text-xs font-bold">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            type="button"
            onClick={() => loadLevel(difficulty, currentLevel)}
            className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-950 border-white text-white hover:bg-slate-800'
                : 'bg-white border-sky-300 text-sky-900 hover:bg-sky-50'
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
            ? 'bg-slate-900 border-sky-400/80 text-white'
            : 'bg-sky-50/80 border-sky-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
            {currentLevel}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {t.level} {currentLevel}
              </span>
              <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full bg-sky-200/60 dark:bg-sky-900/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-600" aria-hidden="true" />
                <span>{t.infiniteLevels} (∞)</span>
              </span>
            </div>
            <span className="font-extrabold text-base sm:text-lg">
              {difficulty === 'easy'
                ? `${t.easy} • ${settings.targetFlowers} Flowers (${t.levelGentle})`
                : difficulty === 'hard'
                ? `${t.hard} • ${settings.targetFlowers} Flowers (${t.levelAdvanced})`
                : `${t.intermediate} • ${settings.targetFlowers} Flowers (${t.levelStandard})`}
            </span>
          </div>
        </div>

        {/* Difficulty Selection Buttons: Easy, Hard, Intermediate */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {([
            { key: 'easy' as const, label: t.easy, stars: '★☆☆' },
            { key: 'hard' as const, label: t.hard, stars: '★★☆' },
            { key: 'intermediate' as const, label: t.intermediate, stars: '★★★' },
          ]).map(({ key, label, stars }) => {
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
                      : 'bg-sky-600 border-sky-500 text-white shadow-md scale-102'
                    : isHighContrast
                    ? 'bg-slate-950 border-slate-700 text-slate-300 hover:border-sky-400 hover:text-white'
                    : 'bg-white border-sky-200 text-slate-700 hover:bg-sky-100/60 hover:text-sky-950'
                }`}
                aria-pressed={isSelected}
              >
                <span>{label}</span>
                <span className="text-xs text-amber-300 dark:text-amber-400 hidden sm:inline">{stars}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress & Feedback Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-base sm:text-lg font-bold shadow-xs ${
          isHighContrast
            ? 'bg-slate-950 border-sky-400 text-sky-200'
            : 'bg-sky-100/70 border-sky-300 text-sky-950'
        }`}
        aria-live="polite"
      >
        <p className="flex-1 text-center sm:text-left">{feedback}</p>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-1.5 rounded-xl border border-sky-300 shrink-0">
          <Flower2 className="w-5 h-5 text-rose-500 fill-rose-300" />
          <span className="text-sm sm:text-base font-black">
            {collectedCount} / {settings.targetFlowers} {t.flowersCollected}
          </span>
        </div>
      </div>

      {/* Game Arena: Garden Grid + On-Screen Control Pad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Garden Grid */}
        <div
          className={`lg:col-span-8 p-4 sm:p-6 rounded-3xl border-3 shadow-lg flex items-center justify-center aspect-square max-w-[480px] mx-auto w-full ${
            isHighContrast
              ? 'bg-slate-950 border-slate-700'
              : 'bg-gradient-to-br from-emerald-50 via-teal-50/50 to-sky-50 border-emerald-300'
          }`}
        >
          <div
            className="grid gap-1 w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
              const x = idx % GRID_SIZE;
              const y = Math.floor(idx / GRID_SIZE);

              // Check if head
              const isHead = snake[0].x === x && snake[0].y === y;
              // Check if body
              const bodyIndex = snake.findIndex((seg) => seg.x === x && seg.y === y);
              const isBody = bodyIndex > 0;
              // Check if flower
              const isFlower = flowerPos.x === x && flowerPos.y === y;

              return (
                <div
                  key={idx}
                  className={`rounded-lg flex items-center justify-center transition-all duration-150 relative ${
                    isHighContrast
                      ? 'border border-slate-900/60 bg-slate-900/40'
                      : 'border border-emerald-200/40 bg-white/40'
                  }`}
                >
                  {isHead && (
                    <div className="w-full h-full rounded-full bg-emerald-500 border-2 border-emerald-700 flex items-center justify-center shadow-md animate-pulse">
                      <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
                    </div>
                  )}

                  {isBody && (
                    <div
                      className={`w-4/5 h-4/5 rounded-full shadow-xs ${
                        isHighContrast
                          ? 'bg-emerald-400 border border-emerald-600'
                          : 'bg-emerald-400 border border-emerald-600'
                      }`}
                      style={{
                        opacity: Math.max(0.45, 1 - bodyIndex * 0.08),
                      }}
                    />
                  )}

                  {isFlower && (
                    <div className="w-full h-full flex items-center justify-center animate-bounce">
                      <Flower2 className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500 fill-rose-300 drop-shadow-sm" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Large Senior-Friendly D-Pad Controls */}
        <div
          className={`lg:col-span-4 p-6 rounded-3xl border-2 shadow-sm flex flex-col items-center justify-center gap-4 ${
            isHighContrast
              ? 'bg-slate-900 border-sky-400/80'
              : 'bg-white/80 border-sky-100'
          }`}
        >
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              Gentle Direction Controls
            </span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Tap buttons or use keyboard arrows
            </span>
          </div>

          {/* D-Pad Layout */}
          <div className="flex flex-col items-center gap-3">
            {/* UP */}
            <button
              type="button"
              onClick={() => handleDirectionChange('UP')}
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-3 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md ${
                direction === 'UP'
                  ? 'bg-sky-500 border-sky-700 text-white scale-105 ring-4 ring-sky-300'
                  : isHighContrast
                  ? 'bg-slate-950 border-white text-white hover:bg-slate-800'
                  : 'bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100'
              }`}
              aria-label="Move Up"
            >
              <ArrowUp className="w-8 h-8 stroke-[3]" />
              <span className="text-[11px] font-black uppercase">Up</span>
            </button>

            {/* LEFT & RIGHT ROW */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleDirectionChange('LEFT')}
                className={`w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-3 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md ${
                  direction === 'LEFT'
                    ? 'bg-sky-500 border-sky-700 text-white scale-105 ring-4 ring-sky-300'
                    : isHighContrast
                    ? 'bg-slate-950 border-white text-white hover:bg-slate-800'
                    : 'bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100'
                }`}
                aria-label="Move Left"
              >
                <ArrowLeftIcon className="w-8 h-8 stroke-[3]" />
                <span className="text-[11px] font-black uppercase">Left</span>
              </button>

              <div className="w-12 h-12 rounded-full border-2 border-dashed border-sky-300/50 flex items-center justify-center text-sky-500">
                <Footprints className="w-6 h-6 opacity-60" />
              </div>

              <button
                type="button"
                onClick={() => handleDirectionChange('RIGHT')}
                className={`w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-3 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md ${
                  direction === 'RIGHT'
                    ? 'bg-sky-500 border-sky-700 text-white scale-105 ring-4 ring-sky-300'
                    : isHighContrast
                    ? 'bg-slate-950 border-white text-white hover:bg-slate-800'
                    : 'bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100'
                }`}
                aria-label="Move Right"
              >
                <ArrowRightIcon className="w-8 h-8 stroke-[3]" />
                <span className="text-[11px] font-black uppercase">Right</span>
              </button>
            </div>

            {/* DOWN */}
            <button
              type="button"
              onClick={() => handleDirectionChange('DOWN')}
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-3 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md ${
                direction === 'DOWN'
                  ? 'bg-sky-500 border-sky-700 text-white scale-105 ring-4 ring-sky-300'
                  : isHighContrast
                  ? 'bg-slate-950 border-white text-white hover:bg-slate-800'
                  : 'bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100'
              }`}
              aria-label="Move Down"
            >
              <ArrowDown className="w-8 h-8 stroke-[3]" />
              <span className="text-[11px] font-black uppercase">Down</span>
            </button>
          </div>

          {/* Manual Step Forward button */}
          <button
            type="button"
            onClick={stepSnake}
            className={`w-full py-3 px-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer ${
              isHighContrast
                ? 'bg-slate-950 border-sky-400 text-sky-300'
                : 'bg-sky-100/60 border-sky-300 text-sky-900 hover:bg-sky-200/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Step 1 Pace Forward</span>
          </button>
        </div>
      </div>

      {/* Completion Modal */}
      {isLevelCompleted && (
        <div
          className={`p-8 rounded-3xl border-4 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 ${
            isHighContrast
              ? 'bg-slate-900 border-sky-400 text-white'
              : 'bg-gradient-to-b from-sky-50 to-emerald-50 border-sky-400 text-slate-900'
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

          <h3 className="text-3xl font-black text-sky-700 dark:text-sky-300">
            {t.allLevelsCompleted} ({t.level} {currentLevel})
          </h3>
          <p className="text-lg font-medium max-w-xl mx-auto">
            {t.completedGameMessage}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleNextLevel}
              className="px-8 py-3.5 rounded-2xl font-black bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white text-xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{t.nextLevel} ({t.level} {currentLevel + 1})</span>
              <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={() => loadLevel(difficulty, currentLevel)}
              className="px-7 py-3.5 rounded-2xl font-black bg-sky-600 hover:bg-sky-700 text-white text-lg shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
