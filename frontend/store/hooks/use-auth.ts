'use client';

import { authService } from '@/services';
import { useAuthStore } from '@/stores';
import { UserSignIn, UserSignUp } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, setAuth, clearAuth } = useAuthStore();
  const router = useRouter();

  const login = useMutation({
    mutationFn: (data: UserSignIn) => authService.login(data),

    onSuccess: ({ user, access_token }: any) => {
      setAuth(user, access_token);
      router.push('/');
    },
  });

  const register = useMutation({
    mutationFn: (data: UserSignUp) => authService.register(data),

    onSuccess: ({ user, access_token }: any) => {
      setAuth(user, access_token);
      router.push('/');
    },
  });

  const logout = useMutation({
    mutationFn: authService.logout,

    onSuccess: () => {
      clearAuth();
      router.push('/login');
    },

    onError: () => {
      clearAuth();
      router.push('/login');
    },
  });

  return {
    user,
    login: login.mutate,
    register: register.mutate,
    logout: logout.mutate,
  };
}
