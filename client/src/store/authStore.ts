import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  role: 'NGO' | 'Needy' | 'Doctor' | 'Admin' | null;
  loading: boolean;
  setAuth: (session: Session | null, user: User | null) => void;
  fetchRole: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
  setMockAuth: (userId: string, role: 'NGO' | 'Needy' | 'Doctor' | 'Admin') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  role: null,
  loading: true,
  
  setAuth: (session, user) => set({ session, user, loading: false }),
  
  fetchRole: async (_userId) => {
    // Attempt to fetch role from user metadata
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user?.user_metadata?.role) {
      set({ role: user.user_metadata.role });
    } else {
      // Default fallback
      set({ role: 'NGO' });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, role: null });
  },

  setMockAuth: (userId, role) => {
    // Construct a mock user object with the required ID
    const mockUser = {
      id: userId,
      email: `${role.toLowerCase()}@sandbox.internal`,
      user_metadata: { role, full_name: `Sandbox ${role}` }
    } as any;
    
    set({ user: mockUser, role, loading: false });
  }
}));
