// src/components/simulations/GapDetectiveStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const PUZZLES = [
  {
    id: 1,
    terms: [5, 9, 13, null, 21],
    missingIdx: 3,
    step: 4,
    answer: 17,
    options: [16, 17, 18, 19],
    hint: 'Look at the gap between consecutive terms: 9 − 5 = 4 and 13 − 9 = 4. Add 4 to 13!',
  },
  {
    id: 2,
    terms: [8, 14, 20, null, 32],
    missingIdx: 3,
    step: 6,
    answer: 26,
    options: [24, 26, 28, 30],
    hint: 'Each term increases by +6: 14 − 8 = 6, 20 − 14 = 6. What is 20 + 6?',
  },
  {
    id: 3,
    terms: [35, 29, 23, null, 11],
    missingIdx: 3,
    step: -6,
    answer: 17,
    options: [15, 17, 18, 19],
    hint: 'Decreasing pattern! Each step subtracts 6: 29 − 35 = −6. What is 23 − 6?',
  },
  {
    id: 4,
    terms: [3, 10, null, 24, 31],
    missingIdx: 2,
    step: 7,
    answer: 17,
    options: [14, 16, 17, 21],
    hint: 'The step is +7: 10 − 3 = 7. Next term is 10 + 7 = 17 (and 17 + 7 = 24 checks out)!',
  },
];

export default function GapDetectiveStation({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [puzIdx, setPuzIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [success, setSuccess] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  const puzzle = PUZZLES[puzIdx];

  function handlePick(val) {
    if (success) return;
    setSelectedAns(val);
    if (val === puzzle.answer) {
      setSuccess(true);
      setSolvedCount(prev => prev + 1);
      sounds.correct();
      narrate([{
        text: `Superb detective work! The common difference is ${puzzle.step > 0 ? `+${puzzle.step}` : puzzle.step}, and the missing term is ${puzzle.answer}!`,
        style: 'celebration'
      }]);
    } else {
      sounds.wrong();
      narrate([{ text: `Not quite! Check the difference between consecutive numbers.`, style: 'encouragement' }]);
    }
  }

  function nextPuzzle() {
    stopAll();
    setPuzIdx(idx => (idx + 1) % PUZZLES.length);
    setSelectedAns(null);
    setSuccess(false);
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔍 Station C: Gap Detective &amp; Missing Terms</h3>
        <div className="station-target-box">
          <span className="station-target-label">Case:</span>
          <span className="station-target-num">{puzIdx + 1} of {PUZZLES.length}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Mystery Sequence & Answer Options */}
        <div className="station-col-left">
          {/* Mystery Sequence Display */}
          <div className="detective-case-box">
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase' }}>
              Sequence Signal Telemetry
            </span>
            <div className="detective-sequence-row">
              {puzzle.terms.map((t, idx) => (
                <div
                  key={idx}
                  className={`detective-term-chip ${t === null ? 'missing' : ''}`}
                >
                  {t !== null ? t : (selectedAns && selectedAns === puzzle.answer ? puzzle.answer : '?')}
                </div>
              ))}
            </div>
          </div>

          {/* Options Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#feca57', textAlign: 'center' }}>
              Select the missing term:
            </span>
            <div className="detective-choices-grid">
              {puzzle.options.map(opt => {
                const isSelected = selectedAns === opt;
                let cls = 'detective-btn';
                if (isSelected) {
                  cls += opt === puzzle.answer ? ' correct' : ' wrong';
                }
                return (
                  <button
                    key={opt}
                    className={cls}
                    onClick={() => handlePick(opt)}
                    disabled={success}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="station-actions">
            <button className="btn-outline" onClick={nextPuzzle}>
              Next Case ➔
            </button>
          </div>
        </div>

        {/* Right Column: Number Line Visualization & Feedback */}
        <div className="station-col-right">
          <div className="running-ratio-bar">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.92rem, 1.05vw, 1.05rem)', color: '#fff' }}>
              Detective Clue: Common Difference = <strong style={{ color: '#4ade80' }}>{puzzle.step > 0 ? `+${puzzle.step}` : puzzle.step}</strong>
            </div>
            <div className={`running-ratio-text ${success ? 'exact' : ''}`}>
              {success ? `🎉 Mystery Solved! Missing Term = ${puzzle.answer}` : 'Find the constant step gap between known numbers'}
            </div>
          </div>

          {/* Visual Step Deduction Card */}
          <div className="sequence-rail-container">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 800 }}>
                Step-by-step Telemetry Hops:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {puzzle.terms.map((t, idx) => (
                  <React.Fragment key={idx}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: t === null ? (success ? '#166534' : '#78350f') : 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      border: '1.5px solid rgba(255,255,255,0.2)'
                    }}>
                      {t !== null ? t : (success ? puzzle.answer : '?')}
                    </span>
                    {idx < puzzle.terms.length - 1 && (
                      <span style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 900 }}>
                        {puzzle.step > 0 ? `+${puzzle.step}` : puzzle.step}➔
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Case cracked! Missing term is <strong>{puzzle.answer}</strong> with step difference <strong>{puzzle.step > 0 ? `+${puzzle.step}` : puzzle.step}</strong>!
                </p>
              </div>
              <div className="station-success-actions">
                <button className="btn-primary" onClick={nextPuzzle}>
                  Next Mystery
                </button>
                <button className="btn-green" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                💡 {puzzle.hint}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
