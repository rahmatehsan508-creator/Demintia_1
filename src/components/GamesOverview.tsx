import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  Award,
  ArrowRight,
  ShieldCheck,
  Star,
  Gamepad2
} from 'lucide-react';
import { GameId, TextSize, ContrastTheme, Language, GameDifficulty } from '../types';
import { soundEffects, speakText } from '../utils/audio';
import { getTranslation } from '../utils/i18n';
import { COGNITIVE_GAMES } from '../data/initialData';
import { MemoryMatchGame } from './games/MemoryMatchGame';
import { BallSortGame } from './games/BallSortGame';
import { GentleSnakeGame } from './games/GentleSnakeGame';
import { ColorShapeGame } from './games/ColorShapeGame';
import { GameLogo } from './games/GameLogo';

interface GamesOverviewProps {
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  isAudioMuted: boolean;
  language: Language;
}

export const GamesOverview: React.FC<GamesOverviewProps> = ({
  textSize,
  contrastTheme,
  isAudioMuted,
  language,
}) => {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>('easy');
  const [playedTodayCount, setPlayedTodayCount] = useState<number>(1);
  const isHighContrast = contrastTheme === 'high-contrast';
  const t = getTranslation(language);

  const handleLaunchGame = (gameId: GameId, difficulty: GameDifficulty = 'easy') => {
    soundEffects.playGentleChime();
    setSelectedDifficulty(difficulty);
    setActiveGame(gameId);
    setPlayedTodayCount((c) => Math.min(4, c + 1));
  };

  const handleReadIntro = () => {
    speakText(
      `${t.navGames}. ${t.gamesIntroSubtitle}. ${t.gamesNoScoreNotice}`,
      language
    );
  };

  // Render individual game if chosen
  if (activeGame === 'memory-cards') {
    return (
      <MemoryMatchGame
        onBack={() => setActiveGame(null)}
        textSize={textSize}
        contrastTheme={contrastTheme}
        isAudioMuted={isAudioMuted}
        language={language}
        initialDifficulty={selectedDifficulty}
      />
    );
  }

  if (activeGame === 'ball-sort') {
    return (
      <BallSortGame
        onBack={() => setActiveGame(null)}
        textSize={textSize}
        contrastTheme={contrastTheme}
        isAudioMuted={isAudioMuted}
        language={language}
        initialDifficulty={selectedDifficulty}
      />
    );
  }

  if (activeGame === 'gentle-snake') {
    return (
      <GentleSnakeGame
        onBack={() => setActiveGame(null)}
        textSize={textSize}
        contrastTheme={contrastTheme}
        isAudioMuted={isAudioMuted}
        language={language}
        initialDifficulty={selectedDifficulty}
      />
    );
  }

  if (activeGame === 'color-shape') {
    return (
      <ColorShapeGame
        onBack={() => setActiveGame(null)}
        textSize={textSize}
        contrastTheme={contrastTheme}
        isAudioMuted={isAudioMuted}
        language={language}
        initialDifficulty={selectedDifficulty}
      />
    );
  }

  // Localized game details map
  const localizedGameMeta: Record<GameId, { title: string; desc: string; benefit: string; tagline: string }> = {
    'memory-cards': {
      title: t.memoryGameTitle,
      desc: t.memoryGameDesc,
      benefit: t.memoryGameBenefit,
      tagline: t.memoryGameTagline,
    },
    'ball-sort': {
      title: t.ballSortTitle,
      desc: t.ballSortDesc,
      benefit: t.ballSortBenefit,
      tagline: t.ballSortTagline,
    },
    'gentle-snake': {
      title: t.snakeGameTitle,
      desc: t.snakeGameDesc,
      benefit: t.snakeGameBenefit,
      tagline: t.snakeGameTagline,
    },
    'color-shape': {
      title: t.colorGameTitle,
      desc: t.colorGameDesc,
      benefit: t.colorGameBenefit,
      tagline: t.colorGameTagline,
    },
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div
        className={`p-6 sm:p-8 rounded-[28px] border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          isHighContrast
            ? 'bg-slate-900 border-amber-400 text-white'
            : 'bg-[#E2F3FD] border-[#1D6FB8]/30 text-slate-900 shadow-[0_10px_30px_-5px_rgba(29,111,184,0.1)]'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                isHighContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                  : 'bg-white text-[#1D6FB8] border-[#1D6FB8]/30'
              }`}
            >
              {t.gentleMindStimulation}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isHighContrast ? 'bg-slate-800 text-slate-300' : 'bg-white/80 text-[#1D6FB8]'
              }`}
            >
              {t.gamesNoScoreNotice}
            </span>
          </div>

          <h2
            className={`font-black tracking-tight ${
              isHighContrast ? 'text-white' : 'text-[#1D6FB8]'
            } ${textSize === 'extra-large' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}
            style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
          >
            {t.gamesTitle}
          </h2>

          <p
            className={`font-medium max-w-2xl ${
              isHighContrast ? 'text-slate-300' : 'text-[#1D6FB8]/90'
            } ${textSize === 'extra-large' ? 'text-xl' : 'text-lg'}`}
          >
            {t.gamesIntroSubtitle}
          </p>
        </div>

        {/* Brain Activity Star Counter & Audio Listen */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`px-4 py-3 rounded-2xl border-2 text-center flex flex-col items-center justify-center ${
              isHighContrast
                ? 'bg-slate-950 border-amber-400 text-amber-300'
                : 'bg-white border-[#1D6FB8]/30 text-[#1D6FB8]'
            }`}
          >
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-5 h-5 ${
                    starIdx <= playedTodayCount
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-black uppercase tracking-wider mt-1">
              {language === 'as' ? 'আজি সম্পন্ন কৰা' : language === 'bn' ? 'আজ সম্পন্ন হয়েছে' : language === 'hi' ? 'आज पूरा किया' : 'Completed Today'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReadIntro}
            className={`p-3.5 rounded-2xl font-bold border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center ${
              isHighContrast
                ? 'bg-slate-950 border-slate-700 text-amber-300 hover:bg-slate-800'
                : 'bg-white border-[#1D6FB8]/40 text-[#1D6FB8] hover:bg-sky-50'
            }`}
            title="Read section aloud"
            aria-label="Read games introduction aloud"
          >
            <Volume2 className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 4 Cognitive Games Cards Grid with Distinct Game Logos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COGNITIVE_GAMES.map((game) => {
          const meta = localizedGameMeta[game.id] || {
            title: game.title,
            desc: game.description,
            benefit: game.cognitiveBenefit,
            tagline: game.tagline || 'Brain Stimulation',
          };

          return (
            <div
              key={game.id}
              id={`game-card-${game.id}`}
              className={`p-6 sm:p-7 rounded-[28px] border-2 flex flex-col justify-between gap-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
                isHighContrast
                  ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-white'
                  : 'bg-[#E2F3FD]/80 hover:bg-[#E2F3FD] border-[#1D6FB8]/40 hover:border-[#1D6FB8] text-slate-900 shadow-[0_8px_24px_-4px_rgba(29,111,184,0.08)]'
              }`}
            >
              {/* Game Card Header with Dedicated Game Logo */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Visual Game Logo Badge */}
                  <GameLogo gameId={game.id} contrastTheme={contrastTheme} size="md" />

                  {/* Difficulty Badge */}
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border ${
                      isHighContrast
                        ? 'bg-slate-950 border-slate-600 text-slate-300'
                        : 'bg-white border-[#1D6FB8]/30 text-[#1D6FB8]'
                    }`}
                  >
                    {t.difficultyGentle}
                  </span>
                </div>

                <div>
                  <h3
                    className={`font-black tracking-tight ${
                      isHighContrast ? 'text-white' : 'text-[#1D6FB8]'
                    } ${
                      textSize === 'extra-large' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                    }`}
                    style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {meta.title}
                  </h3>
                  <p
                    className={`font-medium mt-1.5 ${
                      isHighContrast ? 'text-slate-300' : 'text-slate-700'
                    } ${textSize === 'extra-large' ? 'text-lg' : 'text-base'}`}
                  >
                    {meta.desc}
                  </p>
                </div>

                {/* Cognitive Benefit Pill */}
                <div
                  className={`px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border ${
                    isHighContrast
                      ? 'bg-slate-950 border-slate-700 text-amber-300'
                      : 'bg-white border-[#1D6FB8]/20 text-[#1D6FB8]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-[#0275D8]" aria-hidden="true" />
                  <span>{meta.benefit}</span>
                </div>

                {/* Level Selection Chips */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t.selectLevel}:
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" aria-hidden="true" />
                      <span>{t.infiniteLevels} (∞)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { key: 'easy' as const, name: t.easy, sub: t.levelGentle },
                      { key: 'hard' as const, name: t.hard, sub: t.levelAdvanced },
                      { key: 'intermediate' as const, name: t.intermediate, sub: t.levelStandard },
                    ] as const).map(({ key, name, sub }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleLaunchGame(game.id, key)}
                        className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-black border transition-all hover:scale-105 active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          isHighContrast
                            ? 'bg-slate-950 hover:bg-amber-400 hover:text-slate-950 border-slate-700 text-slate-200'
                            : 'bg-white hover:bg-sky-100 border-[#1D6FB8]/30 text-[#1D6FB8]'
                        }`}
                        title={`Start ${name} (${sub})`}
                      >
                        <span>{name}</span>
                        <span className="text-[10px] opacity-75 font-medium truncate max-w-full">
                          {sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Launch Play Button */}
              <button
                type="button"
                id={`play-button-${game.id}`}
                onClick={() => handleLaunchGame(game.id, 'easy')}
                className={`w-full py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 border transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer ${
                  isHighContrast
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-white font-black'
                    : 'bg-[#0275D8] hover:bg-[#0262b5] text-white border-blue-400'
                }`}
              >
                <Play className="w-6 h-6 fill-current shrink-0" aria-hidden="true" />
                <span>{t.playGameButton}</span>
                <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Gentle Reassurance Card */}
      <div
        className={`p-6 rounded-3xl border-2 flex items-center gap-4 ${
          isHighContrast
            ? 'bg-slate-950 border-slate-800 text-slate-300'
            : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}
      >
        <ShieldCheck className="w-8 h-8 shrink-0 text-emerald-600" aria-hidden="true" />
        <div>
          <h4 className="font-extrabold text-base sm:text-lg">
            {language === 'as' ? 'শান্ত আৰু সহজ খেল' : language === 'bn' ? 'শান্তিময় ও আনন্দদায়ক খেলা' : language === 'hi' ? 'शांतिपूर्ण व सहज खेल' : 'Relaxing & Stress-Free Games'}
          </h4>
          <p className="text-sm font-medium opacity-90 mt-0.5">
            {language === 'as' ? 'ইয়াত কোনো নম্বৰ বা সময়ৰ বাধ্যবাধকতা নাই। যেতিয়ালৈ মন যায় শান্তভাৱে খেলক।' : language === 'bn' ? 'এখানে কোনো সময়সীমা বা ভুল নেই। নিজের গতিতে আরাম করে উপভোগ করুন।' : language === 'hi' ? 'यहाँ कोई समय सीमा या अंक नहीं हैं। अपनी गति से शांति से खेलें।' : 'There are no countdown timers or penalties. Enjoy each moment at your own peaceful pace.'}
          </p>
        </div>
      </div>
    </div>
  );
};
