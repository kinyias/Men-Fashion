"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Loader2 } from "lucide-react"
import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { OrderSummary } from "@/components/checkout/OrderSummary"
import type { CheckoutFormValues } from "@/lib/validations/checkout.validator"
import { useCartStore } from "@/lib/store/cart-store"
import { createOrder, getAddresses } from "@/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ApiError, KhuyenMai } from "@/types"
import toast from "react-hot-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<KhuyenMai | null>(null)
  const [shippingMethod, setShippingMethod] = useState<"SCN" | "SHT" | "STK" >("STK");
  const [shippingPrices, setShippingPrices] = useState<{[key: string]: {
    price: number,
    time: number,
  }}>({});
  const {items: cartItems, clearCart} = useCartStore()
  const { data: userAddresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddresses({ macdinh: true, page: 1, limit: 1 }),
  });
  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.gia * item.soLuong, 0)
  const shipping = shippingMethod === "STK" 
  ? shippingPrices["STK"]?.price 
  : shippingMethod === "SCN"
  ? shippingPrices["SCN"]?.price
  : shippingPrices["SHT"]?.price;
  const getDiscount = (coupon: KhuyenMai) => {
    if (!coupon) return 0
    if (coupon.loaikhuyenmai === "phan_tram") {
      const discount = coupon.giatrigiam / 100 * subtotal;
      return Math.min(discount, coupon.giamtoida)
    } else if (coupon.loaikhuyenmai === "tien_mat") {
      return coupon.giatrigiam
    }
    return 0
  }
  const total = subtotal + (shipping || 0) - (getDiscount(appliedCoupon!))
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCart()
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      
      } else {
        router.push(`/thanh-toan/xac-nhan/${data.ma}`)
      }
      // router.push(`/thanh-toan/xac-nhan/${data.ma}`)
      setIsProcessing(true)
    },
    onError: (error: ApiError) => {
      toast.error(`Đặt hàng thất bại. Vui lòng thử lại! ${error.response?.data?.message}`)
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
      giamgia: getDiscount(appliedCoupon!),
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
  if(isLoading) {
    return <div className="flex h-[50vh] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg font-medium">Đang tải dữ liệu...</span>
    </div>
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
              <CheckoutForm userAddresses={userAddresses?.data[0] || undefined} onSubmit={handleSubmitOrder} total={total} isProcessing={isProcessing} onSetShippingMethod={setShippingMethod} shippingPrices={shippingPrices} onSetShippingPrices={setShippingPrices}  />
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
