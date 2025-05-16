"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, X, Tag, Percent, Truck, Search } from "lucide-react"
import { formatCurrency } from "@/utils/currency"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  color: string
  size: string
  image: string
}

interface Coupon {
  code: string
  name: string
  type: "percentage" | "fixed" | "shipping"
  value: number
  icon: React.ElementType
}

interface OrderSummaryProps {
  cartItems: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

// Danh sách mã giảm giá mẫu
const availableCoupons: Coupon[] = [
  {
    code: "WELCOME10",
    name: "Ưu đãi chào mừng",
    type: "percentage",
    value: 10,
    icon: Percent,
  },
  {
    code: "SAVE20",
    name: "Giảm giá mùa xuân",
    type: "percentage",
    value: 20,
    icon: Percent,
  },
  {
    code: "FREESHIP",
    name: "Miễn phí vận chuyển",
    type: "shipping",
    value: 100,
    icon: Truck,
  },
  {
    code: "SUMMER15",
    name: "Ưu đãi mùa hè",
    type: "percentage",
    value: 15,
    icon: Percent,
  },
  {
    code: "FLAT25",
    name: "Giảm giá cố định",
    type: "fixed",
    value: 25,
    icon: Tag,
  },
]

export function OrderSummary({ cartItems, subtotal, shipping, total: initialTotal }: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([])
  const suggestionRef = useRef<HTMLDivElement>(null)

  const discount = appliedCoupon ? appliedCoupon.discount : 0
  const total = initialTotal - discount

  useEffect(() => {
    if (couponCode.trim() === "") {
      setFilteredCoupons(availableCoupons)
    } else {
      const filtered = availableCoupons.filter(
        (coupon) =>
          coupon.code.toLowerCase().includes(couponCode.toLowerCase()) ||
          coupon.name.toLowerCase().includes(couponCode.toLowerCase()),
      )
      setFilteredCoupons(filtered)
    }
  }, [couponCode])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleApplyCoupon = (code = couponCode) => {
    if (!code.trim()) {
      setError("Vui lòng nhập mã giảm giá")
      return
    }

    setIsApplying(true)
    setError(null)
    setShowSuggestions(false)

    setTimeout(() => {
      const foundCoupon = availableCoupons.find((coupon) => coupon.code.toUpperCase() === code.toUpperCase())

      if (foundCoupon) {
        let discountAmount = 0

        if (foundCoupon.type === "percentage") {
          discountAmount = subtotal * (foundCoupon.value / 100)
        } else if (foundCoupon.type === "fixed") {
          discountAmount = Math.min(foundCoupon.value, subtotal)
        } else if (foundCoupon.type === "shipping") {
          discountAmount = shipping
        }

        setAppliedCoupon({ code: foundCoupon.code, discount: discountAmount })
      } else {
        setError("Mã giảm giá không hợp lệ hoặc đã hết hạn")
      }

      setIsApplying(false)
    }, 800)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setError(null)
  }

  const selectCoupon = (coupon: Coupon) => {
    setCouponCode(coupon.code)
    handleApplyCoupon(coupon.code)
  }

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.type === "percentage") {
      return `${coupon.value}% giảm`
    } else if (coupon.type === "fixed") {
      return `Giảm $${coupon.value.toFixed(2)}`
    } else if (coupon.type === "shipping") {
      return "Miễn phí vận chuyển"
    }
    return ""
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="h-20 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={64}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.color}, Kích cỡ: {item.size}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs">SL: {item.quantity}</p>
                  <p className="font-medium">{formatCurrency(item.price)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Mã giảm giá */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Mã giảm giá</h3>

          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-primary/5 p-2 rounded-md border border-primary/20">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                <div>
                  <p className="text-sm font-medium">{appliedCoupon.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {appliedCoupon.discount === shipping
                      ? "Áp dụng miễn phí vận chuyển"
                      : `Đã giảm $${appliedCoupon.discount.toFixed(2)}`}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={removeCoupon} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Xoá mã</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-2 relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="h-9 pl-8"
                  />
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <Button onClick={() => handleApplyCoupon()} disabled={isApplying} className="h-9 whitespace-nowrap">
                  {isApplying ? "Đang áp dụng..." : "Áp dụng"}
                </Button>
              </div>

              {/* Gợi ý mã */}
              {showSuggestions && (
                <div
                  ref={suggestionRef}
                  className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md max-h-60 overflow-auto"
                >
                  {filteredCoupons.length > 0 ? (
                    filteredCoupons.map((coupon) => (
                      <div
                        key={coupon.code}
                        className="flex items-center p-2 hover:bg-muted cursor-pointer"
                        onClick={() => selectCoupon(coupon)}
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <coupon.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{coupon.code}</p>
                          <p className="text-xs text-muted-foreground">{coupon.name}</p>
                        </div>
                        <div className="text-sm font-medium text-primary">{formatDiscount(coupon)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">Không tìm thấy mã phù hợp</div>
                  )}
                </div>
              )}

              {error && <p className="text-xs text-destructive">{error}</p>}
              <p className="text-xs text-muted-foreground">Nhấn để xem danh sách mã giảm giá</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tạm tính</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phí vận chuyển</span>
            <span>{formatCurrency(shipping)}</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-sm text-primary">
              <span>Giảm giá</span>
              <span>-{formatCurrency(appliedCoupon.discount)}</span>
            </div>
          )}

          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Tổng cộng</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 p-6 rounded-b-lg border-t">
        <div className="text-xs text-muted-foreground space-y-2">
          <p>Dự kiến giao hàng: 3–5 ngày làm việc</p>
          <p>Đổi trả miễn phí trong 30 ngày</p>
          <p>Thanh toán an toàn với mã hoá 256-bit</p>
        </div>
      </div>
    </div>
  )
}
