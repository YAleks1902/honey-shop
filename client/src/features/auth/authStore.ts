import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { api } from '@/lib/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  modalOpen: boolean;
  modalTab: 'login' | 'register' | 'forgot' | 'success';
  login: (data: { accessToken: string; refreshToken: string; user: User }) => void;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  openModal: (tab?: 'login' | 'register' | 'forgot' | 'success') => void;
  closeModal: () => void;
  setModalTab: (tab: 'login' | 'register' | 'forgot' | 'success') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoggedIn: false,
      modalOpen: false,
      modalTab: 'login',

      login: ({ accessToken, refreshToken, user }) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ user, accessToken, isLoggedIn: true });
      },

      logout: async () => {
        try { await api.post('/auth/logout'); } catch { /* ignore */ }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null, isLoggedIn: false });
      },

      setUser: (user) => set({ user }),

      openModal: (tab = 'login') => set({ modalOpen: true, modalTab: tab }),

      closeModal: () => set({ modalOpen: false }),

      setModalTab: (tab) => set({ modalTab: tab }),
    }),
    {
      name: 'honey-auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isLoggedIn: state.isLoggedIn }),
    },
  ),
);
