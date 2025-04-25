export interface User {
  id: number;
  email: string;
  fullName: string | null;
  phoneNumber: string | null;
  address: string | null;
  role: 'customer' | 'admin' | 'technician';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface ApiError {
  message: string;
  errors?: Array<{
    param: string;
    msg: string;
  }>;
}
