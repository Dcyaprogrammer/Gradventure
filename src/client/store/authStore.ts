import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import type { User, Session } from '@supabase/supabase-js';

// Feature Flag: Control whether the app forces real authentication
// In DEMO_MODE, users are automatically signed in anonymously
export const IS_DEMO_MODE = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAnonymous: boolean;
  error: string | null;
  isAuthModalOpen: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  signInAnonymously: (background?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  setAuthModalOpen: (isOpen: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAnonymous: false,
  error: null,
  isAuthModalOpen: false,

  setAuthModalOpen: (isOpen: boolean) => set({ isAuthModalOpen: isOpen }),

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, currentSession) => {
        set({ 
          session: currentSession, 
          user: currentSession?.user || null,
          isAnonymous: currentSession?.user?.is_anonymous || false,
          isLoading: false 
        });
      });

      // Handle Demo Mode Logic
      if (IS_DEMO_MODE && !session) {
        // If in demo mode and no active session, sign in silently in the background
        set({ isLoading: false }); // Unblock UI immediately
        get().signInAnonymously(true);
      } else {
        set({ 
          session, 
          user: session?.user || null,
          isAnonymous: session?.user?.is_anonymous || false,
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('Auth initialization error:', error.message);
    }
  },

  signInAnonymously: async (background = false) => {
    try {
      if (!background) set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) throw error;
      
      set({ 
        user: data.user, 
        session: data.session,
        isAnonymous: true,
        ...(!background && { isLoading: false })
      });
      
      console.log('Signed in anonymously with UID:', data.user?.id);
    } catch (error: any) {
      set({ error: error.message, ...(!background && { isLoading: false }) });
      console.error('Anonymous sign-in error:', error.message);
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ user: null, session: null, isAnonymous: false, isLoading: false });
      
      // If we sign out while in demo mode, immediately sign back in anonymously
      if (IS_DEMO_MODE) {
        await get().signInAnonymously();
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('Sign out error:', error.message);
    }
  }
}));