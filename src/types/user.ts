export interface User {
  ma: number;
  email: string;
  ho: string | null;
  ten: string | null;
  so_dien_thoai: string | null;
  vai_tro: 'khanh_hang' | 'admin';
  ma_xac_minh: boolean;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface UserProfileFormValues {
  ho: string;
  ten: string;
  so_dien_thoai?: string | null;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
}
