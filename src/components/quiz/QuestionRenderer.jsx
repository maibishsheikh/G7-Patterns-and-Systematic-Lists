// src/components/quiz/QuestionRenderer.jsx
import React from 'react';
import './QuestionRenderer.css';
import { PatternDiagramSVG } from '../PatternDiagramSVG.jsx';

export default function QuestionRenderer({
  question,
  onAnswer,
  hintsShown,
  showHint,
  onHint,
  isLocked,
  onPrev,
  onNext,
  canPrev,
  selectedAnswer,
}) {
  if (!question) return null;

  const { category, questionText, prompt, options, diagram, hint1, hint2, hint, correctAnswer } = question;
  const displayText = questionText || prompt;
  const categoryTag = category || 'PATTERNS & LISTS';
  const h1 = hint1 || hint;
  const h2 = hint2;

  return (
    <div className="qr-wrap glass-card anim-slide-up">
      {/* Top category badge tag */}
      <div className="qr-category-badge">
        <span className="cat-icon">🔢</span> {categoryTag}
      </div>

      {/* Question text */}
      <p className="qr-question">{displayText}</p>

      {/* Visual aid if available */}
      {diagram && (
        <div className="qr-visual">
          <PatternDiagramSVG diagram={diagram} size={280} />
        </div>
      )}

      {/* Options — 2x2 grid */}
      <div className="options-grid">
        {options?.map((opt, i) => {
          const isSelected = selectedAnswer !== null && String(selectedAnswer).trim() === String(opt).trim();
          const isCorrectAnswer = isSelected && String(opt).trim() === String(correctAnswer).trim();

          let btnClass = 'option-btn';
          if (isSelected) {
            btnClass += isCorrectAnswer ? ' correct' : ' wrong';
          }

          return (
            <button
              key={i}
              className={btnClass}
              onClick={() => !isLocked && onAnswer(opt)}
              disabled={isLocked}
              aria-label={`Option: ${opt}`}
            >
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Hint display */}
      {showHint === 1 && h1 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">💡</span>
          <span>{h1}</span>
        </div>
      )}
      {showHint === 2 && h2 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">🔑</span>
          <span>{h2}</span>
        </div>
      )}

      {/* Bottom Action Row */}
      <div className="qr-actions-row">
        {hintsShown < 2 && onHint ? (
          <button className="btn btn-outline btn-sm hint-btn" onClick={onHint} aria-label="Show hint">
            💡 Hint {hintsShown + 1}
          </button>
        ) : <div />}

        <div className="qr-nav-btns">
          {onPrev && (
            <button
              className="btn btn-outline btn-sm qr-nav-btn"
              onClick={onPrev}
              disabled={!canPrev}
              aria-label="Previous question"
            >
              ← Prev
            </button>
          )}
          {onNext && (
            <button
              className="btn btn-primary btn-sm qr-nav-btn"
              onClick={onNext}
              aria-label="Next question"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
