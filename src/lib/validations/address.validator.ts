import { z } from 'zod';

export const addressFormSchema = z.object({
  tennguoinhan: z.string().min(1, 'Tên người nhận không được để trống'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  sodienthoai: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  diachi: z.string().min(1, 'Địa chỉ không được để trống'),
  phuongxa: z.string().min(1, 'Phường/Xã không được để trống'),
  quanhuyen: z.string().min(1, 'Quận/Huyện không được để trống'),
  tinhthanh: z.string().min(1, 'Tỉnh/Thành không được để trống'),
  macdinh: z.boolean().optional(),
  loaidiachi: z.enum(['NHA', 'VAN_PHONG', 'KHAC'], {
    required_error: 'Loại địa chỉ không được để trống',
  }),
});
