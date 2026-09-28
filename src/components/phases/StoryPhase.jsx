// src/components/phases/StoryPhase.jsx
import React, { useEffect, useState } from 'react';
import './StoryPhase.css';
import { storySlides } from '../../data/storySlides.js';
import { narrationScript } from '../../data/narration.js';
import { useAudio } from '../../hooks/useAudio.js';

function StoryImage({ slide }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [slide.id]);

  return (
    <div className="story-image-container">
      {!imgError && slide.image ? (
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          onError={() => setImgError(true)}
          className="story-full-img"
        />
      ) : (
        <div className="story-img-fallback">
          <span className="fallback-emoji">🔢</span>
          <span className="fallback-title">{slide.title}</span>
          <span className="fallback-highlight">{slide.keyPoint}</span>
        </div>
      )}
    </div>
  );
}

export default function StoryPhase({ state, dispatch }) {
  const panelIdx = state?.storyPanel || 0;
  const slide = storySlides[panelIdx] || storySlides[0];
  const totalSlides = storySlides.length;
  const isLast = panelIdx >= totalSlides - 1;

  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    stopAll();
    const audioKey = `story_slide_${panelIdx + 1}`;
    const textToPlay = narrationScript[audioKey] || slide.narrative;
    const timer = setTimeout(() => {
      narrate([{ text: textToPlay }]);
    }, 300);
    return () => {
      clearTimeout(timer);
      stopAll();
    };
  }, [panelIdx, narrate, stopAll, slide.narrative]);

  function handleNext() {
    stopAll();
    dispatch({ type: 'NEXT_STORY_PANEL' });
  }

  function handlePrev() {
    stopAll();
    dispatch({ type: 'PREV_STORY_PANEL' });
  }

  return (
    <div className="story-wrap">
      <div className="story-container anim-slide-up" key={panelIdx}>
        {/* Top Progress Bar Row */}
        <div className="story-progress-bar-row">
          <div className="story-track">
            <div
              className="story-fill"
              style={{ width: `${((panelIdx + 1) / totalSlides) * 100}%` }}
            />
          </div>
          <span className="story-counter-text">{panelIdx + 1} / {totalSlides}</span>
        </div>

        {/* Main Horizontal Story Card */}
        <div className="story-main-card">
          {/* Left: Complete Image in full frame */}
          <div className="story-image-section">
            <StoryImage slide={slide} />
          </div>

          {/* Right: Story Content */}
          <div className="story-content-section">
            <h2 className="story-title">{slide.title}</h2>
            <p className="story-text">{slide.narrative}</p>

            {slide.keyPoint && (
              <div className="story-prompt-pill">
                <span className="prompt-icon">💡</span>
                <span className="prompt-text">{slide.keyPoint}</span>
              </div>
            )}

            {/* Character Badge (Robo, No English names) */}
            <div className="story-character-badge">
              <div className="character-avatar-circle">🤖</div>
              <span className="character-name">Robo: "{slide.mascotDialogue}"</span>
            </div>

            {/* Footer Navigation */}
            <div className="story-footer-nav">
              <div className="story-dots-center">
                {storySlides.map((_, i) => (
                  <span
                    key={i}
                    className={`story-nav-dot ${i === panelIdx ? 'active' : ''} ${i < panelIdx ? 'done' : ''}`}
                  />
                ))}
              </div>

              <div className="story-nav-actions">
                <button
                  className="btn btn-outline"
                  onClick={handlePrev}
                  disabled={panelIdx === 0}
                >
                  ← Previous
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  {isLast ? 'Enter Simulations 🧪' : 'Next →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
