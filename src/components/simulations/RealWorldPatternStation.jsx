// src/components/simulations/RealWorldPatternStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const SCENARIOS = [
  {
    id: 'stadium',
    name: '💺 Stadium Seating',
    unit: 'seats',
    a: 20,
    d: 6,
    targetStage: 8,
    targetAns: 62,
    options: [56, 60, 62, 68],
    desc: 'Row 1 has 20 seats. Each following row adds 6 extra seats: T_n = 20 + (n−1)×6.',
    targetPrompt: 'Predict: How many seats are in Row 8?',
  },
  {
    id: 'tiles',
    name: '🧱 Growing Tiles',
    unit: 'tiles',
    a: 4,
    d: 3,
    targetStage: 7,
    targetAns: 22,
    options: [19, 21, 22, 25],
    desc: 'Stage 1 starts with 4 border tiles. Each new stage adds 3 tiles: T_n = 4 + (n−1)×3.',
    targetPrompt: 'Predict: How many tiles are in Stage 7?',
  },
  {
    id: 'stairs',
    name: '🪜 Staircase Steps',
    unit: 'steps',
    a: 14,
    d: 14,
    targetStage: 5,
    targetAns: 70,
    options: [56, 64, 70, 84],
    desc: 'Each flight adds 14 uniform steps: T_n = 14 + (n−1)×14 = 14×n.',
    targetPrompt: 'Predict: How many total steps in Flight 5?',
  },
];

export default function RealWorldPatternStation({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [scenIdx, setScenIdx] = useState(0);
  const [n, setN] = useState(1);
  const [selectedAns, setSelectedAns] = useState(null);
  const [success, setSuccess] = useState(false);

  const scenario = SCENARIOS[scenIdx];
  const currentVal = scenario.a + (n - 1) * scenario.d;

  // Build visible tiers up to 6
  const tiers = [];
  const maxTier = Math.min(Math.max(n, 6), 8);
  for (let i = 1; i <= maxTier; i++) {
    tiers.push({
      tier: i,
      val: scenario.a + (i - 1) * scenario.d,
    });
  }

  function handlePredict(val) {
    if (success) return;
    setSelectedAns(val);
    if (val === scenario.targetAns) {
      setSuccess(true);
      setN(scenario.targetStage);
      sounds.correct();
      narrate([{
        text: `Spot on! At stage ${scenario.targetStage}, T_${scenario.targetStage} = ${scenario.targetAns} ${scenario.unit}!`,
        style: 'celebration'
      }]);
    } else {
      sounds.wrong();
      narrate([{ text: `Use the formula T_n = a + (n-1)d to calculate stage ${scenario.targetStage}.`, style: 'encouragement' }]);
    }
  }

  function switchScenario(idx) {
    stopAll();
    setScenIdx(idx);
    setN(1);
    setSelectedAns(null);
    setSuccess(false);
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🏙️ Station D: Real-World Pattern Simulator</h3>
        <div className="station-target-box">
          <span className="station-target-label">Target:</span>
          <span className="station-target-num">{scenario.targetPrompt.replace('Predict: ', '')}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Context Selector, Stage Adjuster & Prediction */}
        <div className="station-col-left">
          {/* Scenario Tabs */}
          <div style={{ display: 'flex', gap: '6px', width: '100%', flexWrap: 'wrap' }}>
            {SCENARIOS.map((sc, i) => (
              <button
                key={sc.id}
                className={scenIdx === i ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '4px 10px', fontSize: '0.82rem', minHeight: '32px' }}
                onClick={() => switchScenario(i)}
              >
                {sc.name}
              </button>
            ))}
          </div>

          {/* Stepper for Interactive Stage Simulation */}
          <div className="stepper-row">
            <div className="stepper-info">
              <span className="stepper-label">Inspect Tier / Row (n)</span>
              <span className="stepper-desc">Simulate tier-by-tier growth</span>
            </div>
            <div className="stepper-ctrls">
              <button
                className="stepper-btn"
                onClick={() => { sounds.click(); setN(v => Math.max(1, v - 1)); }}
                disabled={n <= 1}
              >−</button>
              <span className="stepper-val">{n}</span>
              <button
                className="stepper-btn"
                onClick={() => { sounds.click(); setN(v => Math.min(10, v + 1)); }}
                disabled={n >= 10}
              >+</button>
            </div>
          </div>

          {/* Live Mathematical Formula */}
          <div className="formula-eval-box">
            <span className="formula-raw">Formula: T<sub>n</sub> = {scenario.a} + (n − 1) × {scenario.d}</span>
            <span className="formula-calc">
              At Tier {n}: {scenario.a} + ({n} − 1) × {scenario.d} = <strong>{currentVal} {scenario.unit}</strong>
            </span>
          </div>

          {/* Prediction Challenge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#feca57', textAlign: 'center' }}>
              {scenario.targetPrompt}
            </span>
            <div className="detective-choices-grid">
              {scenario.options.map(opt => {
                const isSelected = selectedAns === opt;
                let cls = 'detective-btn';
                if (isSelected) {
                  cls += opt === scenario.targetAns ? ' correct' : ' wrong';
                }
                return (
                  <button
                    key={opt}
                    className={cls}
                    onClick={() => handlePredict(opt)}
                    disabled={success}
                  >
                    {opt} {scenario.unit}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Growing Tiers & Success */}
        <div className="station-col-right">
          <div className="running-ratio-bar">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.92rem, 1.05vw, 1.05rem)', color: '#fff' }}>
              Base: <strong>{scenario.a}</strong> &nbsp;|&nbsp; Constant Growth: <strong>+{scenario.d} per tier</strong>
            </div>
            <div className={`running-ratio-text ${success ? 'exact' : ''}`}>
              {success ? `🎉 Calculation Verified! T_${scenario.targetStage} = ${scenario.targetAns}` : scenario.desc}
            </div>
          </div>

          {/* Visual Tiered Graphic */}
          <div className="realworld-tiers-display">
            {tiers.map(t => {
              const pct = Math.min(100, Math.round((t.val / (scenario.a + 7 * scenario.d)) * 100));
              const isSelected = t.tier === n;
              return (
                <div key={t.tier} className="tier-bar-row">
                  <span className="tier-label" style={{ color: isSelected ? '#fde047' : '#94a3b8' }}>
                    Row {t.tier}:
                  </span>
                  <div
                    className="tier-fill-bar"
                    style={{
                      width: `${Math.max(22, pct)}%`,
                      background: isSelected ? 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)' : undefined,
                    }}
                  >
                    {t.val} {scenario.unit}
                  </div>
                </div>
              );
            })}
          </div>

          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Excellent! You applied <strong>T<sub>n</sub> = a + (n−1)d</strong> to solve real-world patterns!
                </p>
              </div>
              <div className="station-success-actions">
                <button
                  className="btn-primary"
                  onClick={() => switchScenario((scenIdx + 1) % SCENARIOS.length)}
                >
                  Try Next Model
                </button>
                <button className="btn-green" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                💡 Real-world linear patterns follow arithmetic progressions: Row n = First Row + (n − 1) × Row Step.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
