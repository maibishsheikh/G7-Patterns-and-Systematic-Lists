import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Plus, Minus, RotateCcw, CheckCircle2 } from 'lucide-react';
import soundEngine from '../utils/audio';

const SKINS = {
  default: { icon: '🔢', label: 'Number Blocks', barColor: '#FFB800' },
  staircase: { icon: '🪜', label: 'Staircase (cm)', barColor: '#38BDF8' },
  tiles: { icon: '🧱', label: 'Growing Tiles', barColor: '#F472B6' },
  seats: { icon: '💺', label: 'Stadium Row Seats', barColor: '#34D399' },
  coins: { icon: '🪙', label: 'Savings Jar ($)', barColor: '#FBBF24' },
};

export const SequenceRig = ({
  skin = 'default',
  initialStart = 2,
  initialStep = 3,
  editable = true,
  compact = false,
  large = false,
  targetStart = null,
  targetStep = null,
  termCount = 5,
}) => {
  const [start, setStart] = useState(initialStart);
  const [step, setStep] = useState(initialStep);

  useEffect(() => {
    setStart(initialStart);
    setStep(initialStep);
  }, [initialStart, initialStep, skin]);

  const terms = Array.from({ length: termCount }, (_, i) => start + i * step);
  const hasTarget = targetStart !== null && targetStep !== null;
  const isMatch = hasTarget && start === targetStart && step === targetStep;

  const triggerConfetti = () => {
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  const bump = (setter, value, delta, min, max, check) => {
    const next = Math.min(max, Math.max(min, value + delta));
    soundEngine.playDragClick();
    setter(next);
    if (check) check(next);
  };

  const changeStart = (delta) => {
    bump(setStart, start, delta, 0, 30, (nextStart) => {
      if (hasTarget && nextStart === targetStart && step === targetStep) triggerConfetti();
    });
  };

  const changeStep = (delta) => {
    bump(setStep, step, delta, 1, 12, (nextStep) => {
      if (hasTarget && start === targetStart && nextStep === targetStep) triggerConfetti();
    });
  };

  const resetRig = () => {
    setStart(initialStart);
    setStep(initialStep);
  };

  const maxVal = Math.max(...terms, 1);
  const skinInfo = SKINS[skin] || SKINS.default;

  const containerSizeClass = large
    ? 'w-full max-w-xl h-56 md:h-64'
    : compact
    ? 'w-full max-w-md h-40 md:h-48'
    : 'w-full max-w-lg h-48 md:h-56';

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-2 select-none">
      {/* Controls Row */}
      {editable && (
        <div className="flex items-center justify-center gap-3 md:gap-5 w-full flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#161129] p-1.5 rounded-xl border border-[#3B2D6B]">
            <span className="text-xs font-black text-purple-300 px-1">Start</span>
            <button onClick={() => changeStart(-1)} className="p-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-200">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-black text-amber-400 px-1.5 w-6 text-center">{start}</span>
            <button onClick={() => changeStart(1)} className="p-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-200">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-[#161129] p-1.5 rounded-xl border border-[#3B2D6B]">
            <span className="text-xs font-black text-purple-300 px-1">Step</span>
            <button onClick={() => changeStep(-1)} className="p-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-200">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-black text-cyan-400 px-1.5 w-6 text-center">+{step}</span>
            <button onClick={() => changeStep(1)} className="p-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-200">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={resetRig}
            className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-[#3B2D6B] text-slate-300"
            title="Reset Rig"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bar Visualization */}
      <div className={`relative ${containerSizeClass} flex items-end justify-center gap-2 md:gap-3 px-3 pb-2 shrink-0`}>
        {terms.map((val, i) => {
          const heightPct = 20 + (val / maxVal) * 78;
          return (
            <div key={i} className="flex flex-col items-center justify-end h-full flex-1 max-w-[64px]">
              <span className="text-[11px] md:text-xs font-black text-slate-100 mb-1">{val}</span>
              <div
                className="w-full rounded-t-lg shadow-lg transition-all duration-300 flex items-start justify-center pt-1"
                style={{ height: `${heightPct}%`, background: `linear-gradient(180deg, ${skinInfo.barColor}, ${skinInfo.barColor}99)` }}
              >
                <span className="text-sm">{skinInfo.icon}</span>
              </div>
              <span className="text-[9px] md:text-[10px] font-bold text-purple-400 mt-1">T{i + 1}</span>
            </div>
          );
        })}
      </div>

      {/* Rule Readout */}
      <div
        className={`px-4 py-1.5 rounded-full border-2 font-black text-xs md:text-sm shadow-md mt-0.5 z-10 shrink-0 transition-all ${
          isMatch ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-glow-green' : 'bg-[#161129] border-amber-400/80 text-amber-400 shadow-glow-gold'
        }`}
      >
        {isMatch && <CheckCircle2 className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
        Rule: start at {start}, add {step} each time
      </div>

      {hasTarget && !isMatch && (
        <p className="text-[11px] md:text-xs text-purple-300 font-bold">
          🎯 Target: start at {targetStart}, add {targetStep} each time
        </p>
      )}
    </div>
  );
};

export default SequenceRig;
