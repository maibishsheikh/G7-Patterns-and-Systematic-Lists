// src/components/quiz/BossBattleModal.jsx
import React, { useState } from 'react';
import './BossBattleModal.css';
import QuestionRenderer from './QuestionRenderer.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import confetti from 'canvas-confetti';

export default function BossBattleModal({ boss, questions, onWin, onClose, audioEnabled }) {
  const { sounds } = useAudio(audioEnabled);
  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const question = questions[qIndex] || questions[0];

  function startBattle() {
    setStarted(true);
    sounds.streak();
  }

  function handleAnswer(ans) {
    setSelectedAnswer(ans);
    const isCorrect = String(ans).trim() === String(question.correctAnswer).trim();

    if (isCorrect) {
      sounds.correct();
      setTimeout(() => {
        setSelectedAnswer(null);
        if (qIndex + 1 >= questions.length) {
          setWon(true);
          sounds.badge();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
        } else {
          setQIndex(qIndex + 1);
        }
      }, 700);
    } else {
      sounds.wrong();
      const nextLives = lives - 1;
      setLives(nextLives);
      setTimeout(() => {
        setSelectedAnswer(null);
        if (nextLives <= 0) {
          setLost(true);
          sounds.defeat();
        }
      }, 700);
    }
  }

  if (!started) {
    return (
      <div className="boss-modal-backdrop">
        <div className="boss-modal-card glass-card anim-bounce-in">
          <div className="boss-avatar-pulse">
            <span className="boss-emoji">{boss.emoji}</span>
          </div>
          <h2 className="boss-title">{boss.name}</h2>
          <p className="boss-desc">
            Answer {questions.length} pattern &amp; listing challenges correctly to defeat the boss!
          </p>
          <div className="boss-lives-preview">
            Lives: {'❤️'.repeat(3)}
          </div>
          <div className="boss-reward-preview">
            Reward: <strong>{boss.reward}</strong> (+50 XP)
          </div>
          <div className="boss-actions">
            <button className="btn btn-primary" onClick={startBattle}>
              ⚔️ Begin Boss Battle!
            </button>
            <button className="btn btn-outline" onClick={onClose}>
              Back to World
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (won) {
    return (
      <div className="boss-modal-backdrop">
        <div className="boss-modal-card glass-card anim-celebrate">
          <div className="boss-avatar-pulse" style={{ background: 'rgba(76, 175, 80, 0.4)' }}>
            <span className="boss-emoji">🏆</span>
          </div>
          <h2 className="boss-title" style={{ color: 'var(--green-light)' }}>Boss Defeated!</h2>
          <p className="boss-desc">
            You conquered {boss.name} and claimed the <strong>{boss.reward}</strong>!
          </p>
          <button className="btn btn-green" onClick={onWin}>
            Claim Reward &amp; Continue ✨
          </button>
        </div>
      </div>
    );
  }

  if (lost) {
    return (
      <div className="boss-modal-backdrop">
        <div className="boss-modal-card glass-card anim-shake">
          <div className="boss-avatar-pulse" style={{ background: 'rgba(239, 83, 80, 0.4)' }}>
            <span className="boss-emoji">💔</span>
          </div>
          <h2 className="boss-title" style={{ color: 'var(--red-light)' }}>Out of Lives!</h2>
          <p className="boss-desc">
            {boss.name} was too tricky! Review the patterns and challenge the boss again.
          </p>
          <button className="btn btn-primary" onClick={onClose}>
            Return to Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="boss-modal-backdrop">
      <div className="boss-modal-card battle-mode glass-card">
        {/* Boss HUD */}
        <div className="boss-hud">
          <div className="boss-hud-left">
            <span className="boss-hud-emoji">{boss.emoji}</span>
            <span className="boss-hud-name">{boss.name}</span>
          </div>
          <div className="boss-hud-lives">
            {'❤️'.repeat(lives)}{'🖤'.repeat(Math.max(0, 3 - lives))}
          </div>
          <div className="boss-hud-progress">
            {qIndex + 1}/{questions.length}
          </div>
        </div>

        {/* Question Area */}
        <QuestionRenderer
          question={question}
          onAnswer={handleAnswer}
          hintsShown={2}
          showHint={false}
          onHint={() => {}}
          isLocked={selectedAnswer !== null}
          selectedAnswer={selectedAnswer}
        />
      </div>
    </div>
  );
}
