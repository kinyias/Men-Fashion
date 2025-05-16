"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { OrderSummary } from "@/components/checkout/OrderSummary"
import type { CheckoutFormValues } from "@/lib/validations/checkout.validator"
import { useCartStore } from "@/lib/store/cart-store"

export default function CheckoutPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const {items: cartItems} = useCartStore()
  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.gia * item.soLuong, 0)
  const shipping = 12.99
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax

  const handleSubmitOrder = (data: CheckoutFormValues) => {
    // Process the order
    setIsProcessing(true)
    const orderData = {
      ...data.shipping,
      chiTietDonHangs: cartItems.map((item) => ({
        masp: Number(item.ma),
        soluong: item.soLuong,
        dongia: item.bienThe.gia,
        mabienthe: Number(item.ma)
      })),
     thanhToan:
      {
        phuongthuc: data.payment.phuongthuc,
      }
    }
    // Log the form data (in a real app, you would send this to your API)
    console.log("Order submitted:", orderData)

    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false)
      // Navigate to order confirmation
      router.push("/checkout/confirmation")
    }, 2000)
  }

  return (
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutForm onSubmit={handleSubmitOrder} isProcessing={isProcessing} />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary cartItems={cartItems} subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
              </div>
            </div>
          </div>
        </div>
  )
}
