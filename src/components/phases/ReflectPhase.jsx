// src/components/phases/ReflectPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ReflectPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { BADGES } from '../../utils/badgeEngine.js';
import { calcStars } from '../../utils/scoring.js';
import { useAudio } from '../../hooks/useAudio.js';
import { narrationScript } from '../../data/narration.js';
import { generateSessionQuestions } from '../../utils/shuffle.js';
import questionBank from '../../data/questionBank.js';
import confetti from 'canvas-confetti';

const REFLECT_QUESTIONS = [
  {
    q: "1. What is a number pattern, and what do we call the fixed amount added each time?",
    options: [
      "A rule-based sequence; the fixed amount is the common difference (or step)",
      "A completely random list of numbers with no rules",
      "A fixed number that never changes value",
    ],
    correct: 0,
  },
  {
    q: "2. What is the golden rule for finding the total combinations in a systematic list?",
    options: [
      "Multiply the choices at each stage (e.g., 3 shirts × 2 shorts = 6 outfits)",
      "Always add the numbers together (3 + 2 = 5)",
      "Pick only the largest number from the list",
    ],
    correct: 0,
  },
  {
    q: "3. How do you find the value at any position n without listing every term?",
    options: [
      "Use the formula: Term = start + (n − 1) × step",
      "Multiply the starting number by 100",
      "Subtract the step from the position number",
    ],
    correct: 0,
  },
];

export default function ReflectPhase({ state, dispatch }) {
  const [answers, setAnswers]     = useState({});
  const [journal, setJournal]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const narrated = useRef(false);

  const totalCorrect = state?.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  const totalStars   = state?.districtScores?.reduce((s, sc) => {
    if (sc === null || sc === undefined) return s;
    return s + calcStars(sc);
  }, 0) || 0;

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      narrate([{ text: narrationScript.reflect_intro }]);
    }
    dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect' });
    return () => stopAll();
  }, [dispatch, narrate, stopAll]);

  function handleSelectOption(qIdx, optIdx) {
    sounds.click();
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  function handleSubmit() {
    setSubmitted(true);
    stopAll();
    sounds.badge();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  }

  function playAgain() {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }

  const earnedBadges = BADGES.filter(b => state?.badges?.includes(b.id));

  if (submitted) {
    return (
      <div className="reflect-wrap">
        <div className="trophy-card glass-card anim-bounce-in">
          <div className="trophy-icon">🏆</div>
          <h1 className="trophy-title headline">You're a Pattern Grand Master!</h1>
          <p className="trophy-sub subheadline" style={{ color: 'var(--gold)' }}>
            Patterns &amp; Systematic Lists Mastery Complete ✅
          </p>

          {/* Stats Breakdown */}
          <div className="trophy-stats">
            <div className="trophy-stat">
              <span className="stat-value number-display">{totalCorrect}</span>
              <span className="stat-label label-text">/ 100 Questions</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{state?.xp || 0}</span>
              <span className="stat-label label-text">XP Earned ⭐</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{state?.maxStreak || 0}</span>
              <span className="stat-label label-text">Best Streak 🔥</span>
            </div>
          </div>

          {/* Stars */}
          <div className="trophy-stars">
            {[...Array(Math.min(Math.max(totalStars, 3), 30))].map((_, i) => (
              <span key={i} style={{ fontSize: '1.3rem', animationDelay: `${i * 0.05}s` }} className="anim-bounce-in">
                ⭐
              </span>
            ))}
          </div>

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <div className="trophy-badges">
              <p className="label-text" style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '6px' }}>
                Badges Unlocked
              </p>
              <div className="badge-list">
                {earnedBadges.map(b => (
                  <div key={b.id} className="badge-pill">
                    <span style={{ fontSize: '1.3rem' }}>{b.icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 800 }}>{b.label}</span>
                      <span className="badge-desc label-text">{b.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="trophy-actions">
            <button className="btn btn-primary trophy-cta" onClick={playAgain}>
              🔄 Play Again
            </button>
            <button className="btn btn-outline" onClick={() => dispatch({ type: 'SET_PHASE', payload: 'intro' })}>
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-wrap">
      <div className="reflect-card glass-card anim-slide-up">
        <div className="reflect-header">
          <span className="reflect-badge">📓 Learning Reflection &amp; Scorecard</span>
          <h2 className="reflect-title subheadline">Reflect on Your Pattern Journey</h2>
        </div>

        <Mascot mood="curious" message="Let's review the key pattern principles and check your scorecard! 🤖" size="sm" />

        {/* Self-assessment Concept Check */}
        <div className="reflect-quiz-container">
          <p className="body-text" style={{ color: 'var(--gold)', fontWeight: 800 }}>
            🧠 Pattern &amp; Listing Concept Check:
          </p>
          {REFLECT_QUESTIONS.map((qObj, qIdx) => (
            <div key={qIdx} className="reflect-q-item">
              <p className="reflect-q-text">{qObj.q}</p>
              <div className="reflect-opt-row">
                {qObj.options.map((opt, oIdx) => {
                  const isSelected = answers[qIdx] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      className={`option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(qIdx, oIdx)}
                      style={{ textAlign: 'left', minHeight: '44px', fontSize: '1rem', padding: '10px 14px' }}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Journal Entry */}
        <div className="reflect-journal">
          <label className="reflect-label body-text" htmlFor="journal-input">
            Write one key mathematical rule or formula you mastered:
          </label>
          <textarea
            id="journal-input"
            className="reflect-textarea"
            placeholder="e.g. Total combos = Choices at stage 1 × Choices at stage 2, and Term = start + (n - 1) × step!"
            value={journal}
            onChange={e => setJournal(e.target.value)}
            rows={2}
            aria-label="Learning journal entry"
          />

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#a0a0b8', alignSelf: 'center' }}>Quick insert:</span>
            {[
              'Total combos = Stage 1 × Stage 2 choices',
              'Term = start + (n − 1) × step',
              'List systematically without skipping or repeating',
            ].map(ex => (
              <button
                key={ex}
                type="button"
                onClick={() => setJournal(ex)}
                className="quick-insert-btn"
              >
                ✨ {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Snapshot */}
        <div className="reflect-stats">
          <div className="reflect-stat-pill">⭐ {state?.xp || 0} XP Earned</div>
          <div className="reflect-stat-pill">✅ {totalCorrect}/100 Correct</div>
          <div className="reflect-stat-pill">🔥 Best Streak: {state?.maxStreak || 0}</div>
        </div>

        <div className="reflect-actions">
          <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
            🌟 Submit Reflection &amp; View Trophy Scorecard!
          </button>
        </div>
      </div>
    </div>
  );
}
