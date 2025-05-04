import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Vui lòng điền email hợp lệ',
  }).nonempty("Email không được để trống"),
  mat_khau: z.string().min(8, {
    message: 'Mật khẩu phải có ít nhất 8 kí tự',
  }).nonempty("Mật khẩu không được để trống"),
});

export const registerSchema = z
  .object({
    ho: z.string().min(2, {
      message: 'Họ phải có ít nhất 2 kí tự',
    }),
    ten: z.string().min(2, {
      message: 'Tên phải có ít nhất 2 kí tự',
    }),
    email: z.string().email({
      message: 'Vui lòng điền email hợp lệ',
    }),
    mat_khau: z.string().min(8, {
      message: 'Mật khẩu phải có ít nhất 8 kí tự',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Xác nhận mật khẩu là bắt buộc',
    }),
    so_dien_thoai: z.string().min(10, {
      message: 'Vui lòng điền số điện thoại',
    }),
  })
  .refine((val) => val.mat_khau === val.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: 'Vui lòng điền email hợp lệ',
  }),
});

export const resetPasswordSchema = z
  .object({
    mat_khau: z.string().trim().min(1, {
      message: 'Vui lòng nhập mật khẩu',
    }),
    confirmPassword: z.string().trim().min(1, {
      message: 'Vui lòng nhập xác nhận mật khẩu',
    }),
  })
  .refine((data) => data.mat_khau === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type registerType = z.infer<typeof registerSchema>;
