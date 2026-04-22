import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { useGameStore, getFormattedDate } from '../store/gameStore';
import type { StatKey } from '../../types/game';

export const GameScreen = ({ 
  onQuit, 
  onNavigate 
}: { 
  onQuit: () => void; 
  onNavigate: (view: 'store' | 'knowledge') => void; 
}) => {
  const { stats, activeStressLevel, currentDay, currentCard, isGameOver, gameOverReason, isWin, currency, initializeGame, makeChoice, hasSeenTutorial, completeTutorial } = useGameStore();
  
  const dateObj = getFormattedDate(currentDay);

  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  
  // Tutorial State (0: Not started/done, 1: Stats, 2: Goal, 3: Swipe)
  const [tutorialStep, setTutorialStep] = useState<number>(0);

  useEffect(() => {
    // If game initializes and hasn't seen tutorial, start step 1
    if (!hasSeenTutorial && !isGameOver && currentCard) {
      setTutorialStep(1);
    }
  }, [hasSeenTutorial, isGameOver, currentCard]);

  const advanceTutorial = () => {
    if (tutorialStep === 3) {
      setTutorialStep(0);
      completeTutorial(); // Persist it
    } else {
      setTutorialStep(prev => prev + 1);
    }
  };
  
  // Dragging State & Animations
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  const [previewStats, setPreviewStats] = useState<Partial<Record<StatKey, number>> | null>(null);

  // When dragging right (x > 0), the left choice text appears
  const rightOpacity = useTransform(x, [20, 100], [0, 1]);
  // When dragging left (x < 0), the right choice text appears
  const leftOpacity = useTransform(x, [-20, -100], [0, 1]);
  
  const controls = useAnimation();

  // Watch x to determine preview stats
  useEffect(() => {
    const unsubscribe = x.on("change", (latest) => {
      if (!currentCard) return;
      const threshold = 30; // Amount of pixels dragged before preview kicks in
      if (latest < -threshold) {
        setPreviewStats(currentCard.choices.left.effect.stats || null);
      } else if (latest > threshold) {
        setPreviewStats(currentCard.choices.right.effect.stats || null);
      } else {
        setPreviewStats(null);
      }
    });
    return () => unsubscribe();
  }, [x, currentCard]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleDragEnd = async (_e: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      // Dragged Left -> Select Left Choice
      await controls.start({ x: -500, opacity: 0, rotate: -20, transition: { duration: 0.3 } });
      processChoice('left');
    } else if (info.offset.x > threshold) {
      // Dragged Right -> Select Right Choice
      await controls.start({ x: 500, opacity: 0, rotate: 20, transition: { duration: 0.3 } });
      processChoice('right');
    } else {
      // Snap back is handled by dragConstraints, but we can enforce it
      controls.start({ x: 0, opacity: 1, rotate: 0 });
    }
  };

  const processChoice = (direction: 'left' | 'right') => {
    if (!currentCard) return;
    const choice = currentCard.choices[direction];
    
    if (choice.effect.resultText) {
      setFeedbackText(choice.effect.resultText);
      setTimeout(() => setFeedbackText(null), 2500);
    }
    
    makeChoice(choice);
    // Instantly reset the controls for the next card that mounts
    controls.set({ x: 0, opacity: 1, rotate: 0 });
    x.set(0);
  };

  const handleQuit = () => {
    onQuit();
  };

  // Theme logic based on stress level - Pop Palette
  const themeColors = {
    chill: 'bg-[#FDF9F1]',     // Cream background with black/color elements
    grind: 'bg-[#FFE066]',     // Yellow background with black/white elements
    panic: 'bg-[#FFA6A6]'      // Coral Red background with black/white elements
  };
  const bgColorClass = themeColors[activeStressLevel] || themeColors.grind;
  const textColorClass = 'text-black';

  // Dynamic screen shake for panic
  const shakeAnimation = activeStressLevel === 'panic' ? {
    x: [0, -2, 2, -2, 2, 0],
    y: [0, 2, -2, 2, -2, 0],
    transition: { duration: 0.2, repeat: Infinity, repeatDelay: 3 }
  } : {};

  if (isGameOver) {
    return (
      <div className={`min-h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden transition-colors duration-500 ${isWin ? 'bg-[#89CFF0]' : 'bg-[#FFA6A6]'}`}>
        
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 pointer-events-none mix-blend-color-burn overflow-hidden">
          {/* Huge abstract geometric background */}
          <div className={`absolute top-0 left-0 w-[150%] h-[150%] ${isWin ? 'bg-white' : 'bg-[#FFE066]'} opacity-40 transform -rotate-12 scale-150`} style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 100%, 50% 75%, 25% 75%, 25% 100%, 0% 100%)' }}></div>
          
          {/* Animated Marquee Text */}
          <div className={`absolute top-1/4 -left-[20vw] w-[150vw] h-20 ${isWin ? 'bg-black text-[#89CFF0]' : 'bg-black text-[#FFE066]'} font-black text-6xl flex items-center overflow-hidden transform rotate-[15deg] shadow-[10px_10px_0px_rgba(0,0,0,0.2)]`}>
            <div className="animate-marquee-fast-left whitespace-nowrap tracking-widest">
              {Array(20).fill(isWin ? " MISSION ACCOMPLISHED " : " GAME OVER ").join("")}
            </div>
          </div>
          <div className={`absolute top-2/3 -left-[20vw] w-[150vw] h-16 ${isWin ? 'bg-white text-black' : 'bg-white text-black'} font-black text-5xl flex items-center overflow-hidden transform -rotate-[8deg] shadow-[5px_5px_0px_rgba(0,0,0,0.2)]`}>
            <div className="animate-marquee-fast-right whitespace-nowrap">
              {Array(20).fill(isWin ? " YOU SURVIVED " : " TRY AGAIN ").join("")}
            </div>
          </div>
        </div>
        
        {/* Main Content Card - Irregular Pop Style */}
        <div className="relative z-10 w-full max-w-sm mt-8">
          
          {/* Huge Title Header */}
          <div className={`absolute -top-10 -left-6 sm:-left-10 z-20 ${isWin ? 'bg-black text-[#89CFF0]' : 'bg-black text-white'} px-6 py-2 border-[4px] border-white transform -rotate-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
            <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter">
              {isWin ? 'VICTORY' : 'FAILED'}
            </h1>
          </div>

          {/* Shadow Layer */}
          <div 
            className="absolute inset-0 bg-black transform translate-x-3 translate-y-3"
            style={{ clipPath: 'polygon(2% 0, 100% 3%, 98% 100%, 0 97%)' }}
          ></div>
          
          {/* Content Layer */}
          <div 
            className={`bg-white border-[6px] border-black px-6 pt-16 pb-8 relative w-full flex flex-col items-center justify-center gap-6`}
            style={{ clipPath: 'polygon(2% 0, 100% 3%, 98% 100%, 0 97%)' }}
          >
            {/* Reason / Narrative Outcome */}
            <div className={`w-full p-4 font-black text-lg sm:text-xl leading-tight border-[4px] border-black transform ${isWin ? 'bg-[#89CFF0] text-black shadow-[4px_4px_0px_0px_#000] rotate-1' : 'bg-[#FFA6A6] text-black shadow-[4px_4px_0px_0px_#000] -rotate-1'}`}>
              {gameOverReason}
            </div>

            {/* Currency Reward Stamp */}
            <div className="flex items-center justify-between w-full bg-black text-white font-black py-3 px-5 border-[4px] border-black transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              <span className="text-sm opacity-80 uppercase tracking-widest">Total Balance</span>
              <span className={`text-3xl ${isWin ? 'text-[#89CFF0]' : 'text-[#FFE066]'}`}>💰 {currency}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full mt-2 relative">
              <button 
                onClick={() => initializeGame()}
                className={`w-full bg-white text-black border-[4px] border-black font-black uppercase tracking-widest text-2xl py-3 ${isWin ? 'shadow-[6px_6px_0px_0px_#89CFF0]' : 'shadow-[6px_6px_0px_0px_#FFA6A6]'} hover:bg-black hover:text-white transition-all transform -rotate-1 active:translate-y-1 active:shadow-none`}
              >
                RESTART
              </button>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => onNavigate('store')}
                  className="flex-1 bg-black text-white border-[4px] border-black font-black uppercase tracking-wider text-lg py-2 shadow-[4px_4px_0px_0px_#D0BFFF] hover:bg-[#D0BFFF] hover:text-black transition-all transform rotate-1 active:translate-y-1 active:shadow-none"
                >
                  🏪 STORE
                </button>
                <button 
                  onClick={() => onNavigate('knowledge')}
                  className="flex-1 bg-black text-white border-[4px] border-black font-black uppercase tracking-wider text-lg py-2 shadow-[4px_4px_0px_0px_#FFE066] hover:bg-[#FFE066] hover:text-black transition-all transform -rotate-1 active:translate-y-1 active:shadow-none"
                >
                  📚 GUIDE
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Return to title floating link */}
        <button 
          onClick={handleQuit}
          className="mt-12 z-20 text-lg font-black underline decoration-4 text-black bg-white px-4 py-1 border-[3px] border-black transform rotate-3 hover:scale-110 transition-transform"
        >
          EXIT TO REALITY
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      animate={shakeAnimation}
      className={`min-h-[100dvh] ${bgColorClass} flex flex-col font-sans relative overflow-hidden transition-colors duration-500`}
    >
      {/* Background Graphic (Pop Theme - Halftone / Abstract shapes) */}
      {activeStressLevel === 'panic' && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-color-burn">
          {/* Huge abstract pop spikes */}
          <div className="absolute top-0 left-0 w-[120%] h-[120%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-[length:20px_20px] opacity-30 transform -rotate-12 scale-150"></div>
          <div className="absolute top-1/4 -left-[20vw] w-[150vw] h-16 bg-black text-white font-black text-5xl flex items-center overflow-hidden transform rotate-[15deg] shadow-[10px_10px_0px_#FFE066]">
            <div className="animate-marquee-fast-left whitespace-nowrap tracking-widest">
              {Array(20).fill(" DANGER !! ").join("")}
            </div>
          </div>
          <div className="absolute top-2/3 -left-[20vw] w-[150vw] h-12 bg-white text-black font-black text-3xl flex items-center overflow-hidden transform -rotate-[8deg] shadow-[5px_5px_0px_#D0BFFF]">
            <div className="animate-marquee-fast-right whitespace-nowrap">
              {Array(20).fill(" DEADLINE APPROACHING ").join("")}
            </div>
          </div>
        </div>
      )}
      {activeStressLevel === 'grind' && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
           {/* Abstract bright geometric shapes in background */}
           <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FFA6A6] transform rotate-45"></div>
           <div className="absolute bottom-0 -left-10 w-64 h-64 border-[15px] border-white transform rotate-12 opacity-40"></div>
           <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMCAwdjhINFIwaHoiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]"></div>
        </div>
      )}
      {activeStressLevel === 'chill' && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#89CFF0] rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-full h-40 bg-[#FFB3D9] transform -rotate-12 translate-x-1/4"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjIiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]"></div>
        </div>
      )}

      {/* TOP STATUS BAR (Pop Design) */}
      <div className="relative z-20 w-full bg-white border-b-[6px] border-black shadow-[0_6px_0_0_#D0BFFF] px-4 py-4 sm:px-8 sm:py-6 flex justify-between items-center">
        
        {/* Left side: The 4 core stats */}
        <div className="flex items-start gap-3 sm:gap-6">
          <StatIcon type="gpa" value={stats.gpa} previewDelta={previewStats?.gpa} />
          <StatIcon type="mentality" value={stats.mentality} previewDelta={previewStats?.mentality} />
          <StatIcon type="energy" value={stats.energy} previewDelta={previewStats?.energy} />
          <StatIcon type="experience" value={stats.experience} previewDelta={previewStats?.experience} />
        </div>

        {/* Right side: Integrated Brutalist Date Badge */}
        <div className="flex flex-col items-end shrink-0">
          <div className="bg-[#FFB3D9] text-black px-2 py-1 sm:px-4 sm:py-2 border-[3px] border-black shadow-[4px_4px_0px_0px_#FFE066] transform rotate-2 max-w-[100px] sm:max-w-none text-right">
            <span className="font-black uppercase tracking-widest text-[10px] sm:text-sm text-black block truncate">
              YEAR {dateObj.year}
            </span>
            <span className="font-black uppercase tracking-tighter text-base sm:text-3xl block text-black truncate leading-tight">
              {dateObj.month} {dateObj.day}
            </span>
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 flex flex-col items-center justify-start pt-12 sm:pt-16 px-6 pb-6 w-full max-w-lg mx-auto gap-8 sm:gap-12 z-10">
        
        {/* Tutorial Overlay */}
        <AnimatePresence>
          {tutorialStep > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
              onClick={advanceTutorial}
            >
              {/* Dark Overlay with cutouts (Only dark for steps 1 and 3) */}
              <div className={`absolute inset-0 transition-colors duration-500 ${tutorialStep === 2 ? 'bg-black/40' : 'bg-black/80'}`} />
              
              {/* Tutorial Content Step 1: The Stats */}
              {tutorialStep === 1 && (
                <div className="absolute top-[28%] sm:top-[30%] left-0 right-0 flex flex-col items-center">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white border-[4px] border-black p-4 font-black text-base sm:text-lg max-w-sm text-center shadow-[6px_6px_0px_0px_#FFA6A6] transform rotate-2 relative z-50"
                  >
                    <p className="text-xl mb-3">Keep your stats balanced!</p>
                    <ul className="text-sm text-left inline-block space-y-1 mb-3">
                      <li><span className="text-[#D0BFFF] mr-1">●</span> <b>GPA:</b> Academic Grades</li>
                      <li><span className="text-[#FFA6A6] mr-1">●</span> <b>MNT:</b> Mentality & Stress</li>
                      <li><span className="text-[#FFE066] mr-1">●</span> <b>ENG:</b> Energy & Health</li>
                      <li><span className="text-[#89CFF0] mr-1">●</span> <b>EXP:</b> Resume & Experience</li>
                    </ul>
                    <p className="text-sm mt-2 text-gray-800">If any of them drop to 0, you're out.</p>
                    <div className="text-xs text-gray-400 mt-4 animate-pulse">(Tap anywhere to continue)</div>
                  </motion.div>
                </div>
              )}

              {/* Tutorial Content Step 2: The Interaction */}
              {tutorialStep === 2 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
                  
                  {/* The text box floating right above the card */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute top-[18%] sm:top-[22%] bg-white border-[4px] border-black p-4 font-black text-lg max-w-[280px] sm:max-w-xs text-center shadow-[6px_6px_0px_0px_#D0BFFF] transform rotate-1 pointer-events-auto z-50"
                  >
                    <p>Swipe the card LEFT or RIGHT to make decisions.</p>
                    <p className="text-sm mt-2 text-gray-600">Watch the dots above to see which stats will change!</p>
                    <div className="text-xs text-gray-400 mt-4 animate-pulse">(Tap anywhere to continue)</div>
                  </motion.div>

                  {/* The Spotlight Box that frames the card */}
                  <div className="absolute top-[65%] sm:top-[65%] -translate-y-1/2 w-[85vw] max-w-[288px] h-[340px] sm:max-w-[320px] sm:h-[400px] border-[6px] border-dashed border-[#FFE066] rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none z-40">
                  </div>
                  
                  {/* Fake animated hand/arrows flanking the card */}
                  <div className="absolute top-[65%] sm:top-[65%] -translate-y-1/2 left-0 right-0 flex justify-between px-2 sm:px-8 pointer-events-none max-w-[360px] sm:max-w-[420px] mx-auto z-50">
                    <motion.div 
                      animate={{ x: [-10, 0, -10] }} 
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-5xl sm:text-6xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                    >👈</motion.div>
                    <motion.div 
                      animate={{ x: [10, 0, 10] }} 
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-5xl sm:text-6xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                    >👉</motion.div>
                  </div>
                </div>
              )}

              {/* Tutorial Content Step 3: The Goal */}
              {tutorialStep === 3 && (
                <div className="absolute top-1/3 left-0 right-0 flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#FFE066] border-[4px] border-black p-6 font-black text-xl max-w-xs text-center shadow-[8px_8px_0px_0px_#89CFF0] transform -rotate-2 relative z-50"
                  >
                    <p className="text-3xl mb-2">🎯 GOAL</p>
                    <p>Survive the entire application season.</p>
                    <div className="text-xs text-black/60 mt-4 animate-pulse">(Tap anywhere to start)</div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedbackText && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="z-50 absolute -top-4 left-0 right-0 flex justify-center px-4 pointer-events-none"
            >
              <div className="bg-[#89CFF0] text-black border-[4px] border-black px-6 py-3 font-black text-center shadow-[6px_6px_0px_0px_#000] text-base sm:text-lg max-w-sm transform rotate-1">
                {feedbackText}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Persistent Text Box Container with Fixed Height to prevent layout shift */}
        <div className="w-full min-h-[140px] sm:min-h-[160px] flex items-center justify-center relative text-center">
          <AnimatePresence mode="popLayout">
            {currentCard && (
              <motion.div 
                key={currentCard.id}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full"
              >
                {/* Offset Shadow Layer (Pop Purple) */}
                <div 
                  className="absolute inset-0 bg-[#D0BFFF] transform translate-x-3 translate-y-3"
                  style={{ clipPath: 'polygon(3% 0, 100% 5%, 97% 100%, 0 95%)' }}
                ></div>
                
                {/* Main Text Box (Irregular Quadrilateral) */}
                <div 
                  className="bg-white border-[4px] border-black p-6 sm:p-8 relative w-full flex items-center justify-center"
                  style={{ clipPath: 'polygon(3% 0, 100% 5%, 97% 100%, 0 95%)' }}
                >
                  {/* Category Tag (Glued to the top left) */}
                  <div className="absolute top-2 left-4 bg-black text-[#89CFF0] px-3 py-1 text-sm font-black border-[2px] border-black transform -rotate-3 shadow-[2px_2px_0px_0px_#FFE066]">
                    {currentCard.category.toUpperCase()}
                  </div>
                  
                  <p className="text-black font-black text-xl sm:text-2xl leading-snug relative z-10 pt-4">
                    {currentCard.text}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Area (Stack) */}
        <div className="relative w-[85vw] max-w-[288px] h-[340px] sm:max-w-[320px] sm:h-[400px] perspective-1000 mt-4 shrink-0">
          
          {/* Card Back (Pop Style) */}
          <div className="absolute inset-0 bg-white border-[6px] border-black shadow-[8px_8px_0px_0px_#FFE066] overflow-hidden flex items-center justify-center transform rotate-2">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iNCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] opacity-20"></div>
            
            {/* Giant jagged star/explosion shape in Mint Green */}
            <div className="absolute w-[150%] h-[150%] bg-[#89CFF0] animate-pulse-slow" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
            
            <div className="relative z-10 flex flex-col items-center transform -rotate-12 mix-blend-multiply">
              <span className="text-black font-black text-4xl tracking-tighter leading-none bg-white px-2 py-1 transform translate-x-4 border-2 border-black">TAKE</span>
              <span className="text-black font-black text-5xl tracking-tighter leading-none bg-white px-2 py-1 transform -translate-x-2 border-2 border-black">YOUR</span>
              <span className="text-[#FFA6A6] font-black text-6xl tracking-tighter leading-none bg-black px-2 py-1 transform translate-x-2 border-4 border-black">TIME</span>
            </div>
          </div>

          {/* Card Front (Draggable) */}
          <AnimatePresence mode="wait">
            {currentCard && (
              <motion.div
                key={currentCard.id} // Changing key forces remount and trigger initial animation
                initial={{ rotateY: 180, scale: 0.9, opacity: 0 }}
                animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="absolute inset-0 origin-center"
              >
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  onDragEnd={handleDragEnd}
                  style={{ x, rotate, clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}
                  animate={controls}
                  // P5 Style Card Shape: Clipped corners, heavy borders
                  className="w-full h-full bg-white border-[6px] border-black cursor-grab active:cursor-grabbing flex flex-col overflow-hidden shadow-[10px_10px_0px_0px_#000] relative bg-cover bg-center"
                >
                  
                  {/* Left Choice Text (Appears when dragging LEFT, text on RIGHT) */}
                  <motion.div
                    style={{ opacity: leftOpacity }}
                    className="absolute top-6 right-4 bg-black text-white px-3 py-1 font-black uppercase text-sm sm:text-base transform rotate-6 z-20 border-[3px] border-white pointer-events-none max-w-[140px] text-center"
                  >
                    {currentCard.choices.left.label}
                  </motion.div>

                  {/* Right Choice Text (Appears when dragging RIGHT, text on LEFT) */}
                  <motion.div
                    style={{ opacity: rightOpacity }}
                    className="absolute top-6 left-4 bg-black text-white px-3 py-1 font-black uppercase text-sm sm:text-base transform -rotate-6 z-20 border-[3px] border-white pointer-events-none max-w-[140px] text-center"
                  >
                    {currentCard.choices.right.label}
                  </motion.div>

                  {/* Character Portrait Area */}
                  <div className="flex-1 flex items-center justify-center bg-[#FDF9F1] relative">
                    
                    {/* Halftone / Comic burst background behind character */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                      <div className="w-full h-full bg-[#FFB3D9]" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}></div>
                    </div>
                    
                    <span className="text-[120px] sm:text-[140px] relative z-10 select-none drop-shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                      {currentCard.character === 'professor_x' ? '👨‍🏫' :
                       currentCard.character === 'roommate' ? '🧑‍🎤' :
                       currentCard.character === 'gym_coach' ? '🏋️' :
                       currentCard.character === 'therapist' ? '🛋️' : 
                       currentCard.character === 'calendar' ? '🗓️' : 
                       currentCard.character === 'consultant' ? '🧛' : 
                       currentCard.character === 'laptop' ? '💻' : 
                       currentCard.character === 'email' ? '📧' :
                       currentCard.character === 'folder' ? '📁' :
                       currentCard.character === 'phone' ? '📱' :
                       currentCard.character === 'interviewer' ? '👔' :
                       currentCard.character === 'language_test' ? '📚' :
                       currentCard.character === 'math_book' ? '📐' :
                       currentCard.character === 'pencil' ? '📝' :
                       currentCard.character === 'parent' ? '👨‍👩‍👧' :
                       currentCard.character === 'friend' ? '🍻' : '🧑‍🎓'}
                    </span>
                  </div>

                  {/* Character Name - Pop Ransom Note Style */}
                  <div className="min-h-[5rem] py-3 flex items-center justify-center bg-black border-t-[6px] border-black z-10 select-none relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMjAiIHkyPSIyMCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] opacity-30"></div>
                    <div className="flex flex-wrap justify-center items-center gap-[2px] sm:gap-1 px-4 relative z-10 w-full">
                      {currentCard.character.replace('_', ' ').split('').map((char, i, arr) => {
                        if (char === ' ') return <span key={i} className="w-2 sm:w-3"></span>;
                        
                        const isLong = arr.length > 9;
                        const seed = char.charCodeAt(0) + i;
                        const isColored = seed % 2 === 0;
                        const colorClass = seed % 3 === 0 ? 'bg-[#FFE066] text-black' : (seed % 3 === 1 ? 'bg-[#89CFF0] text-black' : 'bg-[#FFB3D9] text-black');
                        const rotation = seed % 3 === 0 ? 'rotate-6' : (seed % 3 === 1 ? '-rotate-6' : '-rotate-3');
                        const translateY = seed % 2 === 0 ? 'translate-y-0.5' : '-translate-y-0.5';
                        
                        return (
                          <span key={i} className={`
                            font-black uppercase 
                            ${isLong ? 'text-lg sm:text-xl px-1' : 'text-2xl sm:text-3xl px-1.5'}
                            py-0.5 transform transition-none inline-block
                            ${rotation} ${translateY}
                            ${isColored ? colorClass : 'bg-white text-black'} 
                          `}>
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Swipe Hint */}
        <div className={`text-center font-black text-sm tracking-widest uppercase pointer-events-none select-none ${textColorClass} opacity-60 mb-auto`}>
          ← Swipe Left or Right →
        </div>

        {/* Quit Button (Moved to bottom) */}
        <button 
          onClick={handleQuit}
          className={`font-black text-sm underline decoration-2 hover:opacity-100 transition-opacity mt-auto mb-4 ${textColorClass} opacity-50`}
        >
          QUIT TO MENU
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Smartwatch Ring Status Indicator (Design 3)
 * Extremely clear numerical display with a brutalist circular progress ring.
 * Now supports `previewDelta` to show animated hints when swiping.
 */
const StatIcon = ({ type, value, previewDelta }: { type: 'gpa' | 'mentality' | 'energy' | 'experience', value: number, previewDelta?: number }) => {
  const percentage = Math.max(0, Math.min(100, value));
  
  // Use hex colors for direct SVG stroke injection (P5 Palette)
  const hexColors = {
    gpa: "#D0BFFF",      // Pastel Purple (replaced black to match Macaron palette)
    mentality: "#FFA6A6",// Pastel Peach
    energy: "#FFE066",   // Pastel Lemon
    experience: "#89CFF0"// Pastel Blue
  };
  
  const labels = {
    gpa: "GPA",
    mentality: "MNT",
    energy: "ENG",
    experience: "EXP"
  };

  const hexColor = hexColors[type];
  const label = labels[type];
  
  // Math for the SVG progress ring
  const radius = 34; // The radius of the colored stroke
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Preview visual logic
  const isPreviewing = previewDelta !== undefined && previewDelta !== 0;
  const isPositive = previewDelta ? previewDelta > 0 : false;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div 
        className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
        animate={isPreviewing ? {
          scale: [1, 1.15, 1],
          rotate: isPositive ? [0, 5, -5, 0] : [0, -5, 5, 0],
        } : { scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.4, 
          repeat: isPreviewing ? Infinity : 0, 
          repeatType: "reverse" 
        }}
      >
        
        {/* Preview Dot Indicator */}
        <AnimatePresence>
          {isPreviewing && (
            <motion.div 
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`absolute top-1 right-1 z-30 w-4 h-4 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isPositive ? 'bg-[#89CFF0]' : 'bg-[#FFA6A6]'}`}
            />
          )}
        </AnimatePresence>

        {/* The brutalist badge background and shadow */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full overflow-visible drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
        >
          {/* Main White Background & Outer Border */}
          <circle cx="50" cy="50" r="46" fill="white" stroke="black" strokeWidth="8" />
          
          {/* Empty Track (Light Gray) */}
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="12" />
          
          {/* Colored Progress Ring */}
          <circle 
            cx="50" cy="50" r={radius} 
            fill="none" 
            stroke={hexColor} 
            strokeWidth="12" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out origin-center -rotate-90"
            strokeLinecap="butt"
          />
          
          {/* Inner Border to separate the colored ring from the center text area */}
          <circle cx="50" cy="50" r="28" fill="none" stroke="black" strokeWidth="4" />
        </svg>
        
        {/* Number in the absolute center */}
        <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
          <span className={`font-black text-2xl sm:text-3xl leading-none tracking-tighter transition-colors ${isPreviewing ? (isPositive ? 'text-[#89CFF0]' : 'text-[#FFA6A6]') : 'text-black'}`}>
            {Math.round(percentage)}
          </span>
        </div>
      </motion.div>
      
      {/* Separated Label completely outside the graphic */}
      <span className={`text-xs sm:text-sm font-black uppercase border-[3px] border-black px-2 py-0.5 shadow-[3px_3px_0px_0px_#FFA6A6] tracking-wide transform -rotate-3 transition-colors ${isPreviewing ? (isPositive ? 'bg-[#89CFF0] text-black' : 'bg-[#FFA6A6] text-white') : 'bg-white text-black'}`}>
        {label}
      </span>
    </div>
  );
};