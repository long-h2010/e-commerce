import { apiNoAuth } from '@/lib/api/axios';
import { transformKeysToSnakeCase } from '@/lib/utils';
import { User, UserSignIn, UserSignUp } from '@/types';

export const authService = {
  login: async (
    data: UserSignIn,
  ): Promise<{ user: User; accessToken: string }> => {
    const res = await apiNoAuth.post(
      process.env.NEXT_PUBLIC_LOGIN_ENDPOINT!,
      transformKeysToSnakeCase(data),
    );

    return res.data;
  },

  register: async (data: UserSignUp) => {
    const res = await apiNoAuth.post(
      process.env.NEXT_PUBLIC_REGISTER_ENDPOINT!,
      transformKeysToSnakeCase(data),
    );

    return res.data;
  },

  logout: async () => {
    await apiNoAuth.post(process.env.NEXT_PUBLIC_LOGOUT_ENDPOINT!);
  },

  refreshToken: async (): Promise<string> => {
    const res = await apiNoAuth.post(
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_ENDPOINT!,
    );
    return res.data.access_token;
  },

  getMe: async () => {},
};
