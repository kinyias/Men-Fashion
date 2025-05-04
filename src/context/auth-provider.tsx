"use client";
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import api, { setAuthTokens, clearAuthTokens } from '@/lib/axios-client';
import { User, LoginResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (userData: UpdateProfileData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  googleLogin: () => void;
}

interface RegisterData {
  email: string;
  mat_khau: string;
  ho: string;
  ten: string;
  so_dien_thoai?: string;
}

interface UpdateProfileData {
  ho: string;
  ten: string;
  so_dien_thoai?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    setLoading(true);
    const accessToken = Cookies.get('accessToken');
    
    if (!accessToken) {
      setLoading(false);
      return;
    }
    
    try {
      const { data } = await api.get('/users/profile');
      setUser(data);
    } catch (error) {
      console.error('Tải dữ liệu người dùng thất bại:', error);
      // Don't clear tokens here as the interceptor will handle token refresh
    } finally {
      setLoading(false);
    }
  },[]);
  
  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await api.post<LoginResponse>('/auth/login', {
        email,
        mat_khau: password,
      });
      setAuthTokens(data.tokens);
      setUser(data.user);
      toast.success('Đăng nhập thành công');
      router.push('/dashboard');
      setLoading(false);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      await api.post('/auth/register', userData);
      toast.success('Đăng kí thành công! Vui lòng vào email để xác thực.');
      setLoading(false);
      router.push('/auth/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng kí thất bại';
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    } finally {
      clearAuthTokens();
      setUser(null);
      router.push('auth/login');
      toast.success('Đăng xuất thành công');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      toast.success('Đường dẫn cài lại mật khẩu đã được gửi qua email của bạn.');
      setLoading(false);
      router.push('/auth/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gửi email cài lại mật khẩu thất bại';
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      setLoading(true);
      await api.post(`/auth/reset-password/${token}`, { mat_khau: password });
      toast.success('Cài lại mật khảu thành công! Bây giờ bạn có thể đăng nhập với mật khảu mới.');
      setLoading(false);
      router.push('/auth/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Cài lại mật khẩu thất bại';
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };

  const updateProfile = async (userData: UpdateProfileData) => {
    try {
      const { data } = await api.put('/users/profile', userData);
      setUser(data.user);
      toast.success('Cập nhật thông tin cá nhân thành công!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Cập nhật thông tin cá nhân thất bại';
      toast.error(message);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      await api.put('/users/change-password', { currentPassword, newPassword });
      toast.success('Đổi mật khẩu thành công!');
      setLoading(false);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đổi mật khẩu thất bại';
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };

  const verifyEmail = useCallback(async (token: string) => {
    try {
      setLoading(true);
      await api.get(`/auth/verify-email/${token}`);
      toast.success('Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.');
      setLoading(false);
      router.push('/auth/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Xác thực email thất bại';
      toast.error(message);
      setLoading(false);
      throw error;
    }
  },[router]);

  const googleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loadUser,
        forgotPassword,
        resetPassword,
        updateProfile,
        changePassword,
        verifyEmail,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};