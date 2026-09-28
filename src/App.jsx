import React, { useEffect } from 'react';
import useAppStore from './store/useAppStore';
import TopNav from './components/TopNav';
import HomeScreen from './stages/HomeScreen';
import WonderStage from './stages/WonderStage';
import StoryStage from './stages/StoryStage';
import SimulateStage from './stages/SimulateStage';
import PracticeStage from './stages/PracticeStage';
import ReflectStage from './stages/ReflectStage';

export function App() {
  const { currentStage, resetWorldsProgress } = useAppStore();

  useEffect(() => {
    // Reset all user progress whenever module mounts/loads
    resetWorldsProgress();
  }, []);

  const renderStage = () => {
    switch (currentStage) {
      case 'home':
        return <HomeScreen />;
      case 'wonder':
        return <WonderStage />;
      case 'story':
        return <StoryStage />;
      case 'simulate':
        return <SimulateStage />;
      case 'practice':
        return <PracticeStage />;
      case 'reflect':
        return <ReflectStage />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col cosmic-bg text-slate-100 select-none">
      {/* Fixed Top Navigation Bar (Hidden on Intro / Home stage) */}
      {currentStage !== 'home' && <TopNav />}

      {/* Main Viewport Active Stage View */}
      <main className={`flex-1 w-full overflow-hidden ${currentStage !== 'home' ? 'h-[calc(100vh-4.5rem)]' : 'h-screen'}`}>
        {renderStage()}
      </main>
    </div>
  );
}

export default App;
