import { z } from 'zod';

export const userProfileSchema = z.object({
  ho: z
    .string()
    .min(1, {
      message: 'Họ không được để trống',
    })
    .max(255, {
      message: 'Họ không thể có nhiều hơn 255 kí tự.',
    }),
  ten: z
    .string()
    .min(1, {
      message: 'Tên không được để trống',
    })
    .max(255, {
      message: 'Tên không thể có nhiều hơn 255 kí tự.',
    }),
  so_dien_thoai: z
    .string()
    .min(10, {
      message: 'Số điện thoại phải có ít nhất 10 số',
    })
    .max(20, {
      message: 'Số điện thoại không thể có nhiều hơn 20 số',
    })
    .optional()
    .nullable(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: 'Mật khẩu hiện tại không được để trống',
    }),
    newPassword: z.string().min(8, {
      message: 'Mật khẩu mới phải có ít nhất 8 ký tự',
    }),
    confirmPassword: z.string().min(1, {
      message: 'Xác nhận mật khẩu không được để trống',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });
