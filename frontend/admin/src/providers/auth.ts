import { authService } from '@/services';
import { authStore } from '@/stores';
import { AuthProvider } from '@refinedev/core';

export const authProvider: AuthProvider = {
  login: async (params) => {
    try {
      const { username, password } = params;
      await authService.login({ username, password });

      return {
        success: true,
        redirectTo: '/',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'Login Error',
          message: error.response?.data?.message || 'Login fail',
        },
      };
    }
  },

  logout: async () => {
    await authService.logout();
    return { success: true, redirectTo: '/login' };
  },

  check: async () => {
    const { accessToken, isAuthenticated } = authStore.getState();

    if (accessToken || isAuthenticated) return { authenticated: true };

    try {
      await authService.refreshToken();
      return { authenticated: true };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: '/login',
        logout: true,
      };
    }
  },

  onError: async (error) => {
    const status = error?.response?.status;

    if (status === 401) return { error };

    if (status === 403) {
      authService.logout();
      return {
        logout: true,
        redirectTo: '/login',
        error,
      };
    }

    return { error };
  },

  getPermissions: async () => {
    const user = authStore.getState().user;
    return user?.role;
  },
};
