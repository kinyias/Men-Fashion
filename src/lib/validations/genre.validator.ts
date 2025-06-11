import { z } from 'zod';

export const genreFormSchema = z.object({
  tenloaitin: z
    .string()
    .min(2, {
      message: 'Tên loại tin ít nhất phải có 2 kí tự',
    })
    .max(100, {
      message: 'Tên loại tin không thể có nhiều hơn 100 kí tự.',
    }),
  trangthai: z.boolean(),
});
