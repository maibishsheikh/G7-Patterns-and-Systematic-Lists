// src/components/simulations/SequenceLabStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const CHALLENGES = [
  { targetPos: 5, targetVal: 23, hint: 'Build a sequence where Term 5 equals 23 using T_n = a + (n−1)d!' },
  { targetPos: 6, targetVal: 32, hint: 'Adjust first term (a) and common difference (d) so that Term 6 = 32!' },
  { targetPos: 8, targetVal: 37, hint: 'Target: Term 8 must equal 37! What starting number and step work?' },
  { targetPos: 7, targetVal: 46, hint: 'Target: Term 7 = 46! Find the right first term (a) and common step (d).' },
];

export default function SequenceLabStation({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [challIdx, setChallIdx] = useState(0);
  const [a, setA] = useState(3);
  const [d, setD] = useState(4);
  const [n, setN] = useState(5);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const challenge = CHALLENGES[challIdx] || CHALLENGES[0];
  const currentVal = a + (n - 1) * d;
  const isMatch = n === challenge.targetPos && currentVal === challenge.targetVal;

  // Generate the first n terms for the rail
  const terms = [];
  for (let i = 1; i <= Math.max(n, 6); i++) {
    terms.push({ pos: i, val: a + (i - 1) * d });
  }

  function handleCheck() {
    if (isMatch) {
      setSuccess(true);
      sounds.correct();
      narrate([{ text: `Brilliant! T_${challenge.targetPos} = ${challenge.targetVal} matches the target perfectly!`, style: 'celebration' }]);
    } else {
      setShake(true);
      sounds.wrong();
      if (n !== challenge.targetPos) {
        narrate([{ text: `Set term position (n) to ${challenge.targetPos} to test this target.`, style: 'encouragement' }]);
      } else if (currentVal < challenge.targetVal) {
        narrate([{ text: `Current value ${currentVal} is less than target ${challenge.targetVal}. Increase a or d!`, style: 'encouragement' }]);
      } else {
        narrate([{ text: `Current value ${currentVal} is greater than target ${challenge.targetVal}. Decrease a or d!`, style: 'encouragement' }]);
      }
      setTimeout(() => setShake(false), 600);
    }
  }

  function handleReset() {
    sounds.click();
    setA(3);
    setD(2);
    setN(challenge.targetPos);
    setSuccess(false);
  }

  function newChallenge() {
    stopAll();
    const nextIdx = (challIdx + 1) % CHALLENGES.length;
    setChallIdx(nextIdx);
    setN(CHALLENGES[nextIdx].targetPos);
    setSuccess(false);
  }

  return (
    <div className="station-wrap">
      {/* Header with target badge */}
      <div className="station-header">
        <h3 className="station-title">🧪 Station A: Sequence &amp; AP Formula Lab</h3>
        <div className={`station-target-box ${shake ? 'anim-shake' : ''}`}>
          <span className="station-target-label">Target Term:</span>
          <span className="station-target-num">T<sub>{challenge.targetPos}</sub> = {challenge.targetVal}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Variable Controls & Live Formula */}
        <div className="station-col-left">
          <div className="stepper-list">
            {/* First Term (a) */}
            <div className="stepper-row">
              <div className="stepper-info">
                <span className="stepper-label">First Term (a)</span>
                <span className="stepper-desc">Starting number of sequence</span>
              </div>
              <div className="stepper-ctrls">
                <button
                  className="stepper-btn"
                  onClick={() => { sounds.click(); setA(v => Math.max(1, v - 1)); setSuccess(false); }}
                  disabled={a <= 1 || success}
                >−</button>
                <span className="stepper-val">{a}</span>
                <button
                  className="stepper-btn"
                  onClick={() => { sounds.click(); setA(v => Math.min(20, v + 1)); setSuccess(false); }}
                  disabled={a >= 20 || success}
                >+</button>
              </div>
            </div>

            {/* Common Difference (d) */}
            <div className="stepper-row">
              <div className="stepper-info">
                <span className="stepper-label">Common Difference (d)</span>
                <span className="stepper-desc">Constant step added each time</span>
              </div>
              <div className="stepper-ctrls">
                <button
                  className="stepper-btn"
                  onClick={() => { sounds.click(); setD(v => Math.max(1, v - 1)); setSuccess(false); }}
                  disabled={d <= 1 || success}
                >−</button>
                <span className="stepper-val">{d}</span>
                <button
                  className="stepper-btn"
                  onClick={() => { sounds.click(); setD(v => Math.min(15, v + 1)); setSuccess(false); }}
                  disabled={d >= 15 || success}
                >+</button>
              </div>
            </div>

            {/* Term Position (n) */}
            <div className="stepper-row">
              <div className="stepper-info">
                <span className="stepper-label">Term Position (n)</span>
                <span className="stepper-desc">Which step in line (1st, 2nd, nth)</span>
              </div>
              <div className="stepper-ctrls">
                <button
                  className="stepper-btn"
                  onClick={() => { sounds.click(); setN(v => Math.max(1, v - 1)); setSuccess(false); }}
                  disabled={n <= 1 || success}
                >−</button>
                <span className="stepper-val">{n}</span>
                <button
                  className="stepper-btn"
                  onClick={() => { sounds.click(); setN(v => Math.min(12, v + 1)); setSuccess(false); }}
                  disabled={n >= 12 || success}
                >+</button>
              </div>
            </div>
          </div>

          {/* Live Mathematical Formula Card */}
          <div className="formula-eval-box">
            <span className="formula-raw">General Term Formula: T<sub>n</sub> = a + (n − 1) × d</span>
            <span className="formula-calc">
              T<sub>{n}</sub> = {a} + ({n} − 1) × {d} = {a} + {(n - 1) * d} = <strong>{currentVal}</strong>
            </span>
          </div>

          <div className="station-actions">
            <button className="btn-outline" onClick={handleReset}>
              Reset
            </button>
            <button className="btn-primary" onClick={handleCheck} disabled={success}>
              Check Target
            </button>
            <button className="btn-outline" onClick={newChallenge}>
              New Target
            </button>
          </div>
        </div>

        {/* Right Column: Visual Sequence Rail & Success */}
        <div className="station-col-right">
          <div className="running-ratio-bar">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.92rem, 1.05vw, 1.05rem)', color: '#fff' }}>
              Current: <strong>T<sub>{n}</sub> = {currentVal}</strong> &nbsp;|&nbsp; Target: <strong>T<sub>{challenge.targetPos}</sub> = {challenge.targetVal}</strong>
            </div>
            <div className={`running-ratio-text ${isMatch ? 'exact' : currentVal > challenge.targetVal ? 'over' : ''}`}>
              {isMatch ? `🎯 Exact Match! T_${challenge.targetPos} = ${challenge.targetVal}` : `Step Rule: Start at ${a}, add ${d} every step`}
            </div>
          </div>

          {/* Visual Sequence Rail */}
          <div className="sequence-rail-container">
            <div className="sequence-rail-terms">
              {terms.map((t, idx) => (
                <React.Fragment key={t.pos}>
                  <div className={`rail-term-card ${t.pos === n ? 'target-term' : ''}`}>
                    <span className="rail-pos-label">T<sub>{t.pos}</sub></span>
                    <span className="rail-val-num">{t.val}</span>
                  </div>
                  {idx < terms.length - 1 && (
                    <span className="rail-step-arrow">+{d}➔</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Target matched! <strong>T<sub>{challenge.targetPos}</sub> = {challenge.targetVal}</strong> with a = {a} and d = {d}!
                </p>
              </div>
              <div className="station-success-actions">
                <button className="btn-primary" onClick={newChallenge}>
                  Try Another
                </button>
                <button className="btn-green" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                💡 {challenge.hint}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
