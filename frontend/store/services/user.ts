import { apiNoAuth } from '@/lib/api/axios';
import { User, UserSignIn, UserSignUp } from '@/types';

export const userService = {
  login: async (
    data: UserSignIn,
  ): Promise<{ user: User; accessToken: string }> => {
    const res = await apiNoAuth.post(process.env.NEXT_PUBLIC_LOGIN_ENDPOINT!, {
      username: data.username,
      password: data.password,
    });

    return res.data;
  },

  register: async (data: UserSignUp) => {
    const res = await apiNoAuth.post(process.env.NEXT_PUBLIC_REGISTER_ENDPOINT!, {
      username: data.username,
      name: data.name,
      phone_number: data.phoneNumber,
      password: data.password,
      confirm_password: data.confirmPassword,
    });

    return res.data;
  },

  logout: async () => {
    await apiNoAuth.post(process.env.NEXT_PUBLIC_LOGOUT_ENDPOINT!);
  },

  refreshToken: async (): Promise<string> => {
    const res = await apiNoAuth.post(process.env.NEXT_PUBLIC_REFRESH_TOKEN_ENDPOINT!);
    return res.data.access_token;
  },

  getMe: async () => {},
};
