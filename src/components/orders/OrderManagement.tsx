'use client';

import { useState } from 'react';
import { OrdersTable } from '@/components/orders/OrderTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Download,
  ShoppingCart,
  Package2,
  XCircle,
  Truck,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';
import { ExportDialog } from './ExportDialog';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/lib/api';
import { getOrdersByStatus } from '@/lib/api/api-report';
import { TrangThaiDonHang } from '@/types';
import { Card } from '@/components/ui/card';

const statusInfo: Record<
  string,
  { label: string; icon: LucideIcon; color: string }
> = {
  da_dat: {
    label: 'Đã Đặt',
    icon: ShoppingCart,
    color: 'text-blue-500',
  },
  dang_xu_ly: {
    label: 'Đang Xử Lý',
    icon: Package2,
    color: 'text-yellow-500',
  },
  da_huy: {
    label: 'Đã Hủy',
    icon: XCircle,
    color: 'text-red-500',
  },
  dang_giao_hang: {
    label: 'Đang Giao Hàng',
    icon: Truck,
    color: 'text-orange-500',
  },
  da_giao_hang: {
    label: 'Đã Giao Hàng',
    icon: CheckCircle2,
    color: 'text-green-500',
  },
};

export function OrdersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Fetch all orders for export
  const { data: ordersData } = useQuery({
    queryKey: ['orders-export'],
    queryFn: () =>
      getOrders({
        page: 1,
        limit: 1000, // Get a large number of orders for export
      }),
    enabled: exportDialogOpen, // Only fetch when dialog is open
    staleTime: 5 * 60 * 1000,
  });

  // Fetch orders by status
  const { data: ordersByStatus } = useQuery({
    queryKey: ['orders-by-status'],
    queryFn: getOrdersByStatus,
    staleTime: 5 * 60 * 1000,
  });

  const allOrders = ordersData?.data || [];

  return (
    <div className="space-x-4">
      <div className="p-4 md:p-6">
        {/* Orders by Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {ordersByStatus?.map((statusData) => {
            const status = statusInfo[statusData.status];
            const Icon = status?.icon;
            return (
              <Card
                key={statusData.status}
                className="p-4 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div
                      className={`p-2 rounded-full bg-gray-100 ${status.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      {status?.label}
                    </span>
                    <span className="text-2xl font-bold">
                      {statusData.count}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex gap-5">
            <h1 className="text-2xl font-bold tracking-tight">
              Quản Lý Đơn Hàng
            </h1>
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm đơn hàng..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Lọc trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả</SelectItem>
                <SelectItem value={TrangThaiDonHang.DA_DAT}>Đã Đặt</SelectItem>
                <SelectItem value={TrangThaiDonHang.DANG_XU_LY}>
                  Đang Xử Lý
                </SelectItem>
                <SelectItem value={TrangThaiDonHang.DANG_GIAO_HANG}>
                  Đang Giao Hàng
                </SelectItem>
                <SelectItem value={TrangThaiDonHang.DA_GIAO_HANG}>
                  Đã Giao
                </SelectItem>
                <SelectItem value={TrangThaiDonHang.DA_HUY}>Đã Hủy</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="gap-1"
              onClick={() => setExportDialogOpen(true)}
            >
              <Download className="h-4 w-4" />
              Xuất Dữ Liệu
            </Button>
          </div>
        </div>
        <div className="w-full">
          <OrdersTable searchQuery={searchQuery} statusFilter={statusFilter} />
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        orders={allOrders}
      />
    </div>
  );
}
