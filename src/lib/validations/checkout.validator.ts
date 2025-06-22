import * as z from "zod"

// Shipping information schema to match DonHang model
export const shippingSchema = z.object({
  ten: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Vui lòng nhập email hợp lệ").optional(),
  sdt: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .regex(/^[0-9]{10,11}$/, "Vui lòng nhập số điện thoại hợp lệ"),
  diachi: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  thanhpho: z.string().min(1, "Vui lòng nhập tên thành phố"),
  quan: z.string().min(1, "Vui lòng nhập tên quận"),
  phuong: z.string().min(1, "Vui lòng nhập tên phường"),
  ghichu: z.string().optional(),
  phuongthucgiaohang: z.enum(["SCN", "SHT", "STK"], {
    required_error: "Vui lòng chọn phương thức giao hàng",
  }),
})

// Payment information schema to match ThanhToan model
export const paymentSchema = z
  .object({
    phuongthuc: z.enum(["cod", "momo", "vnpay"], {
      required_error: "Vui lòng chọn phương thức thanh toán",
    }),
  })

// Complete checkout schema
export const checkoutSchema = z.object({
  shipping: shippingSchema,
  payment: paymentSchema,
})

// Types
export type ShippingFormValues = z.infer<typeof shippingSchema>
export type PaymentFormValues = z.infer<typeof paymentSchema>
export type CheckoutFormValues = z.infer<typeof checkoutSchema>
