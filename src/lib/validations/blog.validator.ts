import { z } from 'zod';

export const blogFormSchema = z.object({
  tieude: z
    .string()
    .min(2, {
      message: 'Tiêu đề ít nhất phải có 2 kí tự',
    })
    .max(255, {
      message: 'Tiêu đề không thể có nhiều hơn 255 kí tự.',
    }),
  noidung: z.string().min(10, {
    message: 'Nội dung ít nhất phải có 10 kí tự',
  }),
  hinhdaidien: z.string({
    required_error: 'Vui lòng chọn hình đại diện',
  }),
  tinhot: z.boolean(),
  trangthai: z.boolean(),
  maloaitin: z.number({
    required_error: 'Vui lòng chọn loại tin.',
  }),
});
