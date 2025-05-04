import { z } from "zod";

export const brandFormSchema = z.object({
  ten: z
    .string()
    .min(2, {
      message: "Tên thương hiệu không ít hơn 2 kí tự.",
    })
    .max(255, {
      message: "Mô tả thương hiệu không nhiều hơn 255 kí tự.",
    }),
  mota: z.string().optional(),
})