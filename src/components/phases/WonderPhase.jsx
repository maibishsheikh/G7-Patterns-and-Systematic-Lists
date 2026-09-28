// src/components/phases/WonderPhase.jsx
import React, { useEffect, useState } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['+3', '×2', 'T_n', '3×2=6', '🔢', '✨', '🪐', '4,7,10…', '⭐', '🎲', '🤖', '📡'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const [pollVote, setPollVote] = useState(null); // '5' | '6' | null
  const [mascotMsg, setMascotMsg] = useState(
    "What do you think? Does combining 3 shirts and 2 shorts add or multiply? Vote to test your intuition! 🤔"
  );

  useEffect(() => {
    narrate(wonderNarration());
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleVote(choice) {
    setPollVote(choice);
    if (choice === '6') {
      sounds.correct();
      const msg = "✨ Spot on! Every 1 shirt pairs with 2 shorts: 3 × 2 = 6 combinations! That's the Fundamental Counting Principle!";
      setMascotMsg(msg);
      narrate([{ text: msg }]);
    } else {
      sounds.click();
      const msg = "🤔 Kabir thought so too! But if each shirt gets paired with BOTH pairs of shorts, we multiply: 3 × 2 = 6! Let's prove it!";
      setMascotMsg(msg);
      narrate([{ text: msg }]);
    }
  }

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  function handleSpeak() {
    stopAll();
    narrate([{ text: mascotMsg }]);
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
              left: `${4 + (i * 8.2) % 92}%`,
              top: `${6 + (i * 7.4) % 82}%`,
              animationDelay: `${i * 0.55}s`,
              fontSize: `${1.05 + (i % 3) * 0.35}rem`,
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
          <h1 className="wonder-title headline">The Pattern &amp; Combinations Mystery!</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">
              3 Shirts &amp; 2 Shorts: 5 Outfits or 6? &nbsp;➔&nbsp; 4, 7, 10, 13… ➔ 50th Step = ?
            </span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              Aanya is packing for the mission with <strong className="wonder-em">3 shirts and 2 pairs of shorts</strong>.
              Kabir claims: <span className="wonder-highlight">"There are only 5 outfits because 3 + 2 = 5!"</span> Is he right, or do we multiply?
            </p>
            <p className="body-text wonder-q">
              Meanwhile, the security door counts in constant steps: <strong className="wonder-em">4, 7, 10, 13…</strong> Can you calculate the <strong className="wonder-em">50th step</strong> without counting one by one?
            </p>
          </div>

          {/* Interactive Wonder Dilemma Voting */}
          <div className="wonder-poll-box">
            <div className="wonder-poll-label">Quick Prediction: Total Outfits with 3 Shirts &amp; 2 Shorts?</div>
            <div className="wonder-poll-options">
              <button
                className={`wonder-poll-btn ${pollVote === '5' ? 'selected wrong' : ''}`}
                onClick={() => handleVote('5')}
              >
                <span>➕ 3 + 2 = 5 Outfits</span>
                <span className="poll-sub">Addition Rule</span>
              </button>
              <button
                className={`wonder-poll-btn ${pollVote === '6' ? 'selected correct' : ''}`}
                onClick={() => handleVote('6')}
              >
                <span>✖️ 3 × 2 = 6 Outfits</span>
                <span className="poll-sub">Multiplication Rule</span>
              </button>
            </div>
          </div>

          {/* Mascot Row */}
          <div className="wonder-mascot-row">
            <Mascot
              mood={pollVote === '6' ? 'happy' : 'curious'}
              message={mascotMsg}
              size="sm"
              onSpeak={handleSpeak}
            />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Start Investigation 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
