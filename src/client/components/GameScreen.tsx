import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';

export const GameScreen = ({ onQuit }: { onQuit: () => void }) => {
  const { stats, currentPhase, currentMonth, currentCard, isGameOver, gameOverReason, initializeGame, makeChoice } = useGameStore();
  const { signOut } = useAuthStore();
  
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleChoice = (direction: 'left' | 'right') => {
    if (!currentCard) return;
    
    const choice = currentCard.choices[direction];
    
    if (choice.effect.resultText) {
      setFeedbackText(choice.effect.resultText);
      setTimeout(() => setFeedbackText(null), 2000);
    }
    
    makeChoice(choice);
  };

  const handleQuit = async () => {
    // If they want to completely log out:
    // await signOut();
    // For now, just exit back to main menu
    onQuit();
  };

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
    <div className="min-h-[100dvh] bg-gray-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      {/* Top Bar: Stats */}
      <div className="z-10 bg-white border-b-[6px] border-black p-4 flex flex-col gap-3 shadow-[0px_8px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="flex justify-between items-center mb-2">
          <div className="bg-brand-yellow border-[3px] border-black px-3 py-1 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
            {currentPhase.toUpperCase()} - MONTH {currentMonth}
          </div>
          <button 
            onClick={handleQuit}
            className="font-black underline decoration-4 decoration-brand-pink hover:bg-black hover:text-white px-2"
          >
            QUIT
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <StatBar label="GPA" value={stats.gpa} color="bg-brand-cyan" />
          <StatBar label="MENTALITY" value={stats.mentality} color="bg-brand-pink" />
          <StatBar label="ENERGY" value={stats.energy} color="bg-brand-yellow" />
          <StatBar label="EXPERIENCE" value={stats.experience} color="bg-brand-green" />
        </div>
      </div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {feedbackText && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-32 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
          >
            <div className="bg-black text-white border-[4px] border-white p-4 font-black text-center shadow-[8px_8px_0px_0px_#FFA6F6] transform rotate-1 max-w-sm w-full">
              {feedbackText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Play Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 relative">
        <AnimatePresence mode="wait">
          {currentCard && (
            <motion.div 
              key={currentCard.id}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-white w-full max-w-sm border-[8px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col"
            >
              {/* Card Image/Character Placeholder */}
              <div className="h-48 bg-brand-pink border-b-[6px] border-black flex items-center justify-center overflow-hidden relative">
                {/* Stripe Pattern */}
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)' }}></div>
                <span className="text-6xl drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] z-10">
                  {currentCard.character === 'professor_x' ? '👨‍🏫' : '🧑‍🎓'}
                </span>
              </div>
              
              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="inline-block bg-black text-white px-2 py-1 font-black text-xs uppercase self-start mb-3 transform -rotate-1 shadow-[2px_2px_0px_0px_#A6FAFF]">
                  {currentCard.category}
                </div>
                <h2 className="text-2xl font-black uppercase leading-tight mb-3">
                  {currentCard.title}
                </h2>
                <p className="font-bold text-gray-800 text-lg flex-1 mb-6">
                  {currentCard.text}
                </p>
                
                {/* Choices (Swipe replacements for now) */}
                <div className="flex gap-4 mt-auto">
                  <button 
                    onClick={() => handleChoice('left')}
                    className="flex-1 bg-white border-[4px] border-black p-3 font-black uppercase text-sm hover:bg-brand-pink transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
                  >
                    ← {currentCard.choices.left.label}
                  </button>
                  <button 
                    onClick={() => handleChoice('right')}
                    className="flex-1 bg-white border-[4px] border-black p-3 font-black uppercase text-sm hover:bg-brand-cyan transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
                  >
                    {currentCard.choices.right.label} →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-end mb-1">
        <span className="font-black text-xs uppercase tracking-wider">{label}</span>
        <span className="font-bold text-xs">{Math.round(value)}/100</span>
      </div>
      <div className="h-4 w-full bg-white border-[3px] border-black p-0.5">
        <div 
          className={`h-full ${color} transition-all duration-300 ease-out border-r-[2px] border-black`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
};