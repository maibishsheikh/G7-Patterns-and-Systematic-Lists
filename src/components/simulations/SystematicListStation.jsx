// src/components/simulations/SystematicListStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const SCENARIOS = [
  {
    id: 'outfits',
    name: '👕 Expedition Outfits',
    cat1Label: 'Tops (Shirts)',
    cat2Label: 'Bottoms (Shorts/Pants)',
    cat1Items: [
      { id: 't1', name: '🔴 Red Hoodie', icon: '👕' },
      { id: 't2', name: '🔵 Blue Shirt', icon: '👔' },
      { id: 't3', name: '🟢 Green Polo', icon: '🎽' },
    ],
    cat2Items: [
      { id: 'b1', name: '👖 Denim Jeans', icon: '👖' },
      { id: 'b2', name: '🩳 Sport Shorts', icon: '🩳' },
    ],
  },
  {
    id: 'cafeteria',
    name: '🥪 Mission Snacks',
    cat1Label: 'Breads',
    cat2Label: 'Fillings',
    cat1Items: [
      { id: 'br1', name: '🍞 Whole Wheat', icon: '🍞' },
      { id: 'br2', name: '🥖 Crisp Baguette', icon: '🥖' },
      { id: 'br3', name: '🥐 Croissant', icon: '🥐' },
    ],
    cat2Items: [
      { id: 'f1', name: '🧀 Cheddar', icon: '🧀' },
      { id: 'f2', name: '🥑 Avocado', icon: '🥑' },
      { id: 'f3', name: '🍳 Fresh Egg', icon: '🍳' },
    ],
  },
  {
    id: 'dice_coins',
    name: '🎲 Mission Signals',
    cat1Label: 'Coin Flips',
    cat2Label: 'Dice Rolls',
    cat1Items: [
      { id: 'c1', name: '🪙 Heads (H)', icon: '🪙' },
      { id: 'c2', name: '🪙 Tails (T)', icon: '🪙' },
    ],
    cat2Items: [
      { id: 'd1', name: '🎲 Roll 1', icon: '⚀' },
      { id: 'd2', name: '🎲 Roll 2', icon: '⚁' },
      { id: 'd3', name: '🎲 Roll 3', icon: '⚂' },
      { id: 'd4', name: '🎲 Roll 4', icon: '⚃' },
    ],
  },
];

export default function SystematicListStation({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [scenIdx, setScenIdx] = useState(0);
  const [generatedList, setGeneratedList] = useState([]);
  const [success, setSuccess] = useState(false);

  const scenario = SCENARIOS[scenIdx];
  const totalPossible = scenario.cat1Items.length * scenario.cat2Items.length;

  function generateList() {
    sounds.click();
    const pairs = [];
    let idx = 1;
    for (const item1 of scenario.cat1Items) {
      for (const item2 of scenario.cat2Items) {
        pairs.push({
          id: `${item1.id}-${item2.id}`,
          idx: idx++,
          item1: item1.name,
          item2: item2.name,
        });
      }
    }
    setGeneratedList(pairs);
    setSuccess(true);
    sounds.correct();
    narrate([{
      text: `Magnificent! Systematic list generated: ${scenario.cat1Items.length} × ${scenario.cat2Items.length} = ${totalPossible} unique outcomes without missing any!`,
      style: 'celebration'
    }]);
  }

  function handleClear() {
    sounds.click();
    setGeneratedList([]);
    setSuccess(false);
  }

  function switchScenario(idx) {
    stopAll();
    setScenIdx(idx);
    setGeneratedList([]);
    setSuccess(false);
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">📋 Station B: Systematic List &amp; Combo Builder</h3>
        <div className="station-target-box">
          <span className="station-target-label">Target:</span>
          <span className="station-target-num">{totalPossible} Systematic Pairs</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Category Selectors & Counting Principle */}
        <div className="station-col-left">
          {/* Scenario Chooser */}
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

          {/* Categories Matrix */}
          <div className="outfit-selector-grid">
            <div className="outfit-category-box">
              <span className="outfit-category-title">
                Stage 1: {scenario.cat1Label} ({scenario.cat1Items.length})
              </span>
              {scenario.cat1Items.map(item => (
                <div key={item.id} className="outfit-item-toggle active">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            <div className="outfit-category-box">
              <span className="outfit-category-title">
                Stage 2: {scenario.cat2Label} ({scenario.cat2Items.length})
              </span>
              {scenario.cat2Items.map(item => (
                <div key={item.id} className="outfit-item-toggle active">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Counting Principle Formula Box */}
          <div className="formula-eval-box">
            <span className="formula-raw">Fundamental Counting Principle (Multiplication Rule)</span>
            <span className="formula-calc">
              Total Outcomes = {scenario.cat1Items.length} × {scenario.cat2Items.length} = <strong>{totalPossible} Pairs</strong>
            </span>
          </div>

          <div className="station-actions">
            <button className="btn-outline" onClick={handleClear} disabled={generatedList.length === 0}>
              Clear
            </button>
            <button className="btn-primary" onClick={generateList} disabled={success}>
              Build Systematic List
            </button>
          </div>
        </div>

        {/* Right Column: Live Systematic Table & Success */}
        <div className="station-col-right">
          <div className="running-ratio-bar">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.92rem, 1.05vw, 1.05rem)', color: '#fff' }}>
              Systematic Outcomes: <strong style={{ color: generatedList.length === totalPossible ? '#4ade80' : 'var(--gold)' }}>{generatedList.length} / {totalPossible}</strong>
            </div>
            <div className={`running-ratio-text ${generatedList.length === totalPossible ? 'exact' : ''}`}>
              {generatedList.length === 0
                ? '📋 Tap "Build Systematic List" to organize every pair in order!'
                : `Systematic Tree: Fix Stage 1, pair with every Stage 2 item`}
            </div>
          </div>

          {/* Systematic Table Container */}
          <div className="systematic-table-box">
            {generatedList.length === 0 ? (
              <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.88rem', margin: 'auto', textAlign: 'center' }}>
                📋 No combinations listed yet.<br />Click "Build Systematic List" to generate in order!
              </span>
            ) : (
              generatedList.map(pair => (
                <div key={pair.id} className="systematic-pair-item anim-slide-up">
                  <span className="pair-idx">#{pair.idx}</span>
                  <span>{pair.item1}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>+</span>
                  <span>{pair.item2}</span>
                </div>
              ))
            )}
          </div>

          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Systematic list complete! All <strong>{totalPossible}</strong> combinations generated with zero duplicates!
                </p>
              </div>
              <div className="station-success-actions">
                <button
                  className="btn-primary"
                  onClick={() => switchScenario((scenIdx + 1) % SCENARIOS.length)}
                >
                  Try Next Scenario
                </button>
                <button className="btn-green" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                💡 A systematic list arranges every outcome step-by-step so nothing is missed and nothing is counted twice!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
