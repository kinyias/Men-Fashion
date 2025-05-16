"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { OrderSummary } from "@/components/checkout/OrderSummary"
import type { CheckoutFormValues } from "@/lib/validations/checkout.validator"
import { DonHangFormValues } from "@/types"

// Sample cart items - in a real app, this would come from your cart state/context
const cartItems = [
  {
    id: "1",
    name: "Classic Oxford Shirt",
    price: 89.99,
    quantity: 1,
    color: "Blue",
    size: "M",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Slim Fit Chinos",
    price: 69.99,
    quantity: 1,
    color: "Khaki",
    size: "32",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Leather Weekender Bag",
    price: 199.99,
    quantity: 1,
    color: "Brown",
    size: "One Size",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 12.99
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax

  const handleSubmitOrder = (data: CheckoutFormValues) => {
    // Process the order
    setIsProcessing(true)
    const orderData: DonHangFormValues = {
      ...data.shipping,
      chiTietDonHangs: cartItems.map((item) => ({
        masp: Number(item.id),
        soluong: item.quantity,
        dongia: item.price,
        mabienthe: Number(item.id)
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
