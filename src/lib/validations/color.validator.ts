import { z } from "zod";

export const colorFormSchema = z.object({
  ten: z
    .string()
    .min(2, {
      message: "Tên màu sắc ít nhất phải có 2 kí tự",
    })
    .max(50, {
      message: "Tên màu sắc không thể có nhiều hơn 50 kí tự.",
    }),
  ma_mau: z
    .string()
    .min(3, {
      message: "Mã màu ít nhất phải có 3 kí tự",
    })
    .max(20, {
      message: "Mã màu không thể có nhiều hơn 20 kí tự.",
    })
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "Mã màu phải có định dạng HEX hợp lệ (ví dụ: #FF5733)",
    }),
})