import api from '@/lib/axios-client';
import { User, UserProfileFormValues, ChangePasswordFormValues, AdminUserListParams, UpdateUserRoleFormValues, AdminUserListResponse, CreateUserFormValues } from '@/types';

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


export const getAdminUsers = async (
  params: AdminUserListParams
): Promise<AdminUserListResponse> => {
  const response = await api.get('/api/users/admin/users', { params });
  return response.data;
};

export const createAdminUser = async (
  data: CreateUserFormValues
): Promise<{ message: string; user: User }> => {
  const response = await api.post('/api/users/admin/users', data);
  return response.data;
};

export const updateAdminUserRole = async (
  userId: number,
  data: UpdateUserRoleFormValues
): Promise<{ message: string; user: User }> => {
  const response = await api.put(`/api/users/admin/users/${userId}/role`, data);
  return response.data;
};

export const updateAdminUser = async (
  userId: number,
  data: UserProfileFormValues
): Promise<{ message: string; user: User }> => {
  const response = await api.put(`/api/users/admin/users/${userId}`, data);
  return response.data;
};
