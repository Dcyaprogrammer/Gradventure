import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { AuthModal } from './components/AuthModal';
import { GameScreen } from './components/GameScreen';
import { StoreScreen } from './components/StoreScreen';
import { KnowledgeBaseScreen } from './components/KnowledgeBaseScreen';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { user, isAnonymous, isLoading, error, initialize, signOut, setAuthModalOpen, signInAnonymously } = useAuthStore();
  const [currentView, setCurrentView] = useState<'home' | 'game' | 'store' | 'knowledge'>('home');

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (currentView === 'game' && user) {
    return (
      <GameScreen 
        onQuit={() => setCurrentView('home')} 
        onNavigate={(view) => setCurrentView(view)} 
      />
    );
  }

  if (currentView === 'store') {
    return <StoreScreen onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'knowledge') {
    return <KnowledgeBaseScreen onBack={() => setCurrentView('home')} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-sans">
        <h2 className="text-2xl font-black uppercase text-white animate-pulse">Loading Assets...</h2>
      </div>
    );
  }

  // Generate warning tape text (Grad school application themed)
  const warningText = "⚠ GPA WARNING ⚠ GRE EXAM FAILED ⚠ PROFESSOR GHOSTED YOU ⚠ REJECTED ⚠ DEADLINE MISSED ⚠ NO FUNDING ⚠ ";
  const tapeArray = Array(15).fill(warningText);

  const handlePlayClick = async () => {
    if (user) {
      setCurrentView('game');
    } else {
      await signInAnonymously();
      setCurrentView('game');
    }
  };

  return (
    <div 
      className="min-h-[100dvh] p-4 sm:p-8 font-sans flex flex-col items-center justify-center relative overflow-hidden bg-red-700"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#000 3px, transparent 3px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Permanent Panic State Elements: Fast Moving Tapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Tape 1 (Top) */}
        <div className="absolute top-[15%] w-[200vw] -ml-[50vw] transform rotate-12 bg-brand-yellow border-y-8 border-black text-black font-black text-2xl py-2 shadow-neo flex whitespace-nowrap">
          <div className="animate-marquee-fast-left">
            {tapeArray.map((text, i) => <span key={i} className="px-4">{text}</span>)}
          </div>
        </div>
        
        {/* Tape 2 (Middle) */}
        <div className="absolute top-[50%] w-[200vw] -ml-[50vw] transform -rotate-6 bg-brand-pink border-y-8 border-black text-black font-black text-3xl py-3 shadow-neo flex whitespace-nowrap">
          <div className="animate-marquee-fast-right">
            {tapeArray.map((text, i) => <span key={i} className="px-4">{text}</span>)}
          </div>
        </div>

        {/* Tape 3 (Bottom) */}
        <div className="absolute top-[80%] w-[200vw] -ml-[50vw] transform rotate-[15deg] bg-white border-y-8 border-black text-black font-black text-xl py-2 shadow-neo flex whitespace-nowrap">
          <div className="animate-marquee-fast-left">
            {tapeArray.map((text, i) => <span key={i} className="px-4">{text}</span>)}
          </div>
        </div>
      </div>

      {/* Main Title - Subtle Glitch Style */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="z-10 text-center mb-16 sm:mb-24 flex flex-col items-center pointer-events-none"
      >
        <div className="bg-black text-white border-[6px] border-black px-6 py-2 transform -rotate-3 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <span className="font-black uppercase tracking-widest text-lg sm:text-xl">
            MENTAL BREAKDOWN ?
          </span>
        </div>
        
        <div className="transform rotate-1 drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] sm:drop-shadow-[10px_10px_0px_rgba(0,0,0,1)]">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter text-white glitch-text-subtle">
            Grad<br className="sm:hidden" />venture
          </h1>
        </div>
      </motion.div>

      {/* Minimalist Action Area */}
      <div className="z-10 w-full max-w-sm flex flex-col gap-4 relative">
        <motion.button 
          onClick={handlePlayClick}
          whileHover={{ scale: 1.05, y: -4, rotate: -2 }}
          whileTap={{ scale: 0.95, y: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", rotate: 0 }}
          className="w-full font-black py-6 sm:py-8 px-6 border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] uppercase text-4xl sm:text-5xl text-black flex justify-center items-center bg-brand-yellow hover:bg-brand-green transition-colors"
        >
          {user ? 'PLAY' : 'START'}
        </motion.button>

        <div className="flex gap-4">
          <motion.button 
            onClick={() => setCurrentView('store')}
            whileHover={{ scale: 1.05, y: -2, rotate: 1 }}
            whileTap={{ scale: 0.95, y: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", rotate: 0 }}
            className="flex-1 font-black py-3 px-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase text-lg sm:text-xl text-black flex justify-center items-center bg-white hover:bg-brand-cyan transition-colors"
          >
            🏪 STORE
          </motion.button>

          <motion.button 
            onClick={() => setCurrentView('knowledge')}
            whileHover={{ scale: 1.05, y: -2, rotate: -1 }}
            whileTap={{ scale: 0.95, y: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", rotate: 0 }}
            className="flex-1 font-black py-3 px-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase text-lg sm:text-xl text-black flex justify-center items-center bg-white hover:bg-brand-pink transition-colors"
          >
            📚 GUIDE
          </motion.button>
        </div>

        {(!user || isAnonymous) && (
          <motion.button 
            whileHover={{ scale: 1.05, y: -2, rotate: 1 }}
            whileTap={{ scale: 0.95, y: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", rotate: 0 }}
            onClick={() => setAuthModalOpen(true)}
            className="w-full bg-white text-black font-black py-4 px-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase text-xl flex items-center justify-center gap-2"
          >
            <span>🔑</span> Login / Save Data
          </motion.button>
        )}

        {user && !isAnonymous && (
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
            onClick={() => signOut()}
            className="w-full bg-black text-white font-black py-3 px-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase hover:bg-white hover:text-black flex items-center justify-center text-lg transition-colors"
          >
            Sign Out
          </motion.button>
        )}
      </div>

      {/* Error display if any */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-8 left-4 right-4 sm:left-auto sm:w-96 bg-red-500 border-4 border-black text-black p-4 font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50 text-center"
          >
            🚨 {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render the global Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default App;