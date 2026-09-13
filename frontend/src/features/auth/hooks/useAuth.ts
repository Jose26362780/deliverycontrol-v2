import { useAuthStore } from '../../../stores/auth.store';

export function useAuth() {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const isLoading = useAuthStore(state => state.isLoading);
  const isInitialized = useAuthStore(state => state.isInitialized);
  const error = useAuthStore(state => state.error);
  const login = useAuthStore(state => state.login);
  const loginWithGoogle = useAuthStore(state => state.loginWithGoogle);
  const register = useAuthStore(state => state.register);
  const logout = useAuthStore(state => state.logout);
  const clearError = useAuthStore(state => state.clearError);

  return {
    user,
    token,
    isAuthenticated: Boolean(user),
    isLoading,
    isInitialized,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    clearError,
  };
}
