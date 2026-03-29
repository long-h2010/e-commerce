import { userService } from '@/services';
import { authStore } from '@/stores';
import { UserSignIn } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useCurrentUser() {
  // const { accessToken, setAuth, clearAuth } = authStore();
  // return useQuery({
  //   queryKey: ['current-user'],
  //   queryFn: authService.getCurrentUser,
  //   enabled: !!accessToken,
  //   staleTime: 5 * 60 * 1000,
  //   retry: false,
  //   onError: () => {
  //     clearAuth();
  //   },
  // });
}
export function useAuth() {
  const { user, setAuth, clearAuth } = authStore();
  const router = useRouter();

  const login = useMutation({
    mutationFn: (data: UserSignIn) => userService.login(data),

    onSuccess: ({ user, access_token }: any) => {
      setAuth(user, access_token);
      router.push('/');
    },

    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });

  const logout = useMutation({
    mutationFn: userService.logout,

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
    logout: logout.mutate,
  };
}
