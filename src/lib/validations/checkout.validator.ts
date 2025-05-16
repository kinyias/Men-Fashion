import * as z from "zod"

// Shipping information schema
export const shippingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]*$/, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Please select a country"),
  shippingMethod: z.enum(["standard", "express"], {
    required_error: "Please select a shipping method",
  }),
})

// Payment information schema with conditional validation
export const paymentSchema = z
  .object({
    paymentMethod: z.enum(["credit", "momo", "vnpay"], {
      required_error: "Please select a payment method",
    }),
    cardNumber: z.string().refine(
      (val) => {
        // Only validate if payment method is credit
        if (val === "") return true
        return /^[0-9]{16}$/.test(val)
      },
      { message: "Card number must be 16 digits" },
    ),
    cardName: z.string().refine(
      (val) => {
        // Only validate if payment method is credit
        if (val === "") return true
        return val.length >= 3
      },
      { message: "Cardholder name must be at least 3 characters" },
    ),
    expiryDate: z.string().refine(
      (val) => {
        // Only validate if payment method is credit
        if (val === "") return true
        return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(val)
      },
      { message: "Expiry date must be in MM/YY format" },
    ),
    cvv: z.string().refine(
      (val) => {
        // Only validate if payment method is credit
        if (val === "") return true
        return /^[0-9]{3,4}$/.test(val)
      },
      { message: "CVV must be 3 or 4 digits" },
    ),
    saveCard: z.boolean(),
    sameAsShipping: z.boolean(),
  })
  .refine(
    (data) => {
      // If payment method is credit, all credit card fields must be filled
      if (data.paymentMethod === "credit") {
        return !!data.cardNumber && !!data.cardName && !!data.expiryDate && !!data.cvv
      }
      return true
    },
    {
      message: "Please fill in all credit card details",
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
