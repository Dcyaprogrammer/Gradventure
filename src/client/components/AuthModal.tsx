import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const { user, isAnonymous, initialize, isAuthModalOpen, setAuthModalOpen } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      await initialize();
      setAuthModalOpen(false); // Close modal on success
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Do not render anything if modal is closed
  if (!isAuthModalOpen) {
    return null;
  }

  // If fully authenticated user opens modal, just close it
  if (user && !isAnonymous) {
    setAuthModalOpen(false);
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 font-sans">
        {/* Lighter, high-contrast overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAuthModalOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          style={{ backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.4) 4px, transparent 4px)', backgroundSize: '20px 20px' }}
        />
        
        {/* Main Modal Container - Bright, standard neo-brutalism */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20, rotate: -2 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20, rotate: 2 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="bg-white text-black border-[8px] border-black p-6 sm:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm z-10 flex flex-col relative"
        >
          {/* Close Button */}
          <button 
            onClick={() => setAuthModalOpen(false)}
            className="absolute -top-6 -right-6 w-12 h-12 flex items-center justify-center bg-brand-pink text-black border-[4px] border-black font-black text-2xl hover:bg-brand-yellow hover:scale-110 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            ✕
          </button>

          {/* Interactive Mascot - Student theme */}
          <div className="flex justify-center mb-4 -mt-16 sm:-mt-20 relative z-20 pointer-events-none">
            <motion.div 
              animate={isPasswordFocused ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1, rotate: 0 }}
              className="text-[80px] sm:text-[100px] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] select-none"
            >
              {isPasswordFocused ? '🙈' : '🎓'}
            </motion.div>
          </div>

          <div className="text-center mb-6 border-b-[6px] border-black pb-4 mt-2">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none text-black drop-shadow-[4px_4px_0px_#FFF066]">
              {isLogin ? 'WELCOME' : 'JOIN'} <br/>
              <span className="text-2xl sm:text-3xl drop-shadow-none">GRADVENTURE</span>
            </h1>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-brand-yellow text-black border-[4px] border-black p-3 mb-6 font-black text-sm sm:text-base shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase transform -rotate-1">
                  ERROR: {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="inline-block bg-brand-cyan text-black px-2 py-1 border-[3px] border-black text-sm sm:text-base font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
                STUDENT EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsPasswordFocused(false)}
                required
                className="w-full bg-white text-black border-[4px] border-black p-3 text-lg font-black focus:outline-none focus:bg-brand-cyan/20 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400 placeholder:font-bold"
                placeholder="student@university.edu"
              />
            </div>

            <div className="space-y-2 group">
              <label className="inline-block bg-brand-pink text-black px-2 py-1 border-[3px] border-black text-sm sm:text-base font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
                className="w-full bg-white text-black border-[4px] border-black p-3 text-lg font-black focus:outline-none focus:bg-brand-pink/20 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400 placeholder:font-bold"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -4, rotate: 1 }}
              whileTap={{ scale: 0.98, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", rotate: 0 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-green text-black border-[6px] border-black font-black uppercase tracking-widest text-2xl py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 hover:bg-brand-yellow"
            >
              {isLoading ? 'LOADING...' : (isLogin ? 'ENTER GAME' : 'ENROLL NOW')}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="font-black text-sm sm:text-base uppercase tracking-widest text-black hover:text-brand-accent underline decoration-[4px] decoration-brand-pink hover:bg-black/5 px-4 py-2 transition-all"
            >
              {isLogin ? "NEW STUDENT? REGISTER" : "ALREADY ENROLLED? LOGIN"}
            </button>
          </div>
          
          {isAnonymous && (
            <div className="mt-8 pt-4 border-t-[4px] border-black border-dashed text-center">
              <p className="text-sm font-black bg-white text-black inline-block px-3 py-1 border-[4px] border-black transform rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                PLAYING AS GUEST
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};