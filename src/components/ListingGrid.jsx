import React, { useState } from 'react';
import { RefreshCw, RotateCcw, Zap, CheckCircle2 } from 'lucide-react';
import soundEngine from '../utils/audio';

const PRESETS = [
  {
    title: 'Ice-Cream Combos',
    labelA: 'Flavours',
    itemsA: [{ n: 'Vanilla', e: '🍦' }, { n: 'Choc', e: '🍫' }, { n: 'Mango', e: '🥭' }],
    labelB: 'Cones',
    itemsB: [{ n: 'Wafer', e: '🧇' }, { n: 'Sugar', e: '🍪' }],
  },
  {
    title: 'Outfit Picker',
    labelA: 'T-Shirts',
    itemsA: [{ n: 'Red', e: '🔴' }, { n: 'Blue', e: '🔵' }],
    labelB: 'Shorts',
    itemsB: [{ n: 'Denim', e: '🩳' }, { n: 'Black', e: '⚫' }, { n: 'Grey', e: '⚪' }],
  },
  {
    title: 'Lunch Set Menu',
    labelA: 'Mains',
    itemsA: [{ n: 'Rice', e: '🍚' }, { n: 'Noodles', e: '🍜' }, { n: 'Bread', e: '🍞' }],
    labelB: 'Drinks',
    itemsB: [{ n: 'Juice', e: '🧃' }, { n: 'Water', e: '💧' }],
  },
  {
    title: 'Coin Flip Codes',
    labelA: 'Coin 1',
    itemsA: [{ n: 'Heads', e: '🪙' }, { n: 'Tails', e: '⭕' }],
    labelB: 'Coin 2',
    itemsB: [{ n: 'Heads', e: '🪙' }, { n: 'Tails', e: '⭕' }],
  },
];

export const ListingGrid = () => {
  const [presetIndex, setPresetIndex] = useState(0);
  const [revealed, setRevealed] = useState(0);

  const preset = PRESETS[presetIndex];
  const rows = preset.itemsA.length;
  const cols = preset.itemsB.length;
  const total = rows * cols;
  const isComplete = revealed >= total;

  const revealNext = () => {
    if (revealed >= total) return;
    soundEngine.playDragClick();
    setRevealed(revealed + 1);
  };

  const revealAll = () => {
    soundEngine.playDragClick();
    setRevealed(total);
  };

  const resetGrid = () => setRevealed(0);

  const nextPreset = () => {
    setPresetIndex((prev) => (prev + 1) % PRESETS.length);
    setRevealed(0);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full space-y-2.5 select-none">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-2 w-full">
        <span className="text-xs md:text-sm font-black text-purple-300 bg-[#161129] px-3 py-1.5 rounded-xl border border-purple-700/60">
          {preset.title}
        </span>
        <button
          onClick={revealNext}
          disabled={isComplete}
          className="bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-black flex items-center gap-1.5 shadow-glow-gold transition-transform hover:scale-105"
        >
          <Zap className="w-4 h-4" />
          <span>List Next Pair</span>
        </button>
        <button
          onClick={revealAll}
          className="bg-purple-950 border border-purple-700 text-amber-400 hover:text-white px-3 py-1.5 rounded-xl text-xs md:text-sm font-black flex items-center gap-1.5"
        >
          <span>Reveal All</span>
        </button>
        <button onClick={resetGrid} className="p-2 rounded-xl bg-purple-950/80 border border-purple-700 text-purple-200" title="Reset">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={nextPreset}
          className="bg-purple-950 border border-purple-700 text-amber-400 hover:text-white px-3 py-1.5 rounded-xl text-xs md:text-sm font-black flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span>New Challenge</span>
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto w-full flex justify-center">
        <table className="border-separate" style={{ borderSpacing: '6px' }}>
          <thead>
            <tr>
              <th className="w-16" />
              {preset.itemsB.map((b, c) => (
                <th key={c} className="text-[11px] md:text-xs font-black text-amber-300 px-2 py-1">
                  {b.e} {b.n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preset.itemsA.map((a, r) => (
              <tr key={r}>
                <td className="text-[11px] md:text-xs font-black text-cyan-300 pr-2 text-right whitespace-nowrap">
                  {a.e} {a.n}
                </td>
                {preset.itemsB.map((b, c) => {
                  const order = r * cols + c;
                  const isRevealed = order < revealed;
                  const isNext = order === revealed;
                  return (
                    <td key={c}>
                      <div
                        className={`w-16 h-12 md:w-20 md:h-14 rounded-xl border-2 flex items-center justify-center text-center text-[10px] md:text-[11px] font-black transition-all ${
                          isRevealed
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                            : isNext
                            ? 'bg-amber-950/50 border-amber-400 text-amber-300 animate-pulse'
                            : 'bg-[#1A1333] border-purple-900/60 text-purple-700'
                        }`}
                      >
                        {isRevealed ? `${a.n}+${b.n}` : isNext ? '?' : ''}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Readout */}
      <div
        className={`px-5 py-1.5 rounded-full border-2 font-black text-xs md:text-sm shadow-md flex items-center gap-2 ${
          isComplete ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-glow-green' : 'bg-[#161129] border-amber-400/80 text-amber-400'
        }`}
      >
        {isComplete && <CheckCircle2 className="w-4 h-4" />}
        <span>Listed {revealed}/{total} — Total = {rows} × {cols} = {total}</span>
      </div>
    </div>
  );
};

export default ListingGrid;
