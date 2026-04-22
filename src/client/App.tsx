import { useEffect, useState, lazy, Suspense } from 'react';
import { useAuthStore } from './store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = lazy(() => import('./components/AuthModal').then(module => ({ default: module.AuthModal })));
const GameScreen = lazy(() => import('./components/GameScreen').then(module => ({ default: module.GameScreen })));
const StoreScreen = lazy(() => import('./components/StoreScreen').then(module => ({ default: module.StoreScreen })));
const KnowledgeBaseScreen = lazy(() => import('./components/KnowledgeBaseScreen').then(module => ({ default: module.KnowledgeBaseScreen })));

function App() {
  const { user, isAnonymous, isLoading, error, initialize, signOut, setAuthModalOpen, signInAnonymously } = useAuthStore();
  const [currentView, setCurrentView] = useState<'home' | 'game' | 'store' | 'knowledge'>('home');

  useEffect(() => {
    initialize();
  }, [initialize]);

  const loadingFallback = (
    <div className="min-h-screen bg-black flex items-center justify-center font-sans">
      <h2 className="text-2xl font-black uppercase text-white animate-pulse">Loading Assets...</h2>
    </div>
  );

  if (currentView === 'game' && user) {
    return (
      <Suspense fallback={loadingFallback}>
        <GameScreen 
          onQuit={() => setCurrentView('home')} 
          onNavigate={(view) => setCurrentView(view)} 
        />
      </Suspense>
    );
  }

  if (currentView === 'store') {
    return (
      <Suspense fallback={loadingFallback}>
        <StoreScreen onBack={() => setCurrentView('home')} />
      </Suspense>
    );
  }

  if (currentView === 'knowledge') {
    return (
      <Suspense fallback={loadingFallback}>
        <KnowledgeBaseScreen onBack={() => setCurrentView('home')} />
      </Suspense>
    );
  }

  if (isLoading) {
    return loadingFallback;
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
      className="min-h-[100dvh] p-4 sm:p-8 font-sans flex flex-col items-center justify-center relative overflow-hidden bg-[#FDF9F1]"
    >
      {/* Background Grid - Pop Style */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D0BFFF 3px, transparent 3px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Permanent Panic State Elements: Fast Moving Tapes (Adjusted to Pop Colors) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Tape 1 (Top) */}
        <div className="absolute top-[15%] w-[200vw] -ml-[50vw] transform rotate-12 bg-[#FFE066] border-y-8 border-black text-black font-black text-2xl py-2 shadow-[4px_4px_0px_0px_#FFA6A6] flex whitespace-nowrap">
          <div className="animate-marquee-fast-left">
            {tapeArray.map((text, i) => <span key={i} className="px-4">{text}</span>)}
          </div>
        </div>
        
        {/* Tape 2 (Middle) */}
        <div className="absolute top-[50%] w-[200vw] -ml-[50vw] transform -rotate-6 bg-[#D0BFFF] border-y-8 border-black text-white font-black text-3xl py-3 shadow-[4px_4px_0px_0px_#89CFF0] flex whitespace-nowrap">
          <div className="animate-marquee-fast-right">
            {tapeArray.map((text, i) => <span key={i} className="px-4">{text}</span>)}
          </div>
        </div>

        {/* Tape 3 (Bottom) */}
        <div className="absolute top-[80%] w-[200vw] -ml-[50vw] transform rotate-[15deg] bg-[#FFA6A6] border-y-8 border-black text-white font-black text-xl py-2 shadow-[4px_4px_0px_0px_#FFE066] flex whitespace-nowrap">
          <div className="animate-marquee-fast-left">
            {tapeArray.map((text, i) => <span key={i} className="px-4">{text}</span>)}
          </div>
        </div>
      </div>

      {/* Main Title - Pop Neo-Brutalism Style */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="z-10 text-center mb-16 sm:mb-24 flex flex-col items-center pointer-events-none"
      >
        <div className="bg-black text-white border-[6px] border-black px-6 py-2 transform -rotate-3 mb-6 shadow-[8px_8px_0px_0px_#89CFF0]">
          <span className="font-black uppercase tracking-widest text-lg sm:text-xl">
            READY TO APPLY ?
          </span>
        </div>
        
        <div className="transform rotate-1 drop-shadow-[6px_6px_0px_#FFA6A6] sm:drop-shadow-[10px_10px_0px_#D0BFFF]">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter text-black glitch-text-subtle">
            Grad<br className="sm:hidden" />venture
          </h1>
        </div>
      </motion.div>

      {/* Minimalist Action Area - Pop Colors */}
      <div className="z-10 w-full max-w-sm flex flex-col gap-4 relative">
        <motion.button 
          onClick={handlePlayClick}
          whileHover={{ scale: 1.05, y: -4, rotate: -2 }}
          whileTap={{ scale: 0.95, y: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", rotate: 0 }}
          className="w-full font-black py-6 sm:py-8 px-6 border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] uppercase text-4xl sm:text-5xl text-black flex justify-center items-center bg-[#FFE066] hover:bg-[#89CFF0] transition-colors"
        >
          {user ? 'PLAY' : 'START'}
        </motion.button>

        <div className="flex gap-4">
          <motion.button 
            onClick={() => setCurrentView('store')}
            whileHover={{ scale: 1.05, y: -2, rotate: 1 }}
            whileTap={{ scale: 0.95, y: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", rotate: 0 }}
            className="flex-1 font-black py-3 px-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase text-lg sm:text-xl text-black flex justify-center items-center bg-white hover:bg-[#D0BFFF] transition-colors"
          >
            🏪 STORE
          </motion.button>

          <motion.button 
            onClick={() => setCurrentView('knowledge')}
            whileHover={{ scale: 1.05, y: -2, rotate: -1 }}
            whileTap={{ scale: 0.95, y: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", rotate: 0 }}
            className="flex-1 font-black py-3 px-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase text-lg sm:text-xl text-black flex justify-center items-center bg-white hover:bg-[#FFA6A6] transition-colors"
          >
            📚 GUIDE
          </motion.button>
        </div>

        {(!user || isAnonymous) && (
          <motion.button 
            whileHover={{ scale: 1.05, y: -2, rotate: 1 }}
            whileTap={{ scale: 0.95, y: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", rotate: 0 }}
            onClick={() => setAuthModalOpen(true)}
            className="w-full bg-white text-black font-black py-4 px-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase text-xl flex items-center justify-center gap-2 hover:bg-[#89CFF0] transition-colors"
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
            className="absolute bottom-8 left-4 right-4 sm:left-auto sm:w-96 bg-[#FFA6A6] border-4 border-black text-black p-4 font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50 text-center"
          >
            🚨 {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render the global Auth Modal */}
      <Suspense fallback={null}>
        <AuthModal />
      </Suspense>
    </div>
  );
}

export default App;