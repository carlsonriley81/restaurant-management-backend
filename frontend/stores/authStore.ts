import { create } from 'zustand';
import type { User } from '@/types/auth';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '@/utils/storage';
import api from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post<{ user: User; tokens: { accessToken: string; refreshToken: string } }>(
        '/auth/login',
        { email, password },
      );
      const { user, tokens } = response.data;
      setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
      setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
      setItem(STORAGE_KEYS.user, user);
      set({ user, token: tokens.accessToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    removeItem(STORAGE_KEYS.accessToken);
    removeItem(STORAGE_KEYS.refreshToken);
    removeItem(STORAGE_KEYS.user);
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = getItem<string>(STORAGE_KEYS.accessToken);
    const user = getItem<User>(STORAGE_KEYS.user);
    if (token && user) {
      set({ user, token, isAuthenticated: true });
    }
  },
}));
