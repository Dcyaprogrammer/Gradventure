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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 font-sans overflow-hidden">
        {/* High-contrast P5 overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAuthModalOpen(false)}
          className="absolute inset-0 bg-[#D0BFFF]/80 backdrop-blur-sm"
          style={{ backgroundImage: 'radial-gradient(#FFE066 2px, transparent 3px)', backgroundSize: '16px 16px' }}
        />
        
        {/* Main Modal Container - Pop Neo-Brutalism Style */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20, rotate: -2 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20, rotate: 2 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative w-full max-w-md z-10"
        >
          {/* Close Button */}
          <button 
            onClick={() => setAuthModalOpen(false)}
            className="absolute -top-4 -right-2 sm:-top-6 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black text-white border-[3px] border-white font-black text-xl sm:text-2xl hover:bg-[#FFA6A6] hover:scale-110 transition-all transform rotate-6 z-30 shadow-[4px_4px_0px_0px_#FFA6A6]"
          >
            ✕
          </button>

          {/* Guest Mode Tag */}
          {isAnonymous && (
            <div className="absolute -bottom-3 -right-2 sm:-bottom-5 sm:-right-4 z-30">
              <p className="text-[10px] sm:text-xs font-black bg-[#FFE066] text-black inline-block px-3 py-1.5 border-[3px] border-black transform -rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                GUEST MODE
              </p>
            </div>
          )}

          {/* Decorative Background Shadow */}
          <div 
            className="absolute inset-0 bg-[#89CFF0] transform translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4"
            style={{ clipPath: 'polygon(3% 0, 100% 2%, 97% 100%, 0 98%)' }}
          ></div>

          {/* Actual Modal Content Box */}
          <div 
            className="bg-white text-black border-[6px] sm:border-[8px] border-black p-6 sm:p-10 w-full flex flex-col relative"
            style={{ clipPath: 'polygon(3% 0, 100% 2%, 97% 100%, 0 98%)' }}
          >
            {/* Very Subtle Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQPSI4Ij48Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMSIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')]"></div>

            {/* Interactive Mascot */}
            <div className="flex justify-center mb-2 -mt-10 sm:-mt-14 relative z-20 pointer-events-none">
              <motion.div 
                animate={isPasswordFocused ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1, rotate: 0 }}
                className="text-[60px] sm:text-[80px] drop-shadow-[4px_4px_0px_#D0BFFF] select-none bg-black rounded-full border-[4px] border-white w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center"
              >
                {isPasswordFocused ? '🙈' : '🎓'}
              </motion.div>
            </div>

            {/* Title Header */}
            <div className="text-center mb-6 mt-2 relative">
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none text-black relative z-10 transform -rotate-1">
                {isLogin ? 'WELCOME' : 'JOIN'} <br/>
                <span className="text-2xl sm:text-3xl text-black bg-[#FFE066] px-4 py-1 mt-2 inline-block border-[4px] border-black shadow-[4px_4px_0px_0px_#89CFF0] transform rotate-2">GRADVENTURE</span>
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
                  <div className="bg-[#FFA6A6] text-black border-[4px] border-black p-3 mb-6 font-black text-xs sm:text-sm shadow-[4px_4px_0px_0px_#D0BFFF] uppercase transform -rotate-1 text-center tracking-widest">
                    ⚠️ {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2 group relative">
                <label className="absolute -top-3 left-2 bg-[#FFB3D9] text-black px-2 py-0.5 border-[2px] border-black text-xs sm:text-sm font-black uppercase tracking-widest transform -rotate-2 z-10 shadow-[2px_2px_0px_0px_#000]">
                  STUDENT EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsPasswordFocused(false)}
                  required
                  className="w-full bg-white text-black border-[4px] sm:border-[5px] border-black p-3 sm:p-4 pt-5 text-base sm:text-lg font-black focus:outline-none focus:bg-[#FFE066] focus:text-black transition-all placeholder:text-gray-400 placeholder:font-bold"
                  placeholder="student@university.edu"
                />
              </div>

              <div className="space-y-2 group relative">
                <label className="absolute -top-3 left-2 bg-[#89CFF0] text-black px-2 py-0.5 border-[2px] border-black text-xs sm:text-sm font-black uppercase tracking-widest transform rotate-2 z-10 shadow-[2px_2px_0px_0px_#000]">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  required
                  className="w-full bg-white text-black border-[4px] sm:border-[5px] border-black p-3 sm:p-4 pt-5 text-base sm:text-lg font-black focus:outline-none focus:bg-[#FFE066] focus:text-black transition-all placeholder:text-gray-400 placeholder:font-bold"
                  placeholder="••••••••"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -4, rotate: 1 }}
                whileTap={{ scale: 0.98, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", rotate: 0 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white border-[4px] sm:border-[6px] border-black font-black uppercase tracking-widest text-xl sm:text-2xl py-3 sm:py-4 shadow-[6px_6px_0px_0px_#D0BFFF] sm:shadow-[8px_8px_0px_0px_#FFE066] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 hover:bg-[#FFE066] hover:text-black hover:shadow-[6px_6px_0px_0px_#000] sm:hover:shadow-[8px_8px_0px_0px_#000]"
              >
                {isLoading ? 'LOADING...' : (isLogin ? 'ENTER GAME' : 'ENROLL NOW')}
              </motion.button>
            </form>

            <div className="mt-6 sm:mt-8 text-center relative z-10">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="font-black text-xs sm:text-sm uppercase tracking-widest text-black hover:text-white hover:bg-black px-4 py-2 transition-all border-[3px] border-transparent hover:border-black transform rotate-1"
              >
                {isLogin ? "NEW STUDENT? REGISTER" : "ALREADY ENROLLED? LOGIN"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};