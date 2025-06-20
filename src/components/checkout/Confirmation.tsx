'use client'
import React from 'react'
import Link from "next/link"
import { CheckCircle2, Package, ArrowRight, Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from '@/utils/currency'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getOrderById } from '@/lib/api'

export default function Confirmation() {
    const params = useParams();
    const orderId = params.id as string;
    const { data: order, isLoading, isError } = useQuery({
        queryKey: ['order-confirmation', orderId],
        queryFn: () => getOrderById(orderId),
        retry: false,
    })

    const orderDate = new Date().toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="bg-white rounded-lg border shadow-sm p-6 md:p-8 text-center max-w-md w-full">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                            <XCircle className="h-8 w-8 text-destructive" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Không tìm thấy đơn hàng</h1>
                    <p className="text-muted-foreground mb-6">
                        Rất tiếc, chúng tôi không thể tìm thấy thông tin đơn hàng của bạn. Vui lòng thử lại sau.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                            <Link href="/">Quay về trang chủ</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (!order) return null;

    return (
    <div className="bg-white rounded-lg border shadow-sm p-6 md:p-8 text-center">
    <div className="flex justify-center mb-6">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </div>
    </div>

    <h1 className="text-2xl md:text-3xl font-bold mb-2">Đơn hàng đã được xác nhận!</h1>
    <p className="text-muted-foreground mb-6">
      Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận và đang được xử lý.
    </p>

    <div className="bg-muted/30 rounded-lg p-6 text-left mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Mã đơn hàng</h3>
          <p className="font-medium">{order.ma}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Ngày đặt</h3>
          <p>{orderDate}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
          <p>{order.email || 'Khong co'}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Tổng cộng</h3>
          <p className="font-medium">{formatCurrency(order.tonggia)}</p>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-center gap-2 mb-6 bg-primary/5 p-4 rounded-lg border border-primary/20">
      <Package className="h-5 w-5 text-primary" />
      <p>Chúng tôi sẽ gửi email nếu co email xác nhận khi đơn hàng của bạn được giao.</p>
    </div>

    <Separator className="my-6" />

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button asChild>
        <Link href="/">Tiếp tục mua sắm</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={"/tai-khoan/don-hang/" + orderId}>
          Xem đơn hàng <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </div>
  )
}
