import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export const GameScreen = ({ onQuit }: { onQuit: () => void }) => {
  const { stats, activeStressLevel, currentPhase, currentMonth, currentCard, isGameOver, gameOverReason, initializeGame, makeChoice } = useGameStore();
  
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  
  // Dragging State & Animations
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  // When dragging right (x > 0), the left choice text appears
  const rightOpacity = useTransform(x, [20, 100], [0, 1]);
  // When dragging left (x < 0), the right choice text appears
  const leftOpacity = useTransform(x, [-20, -100], [0, 1]);
  
  const controls = useAnimation();

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

  // Theme logic based on stress level
  const themeColors = {
    chill: 'bg-brand-cyan', // Light Cyan -> Black text preferred
    grind: 'bg-gray-200',   // Light Gray -> Black text preferred
    panic: 'bg-red-600'     // Dark Red -> White text preferred
  };
  const bgColorClass = themeColors[activeStressLevel] || themeColors.grind;
  const isDarkTheme = activeStressLevel === 'panic';
  const textColorClass = isDarkTheme ? 'text-white' : 'text-black';

  if (isGameOver) {
    return (
      <div className="min-h-[100dvh] bg-brand-yellow flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white border-[8px] border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center transform -rotate-2">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 text-black">
            GAME OVER
          </h1>
          <div className="bg-black text-white p-4 font-bold text-xl mb-8 border-[4px] border-black shadow-[4px_4px_0px_0px_#FFA6F6] transform rotate-1">
            {gameOverReason}
          </div>
          <button 
            onClick={() => initializeGame()}
            className="w-full bg-brand-cyan text-black border-[6px] border-black font-black uppercase tracking-widest text-2xl py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-brand-pink transition-all hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[100dvh] ${bgColorClass} flex flex-col font-sans relative overflow-hidden transition-colors duration-500`}>
      {/* Background Graphic (Changes based on stress) */}
      {activeStressLevel === 'panic' && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 10px, transparent 10px, transparent 20px)' }}></div>
      )}
      {activeStressLevel === 'grind' && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      )}
      {activeStressLevel === 'chill' && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      )}

      {/* Dedicated Top Bar for Status Icons (Visually separated from dynamic background) */}
      <div className="z-20 w-full bg-white border-b-[6px] border-black shadow-[0px_8px_0px_0px_rgba(0,0,0,1)] relative shrink-0">
        <div className="max-w-md mx-auto flex justify-between items-center px-8 py-6">
          <StatIcon type="gpa" value={stats.gpa} />
          <StatIcon type="mentality" value={stats.mentality} />
          <StatIcon type="energy" value={stats.energy} />
          <StatIcon type="experience" value={stats.experience} />
        </div>
        
        {/* Phase Info (Now attached to the bottom edge of the top bar) */}
        <div className="absolute -bottom-10 right-4 z-10 text-right">
          <div className={`font-black text-lg tracking-widest ${textColorClass} drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]`}>
            {currentPhase.toUpperCase()}
          </div>
          <div className={`font-black text-sm opacity-80 ${textColorClass} tracking-widest`}>
            MONTH {currentMonth}
          </div>
        </div>
      </div>

      {/* Main Play Area (Shifted slightly down to account for new top bar) */}
      <div className="flex-1 flex flex-col items-center justify-start pt-12 sm:pt-16 px-6 pb-6 w-full max-w-lg mx-auto gap-8 sm:gap-12 z-10">
        
        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedbackText && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="z-50 absolute -top-4 left-0 right-0 flex justify-center px-4 pointer-events-none"
            >
              <div className="bg-black text-white border-[4px] border-brand-yellow px-6 py-3 font-black text-center shadow-[6px_6px_0px_0px_#FFA6F6] text-base sm:text-lg max-w-sm transform rotate-1">
                {feedbackText}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Text Box */}
        <div className="w-full text-center">
          <div className="bg-white border-[4px] border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 relative">
            <div className="absolute -top-3 left-4 bg-brand-cyan text-black px-2 py-0.5 text-xs font-black border-[2px] border-black transform -rotate-3">
              {currentCard?.category.toUpperCase()}
            </div>
            <p className="text-black font-black text-xl sm:text-2xl leading-snug">
              {currentCard?.text}
            </p>
          </div>
        </div>

        {/* Card Area (Stack) */}
        <div className="relative w-72 h-80 sm:w-80 sm:h-96 perspective-1000">
          
          {/* Card Back (Static underneath, visible when top card is swiped) */}
          <div className="absolute inset-0 bg-black border-[6px] border-white rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
               style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 10px, #222 10px, #222 20px)' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/20 text-8xl font-black transform -rotate-12 select-none">G</span>
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
                  style={{ x, rotate }}
                  animate={controls}
                  className="w-full h-full bg-brand-yellow border-[6px] border-black rounded-xl cursor-grab active:cursor-grabbing flex flex-col overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative bg-cover bg-center"
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

                  {/* Character Portrait */}
                  <div className="flex-1 flex items-center justify-center bg-brand-pink relative">
                    {/* Subtle brutalist pattern inside portrait area */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
                    <span className="text-[120px] sm:text-[140px] drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] relative z-10 select-none">
                      {currentCard.character === 'professor_x' ? '👨‍🏫' :
                       currentCard.character === 'roommate' ? '🧑‍🎤' :
                       currentCard.character === 'gym_coach' ? '🏋️' :
                       currentCard.character === 'therapist' ? '🛋️' : '🧑‍🎓'}
                    </span>
                  </div>

                  {/* Character Name */}
                  <div className="h-16 sm:h-20 flex items-center justify-center bg-white border-t-[6px] border-black font-black uppercase text-xl sm:text-2xl tracking-tight z-10 select-none">
                    {currentCard.character.replace('_', ' ')}
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
    </div>
  );
};

/**
 * Reigns-style Status Indicator (SVG Fill)
 * The icon itself fills up based on the value (0-100)
 */
const StatIcon = ({ type, value }: { type: 'gpa' | 'mentality' | 'energy' | 'experience', value: number }) => {
  const percentage = Math.max(0, Math.min(100, value));
  
  // Custom SVG paths for the 4 stats (Replaced complex shapes with highly legible, solid-fill-friendly blocky shapes)
  const paths = {
    gpa: "M12 3L1 9l11 6 9-4.91V17h2V9zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z", // Graduation Cap (Simplified outline, added 'z' to close the top diamond path)
    mentality: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z", // A literal Play/Energy circle, much easier to read when filled.
    energy: "M13 2.05v9h6L7 21.95v-9H1z", // Lightning Bolt (Sharp, thick, brutalist shape without tiny details)
    experience: "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" // Briefcase (Blocky)
  };

  const pathData = paths[type];

  return (
    <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
      {/* Background fill (Empty state - Light Gray) */}
      <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full fill-gray-200">
        <path d={pathData} />
      </svg>
      
      {/* Dynamic Foreground fill (Filled state - Solid Yellow) using clip-path */}
      <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full fill-brand-yellow transition-all duration-500 ease-out"
           style={{ clipPath: `inset(${100 - percentage}% 0 0 0)` }}>
        <path d={pathData} />
      </svg>

      {/* Wireframe Outline (Always on top, purely for definition) */}
      <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full fill-none stroke-black stroke-[2px] pointer-events-none">
        <path d={pathData} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
};