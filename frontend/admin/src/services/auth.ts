import { apiNoAuth } from '@/lib/api/axios';
import { useAuthStore } from '@/stores';
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
    useAuthStore.getState().setAuth(user, accessToken);

    return res.data;
  },

  logout: async () => {
    try {
      await apiNoAuth.post(import.meta.env.VITE_LOGOUT_ENDPOINT);
    } catch (e) {
      console.error('Logout error: ', e);
    } finally {
      useAuthStore.getState().clearAuth();
    }
  },

  refreshToken: async (): Promise<string> => {
    const res = await apiNoAuth.post(
      import.meta.env.VITE_REFRESH_TOKEN_ENDPOINT,
    );

    const newAccessToken = res.data.access_token;
    console.log('New access token: ', newAccessToken);
    useAuthStore.setState({ accessToken: newAccessToken });

    return newAccessToken;
  },
};
