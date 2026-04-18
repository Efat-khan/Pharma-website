'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => api.post('/auth/send-otp', { phone }).then(r => r.data),
  });
}

export function useVerifyOtp() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { phone: string; otp: string; name?: string }) =>
      api.post('/auth/verify-otp', data).then(r => r.data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Welcome back!');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Verification failed');
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  return () => {
    const refreshToken = document.cookie
      .split(';')
      .find(c => c.trim().startsWith('refreshToken='))
      ?.split('=')[1];

    if (refreshToken) {
      api.post('/auth/logout', { refreshToken }).catch(() => {});
    }
    logout();
    router.push('/login');
  };
}
