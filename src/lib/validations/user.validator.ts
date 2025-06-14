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

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Email không được để trống',
    })
    .email({
      message: 'Email không hợp lệ',
    })
    .max(255, {
      message: 'Email không thể có nhiều hơn 255 kí tự',
    }),
  ho: z
    .string()
    .min(1, {
      message: 'Họ không được để trống',
    })
    .max(255, {
      message: 'Họ không thể có nhiều hơn 255 kí tự',
    })
    .optional(),
  ten: z
    .string()
    .min(1, {
      message: 'Tên không được để trống',
    })
    .max(255, {
      message: 'Tên không thể có nhiều hơn 255 kí tự',
    })
    .optional(),
  so_dien_thoai: z
    .string()
    .min(10, {
      message: 'Số điện thoại phải có ít nhất 10 số',
    })
    .max(20, {
      message: 'Số điện thoại không thể có nhiều hơn 20 số',
    })
    .optional(),
  vai_tro: z.enum(['khach_hang', 'admin'], {
    required_error: 'Vai trò không được để trống',
    invalid_type_error: 'Vai trò không hợp lệ',
  }),
  mat_khau: z
    .string()
    .min(8, {
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
    })
    .max(255, {
      message: 'Mật khẩu không thể có nhiều hơn 255 kí tự',
    }),
});

export const updateUserSchema = z.object({
  ho: z
    .string()
    .min(1, {
      message: 'Họ không được để trống',
    })
    .max(255, {
      message: 'Họ không thể có nhiều hơn 255 kí tự',
    })
    .optional(),
  ten: z
    .string()
    .min(1, {
      message: 'Tên không được để trống',
    })
    .max(255, {
      message: 'Tên không thể có nhiều hơn 255 kí tự',
    })
    .optional(),
  so_dien_thoai: z
    .string()
    .min(10, {
      message: 'Số điện thoại phải có ít nhất 10 số',
    })
    .max(20, {
      message: 'Số điện thoại không thể có nhiều hơn 20 số',
    })
    .optional(),
});

export const updateUserRoleSchema = z.object({
  vai_tro: z.enum(['khach_hang', 'admin'], {
    required_error: 'Vai trò không được để trống',
    invalid_type_error: 'Vai trò không hợp lệ',
  }),
});
