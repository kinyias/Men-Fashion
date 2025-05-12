import { z } from "zod";

export const sizeFormSchema = z.object({
  ten: z
    .string()
    .min(1, {
      message: "Kích cỡ ít nhất phải có 1 kí tự",
    })
    .max(50, {
      message: "Kích cỡ không thể có nhiều hơn 50 kí tự.",
    }),
})