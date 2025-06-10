import api from '@/lib/axios-client';
import { User, UserProfileFormValues, ChangePasswordFormValues } from '@/types';

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get('/api/users/profile');
  return response.data;
};

export const updateUserProfile = async (
  data: UserProfileFormValues
): Promise<{ message: string; user: User }> => {
  const response = await api.put('/api/users/profile', data);
  return response.data;
};

export const changePassword = async (
  data: ChangePasswordFormValues
): Promise<{ message: string }> => {
  const response = await api.put('/api/users/change-password', data);
  return response.data;
};
