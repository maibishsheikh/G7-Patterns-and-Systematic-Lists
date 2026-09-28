import React from 'react';
import useAppStore from '../store/useAppStore';
import { Volume2, VolumeX } from 'lucide-react';

const STAGES = [
  { id: 'wonder', label: 'Wonder', number: '01', icon: '🔍' },
  { id: 'story', label: 'Story', number: '02', icon: '📖' },
  { id: 'simulate', label: 'Simulate', number: '03', icon: '✏️' },
  { id: 'practice', label: 'Practice', number: '04', icon: '🎮' },
  { id: 'reflect', label: 'Reflect', number: '05', icon: '📜' },
];

export const TopNav = () => {
  const { currentStage, setStage, audioEnabled, toggleAudio } = useAppStore();

  return (
    <header className="w-full pt-3 px-4 flex items-center justify-center z-50 shrink-0 select-none bg-transparent">
      {/* Centered Floating Pill Navigation Bar (Blends seamlessly with cosmic-bg) */}
      <div className="flex items-center gap-2 md:gap-3 bg-[#0F0B1E]/80 border border-purple-900/60 rounded-full px-3.5 py-1.5 shadow-2xl backdrop-blur-md">
        
        {/* 1. Home Button */}
        <button
          onClick={() => setStage('home')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-200 hover:text-white font-black text-xs md:text-sm transition-colors cursor-pointer"
        >
          <span>🏠</span>
          <span>Home</span>
        </button>

        {/* 2. Highlighted Stage Navigation Pill Group */}
        <nav className="flex items-center gap-1 bg-[#161129]/80 p-1 rounded-full border border-amber-400/50 shadow-[0_0_15px_rgba(255,184,0,0.25)]">
          {STAGES.map((st) => {
            const isActive = currentStage === st.id;

            return (
              <button
                key={st.id}
                onClick={() => setStage(st.id)}
                className={`px-3 md:px-4 py-1.5 rounded-full font-black text-xs md:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-[0_0_15px_rgba(255,184,0,0.6)] scale-105'
                    : 'text-slate-200 hover:text-white hover:bg-purple-900/30'
                }`}
              >
                <span className={isActive ? 'text-slate-950 font-black' : 'text-amber-400'}>
                  {st.number}
                </span>
                <span>{st.icon}</span>
                <span>{st.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. Circular Golden Audio Toggle Button */}
        <button
          onClick={toggleAudio}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black flex items-center justify-center shadow-[0_0_12px_rgba(255,184,0,0.5)] hover:scale-110 transition-transform cursor-pointer ml-1"
          title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
        >
          {audioEnabled ? (
            <Volume2 className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <VolumeX className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>

      </div>
    </header>
  );
};

export default TopNav;
