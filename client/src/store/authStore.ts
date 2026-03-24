import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  role: 'NGO' | 'Needy' | 'Doctor' | null;
  loading: boolean;
  setAuth: (session: Session | null, user: User | null) => void;
  fetchRole: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  role: null,
  loading: true,
  
  setAuth: (session, user) => set({ session, user, loading: false }),
  
  fetchRole: async (userId) => {
    // Attempt to fetch role from profiles table (assuming it's set up to maintain roles)
    // If profiles isn't available right now, we can fallback to user metadata for the Hackathon scope.
    const { data: userObj, error } = await supabase.auth.getUser();
    
    if (userObj?.user?.user_metadata?.role) {
      set({ role: userObj.user.user_metadata.role });
    } else {
      // Fallback
      set({ role: 'NGO' }); // default for testing if not set
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, role: null });
  }
}));
