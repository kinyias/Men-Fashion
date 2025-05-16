import * as z from "zod"

// Shipping information schema to match DonHang model
export const shippingSchema = z.object({
  ho: z.string().min(2, "Họ phải có ít nhất 2 ký tự"),
  ten: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Vui lòng nhập email hợp lệ").optional(),
  sdt: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .regex(/^[0-9]{10,11}$/, "Vui lòng nhập số điện thoại hợp lệ"),
  diachi: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  thanhpho: z.string().min(2, "Vui lòng nhập tên thành phố"),
  quan: z.string().min(2, "Vui lòng nhập tên quận"),
  phuong: z.string().min(2, "Vui lòng nhập tên phường"),
  ghichu: z.string().optional(),
  phuongthucgiaohang: z.enum(["standard", "express"], {
    required_error: "Vui lòng chọn phương thức giao hàng",
  }),
})

// Payment information schema to match ThanhToan model
export const paymentSchema = z
  .object({
    phuongthuc: z.enum(["credit", "momo", "vnpay"], {
      required_error: "Vui lòng chọn phương thức thanh toán",
    }),
    cardNumber: z.string().refine(
      (val) => {
        if (val === "") return true
        return /^[0-9]{16}$/.test(val)
      },
      { message: "Số thẻ phải có 16 chữ số" },
    ),
    cardName: z.string().refine(
      (val) => {
        if (val === "") return true
        return val.length >= 3
      },
      { message: "Tên chủ thẻ phải có ít nhất 3 ký tự" },
    ),
    expiryDate: z.string().refine(
      (val) => {
        if (val === "") return true
        return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(val)
      },
      { message: "Ngày hết hạn phải có định dạng MM/YY" },
    ),
    cvv: z.string().refine(
      (val) => {
        if (val === "") return true
        return /^[0-9]{3,4}$/.test(val)
      },
      { message: "CVV phải có 3 hoặc 4 chữ số" },
    ),
    saveCard: z.boolean(),
    sameAsShipping: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.phuongthuc === "credit") {
        return !!data.cardNumber && !!data.cardName && !!data.expiryDate && !!data.cvv
      }
      return true
    },
    {
      message: "Vui lòng điền đầy đủ thông tin thẻ",
      path: ["cardNumber"],
    },
  )

// Complete checkout schema
export const checkoutSchema = z.object({
  shipping: shippingSchema,
  payment: paymentSchema,
})

// Types
export type ShippingFormValues = z.infer<typeof shippingSchema>
export type PaymentFormValues = z.infer<typeof paymentSchema>
export type CheckoutFormValues = z.infer<typeof checkoutSchema>
