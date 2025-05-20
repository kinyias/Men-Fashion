'use client'
import CouponsForm from '@/components/coupons/CouponsForm'
import { getCouponById } from '@/lib/api/api-coupons'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

export default function CouponsEditPage() {
  const params = useParams()
  const couponId = params.id !== 'new' ? Number(params.id) : undefined
  const isEditMode = !!couponId && couponId > 0

  // Fetch coupon data if in edit mode
  const { data: coupon, isLoading: isLoadingCoupon } = useQuery({
    queryKey: ['coupon', couponId],
    queryFn: () => getCouponById(couponId!),
    enabled: isEditMode,
  })

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? 'Cập Nhật Mã Khuyến Mãi' : 'Tạo Mã Khuyến Mãi Mới'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Cập nhật thông tin cho mã khuyến mãi hiện có' 
              : 'Điền thông tin để tạo mã khuyến mãi mới cho hệ thống'}
          </p>
        </div>
      </div>
      <div className="mt-8">
        {isEditMode && isLoadingCoupon ? (
          <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg font-medium">Đang tải dữ liệu khuyến mãi...</span>
          </div>
        ) : (
          <CouponsForm coupon={coupon} />
        )}
      </div>
    </div>
  )
}
