import React, { useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import { storySlides } from '../data/storySlides';
import { narrationScript } from '../data/narration';
import soundEngine from '../utils/audio';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const StoryStage = () => {
  const { storySlideIndex, setStorySlideIndex, setStage } = useAppStore();

  const currentSlide = storySlides[storySlideIndex] || storySlides[0];

  useEffect(() => {
    const audioKey = `story_slide_${storySlideIndex + 1}`;
    const textToPlay = narrationScript[audioKey] || currentSlide.narrative;
    soundEngine.playText(textToPlay);
    return () => {
      soundEngine.stop();
    };
  }, [storySlideIndex]);

  const handleMascotSpeak = () => {
    const audioKey = `story_slide_${storySlideIndex + 1}`;
    const textToPlay = narrationScript[audioKey] || currentSlide.narrative;
    soundEngine.playText(textToPlay);
  };

  const handleNext = () => {
    if (storySlideIndex < storySlides.length - 1) {
      setStorySlideIndex(storySlideIndex + 1);
    } else {
      setStage('simulate');
    }
  };

  const handlePrev = () => {
    if (storySlideIndex > 0) {
      setStorySlideIndex(storySlideIndex - 1);
    } else {
      setStage('wonder');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-3 md:p-5 cosmic-bg overflow-hidden select-none">
      
      {/* 1. Main Stage Header Title & Subtitle */}
      <div className="flex flex-col items-center text-center space-y-1 pt-0.5 shrink-0 w-full max-w-xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-amber-400 font-display flex items-center gap-2">
          <span>📖</span>
          <span>Concept Story</span>
        </h1>
        <p className="text-sm md:text-base font-extrabold text-purple-200">
          Discover the rule behind patterns, and the golden rule for systematic lists!
        </p>

        {/* Story Progress Bar */}
        <div className="w-full bg-[#130E26] rounded-full h-3.5 p-0.5 border border-purple-700/60 shadow-inner mt-1">
          <div
            className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(255,184,0,0.8)] flex items-center justify-end pr-2 text-[9px] font-black text-slate-950"
            style={{ width: `${((storySlideIndex + 1) / storySlides.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-black text-amber-300 tracking-wider">
          SLIDE {storySlideIndex + 1} OF {storySlides.length} ({Math.round(((storySlideIndex + 1) / storySlides.length) * 100)}%)
        </span>
      </div>

      {/* 2. Main Story Card Workspace */}
      <div className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center my-auto overflow-hidden px-2">
        <div className="w-full bg-[#130E26]/90 border-2 border-purple-800/60 rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          
          {/* Left Column: Story Illustration Image */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
            <div className="relative w-full h-56 md:h-80 lg:h-[360px] rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-[#1A1333]">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-contain bg-[#0F0B1E]"
              />
            </div>
          </div>

          {/* Right Column: Slide Text, Highlight Pill & Audio Trigger */}
          <div className="w-full md:w-1/2 flex flex-col space-y-4 text-left">
            
            {/* Slide Badge & Title */}
            <div className="flex items-center gap-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {currentSlide.badge || `Slide ${storySlideIndex + 1} of 4`}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-amber-400 font-display">
              {currentSlide.title}
            </h2>

            {/* Main Narrative Body Text */}
            <p className="text-sm md:text-base lg:text-lg font-extrabold text-slate-100 leading-relaxed whitespace-pre-line">
              {currentSlide.narrative}
            </p>

            {/* Key Takeaway Highlight Pill */}
            <div className="bg-[#1A1333] border-l-4 border-amber-400 p-3 rounded-r-2xl shadow-md">
              <p className="text-xs md:text-sm font-black text-amber-300">
                ✨ {currentSlide.keyPoint}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Bottom Slide Controls Row */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-4 pb-1 shrink-0">
        
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="bg-[#130E26] hover:bg-[#1A1333] border border-purple-800/80 text-purple-200 hover:text-white font-black text-sm md:text-base px-6 py-2.5 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Slide Indicator Dots (4 Slides) */}
        <div className="flex items-center gap-2">
          {storySlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStorySlideIndex(idx)}
              className={`transition-all cursor-pointer ${
                storySlideIndex === idx
                  ? 'w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(255,184,0,0.9)] scale-110'
                  : 'w-2.5 h-2.5 bg-purple-900/60 rounded-full hover:bg-purple-700'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next / Step into Lab Button */}
        <button
          onClick={handleNext}
          className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm md:text-base lg:text-lg px-8 py-3 rounded-full shadow-[0_0_22px_rgba(255,184,0,0.7)] hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
        >
          <span>{storySlideIndex === storySlides.length - 1 ? 'Step into Lab 🧪' : 'Next'}</span>
          <ArrowRight className="w-5 h-5 text-slate-950" />
        </button>
      </div>

    </div>
  );
};

export default StoryStage;
