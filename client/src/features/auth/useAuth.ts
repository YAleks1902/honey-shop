import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from './authStore';
import { User } from '@/types';

export function useProfile(enabled = true) {
  return useQuery<User>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/users/profile');
      return data.data;
    },
    enabled,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData: Partial<User> & { currentPassword?: string; newPassword?: string }) => {
      const { data } = await api.put('/users/profile', profileData);
      return data.data as User;
    },
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (addressData: Partial<User>) => {
      const { data } = await api.put('/users/address', addressData);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}

export function useRegister() {
  const { login } = useAuthStore();
  return useMutation({
    mutationFn: async (body: { email: string; password: string; confirmPassword: string }) => {
      const { data } = await api.post('/auth/register', body);
      return data.data;
    },
    onSuccess: (data) => login(data),
  });
}

export function useLogin() {
  const { login } = useAuthStore();
  return useMutation({
    mutationFn: async (body: { email: string; password: string; rememberMe?: boolean }) => {
      const { data } = await api.post('/auth/login', body);
      return data.data;
    },
    onSuccess: (data) => login(data),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (body: { email: string }) => {
      const { data } = await api.post('/auth/forgot-password', body);
      return data.data;
    },
  });
}
