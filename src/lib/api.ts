// import { LoginResponse } from '@/types';
// import api from './axios-client';
// type LoginData = {
//   email?: string;
//   password?: string;
// };
// interface RegisterData {
//   email: string;
//   password: string;
//   fullName?: string;
//   phoneNumber?: string;
//   address?: string;
// }

// interface UpdateProfileData {
//   fullName?: string;
//   phoneNumber?: string;
//   address?: string;
// }
// export const loginMutationFn = async (data: LoginData) =>
//   await api.post<LoginResponse>('/auth/login', data);

// export const registerMutationFn = async (userData: RegisterData) =>
//   await api.post('/auth/register', userData);

// export const logoutMutationFn = async () => await api.post('/auth/logout');

// export const forgotPasswordMutationFn = async (email: string) =>
//   await api.post('/auth/forgot-password', { email });

// export const resetPasswordMutationFn = async (token: string, password: string) =>
//   await api.post(`/auth/reset-password/${token}`, { password });

// export const updateProfile = async (userData: UpdateProfileData) =>
//   await api.put('/users/profile', userData);

// export const changePassword = async (currentPassword: string, newPassword: string) =>
//   await api.put('/users/change-password', { currentPassword, newPassword });

// export const verifyEmailMutationFn = async (token: string) =>
//   await api.get(`/auth/verify-email/${token}`);

// export const getProfileUserQueryFn = async () => await api.get('/users/profile');

// export const googleLogin = () => {
//   window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
// };
