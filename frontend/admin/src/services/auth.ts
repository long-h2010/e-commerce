import { apiNoAuth } from '@/lib/api/axios';
import { authStore } from '@/stores';
import { User, UserSignIn } from '@/types';

export const authService = {
  login: async (
    data: UserSignIn,
  ): Promise<{ user: User; accessToken: string }> => {
    const res = await apiNoAuth.post(import.meta.env.VITE_LOGIN_ENDPOINT, {
      username: data.username,
      password: data.password,
    });

    const { user, access_token: accessToken } = res.data;
    authStore.getState().setAuth(user, accessToken);

    return res.data;
  },

  logout: async () => {
    try {
      await apiNoAuth.post(import.meta.env.VITE_LOGOUT_ENDPOINT);
    } catch (e) {
      console.error('Logout error: ', e);
    } finally {
      authStore.getState().clearAuth();
    }
  },

  refreshToken: async (): Promise<string> => {
    const res = await apiNoAuth.post(
      import.meta.env.VITE_REFRESH_TOKEN_ENDPOINT,
    );

    const newAccessToken = res.data.access_token;
    authStore.setState({ accessToken: newAccessToken });

    return newAccessToken;
  },
};
