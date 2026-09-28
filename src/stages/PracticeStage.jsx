import React, { useEffect, useState } from 'react';
import useAppStore from '../store/useAppStore';
import PatternDiagramSVG from '../components/PatternDiagramSVG';
import { worldsData } from '../data/worlds';
import { narrationScript } from '../data/narration';
import soundEngine from '../utils/audio';
import { Trophy, Heart, Flame, Star, Lock, Play, RotateCcw, Lightbulb, CheckCircle, XCircle, ArrowRight, Compass, RefreshCw, LogOut } from 'lucide-react';

export const PracticeStage = () => {
  const {
    activeWorldId,
    startWorldSession,
    exitWorld,
    session,
    answerQuestion,
    advanceQuestion,
    useHint,
    progress,
    setStage,
  } = useAppStore();

  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!activeWorldId) {
      soundEngine.playText(narrationScript.practice_welcome);
    }
    return () => {
      soundEngine.stop();
    };
  }, [activeWorldId]);

  const currentQ = session.questions ? session.questions[session.currentIndex] : null;
  const activeWorld = worldsData.find(w => w.id === activeWorldId);

  // Trigger question prompt audio when activeWorldId or currentIndex changes
  useEffect(() => {
    if (activeWorldId && currentQ && !session.outOfHearts && !session.completed) {
      const promptKey = `w${activeWorldId}_q${session.currentIndex + 1}_prompt`;
      const promptText = narrationScript[promptKey] || currentQ.prompt;
      soundEngine.playText(promptText);
    }
    return () => {
      soundEngine.stop();
    };
  }, [activeWorldId, session.currentIndex]);

  // Trigger Out of Hearts narration
  useEffect(() => {
    if (session.outOfHearts) {
      soundEngine.playText(narrationScript.out_of_hearts);
    }
    return () => {
      soundEngine.stop();
    };
  }, [session.outOfHearts]);

  // Trigger World Complete narration
  useEffect(() => {
    if (session.completed) {
      soundEngine.playText(narrationScript.world_complete);
    }
    return () => {
      soundEngine.stop();
    };
  }, [session.completed]);

  const handleStartWorld = (worldId) => {
    soundEngine.stop();
    setSelectedOption(null);
    setFeedback(null);
    startWorldSession(worldId);
  };

  const handleExitWorld = () => {
    soundEngine.stop();
    setSelectedOption(null);
    setFeedback(null);
    exitWorld();
  };

  const handleOptionClick = (optionVal) => {
    if (feedback || session.completed || session.outOfHearts) return;

    soundEngine.stop();
    setSelectedOption(optionVal);
    const result = answerQuestion(optionVal);

    if (result.isCorrect) {
      soundEngine.playText(narrationScript.correct_cheer);
      setFeedback({ isCorrect: true, explanation: currentQ.explanation });
    } else {
      soundEngine.playText(narrationScript.incorrect_try_again);
      setFeedback({ isCorrect: false, explanation: currentQ.explanation });
    }
  };

  const handleNextQuestion = () => {
    soundEngine.stop();
    setSelectedOption(null);
    setFeedback(null);
    advanceQuestion();
  };

  const handleUseHint = () => {
    soundEngine.stop();
    useHint();
    if (activeWorldId && currentQ) {
      const hintKey = `w${activeWorldId}_q${session.currentIndex + 1}_hint`;
      const hintText = narrationScript[hintKey] || currentQ.hint;
      soundEngine.playText(hintText);
    }
  };

  // 1. World Selector List Screen (Single Frame Viewport Fitting)
  if (!activeWorldId) {
    return (
      <div className="relative w-full h-full flex flex-col justify-between items-center p-2 md:p-4 cosmic-bg overflow-hidden select-none">
        {/* Header Title & Subtitle */}
        <div className="flex flex-col items-center text-center space-y-0.5 pt-0.5 shrink-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-amber-400 font-display flex items-center gap-2">
            <span>🎮</span>
            <span>Choose Your World!</span>
          </h1>
          <p className="text-sm md:text-base font-bold text-purple-200">
            Beat each world to unlock the next. Earn stars and XP!
          </p>
        </div>

        {/* Expanded Height World Map Container (Fills single frame viewport) */}
        <div className="my-auto w-full max-w-3xl h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar p-1 space-y-1.5 md:space-y-2">
          {worldsData.map((world) => {
            const isUnlocked = progress.unlockedWorlds.includes(world.id);
            const stars = progress.worldStars[world.id] || 0;

            return (
              <div
                key={world.id}
                className={`p-3 md:p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  isUnlocked
                    ? 'bg-[#130E26]/90 border-emerald-500/60 shadow-lg'
                    : 'bg-[#130E26]/60 border-purple-900/40 opacity-75'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${isUnlocked ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-400' : 'bg-purple-950/50 border border-purple-900/40 text-purple-400'} flex items-center justify-center text-2xl shrink-0`}>
                    {isUnlocked ? <Compass className="w-6 h-6 text-emerald-400" /> : <Lock className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg lg:text-xl font-black text-white">{world.title}</h3>
                    <p className="text-xs md:text-sm text-purple-300 font-bold">{world.focus}</p>
                  </div>
                </div>

                {/* Right Action CTA */}
                <div className="flex items-center gap-3 shrink-0">
                  {isUnlocked && (
                    <div className="flex items-center gap-0.5 hidden sm:flex">
                      {[1, 2, 3].map((starNum) => (
                        <Star
                          key={starNum}
                          className={`w-4 h-4 ${
                            starNum <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {isUnlocked ? (
                    <button
                      onClick={() => handleStartWorld(world.id)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-2 rounded-xl text-xs md:text-sm lg:text-base shadow-glow-green cursor-pointer transition-transform hover:scale-105"
                    >
                      PLAY
                    </button>
                  ) : (
                    <span className="text-xs md:text-sm font-black text-purple-400/60 uppercase tracking-wider px-2.5 py-1">
                      LOCKED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    );
  }

  // 2. Out of Hearts Screen
  if (session.outOfHearts) {
    return (
      <div className="relative w-full h-full flex flex-col justify-between items-center p-3 md:p-5 cosmic-bg overflow-hidden select-none">
        {/* 1. World Sub-Header Pill */}
        <div className="shrink-0 pt-0.5">
          <div className="bg-[#130E26] border border-cyan-500/50 text-cyan-300 font-black text-xs md:text-sm px-4 py-1 rounded-full flex items-center gap-2 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{activeWorld ? activeWorld.title : 'Spot the Next Term'}</span>
          </div>
        </div>

        {/* 2. Status Stats Row (XP, Hearts, Streak) */}
        <div className="w-full max-w-2xl flex items-center justify-between px-2 shrink-0 my-0.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm md:text-base">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{session.xp} XP</span>
          </div>

          {/* 3 Dark Lost Hearts */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((h) => (
              <Heart key={h} className="w-6 h-6 text-purple-900/60 fill-purple-950/40" />
            ))}
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm md:text-base">
            <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{session.streak}x Streak</span>
          </div>
        </div>

        {/* 3. Progress Bar Track */}
        <div className="w-full max-w-2xl shrink-0">
          <div className="flex items-center justify-between text-xs md:text-sm font-black text-purple-300 mb-0.5">
            <span>Question {Math.min(session.currentIndex + 1, 10)}/10</span>
            <span>{Math.round((Math.min(session.currentIndex + 1, 10) / 10) * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-purple-950/80 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
              style={{ width: `${(Math.min(session.currentIndex + 1, 10) / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* 4. Center Out of Hearts Banner */}
        <div className="my-auto flex flex-col items-center text-center space-y-4 max-w-lg w-full">
          {/* Sad Emoji Icon */}
          <button
            onClick={() => soundEngine.playText(narrationScript.out_of_hearts)}
            className="text-6xl md:text-7xl animate-bounce cursor-pointer"
            title="Listen out of hearts narration"
          >
            🥺
          </button>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-black text-rose-500 font-display">
            Out of Hearts!
          </h2>

          {/* Robo Quote */}
          <p className="text-sm md:text-base font-extrabold text-purple-200 leading-relaxed px-4">
            Robo says: "No worries! Let's practice some more. Try again to master this world!"
          </p>

          {/* Action Buttons: Retry World & Quit World */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleStartWorld(activeWorldId)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-7 py-3 rounded-full shadow-[0_0_20px_rgba(255,184,0,0.6)] cursor-pointer text-sm md:text-base flex items-center gap-2 transition-transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry World</span>
            </button>
            <button
              onClick={handleExitWorld}
              className="bg-[#130E26] hover:bg-[#1A1333] border border-purple-700/80 text-purple-200 hover:text-white font-black px-7 py-3 rounded-full cursor-pointer text-sm md:text-base flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Quit World</span>
            </button>
          </div>
        </div>

        {/* Bottom spacing placeholder */}
        <div className="shrink-0 pb-1" />
      </div>
    );
  }

  // 3. World Complete Celebration Screen
  if (session.completed) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 cosmic-bg text-center space-y-6">
        <div className="bg-emerald-950/90 border-2 border-emerald-500 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-glow-green">
          <button
            onClick={() => soundEngine.playText(narrationScript.world_complete)}
            className="text-5xl animate-bounce cursor-pointer"
            title="Listen celebration audio"
          >
            🏆
          </button>
          <h2 className="text-2xl md:text-3xl font-black text-white">World Cleared!</h2>

          {/* Stars display */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`w-9 h-9 ${
                  s <= session.starsEarned
                    ? 'fill-amber-400 text-amber-400 scale-110 shadow-glow-gold'
                    : 'text-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="text-base font-black text-emerald-300">
            Earned +{session.xp} XP ⭐
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {activeWorldId < 10 && (
              <button
                onClick={() => handleStartWorld(activeWorldId + 1)}
                className="btn-gold px-6 py-2.5 rounded-xl font-black text-sm md:text-base"
              >
                Next World 🚀
              </button>
            )}
            <button
              onClick={handleExitWorld}
              className="px-6 py-2.5 rounded-xl bg-purple-950 border border-purple-700 text-purple-200 font-bold text-sm md:text-base"
            >
              World Map 🗺️
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  // 4. Per-Question Quiz Play View
  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-3 md:p-4 cosmic-bg overflow-hidden select-none">
      
      {/* 1. World Sub-Header Pill */}
      <div className="shrink-0 pt-0.5">
        <div className="bg-[#130E26] border border-cyan-500/50 text-cyan-300 font-black text-xs md:text-sm px-4 py-1 rounded-full flex items-center gap-2 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{activeWorld ? activeWorld.title : 'World Practice'}</span>
        </div>
      </div>

      {/* 2. Status Stats Row (XP, Hearts, Streak) */}
      <div className="w-full max-w-2xl flex items-center justify-between px-2 shrink-0 my-0.5">
        <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm md:text-base">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span>{session.xp} XP</span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((h) => (
            <Heart
              key={h}
              className={`w-6 h-6 ${
                h <= session.hearts ? 'fill-red-500 text-red-500' : 'text-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm md:text-base">
          <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span>{session.streak}x Streak</span>
        </div>
      </div>

      {/* 3. Progress Bar Track */}
      <div className="w-full max-w-2xl shrink-0">
        <div className="flex items-center justify-between text-xs md:text-sm font-black text-purple-300 mb-0.5">
          <span>Question {session.currentIndex + 1}/10</span>
          <span>{Math.round(((session.currentIndex + 1) / 10) * 100)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-purple-950/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
            style={{ width: `${((session.currentIndex + 1) / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* 4. Question Text & Poster-Size Diagram Container */}
      <div className="w-full max-w-2xl flex flex-col items-center text-center my-auto space-y-2.5 shrink-0">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white max-w-2xl leading-snug font-display">
            {currentQ.prompt}
          </h2>
        </div>

        {/* Poster-Size Enlarged Diagram Image Box */}
        <div className="w-40 h-40 md:w-52 md:h-52 rounded-3xl bg-[#130E26]/90 border-2 border-cyan-400/50 p-2 flex items-center justify-center text-white shadow-[0_0_30px_rgba(6,182,212,0.35)] my-0.5 shrink-0">
          {currentQ.diagram ? (
            <div className="w-full h-full flex items-center justify-center">
              <PatternDiagramSVG diagram={currentQ.diagram} size={320} />
            </div>
          ) : (
            <div className="w-full h-full bg-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
              <RefreshCw className="w-16 h-16 text-white animate-spin-slow" />
            </div>
          )}
        </div>

        {/* 5. 4 Multiple Choice Answer Option Cards (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            let btnStyle = "bg-[#1A1333] border-purple-800/60 text-white hover:bg-[#251B47] hover:border-purple-500";

            if (feedback) {
              if (opt === currentQ.correctAnswer) {
                btnStyle = "bg-emerald-950 border-emerald-500 text-emerald-300 font-black shadow-glow-green scale-105";
              } else if (isSelected && !feedback.isCorrect) {
                btnStyle = "bg-red-950 border-red-500 text-red-300 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(opt)}
                disabled={!!feedback}
                className={`py-3.5 md:py-4 px-5 rounded-2xl border-2 text-2xl md:text-3xl lg:text-4xl font-black transition-all flex items-center justify-center shadow-lg cursor-pointer ${btnStyle}`}
              >
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Explanation Overlay (If answered) */}
        {feedback && (
          <div className={`p-3 rounded-2xl border flex items-center gap-3 max-w-xl w-full ${
            feedback.isCorrect ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300' : 'bg-red-950/90 border-red-500 text-red-200'
          }`}>
            {feedback.isCorrect ? <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" /> : <XCircle className="w-6 h-6 text-red-400 shrink-0" />}
            <p className="text-xs md:text-sm font-bold flex-1 text-left">{feedback.explanation}</p>
            <button
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-5 py-2 rounded-xl text-xs md:text-sm font-black shrink-0"
            >
              Next →
            </button>
          </div>
        )}

        {/* Hint Link (Bottom Left of Question Area) */}
        <div className="w-full max-w-xl flex items-center justify-start pt-0.5">
          <button
            onClick={handleUseHint}
            className="text-sm md:text-base font-black text-amber-400 flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>Use Hint</span>
          </button>
        </div>

        {session.hintUsed && (
          <p className="text-xs md:text-sm font-bold text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 max-w-xl w-full text-left">
            💡 {currentQ.hint}
          </p>
        )}
      </div>

      {/* Back to World Map Button */}
      <div className="shrink-0 pb-0.5">
        <button
          onClick={handleExitWorld}
          className="text-xs md:text-sm font-black text-purple-300 hover:text-white transition-colors"
        >
          ← Exit to World Selection
        </button>
      </div>

    </div>
  );
};

export default PracticeStage;
