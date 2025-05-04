import { z } from "zod";

export const subCategoryFormSchema = z.object({
  ten: z
    .string()
    .min(2, {
      message: "Danh mục ít nhất phải có 2 kí tự",
    })
    .max(255, {
      message: "Mô tả danh mục không thể có nhiều hơn 255 kí tự.",
    }),
  mota: z.string().optional(),
  hinhanh: z.string().optional(),
  noibat: z.boolean(),
  madanhmuc: z.number({
  required_error: 'Vui lòng chọn danh mục.',
}),
})