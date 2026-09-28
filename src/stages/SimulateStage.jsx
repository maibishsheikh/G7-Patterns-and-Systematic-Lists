import React, { useEffect, useState } from 'react';
import useAppStore from '../store/useAppStore';
import SequenceRig from '../components/SequenceRig';
import ListingGrid from '../components/ListingGrid';
import { narrationScript } from '../data/narration';
import soundEngine from '../utils/audio';
import { ArrowRight, ArrowLeft, Dices, CheckCircle } from 'lucide-react';

const REALWORLD_SKINS = [
  { id: 'staircase', name: 'Staircase 🪜', start: 15, step: 15 },
  { id: 'tiles', name: 'Growing Tiles 🧱', start: 4, step: 3 },
  { id: 'seats', name: 'Stadium Seats 💺', start: 20, step: 8 },
  { id: 'coins', name: 'Savings Jar 🪙', start: 5, step: 5 },
];

export const SimulateStage = () => {
  const { simulateStation, setSimulateStation, setStage } = useAppStore();
  const [stationDSkinId, setStationDSkinId] = useState('staircase');

  // Station C: Pattern Detective mystery puzzles
  const [detectivePuzzleIndex, setDetectivePuzzleIndex] = useState(0);
  const detectivePuzzles = [
    { terms: [5, 9, 13], step: 4, answer: 17, options: [17, 21, 13, 19] },
    { terms: [8, 14, 20], step: 6, answer: 26, options: [26, 32, 20, 24] },
    { terms: [3, 10, 17], step: 7, answer: 24, options: [24, 31, 17, 21] },
    { terms: [20, 17, 14], step: -3, answer: 11, options: [11, 8, 14, 17] },
    { terms: [6, 11, 16], step: 5, answer: 21, options: [21, 26, 16, 19] },
  ];

  const currentDetective = detectivePuzzles[detectivePuzzleIndex];
  const [detectiveUserAnswer, setDetectiveUserAnswer] = useState('');
  const [detectiveSuccess, setDetectiveSuccess] = useState(false);

  useEffect(() => {
    const wrongOpt = currentDetective.options.find((opt) => opt !== currentDetective.answer);
    if (wrongOpt !== undefined) {
      setDetectiveUserAnswer(wrongOpt.toString());
      setDetectiveSuccess(false);
    }
  }, [detectivePuzzleIndex]);

  const stationNarrationMap = {
    A: narrationScript.station_a_intro,
    B: narrationScript.station_b_intro,
    C: narrationScript.station_c_intro,
    D: narrationScript.station_d_intro,
  };

  useEffect(() => {
    soundEngine.playText(stationNarrationMap[simulateStation]);
    return () => {
      soundEngine.stop();
    };
  }, [simulateStation]);

  const handleMascotSpeak = () => {
    soundEngine.playText(stationNarrationMap[simulateStation]);
  };

  const handleDetectiveQuickChoice = (val) => {
    setDetectiveUserAnswer(val.toString());
    if (val === currentDetective.answer) {
      setDetectiveSuccess(true);
      soundEngine.playText(narrationScript.correct_cheer);
    } else {
      setDetectiveSuccess(false);
      soundEngine.playText(narrationScript.incorrect_try_again);
    }
  };

  const nextDetectivePuzzle = () => {
    setDetectivePuzzleIndex((prev) => (prev + 1) % detectivePuzzles.length);
  };

  const stations = [
    { id: 'A', name: 'Pattern Lab', badge: 'A' },
    { id: 'B', name: 'Systematic List Builder', badge: 'B' },
    { id: 'C', name: 'Pattern Detective', badge: 'C' },
    { id: 'D', name: 'Real-World Pattern Lab', badge: 'D' },
  ];

  const stationIndex = stations.findIndex((s) => s.id === simulateStation);

  const handleNextStation = () => {
    if (stationIndex < stations.length - 1) {
      setSimulateStation(stations[stationIndex + 1].id);
    } else {
      setStage('practice');
    }
  };

  const handlePrevStation = () => {
    if (stationIndex > 0) {
      setSimulateStation(stations[stationIndex - 1].id);
    } else {
      setStage('story');
    }
  };

  const stationDSkin = REALWORLD_SKINS.find((s) => s.id === stationDSkinId) || REALWORLD_SKINS[0];

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-2.5 md:p-4 cosmic-bg overflow-hidden select-none">
      {/* Decorative Watermark Symbols */}
      <div className="absolute top-8 left-8 text-7xl font-black text-purple-900/10 rotate-[-12deg] pointer-events-none font-display">
        +4
      </div>
      <div className="absolute top-6 right-12 text-7xl font-black text-purple-900/10 rotate-[15deg] pointer-events-none font-display">
        3×2
      </div>
      <div className="absolute bottom-10 right-10 text-7xl font-black text-purple-900/10 rotate-[-15deg] pointer-events-none font-display">
        ?
      </div>

      {/* 1. Main Header Title & Subtitle */}
      <div className="flex flex-col items-center text-center space-y-0.5 pt-0.5 shrink-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-amber-400 font-display flex items-center gap-2">
          <span>✏️</span>
          <span>Simulate</span>
        </h1>
        <p className="text-sm md:text-base font-extrabold text-purple-200">
          Explore and discover — no wrong answers!
        </p>
      </div>

      {/* 2. Station Switcher Tab Bar */}
      <div className="flex items-center justify-center gap-3 md:gap-4 bg-transparent p-1.5 md:p-2 max-w-4xl w-full shrink-0 my-1">
        {stations.map((st) => {
          const isActive = simulateStation === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setSimulateStation(st.id)}
              className={`flex-1 py-2 px-3 md:px-4 rounded-xl font-black text-xs md:text-sm lg:text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(255,184,0,0.6)] scale-105'
                  : 'bg-purple-950/20 text-purple-200 hover:text-white hover:bg-purple-900/30'
              }`}
            >
              <span className={`w-5 h-5 md:w-6 md:h-6 rounded-full text-xs md:text-sm font-black flex items-center justify-center ${isActive ? 'bg-slate-950 text-amber-400' : 'bg-purple-900 text-amber-300'}`}>
                {st.badge}
              </span>
              <span className="truncate">{st.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Active Station Content Workspace */}
      <div className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center my-auto overflow-hidden px-2">

        {/* Station A: Pattern Lab */}
        {simulateStation === 'A' && (
          <div className="w-full flex flex-col items-center justify-center space-y-1.5 my-auto">
            <div className="text-center space-y-0.5">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-amber-400 flex items-center justify-center gap-2">
                <span>🔬</span>
                <span>Pattern Lab</span>
              </h3>
              <p className="text-sm md:text-base font-extrabold text-slate-200 max-w-xl">
                Change the start number and the step size — try to build the target pattern below!
              </p>
            </div>

            <div className="w-full flex items-center justify-center my-1">
              <SequenceRig skin="default" initialStart={2} initialStep={2} editable={true} large targetStart={4} targetStep={5} />
            </div>
          </div>
        )}

        {/* Station B: Systematic List Builder */}
        {simulateStation === 'B' && (
          <div className="w-full flex flex-col items-center justify-center space-y-1.5 my-auto">
            <div className="text-center space-y-0.5">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-amber-400 flex items-center justify-center gap-2">
                <span>📋</span>
                <span>Systematic List Builder</span>
              </h3>
              <p className="text-sm md:text-base font-extrabold text-slate-200 max-w-xl">
                Tap "List Next Pair" to reveal combinations in order — the total is always rows × columns!
              </p>
            </div>

            <div className="w-full flex items-center justify-center my-1">
              <ListingGrid />
            </div>
          </div>
        )}

        {/* Station C: Pattern Detective */}
        {simulateStation === 'C' && (
          <div className="w-full flex flex-col items-center justify-center space-y-1.5 my-auto">
            <div className="text-center space-y-0.5">
              <h3 className="text-2xl md:text-3xl font-black text-amber-400 flex items-center justify-center gap-2 font-display">
                <span>🕵️</span>
                <span>Pattern Detective</span>
              </h3>
              <p className="text-xs md:text-sm font-extrabold text-slate-200 max-w-xl">
                Find the step rule between the known terms, then solve for the missing term!
              </p>
            </div>

            <div className="w-full max-w-md bg-transparent p-1.5 md:p-2 flex flex-col items-center space-y-2">

              <div className="w-full flex items-center justify-between">
                <span className="text-xs md:text-sm font-black text-cyan-300">
                  Mystery #{detectivePuzzleIndex + 1}
                </span>
                <button
                  onClick={nextDetectivePuzzle}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-glow-gold transition-transform hover:scale-105"
                >
                  <Dices className="w-4 h-4" />
                  <span>New Mystery 🎲</span>
                </button>
              </div>

              {/* Sequence Diagram */}
              <div className="w-full flex items-center justify-center py-2">
                <svg viewBox="0 0 400 140" className="w-full max-w-sm">
                  {currentDetective.terms.concat(['?']).map((t, i) => {
                    const boxW = 68;
                    const gap = 20;
                    const x = 10 + i * (boxW + gap);
                    const colors = ['#06B6D4', '#F59E0B', '#10B981'];
                    const isUnknown = t === '?';
                    const stroke = isUnknown ? '#EC4899' : colors[i % colors.length];
                    return (
                      <g key={i}>
                        {i > 0 && (
                          <line x1={x - gap + 4} y1="60" x2={x - 4} y2="60" stroke="#FFB800" strokeWidth="4" strokeLinecap="round" />
                        )}
                        <rect x={x} y="34" width={boxW} height="52" rx="12" fill="#161129" stroke={stroke} strokeWidth="3.5" />
                        <text x={x + boxW / 2} y="68" textAnchor="middle" fill={isUnknown ? '#EC4899' : '#FFFFFF'} fontSize="20" fontWeight="900">
                          {t}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Rule Formula Pill */}
              <div className="bg-[#161129] border border-purple-700/60 px-4 py-1 rounded-2xl w-full text-center shadow-md">
                <p className="text-xs md:text-sm font-black text-emerald-400">
                  Missing Term ? = Last Term {currentDetective.step >= 0 ? '+' : '−'} {Math.abs(currentDetective.step)}
                </p>
              </div>

              {/* Option Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-0.5">
                {currentDetective.options.map((choiceVal) => (
                  <button
                    key={choiceVal}
                    onClick={() => handleDetectiveQuickChoice(choiceVal)}
                    className={`px-5 py-2 rounded-2xl text-base md:text-lg font-black transition-all cursor-pointer ${
                      parseInt(detectiveUserAnswer, 10) === choiceVal
                        ? 'bg-amber-400 text-slate-950 shadow-glow-gold scale-105'
                        : 'bg-[#1A1333] text-purple-200 hover:text-white border border-purple-700/60'
                    }`}
                  >
                    {choiceVal}
                  </button>
                ))}
              </div>

              {detectiveSuccess && (
                <div className="bg-emerald-950 border-2 border-emerald-500 text-emerald-300 px-4 py-1.5 rounded-2xl text-xs md:text-sm font-black shadow-glow-green animate-bounce flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Correct! Missing Term = {currentDetective.answer}!</span>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Station D: Real-World Pattern Lab */}
        {simulateStation === 'D' && (
          <div className="w-full flex flex-col items-center justify-center space-y-2.5 my-auto">
            <div className="text-center space-y-0.5">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-amber-400 flex items-center justify-center gap-2 font-display">
                <span>🌍</span>
                <span>Real-World Pattern Lab</span>
              </h3>
              <p className="text-base md:text-lg font-extrabold text-slate-200 max-w-xl">
                Staircases, stadium seats, tiling floors & savings — all grow by a constant step!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {REALWORLD_SKINS.map((skinItem) => {
                const isSelected = stationDSkinId === skinItem.id;
                return (
                  <button
                    key={skinItem.id}
                    onClick={() => setStationDSkinId(skinItem.id)}
                    className={`px-4 py-2 rounded-2xl font-black text-sm md:text-base flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 shadow-glow-gold scale-105'
                        : 'bg-[#130E26]/90 text-purple-200 hover:text-white border border-purple-800/60'
                    }`}
                  >
                    <span>{skinItem.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="w-full flex items-center justify-center my-1">
              <SequenceRig
                key={stationDSkin.id}
                skin={stationDSkin.id}
                initialStart={stationDSkin.start}
                initialStep={stationDSkin.step}
                editable={true}
                large
              />
            </div>
          </div>
        )}

      </div>

      {/* 4. Mascot Speech Bubble Footer */}
      <div className="flex items-center gap-3 max-w-xl w-full justify-center shrink-0 my-0.5">
        <button
          onClick={handleMascotSpeak}
          className="w-9 h-9 rounded-full bg-[#130E26] border-2 border-amber-400 flex items-center justify-center text-lg shadow-[0_0_12px_rgba(255,184,0,0.5)] shrink-0 hover:scale-105 transition-transform"
          title="Listen narration"
        >
          🤖
        </button>
        <div className="bg-white text-slate-900 rounded-full px-4 py-1.5 shadow-xl border border-slate-100 font-extrabold text-xs md:text-sm text-center flex-1">
          Remember: for systematic lists, multiply the number of choices — never add them!
        </div>
      </div>

      {/* 5. Bottom Station Navigation Buttons */}
      <div className="w-full max-w-xl flex items-center justify-between gap-4 pb-0.5 shrink-0">
        <button
          onClick={handlePrevStation}
          className="bg-[#130E26] hover:bg-[#1A1333] border border-purple-800/80 text-purple-200 hover:text-white px-7 py-2 rounded-full font-black text-xs md:text-sm cursor-pointer flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Station</span>
        </button>

        <button
          onClick={handleNextStation}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-7 py-2 rounded-full font-black text-xs md:text-sm cursor-pointer flex items-center gap-2 shadow-glow-gold transition-transform hover:scale-105"
        >
          <span>Next Station</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default SimulateStage;
