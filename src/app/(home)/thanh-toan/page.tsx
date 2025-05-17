"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { OrderSummary } from "@/components/checkout/OrderSummary"
import type { CheckoutFormValues } from "@/lib/validations/checkout.validator"
import { useCartStore } from "@/lib/store/cart-store"
import { createOrder } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { ApiError } from "@/types"
import toast from "react-hot-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [shippingMethod, setShippingMethod] = useState<"nhanh" | "tietkiem" | "hoatoc" >("tietkiem");
  const [shippingPrices, setShippingPrices] = useState<{[key: string]: {
    price: number,
    time: number,
  }}>({});
  const {items: cartItems, clearCart} = useCartStore()
  
  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.gia * item.soLuong, 0)
  const shipping = shippingMethod === "tietkiem" 
  ? shippingPrices["STK"]?.price 
  : shippingMethod === "nhanh"
  ? shippingPrices["SCN"]?.price
  : shippingPrices["SHT"]?.price;
  const total = subtotal + (shipping || 0) - (appliedCoupon?.discount || 0)

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      clearCart()
      router.push('/thanh-toan/xac-nhan')
      setIsProcessing(true)
    },
    onError: (error: ApiError) => {
      toast.error('Đặt hàng thất bại. Vui lòng thử lại!')
      console.log(error)
      setIsProcessing(false)
    },
    retry:false
  })

  const handleSubmitOrder = (data: CheckoutFormValues) => {
    setIsProcessing(true)
    const orderData = {
      ...data.shipping,
      tonggia: total,
      tamtinh: subtotal,
      phigiaohang: shipping || 0,
      chiTietDonHangs: cartItems.map((item) => ({
        masp:item.ma,
        soluong: item.soLuong,
        dongia: item.gia,
        mabienthe: item.bienThe.ma
      })),
      thanhToan: {
        phuongthuc: data.payment.phuongthuc,
      }
    }
    createOrderMutation.mutate(orderData)
  }

  return (
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Tiếp tục mua sắm
            </Link>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-8">Thanh toán</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutForm onSubmit={handleSubmitOrder} isProcessing={isProcessing} onSetShippingMethod={setShippingMethod} shippingPrices={shippingPrices} onSetShippingPrices={setShippingPrices}  />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary cartItems={cartItems} appliedCoupon={appliedCoupon} onSetAppliedCoupon={setAppliedCoupon} subtotal={subtotal} shipping={shipping || 0} total={total} />
              </div>
            </div>
          </div>
        </div>
  )
}
