import { z } from 'zod';

export const reviewFormSchema = z.object({
  sosao: z
    .number()
    .min(1, {
      message: 'Số sao phải từ 1 đến 5',
    })
    .max(5, {
      message: 'Số sao phải từ 1 đến 5',
    }),
  binhluan: z
    .string()
    .min(2, {
      message: 'Bình luận ít nhất phải có 2 kí tự',
    })
    .max(1000, {
      message: 'Bình luận không thể có nhiều hơn 1000 kí tự',
    }),
  hinhAnh: z.string().optional(),
});
