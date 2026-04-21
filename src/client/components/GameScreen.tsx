import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { useGameStore, getFormattedDate } from '../store/gameStore';

export const GameScreen = ({ 
  onQuit, 
  onNavigate 
}: { 
  onQuit: () => void; 
  onNavigate: (view: 'store' | 'knowledge') => void; 
}) => {
  const { stats, activeStressLevel, currentDay, currentCard, isGameOver, gameOverReason, isWin, currency, initializeGame, makeChoice } = useGameStore();
  
  const dateObj = getFormattedDate(currentDay);

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
      <div className="min-h-[100dvh] bg-brand-yellow flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
        {/* Background graphic */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="bg-white border-[8px] border-black p-6 sm:p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center transform -rotate-1 relative z-10">
          <h1 className={`text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4 ${isWin ? 'text-brand-green' : 'text-brand-pink'}`}>
            {isWin ? 'VICTORY' : 'GAME OVER'}
          </h1>
          
          <div className={`p-4 font-bold text-lg sm:text-xl mb-6 border-[4px] border-black transform rotate-1 ${isWin ? 'bg-brand-cyan text-black shadow-[4px_4px_0px_0px_#000]' : 'bg-black text-white shadow-[4px_4px_0px_0px_#FFA6F6]'}`}>
            {gameOverReason}
          </div>

          <div className="bg-black text-white font-black text-xl py-2 mb-6 border-4 border-black inline-block px-6">
            💰 Currency: {currency}
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => initializeGame()}
              className="w-full bg-brand-yellow text-black border-[6px] border-black font-black uppercase tracking-widest text-xl py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-brand-pink transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              PLAY AGAIN
            </button>
            
            <div className="flex gap-4">
              <button 
                onClick={() => onNavigate('store')}
                className="flex-1 bg-white text-black border-[4px] border-black font-black uppercase tracking-wider text-sm sm:text-base py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-brand-cyan transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
              >
                🏪 STORE
              </button>
              <button 
                onClick={() => onNavigate('knowledge')}
                className="flex-1 bg-white text-black border-[4px] border-black font-black uppercase tracking-wider text-sm sm:text-base py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-brand-green transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
              >
                📚 GUIDE
              </button>
            </div>
            <button 
              onClick={handleQuit}
              className="mt-2 text-sm font-black underline decoration-2 hover:text-brand-pink transition-colors"
            >
              RETURN TO TITLE
            </button>
          </div>
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

      {/* TOP STATUS BAR (Integrated Date Design) */}
      <div className="relative z-20 w-full bg-white border-b-[6px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] px-4 py-4 sm:px-8 sm:py-6 flex justify-between items-center">
        
        {/* Left side: The 4 core stats */}
        <div className="flex items-start gap-3 sm:gap-6">
          <StatIcon type="gpa" value={stats.gpa} />
          <StatIcon type="mentality" value={stats.mentality} />
          <StatIcon type="energy" value={stats.energy} />
          <StatIcon type="experience" value={stats.experience} />
        </div>

        {/* Right side: Integrated Brutalist Date Badge */}
        <div className="flex flex-col items-end">
          <div className="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 border-[3px] border-black shadow-[4px_4px_0px_0px_#FFF066] transform rotate-2">
            <span className="font-black uppercase tracking-widest text-xs sm:text-sm text-brand-yellow block text-right">
              YEAR {dateObj.year}
            </span>
            <span className="font-black uppercase tracking-tighter text-xl sm:text-3xl block text-right">
              {dateObj.month} {dateObj.day}
            </span>
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

        {/* Persistent Text Box Container with Fixed Height to prevent layout shift */}
        <div className="w-full min-h-[140px] sm:min-h-[160px] flex items-center justify-center relative text-center">
          <AnimatePresence mode="popLayout">
            {currentCard && (
              <motion.div 
                key={currentCard.id}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // A very smooth, custom cubic-bezier ease
                className="bg-white border-[4px] border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 relative w-full absolute"
              >
                <div className="absolute -top-3 left-4 bg-brand-cyan text-black px-2 py-0.5 text-xs font-black border-[2px] border-black transform -rotate-3">
                  {currentCard.category.toUpperCase()}
                </div>
                <p className="text-black font-black text-xl sm:text-2xl leading-snug">
                  {currentCard.text}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
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
 * Smartwatch Ring Status Indicator (Design 3)
 * Extremely clear numerical display with a brutalist circular progress ring.
 */
const StatIcon = ({ type, value }: { type: 'gpa' | 'mentality' | 'energy' | 'experience', value: number }) => {
  const percentage = Math.max(0, Math.min(100, value));
  
  // Use hex colors for direct SVG stroke injection
  const hexColors = {
    gpa: "#A6FAFF",      // brand-cyan
    mentality: "#FFA6F6",// brand-pink
    energy: "#FFF066",   // brand-yellow
    experience: "#B8FF9F"// brand-green
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

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        
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
          <span className="font-black text-2xl sm:text-3xl leading-none text-black tracking-tighter">
            {Math.round(percentage)}
          </span>
        </div>
      </div>
      
      {/* Separated Label completely outside the graphic */}
      <span className="text-sm sm:text-base font-black uppercase text-black bg-white border-[3px] border-black px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] tracking-wide">
        {label}
      </span>
    </div>
  );
};