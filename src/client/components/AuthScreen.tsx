import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthScreen: React.FC = () => {
  const { user, isAnonymous, initialize } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for the "cover eyes" animation
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
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (user && !isAnonymous) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-yellow flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background decorations - Now animated with framer-motion */}
      <motion.div 
        animate={{ y: [0, -20, 0] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute -top-4 -left-4 sm:top-10 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 bg-brand-pink border-4 border-black rounded-full" 
      />
      <motion.div 
        animate={{ rotate: [12, -12, 12] }} 
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute -bottom-8 -right-8 sm:bottom-20 sm:right-10 w-20 h-20 sm:w-24 sm:h-24 bg-brand-cyan border-4 border-black" 
      />
      
      {/* Main Container - Removed tilt, made more compact for mobile (max-w-sm) */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="bg-white border-4 border-black p-5 sm:p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm z-10 flex flex-col relative"
      >
        {/* Interactive Mascot - Changes when password is focused */}
        <div className="flex justify-center mb-2 -mt-10 sm:-mt-12 relative z-20">
          <motion.div 
            animate={isPasswordFocused ? { scale: 1.1, rotate: [0, -10, 10, 0] } : { scale: 1, rotate: 0 }}
            className="text-6xl sm:text-7xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] select-none"
          >
            {isPasswordFocused ? '🙈' : '🐵'}
          </motion.div>
        </div>

        <div className="text-center mb-6 border-b-4 border-black pb-4 mt-2">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none">
            {isLogin ? 'Welcome' : 'Join'} <br/>
            <span className="text-brand-pink text-2xl sm:text-3xl">Gradventure</span>
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
              <div className="bg-red-400 text-black border-4 border-black p-2 mb-4 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                🚨 {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 group">
            <label className="block text-sm sm:text-base font-black uppercase tracking-wide group-hover:text-brand-cyan transition-colors">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsPasswordFocused(false)}
              required
              className="w-full bg-gray-100 border-4 border-black p-2.5 text-base font-bold focus:outline-none focus:bg-brand-cyan focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
              placeholder="student@university.edu"
            />
          </div>

          <div className="space-y-1 group">
            <label className="block text-sm sm:text-base font-black uppercase tracking-wide group-hover:text-brand-pink transition-colors">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              required
              className="w-full bg-gray-100 border-4 border-black p-2.5 text-base font-bold focus:outline-none focus:bg-brand-pink focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95, y: 2, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white border-4 border-black font-black uppercase text-xl py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 hover:bg-brand-green hover:text-black"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Start Journey' : 'Create Profile')}
          </motion.button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="font-bold text-sm underline decoration-4 decoration-brand-yellow hover:bg-black hover:text-white px-2 py-1 transition-colors"
          >
            {isLogin ? "New here? Create account" : "Already registered? Log in"}
          </button>
        </div>
        
        {isAnonymous && (
          <div className="mt-5 pt-3 border-t-4 border-black border-dashed text-center">
            <p className="text-xs font-bold bg-brand-yellow inline-block px-2 py-1 border-2 border-black transform rotate-2 shadow-neo">
              Playing as Guest
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};