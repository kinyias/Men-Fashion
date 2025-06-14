export interface User {
  ma: number;
  email: string;
  ho: string | null;
  ten: string | null;
  so_dien_thoai: string | null;
  vai_tro: 'khach_hang' | 'admin';
  ma_xac_minh: string;
  xac_thuc_email: boolean;
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

// Admin user management APIs
export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  vai_tro?: string;
  xac_thuc_email?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminUserListResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CreateUserFormValues {
  email: string;
  ho?: string;
  ten?: string;
  so_dien_thoai?: string;
  vai_tro: 'khach_hang' | 'admin';
  mat_khau: string;
}

export interface UpdateUserRoleFormValues {
  vai_tro: 'khach_hang' | 'admin';
}
