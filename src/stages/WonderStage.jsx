import React, { useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import SequenceRig from '../components/SequenceRig';
import { narrationScript } from '../data/narration';
import soundEngine from '../utils/audio';
import { Sparkles } from 'lucide-react';

export const WonderStage = () => {
  const { setStage } = useAppStore();

  useEffect(() => {
    soundEngine.playText(narrationScript.wonder_prompt);
    return () => {
      soundEngine.stop();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3 md:p-5 cosmic-bg overflow-hidden select-none">
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full my-auto space-y-3 md:space-y-4">

        {/* 1. Mascot Speech Header */}
        <div className="flex items-center gap-3 justify-center">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#130E26] border-2 border-amber-400 flex items-center justify-center text-2xl md:text-3xl shadow-[0_0_15px_rgba(255,184,0,0.4)] shrink-0">
            🤖
          </div>

          <div className="relative bg-white text-slate-900 rounded-full px-6 py-2 shadow-xl border border-slate-100 flex items-center justify-center">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-r-8 border-r-white border-b-6 border-b-transparent" />
            <p className="text-base md:text-lg font-black text-slate-900">
              Hmm... I wonder... 🤔
            </p>
          </div>
        </div>

        {/* 2. Interactive Simulator Card */}
        <div className="w-full max-w-md bg-[#130E26]/90 border-2 border-purple-900/70 rounded-3xl p-3 shadow-2xl flex flex-col items-center justify-center relative space-y-1 shrink-0">
          <div className="w-full text-left flex items-center gap-1.5 text-xs font-black tracking-widest text-amber-400 uppercase">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
            <span>STAIRCASE PATTERN RIG</span>
          </div>

          <div className="w-full flex items-center justify-center py-1">
            <SequenceRig skin="staircase" initialStart={2} initialStep={2} editable={true} compact={true} />
          </div>
        </div>

        {/* 3. On-Screen Text Narration (100% Word-for-Word Matched to Audio) */}
        <div className="bg-[#130E26]/80 border border-purple-800/80 rounded-2xl p-4 md:p-5 max-w-3xl shadow-xl space-y-2 text-center">
          <p className="text-base md:text-lg lg:text-xl font-extrabold text-slate-100 leading-relaxed">
            Robo is packing for a trip. Alex has 3 t-shirts and 2 pairs of shorts, and says: <span className="text-amber-300 font-black">"There are only 5 outfits I can make, because 3 plus 2 is 5."</span> Is that actually true? And the staircase outside grows by 2 steps every floor: 2, 4, 6, 8… will it ever land exactly on 25 steps?
          </p>

          <p className="text-sm md:text-base font-extrabold text-purple-200 italic">
            What if Alex packed one more t-shirt? How many outfits would that unlock?
          </p>
        </div>

        {/* 4. Golden Rule Pill Box */}
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-amber-400/80 bg-amber-950/40 text-amber-300 font-black text-sm md:text-base text-center shadow-[0_0_20px_rgba(255,184,0,0.35)]">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Patterns follow a rule — and systematic lists are multiplied, never added!</span>
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
        </div>

        {/* 5. Primary Gold CTA Button */}
        <button
          onClick={() => setStage('story')}
          className="w-full max-w-sm bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-lg md:text-xl py-3.5 rounded-full shadow-[0_0_25px_rgba(255,184,0,0.7)] hover:scale-105 transition-transform flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>I have a guess! 🔍 Let's Find Out!</span>
        </button>

      </div>
    </div>
  );
};

export default WonderStage;
