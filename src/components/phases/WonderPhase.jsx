// src/components/phases/WonderPhase.jsx
import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import SequenceRig from '../SequenceRig.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { narrationScript } from '../../data/narration.js';

const PARTICLES = ['+3', '×2', '2,4,6…', '3×2=6', '🔢', '✨', '🪜', '🧱', '⭐', '4,9,14…', '🤖', '🎲'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    narrate([{ text: narrationScript.wonder_prompt }]);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  function handleSpeak() {
    stopAll();
    narrate([{ text: narrationScript.wonder_prompt }]);
  }

  return (
    <div className="wonder-wrap">
      {/* Floating ambient particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card">
          <div className="wonder-stadium-icon" aria-hidden="true">🔢</div>
          <h1 className="wonder-title headline">The Pattern &amp; Outfit Mystery!</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">
              3 Shirts &amp; 2 Shorts: 5 Outfits or 6? ➔ Staircase: 2, 4, 6, 8... ➔ 25?
            </span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              Robo is packing for a trip with <strong className="wonder-em">3 t-shirts and 2 pairs of shorts</strong>, and says: <span className="wonder-highlight">"There are only 5 outfits I can make, because 3 + 2 = 5."</span> Is that true, or do we multiply?
            </p>
            <p className="body-text wonder-q">
              And the staircase outside grows by <strong className="wonder-em">2 steps every floor: 2, 4, 6, 8…</strong> will it ever land exactly on <strong className="wonder-em">25 steps</strong>?
            </p>
          </div>

          {/* Interactive Sequence Rig Preview */}
          <div className="wonder-rig-box">
            <SequenceRig skin="staircase" initialStart={2} initialStep={2} editable={true} compact={true} />
          </div>

          {/* Mascot Row */}
          <div className="wonder-mascot-row">
            <Mascot
              mood="curious"
              message="What if you packed one more t-shirt? How many outfits would that unlock? 🤔"
              size="sm"
              onSpeak={handleSpeak}
            />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Investigate the Rules 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
