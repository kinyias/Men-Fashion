'use client'
import { OrderDetails } from '@/components/orders/OrderDetail'
import { PrintOrder } from '@/components/orders/PrintOrder';
import { getOrderWithOrderItemsById } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Printer } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useRef } from 'react'
import { Button } from '@/components/ui/button';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const printRef = useRef<HTMLDivElement>(null)
  // Fetch order data with order items
  const { data: order, isLoading: isLoadingOrder, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderWithOrderItemsById(orderId),
    enabled: !!orderId,
  })

  // Handle print function
  const handlePrint = () => {
    window.print();
  };

  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">Lỗi tải dữ liệu</h1>
            <p className="text-muted-foreground">Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chi tiết đơn hàng</h1>
          <p className="text-muted-foreground">Xem và quản lý thông tin đơn hàng</p>
        </div>
        {order && (
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="print:hidden"
          >
            <Printer className="mr-2 h-4 w-4" />
            In Đơn Hàng
          </Button>
        )}
      </div>
      
      <div className="mt-8 print:hidden">
        {isLoadingOrder ? (
          <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg font-medium">Đang tải dữ liệu đơn hàng...</span>
          </div>
        ) : order ? (
          <OrderDetails order={order} />
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Không tìm thấy đơn hàng</h2>
              <p className="text-muted-foreground">Đơn hàng với ID {orderId} không tồn tại.</p>
            </div>
          </div>
        )}
      </div>

      {/* PrintOrder component - only visible when printing */}
      {order && <PrintOrder ref={printRef} order={order} />}
    </div>
  )
}