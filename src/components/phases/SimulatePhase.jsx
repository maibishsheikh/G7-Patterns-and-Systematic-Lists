// src/components/phases/SimulatePhase.jsx
import React, { useEffect, useRef, useState } from 'react';
import './SimulatePhase.css';
import SequenceRig from '../SequenceRig.jsx';
import ListingGrid from '../ListingGrid.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { narrationScript } from '../../data/narration.js';
import confetti from 'canvas-confetti';

const STATIONS = [
  { id: 0, label: 'A', name: 'Pattern Lab',           icon: '🧪', desc: 'Build and test sequences term-by-term' },
  { id: 1, label: 'B', name: 'Systematic List Builder',icon: '📋', desc: 'Generate every combination systematically' },
  { id: 2, label: 'C', name: 'Pattern Detective',     icon: '🔍', desc: 'Crack the missing terms hiding in patterns' },
  { id: 3, label: 'D', name: 'Real-World Pattern Lab',icon: '🏙️', desc: 'Explore patterns in stairs, tiles & stadiums' },
];

const REALWORLD_SKINS = [
  { id: 'staircase', name: 'Staircase 🪜', start: 15, step: 15 },
  { id: 'tiles', name: 'Growing Tiles 🧱', start: 4, step: 3 },
  { id: 'seats', name: 'Stadium Seats 💺', start: 20, step: 8 },
  { id: 'coins', name: 'Savings Jar 🪙', start: 5, step: 5 },
];

