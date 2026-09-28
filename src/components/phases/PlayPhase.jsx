// src/components/phases/PlayPhase.jsx (Named as Practice)
import React, { useState, useEffect, useRef } from 'react';
import './PlayPhase.css';
import KingdomMap from '../gamification/KingdomMap.jsx';
import QuestionRenderer from '../quiz/QuestionRenderer.jsx';
import BossBattleModal from '../quiz/BossBattleModal.jsx';
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { DISTRICTS } from '../../data/questionBank.js';
import { narrationScript } from '../../data/narration.js';
import confetti from 'canvas-confetti';

export default function PlayPhase({ state, dispatch }) {
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const [showMap, setShowMap]       = useState(state?.currentQuestion === 0);
  const [hintsShown, setHintsShown] = useState(0);
  const [showHint, setShowHint]     = useState(false);
  const [showBoss, setShowBoss]     = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const feedbackTimer               = useRef(null);

  const qs = state?.questionSet || [];
  const qIdx = state?.currentQuestion || 0;
  const question = qs[qIdx];
  const distIdx = state?.currentDistrict || 0;
  const district = DISTRICTS[distIdx] || DISTRICTS[0];
  const qInDistrict = qIdx % 10;
  const isPlayDone = state?.phaseComplete?.play;

  // Narrate question prompt when question changes
  useEffect(() => {
    if (!showMap && !showBoss && question && !state?.showFeedback) {
      const timer = setTimeout(() => {
        const text = question.prompt || question.questionText;
        if (text) narrate([{ text }]);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [qIdx, showMap, showBoss, narrate, question, state?.showFeedback]);

  // Auto-dismiss popup after 2.4s
  useEffect(() => {
    if (state?.showFeedback) {
      feedbackTimer.current = setTimeout(() => {
        if (state?.showFeedback === 'correct') {
          dispatch({ type: 'CLEAR_FEEDBACK' });
          advanceQuestion();
        } else {
          handleAfterWrong();
        }
      }, 2400);
    }
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, [state?.showFeedback]);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      stopAll();
    };
  }, [stopAll]);

  function handleAnswer(answer) {
    stopAll();
    setSelectedAnswer(answer);
    const isCorrect = String(answer).trim() === String(question.correctAnswer).trim();

    if (isCorrect) {
      sounds.correct();
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
      dispatch({ type: 'ANSWER_CORRECT' });
    } else {
      sounds.wrong();
      dispatch({ type: 'ANSWER_INCORRECT', payload: question.explanation });
      setHintsShown(0);
    }
  }

  function advanceQuestion() {
    setSelectedAnswer(null);
    setHintsShown(0);
    setShowHint(false);
    const nextIdx = qIdx + 1;

    if (nextIdx % 10 === 0 && nextIdx <= 100) {
      sounds.levelUp();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
      dispatch({ type: 'NEXT_QUESTION' });
      setShowMap(true);
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  }

  function handleShowHint() {
    stopAll();
    dispatch({ type: 'USE_HINT' });
    if (hintsShown === 0) {
      setShowHint(1);
      setHintsShown(1);
      if (question.hint || question.hint1) {
        narrate([{ text: question.hint || question.hint1 }]);
      }
    } else {
      setShowHint(2);
      setHintsShown(2);
      if (question.explanation || question.hint2) {
        narrate([{ text: question.explanation || question.hint2 }]);
      }
    }
  }

  function handleAfterWrong() {
    setSelectedAnswer(null);
    dispatch({ type: 'CLEAR_FEEDBACK' });
    advanceQuestion();
  }

  function handlePrevQuestion() {
    stopAll();
    setSelectedAnswer(null);
    dispatch({ type: 'CLEAR_FEEDBACK' });
    dispatch({ type: 'PREV_QUESTION' });
  }

  function handleNextQuestion() {
    stopAll();
    setSelectedAnswer(null);
    dispatch({ type: 'CLEAR_FEEDBACK' });
    advanceQuestion();
  }

  function startDistrict(idx) {
    setShowMap(false);
    setSelectedAnswer(null);
  }

  // Play done screen
  if (isPlayDone || (qIdx >= 100 && !showMap)) {
    const totalCorrect = state?.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
    return (
      <div className="play-done-wrap">
        <div className="play-done-card glass-card anim-bounce-in">
          <div className="play-done-icon">🏆</div>
          <h2 className="play-done-title headline">Practice Phase Complete!</h2>
          <div className="play-done-stats">
            <div className="stat-pill"><span>✅</span><span>{totalCorrect}/100 Correct</span></div>
            <div className="stat-pill"><span>⭐</span><span>{state?.xp || 0} XP Earned</span></div>
            <div className="stat-pill"><span>🔥</span><span>Best Streak: {state?.maxStreak || 0}</span></div>
          </div>
          <button className="btn btn-primary play-done-cta" onClick={() => dispatch({ type: 'SET_PHASE', payload: 'reflect' })}>
            🌟 Go to Reflect Phase
          </button>
        </div>
      </div>
    );
  }

  // District Map Screen
  if (showMap) {
    const isAllDone = qIdx >= 100;
    return (
      <div className="play-map-wrap">
        <div className="play-map-card glass-card">
          <h2 className="play-map-title subheadline">🗺️ Practice Worlds Kingdom</h2>
          <p className="body-text" style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
            {isAllDone ? (
              <strong style={{ color: 'var(--gold)' }}>All 10 Practice Worlds Complete!</strong>
            ) : (
              <>World {distIdx + 1}: <strong style={{ color: 'var(--gold)' }}>{district.name}</strong></>
            )}
          </p>

          <KingdomMap
            districtScores={state?.districtScores || []}
            districtCorrect={state?.districtCorrect || []}
            currentDistrict={isAllDone ? 10 : distIdx}
            onSelectDistrict={(d) => {
              if (d <= distIdx) {
                setShowMap(false);
              }
            }}
          />

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
            {!isAllDone ? (
              <>
                <button className="btn btn-primary" onClick={() => startDistrict(distIdx)}>
                  🚀 Enter {district.name}!
                </button>
                <button className="btn btn-outline" onClick={() => setShowBoss(true)} style={{ borderColor: '#feca57', color: '#feca57' }}>
                  👑 Challenge Boss ({district.boss.name})
                </button>
                <button className="btn btn-outline" onClick={() => dispatch({ type: 'SET_PHASE', payload: 'reflect' })}>
                  📓 Jump to Reflect
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setShowMap(false)}>
                📊 View Results
              </button>
            )}
          </div>
        </div>

        {/* Boss Battle Modal from map */}
        {showBoss && (
          <BossBattleModal
            boss={district.boss}
            questions={qs.slice(distIdx * 10, distIdx * 10 + 5)}
            onWin={() => {
              setShowBoss(false);
              dispatch({ type: 'UNLOCK_BADGE', payload: 'boss_slayer' });
            }}
            onClose={() => setShowBoss(false)}
            audioEnabled={state?.audioEnabled}
          />
        )}
      </div>
    );
  }

  return (
    <div className="play-wrap">
      {/* Sleek Compact Top Bar */}
      <div className="play-top-bar">
        <div className="play-topic-compact">
          <span className="topic-name">
            <span className="topic-icon">{district.icon}</span> W{distIdx + 1}: {district.name}
          </span>
          <button
            className="topic-mini-btn"
            onClick={() => setShowBoss(true)}
            title="Challenge World Boss"
          >
            👑 Boss
          </button>
          <button
            className="topic-mini-btn"
            onClick={() => setShowMap(true)}
            title="View World Map"
          >
            🗺️ Map
          </button>
        </div>

        <div className="play-hud-compact">
          <span className="hud-pill-mini">⭐ {state?.xp || 0} XP</span>
          <span className="hud-pill-mini">🔥 {state?.streak || 0}x</span>
          <span className="hud-pill-mini q-num">Q {qInDistrict + 1}/10</span>
        </div>
      </div>

      {/* Question Progress Mini Line */}
      <div className="play-progress-line">
        <div className="play-progress-fill" style={{ width: `${((qInDistrict + 1) / 10) * 100}%` }} />
      </div>

      {/* Question Renderer */}
      {question && (
        <div className="play-question-area">
          <QuestionRenderer
            question={question}
            onAnswer={handleAnswer}
            hintsShown={hintsShown}
            showHint={showHint}
            onHint={handleShowHint}
            isLocked={state?.showFeedback === 'correct' || selectedAnswer !== null}
            onPrev={handlePrevQuestion}
            onNext={handleNextQuestion}
            canPrev={qInDistrict > 0}
            selectedAnswer={selectedAnswer}
          />
        </div>
      )}

      {/* Boss Battle Modal */}
      {showBoss && (
        <BossBattleModal
          boss={district.boss}
          questions={qs.slice(distIdx * 10, distIdx * 10 + 5)}
          onWin={() => {
            setShowBoss(false);
            dispatch({ type: 'UNLOCK_BADGE', payload: 'boss_slayer' });
          }}
          onClose={() => setShowBoss(false)}
          audioEnabled={state?.audioEnabled}
        />
      )}

      {/* Feedback Overlay */}
      {state?.showFeedback && (
        <FeedbackOverlay
          isCorrect={state?.showFeedback === 'correct'}
          explanation={question?.explanation}
          onContinue={state?.showFeedback === 'correct' ? () => { dispatch({ type: 'CLEAR_FEEDBACK' }); advanceQuestion(); } : handleAfterWrong}
        />
      )}
    </div>
  );
}
