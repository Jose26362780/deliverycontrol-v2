import { create } from 'zustand';
import { User } from '../types';
import { AuthService } from '../features/auth/services/auth.service';

interface AuthState {
  user: User | null;
  token: null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  init: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = await AuthService.getSession();
      set({ user, isInitialized: true, isLoading: false });
    } catch {
      set({ user: null, isInitialized: true, isLoading: false });
    }
  },

  init: async () => get().initialize(),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.login({ email, password });
      set({ user, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao iniciar sessão';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.loginWithGoogle();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao autenticar com Google';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.register({ name, email, password, confirmPassword: password });
      set({ user, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar a conta';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  logout: async () => {
    try {
      await AuthService.logout();
    } finally {
      set({ user: null, token: null, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));

if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    void useAuthStore.getState().logout();
  });
}