export default function SimulatePhase({ state, dispatch }) {
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const prevStation = useRef(-1);
  const s = state?.currentSimStation || 0;

  // Station C: Detective state
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

  // Station D: Real world skin state
  const [stationDSkinId, setStationDSkinId] = useState('staircase');
  const stationDSkin = REALWORLD_SKINS.find((sk) => sk.id === stationDSkinId) || REALWORLD_SKINS[0];

  const stationNarrationMap = [
    narrationScript.station_a_intro,
    narrationScript.station_b_intro,
    narrationScript.station_c_intro,
    narrationScript.station_d_intro,
  ];

  useEffect(() => {
    if (prevStation.current !== s) {
      prevStation.current = s;
      stopAll();
      const text = stationNarrationMap[s];
      if (text) {
        setTimeout(() => narrate([{ text }]), 400);
      }
    }
  }, [s, narrate, stopAll]);

  useEffect(() => {
    return () => stopAll();
  }, [stopAll]);

  function handleStationComplete(stationIdx) {
    sounds.badge();
    dispatch({ type: 'COMPLETE_SIM_STATION', payload: stationIdx });
    if (stationIdx < 3) {
      setTimeout(() => dispatch({ type: 'ADVANCE_SIM_STATION' }), 600);
    } else {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  }

  function handleDetectiveChoice(val) {
    setDetectiveUserAnswer(val.toString());
    if (val === currentDetective.answer) {
      setDetectiveSuccess(true);
      sounds.correct();
      handleStationComplete(2);
    } else {
      setDetectiveSuccess(false);
      sounds.wrong();
    }
  }

  function goToPrev() {
    stopAll();
    dispatch({ type: 'PREV_SIM_STATION' });
  }

  function goToNext() {
    stopAll();
    dispatch({ type: 'ADVANCE_SIM_STATION' });
  }

  return (
    <div className="sim-wrap">
      <div className="sim-card glass-card">
        {/* Stations Tab Bar */}
        <div className="sim-tabs" role="tablist">
          {STATIONS.map((st) => (
            <button
              key={st.id}
              role="tab"
              aria-selected={s === st.id}
              className={`sim-tab ${s === st.id ? 'active' : ''} ${state?.simStationsComplete?.[st.id] ? 'done' : ''}`}
              onClick={() => {
                if (st.id > s && !state?.simStationsComplete?.[s]) return;
                stopAll();
                if (st.id > s) {
                  for (let i = 0; i < st.id - s; i++) dispatch({ type: 'ADVANCE_SIM_STATION' });
                } else if (st.id < s) {
                  for (let i = 0; i < s - st.id; i++) dispatch({ type: 'PREV_SIM_STATION' });
                }
              }}
              aria-label={`Station ${st.label}: ${st.name}`}
              disabled={st.id > s && !state?.simStationsComplete?.[s]}
            >
              <span className="tab-icon">{state?.simStationsComplete?.[st.id] ? '✅' : st.icon}</span>
              <span className="tab-name">[{st.label}] {st.name}</span>
            </button>
          ))}
        </div>

        {/* Station Content Area */}
        <div className="sim-station-area" role="tabpanel" key={s}>
          {/* Station A: Pattern Lab */}
          {s === 0 && (
            <div className="flex flex-col items-center gap-4 text-center anim-slide-up">
              <div className="station-header-box w-full">
                <div>
                  <h3 className="station-title">Station A: Pattern Lab</h3>
                  <p className="station-desc">Adjust the starting number and step to discover sequence rules!</p>
                </div>
                <button
                  className="btn btn-green btn-sm"
                  onClick={() => handleStationComplete(0)}
                >
                  {state?.simStationsComplete?.[0] ? 'Station Completed ✅' : 'Mark Complete ✨'}
                </button>
              </div>

              <div className="w-full max-w-2xl bg-[#140e2b] p-4 rounded-2xl border border-purple-900/60 shadow-xl">
                <SequenceRig
                  skin="default"
                  initialStart={4}
                  initialStep={5}
                  targetStart={4}
                  targetStep={5}
                  editable={true}
                  large={true}
                />
              </div>
            </div>
          )}

          {/* Station B: Systematic List Builder */}
          {s === 1 && (
            <div className="flex flex-col items-center gap-4 text-center anim-slide-up">
              <div className="station-header-box w-full">
                <div>
                  <h3 className="station-title">Station B: Systematic List Builder</h3>
                  <p className="station-desc">List every combination systematically across categories. Multiply choices!</p>
                </div>
                <button
                  className="btn btn-green btn-sm"
                  onClick={() => handleStationComplete(1)}
                >
                  {state?.simStationsComplete?.[1] ? 'Station Completed ✅' : 'Mark Complete ✨'}
                </button>
              </div>

              <div className="w-full max-w-3xl bg-[#140e2b] p-4 rounded-2xl border border-purple-900/60 shadow-xl">
                <ListingGrid />
              </div>
            </div>
          )}

          {/* Station C: Pattern Detective */}
          {s === 2 && (
            <div className="flex flex-col items-center gap-4 text-center anim-slide-up">
              <div className="station-header-box w-full">
                <div>
                  <h3 className="station-title">Station C: Pattern Detective</h3>
                  <p className="station-desc">Use the step rule to find the missing term in each sequence!</p>
                </div>
                <button
                  className="btn btn-green btn-sm"
                  onClick={() => handleStationComplete(2)}
                >
                  {state?.simStationsComplete?.[2] ? 'Station Completed ✅' : 'Mark Complete ✨'}
                </button>
              </div>

              <div className="w-full max-w-xl bg-[#140e2b] p-6 rounded-2xl border border-purple-900/60 shadow-xl flex flex-col items-center gap-4">
                <div className="text-sm font-bold text-amber-300 uppercase tracking-widest">
                  Mystery Puzzle {detectivePuzzleIndex + 1} of {detectivePuzzles.length}
                </div>

                <div className="flex items-center gap-3 justify-center py-3 flex-wrap">
                  {currentDetective.terms.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-5 py-3 rounded-xl bg-purple-950/80 border-2 border-purple-700 text-2xl font-black text-white shadow-md font-display"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="px-5 py-3 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-2xl font-black text-amber-300 shadow-md font-display animate-pulse">
                    ?
                  </span>
                </div>

                <p className="text-base text-purple-200 font-bold">
                  What is the common step rule? Pick the next term:
                </p>

                <div className="options-grid" style={{ maxWidth: '420px' }}>
                  {currentDetective.options.map((opt) => {
                    const isSelected = detectiveUserAnswer === opt.toString();
                    const isCorrect = isSelected && opt === currentDetective.answer;
                    let cls = 'option-btn';
                    if (isSelected) cls += isCorrect ? ' correct' : ' wrong';

                    return (
                      <button
                        key={opt}
                        className={cls}
                        onClick={() => handleDetectiveChoice(opt)}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {detectiveSuccess && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500 rounded-xl text-emerald-300 font-bold text-sm anim-slide-up">
                    🎉 Excellent! The step is {currentDetective.step > 0 ? `+${currentDetective.step}` : currentDetective.step}. Next term = {currentDetective.answer}!
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setDetectivePuzzleIndex((prev) => (prev + 1) % detectivePuzzles.length);
                      setDetectiveUserAnswer('');
                      setDetectiveSuccess(false);
                    }}
                  >
                    Next Puzzle ➔
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Station D: Real-World Pattern Lab */}
          {s === 3 && (
            <div className="flex flex-col items-center gap-4 text-center anim-slide-up">
              <div className="station-header-box w-full">
                <div>
                  <h3 className="station-title">Station D: Real-World Pattern Lab</h3>
                  <p className="station-desc">Explore constant-step patterns in staircases, stadium seating, tiles &amp; savings!</p>
                </div>
                <button
                  className="btn btn-green btn-sm"
                  onClick={() => handleStationComplete(3)}
                >
                  {state?.simStationsComplete?.[3] ? 'Station Completed ✅' : 'Mark Complete ✨'}
                </button>
              </div>

              {/* Skin Chooser Tabs */}
              <div className="flex gap-2 justify-center flex-wrap">
                {REALWORLD_SKINS.map((sk) => (
                  <button
                    key={sk.id}
                    className={`btn btn-sm ${stationDSkinId === sk.id ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setStationDSkinId(sk.id)}
                  >
                    {sk.name}
                  </button>
                ))}
              </div>

              <div className="w-full max-w-2xl bg-[#140e2b] p-4 rounded-2xl border border-purple-900/60 shadow-xl">
                <SequenceRig
                  skin={stationDSkin.id}
                  initialStart={stationDSkin.start}
                  initialStep={stationDSkin.step}
                  editable={true}
                  large={true}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="sim-footer">
          <button className="btn btn-outline btn-sm" onClick={goToPrev} disabled={s === 0}>
            ← Previous Station
          </button>
          <div className="sim-progress-dots">
            {STATIONS.map((st) => (
              <span
                key={st.id}
                className={`sim-dot ${s === st.id ? 'active' : ''} ${state?.simStationsComplete?.[st.id] ? 'done' : ''}`}
              />
            ))}
          </div>
          {s < 3 ? (
            <button
              className={state?.simStationsComplete?.[s] ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
              onClick={goToNext}
              disabled={!state?.simStationsComplete?.[s]}
            >
              Next Station →
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                stopAll();
                dispatch({ type: 'COMPLETE_PHASE', payload: 'simulate' });
                dispatch({ type: 'SET_PHASE', payload: 'play' });
              }}
            >
              Practice Quests! 🎮
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
