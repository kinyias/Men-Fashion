"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, X, Tag, Percent, Search, Loader2, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/utils/currency"
import { CartItem } from "@/lib/store/cart-store"
import { KhuyenMai } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { getCoupons } from "@/lib/api"
import { useDebounce } from "@/hooks/use-debounce"

interface OrderSummaryProps {
  cartItems: CartItem[]
  subtotal: number
  shipping: number
  total: number
  appliedCoupon: KhuyenMai | null
  onSetAppliedCoupon: (coupon: KhuyenMai | null) => void
}


export function OrderSummary({ cartItems, subtotal, shipping, total, appliedCoupon, onSetAppliedCoupon }: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredCoupons, setFilteredCoupons] = useState<KhuyenMai[]>([])
  const suggestionRef = useRef<HTMLDivElement>(null)
  
  // Add debounced coupon code
  const debouncedCouponCode = useDebounce(couponCode, 300)

  // Fetch active coupons with debounced search
  const { data: couponsData, isLoading } = useQuery({
    queryKey: ["coupons", { active: "true", search: debouncedCouponCode }],
    queryFn: () => getCoupons({
      page: 1,
      limit: 10,
      search: debouncedCouponCode,
      active: "true"
    }),
    // staleTime: Infinity,
  })
  
  // Update filtered coupons when coupons data is loaded
  useEffect(() => {
    if (couponsData?.data) {
      setFilteredCoupons(couponsData.data);
    }
  }, [couponsData]);

  // Update filtered coupons when search input changes or when coupons data is loaded
  useEffect(() => {
    if (couponsData?.data) {
      const filtered = couponsData.data.filter(coupon => 
        coupon.ten.toLowerCase().includes(couponCode.toLowerCase()) || 
        coupon.ma.toString().includes(couponCode)
      );
      setFilteredCoupons(filtered);
    }
  }, [couponCode, couponsData]);

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

    // Find coupon in our fetched data
    const foundCoupon = couponsData?.data.find(
      (coupon) => coupon.ma.toString() === code.toString() || coupon.ten.toLowerCase() === code.toLowerCase()
    )

    if (foundCoupon) {
      // Check if order meets minimum value requirement
      if (subtotal < foundCoupon.giatridonhang) {
        setError(`Đơn hàng cần tối thiểu ${formatCurrency(foundCoupon.giatridonhang)} để áp dụng mã này`)
        setIsApplying(false)
        return
      }

      // Apply the coupon
      onSetAppliedCoupon(foundCoupon)
    } else {
      setError("Mã giảm giá không hợp lệ hoặc đã hết hạn")
    }

    setIsApplying(false)
  }

  const removeCoupon = () => {
    onSetAppliedCoupon(null)
    setCouponCode("")
    setError(null)
  }

  const selectCoupon = (coupon: KhuyenMai) => {
    // Kiểm tra giá trị đơn hàng tối thiểu trước khi chọn
    if (subtotal < coupon.giatridonhang) {
      setError(`Đơn hàng cần tối thiểu ${formatCurrency(coupon.giatridonhang)} để áp dụng mã này`)
      return
    }
    
    setCouponCode(coupon.ten)
    handleApplyCoupon(coupon.ten)
  }

  const formatDiscount = (coupon: KhuyenMai) => {
    if (coupon.loaikhuyenmai === "phan_tram") {
      return `${coupon.giatrigiam}% giảm`
    } else if (coupon.loaikhuyenmai === "tien_mat") {
      return `Giảm ${formatCurrency(coupon.giatrigiam)}`
    }
    return ""
  }

  const getDiscount = (coupon: KhuyenMai) => {
    if (coupon.loaikhuyenmai === "phan_tram") {
      const discount = coupon.giatrigiam / 100 * subtotal;
      return Math.min(discount, coupon.giamtoida)
    } else if (coupon.loaikhuyenmai === "tien_mat") {
      return coupon.giatrigiam
    }
    return 0
  }

  // Kiểm tra xem coupon có đạt điều kiện giá trị tối thiểu không
  const isCouponEligible = (coupon: KhuyenMai) => {
    return subtotal >= coupon.giatridonhang
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={`${item.ma}-${item.bienThe.mamausac}-${item.bienThe.makichco}`} className="flex gap-4">
              <div className="h-20 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item.hinhAnh || "/placeholder.svg"}
                  alt={item.ten}
                  width={64}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-1">{item.ten}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.bienThe.mauSac.ten}, Kích cỡ: {item.bienThe.kichCo.ten}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs">SL: {item.soLuong}</p>
                  <p className="font-medium">{formatCurrency(item.gia)}</p>
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
                  <p className="text-sm font-medium">{appliedCoupon.ten}</p>
                  <p className="text-xs text-muted-foreground">
                    {`Đã giảm ${formatCurrency(getDiscount(appliedCoupon))}`}
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
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Đang tải mã giảm giá...</p>
                    </div>
                  ) : filteredCoupons.length > 0 ? (
                    filteredCoupons.map((coupon) => {
                      const eligible = isCouponEligible(coupon);
                      return (
                        <div
                          key={coupon.ma}
                          className={`flex items-center p-2 ${eligible ? 'hover:bg-muted cursor-pointer' : 'opacity-60 bg-muted/20'}`}
                          onClick={() => eligible && selectCoupon(coupon)}
                        >
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            {
                              !eligible ? (
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                              ) : coupon.loaikhuyenmai === "phan_tram" ? (
                                <Percent className="h-4 w-4 text-primary" />
                              ) : (
                                <Tag className="h-4 w-4 text-primary" />
                              )
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm ${!eligible ? 'text-muted-foreground' : ''}`}>{coupon.ten}</p>
                            <p className="text-xs text-muted-foreground">
                              {coupon.giatridonhang > 0 && `Đơn tối thiểu: ${formatCurrency(coupon.giatridonhang)}`}
                              {!eligible && coupon.giatridonhang > 0 && ` (Chưa đạt)`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {coupon.giamtoida > 0 && `Giảm tối đa: ${formatCurrency(coupon.giamtoida)}`}
                              
                            </p>
                          </div>
                          <div className={`text-sm font-medium ${eligible ? 'text-primary' : 'text-muted-foreground'}`}>
                            {formatDiscount(coupon)}
                          </div>
                        </div>
                      );
                    })
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
              <span>-{formatCurrency(getDiscount(appliedCoupon))}</span>
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
          <p>Thanh toán an toàn với mã hoá 256-bit</p>
        </div>
      </div>
    </div>
  )
}
