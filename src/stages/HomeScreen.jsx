import React, { useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import { narrationScript } from '../data/narration';
import soundEngine from '../utils/audio';
import { Sparkles, Search, BookOpen, Sliders, Gamepad2, Trophy, ArrowRight } from 'lucide-react';

export const HomeScreen = () => {
  const { setStage } = useAppStore();

  useEffect(() => {
    soundEngine.playText(narrationScript.home_intro);
    return () => {
      soundEngine.stop();
    };
  }, []);

  const handleMascotSpeak = () => {
    soundEngine.playText(narrationScript.home_intro);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3 md:p-5 cosmic-bg overflow-hidden select-none">
      {/* Decorative Rotating Faint Symbols in Background */}
      <div className="absolute top-8 left-12 text-7xl md:text-9xl font-black text-purple-900/10 rotate-[-15deg] pointer-events-none font-display">
        +3
      </div>
      <div className="absolute top-12 right-16 text-7xl md:text-9xl font-black text-purple-900/10 rotate-[12deg] pointer-events-none font-display">
        3×2
      </div>
      <div className="absolute bottom-12 left-16 text-7xl md:text-9xl font-black text-purple-900/10 rotate-[-8deg] pointer-events-none font-display">
        1,2,3…
      </div>

      {/* Main Centered Wrapper */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full my-auto space-y-3.5 md:space-y-4">

        {/* 1. Curriculum Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#130E26]/90 border border-amber-400/50 text-amber-300 font-black text-xs md:text-sm lg:text-base shadow-md">
          <Sparkles className="w-4.5 h-4.5 text-amber-400" />
          <span>MOE-Aligned • Grade 7 • Patterns & Combinatorics</span>
        </div>

        {/* 2. Large Two-Tone Title */}
        <div className="flex flex-col items-center leading-none">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white font-display">
            Patterns &amp;
          </h1>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-amber-400 font-display mt-1 drop-shadow-[0_4px_20px_rgba(255,184,0,0.4)]">
            Systematic Lists!
          </h1>
        </div>

        {/* 3. Mascot Speech Bubble */}
        <div className="flex items-center gap-3 max-w-xl w-full justify-center">
          <button
            onClick={handleMascotSpeak}
            className="w-13 h-13 md:w-15 md:h-15 rounded-full bg-[#130E26] border-2 border-amber-400 flex items-center justify-center text-2xl md:text-3xl shadow-[0_0_15px_rgba(255,184,0,0.4)] shrink-0 hover:scale-105 transition-transform"
            title="Listen narration"
          >
            🤖
          </button>

          <div className="relative flex-1 bg-white text-slate-900 rounded-3xl px-6 py-3.5 shadow-xl border border-slate-100 flex flex-col items-center justify-center">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />
            <p className="text-sm md:text-base lg:text-lg font-black text-slate-900 text-center leading-snug">
              Ready to crack the rule behind any sequence and list every possibility without missing one? Let's roll!
            </p>
            <div className="text-xs text-slate-400 mt-0.5">🔢</div>
          </div>
        </div>

        {/* 4. Sub-Description Paragraph */}
        <p className="text-base md:text-xl lg:text-2xl font-black text-white max-w-3xl leading-relaxed px-2">
          Discover the hidden rule behind number patterns — plus how to systematically list and count every possible outcome, no guessing needed!
        </p>

        {/* 5. "YOUR LEARNING JOURNEY" Card */}
        <div className="w-full bg-[#130E26]/90 border border-purple-900/60 rounded-3xl p-4 md:p-5 shadow-2xl space-y-3">
          <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-amber-400 text-center">
            YOUR LEARNING JOURNEY
          </h2>

          <div className="flex items-center justify-center gap-3 md:gap-6">
            <button onClick={() => setStage('wonder')} className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-400 bg-cyan-950/40 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <Search className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm md:text-base lg:text-lg font-black text-white group-hover:text-amber-400 transition-colors">Wonder</h3>
                <p className="text-xs md:text-sm text-purple-300 font-bold">Spark curiosity</p>
              </div>
            </button>

            <ArrowRight className="w-4 h-4 text-purple-500 shrink-0" />

            <button onClick={() => setStage('story')} className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-950/40 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(255,184,0,0.3)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm md:text-base lg:text-lg font-black text-white group-hover:text-amber-400 transition-colors">Story</h3>
                <p className="text-xs md:text-sm text-purple-300 font-bold">Hear the tale</p>
              </div>
            </button>

            <ArrowRight className="w-4 h-4 text-purple-500 shrink-0" />

            <button onClick={() => setStage('simulate')} className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-400 bg-emerald-950/40 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm md:text-base lg:text-lg font-black text-white group-hover:text-amber-400 transition-colors">Simulate</h3>
                <p className="text-xs md:text-sm text-purple-300 font-bold">Explore & discover</p>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 md:gap-8 pt-1">
            <button onClick={() => setStage('practice')} className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-950/40 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm md:text-base lg:text-lg font-black text-white group-hover:text-amber-400 transition-colors">Practice</h3>
                <p className="text-xs md:text-sm text-purple-300 font-bold">Test your skills</p>
              </div>
            </button>

            <ArrowRight className="w-4 h-4 text-purple-500 shrink-0" />

            <button onClick={() => setStage('reflect')} className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-12 h-12 rounded-full border-2 border-pink-400 bg-pink-950/40 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm md:text-base lg:text-lg font-black text-white group-hover:text-amber-400 transition-colors">Reflect</h3>
                <p className="text-xs md:text-sm text-purple-300 font-bold">What did you learn?</p>
              </div>
            </button>
          </div>
        </div>

        {/* 6. Glowing Primary CTA Button */}
        <button
          onClick={() => setStage('wonder')}
          className="w-full max-w-sm bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xl md:text-2xl py-3.5 rounded-full shadow-[0_0_25px_rgba(255,184,0,0.7)] hover:scale-105 transition-transform flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🚀 Begin Your Journey!</span>
        </button>

        {/* 7. Bottom 3 Stat Cards */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
          <div className="bg-[#130E26]/90 border border-purple-900/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center space-y-0.5">
            <span className="text-3xl md:text-4xl">🔢</span>
            <h4 className="text-sm md:text-base lg:text-lg font-black text-white">4 Core Rules</h4>
            <p className="text-xs md:text-sm text-purple-300 font-bold">Sequences & counting</p>
          </div>

          <div className="bg-[#130E26]/90 border border-purple-900/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center space-y-0.5">
            <span className="text-3xl md:text-4xl">🧩</span>
            <h4 className="text-sm md:text-base lg:text-lg font-black text-white">4 Simulations</h4>
            <p className="text-xs md:text-sm text-purple-300 font-bold">Interactive labs</p>
          </div>

          <div className="bg-[#130E26]/90 border border-purple-900/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center space-y-0.5">
            <span className="text-3xl md:text-4xl">🏆</span>
            <h4 className="text-sm md:text-base lg:text-lg font-black text-white">10 Game Worlds</h4>
            <p className="text-xs md:text-sm text-purple-300 font-bold">Quizzes & rewards</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeScreen;
