import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z.string().min(1, 'Họ không được để trống'),
  lastName: z.string().min(1, 'Tên không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(8, 'Số điện thoại không được để trống'),
  subject: z.string().min(2, 'Chủ đề không được để trống'),
  message: z.string().min(10, 'Nội dung không được để trống'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
