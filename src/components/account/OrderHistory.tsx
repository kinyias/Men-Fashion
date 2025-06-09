'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '@/lib/api/api-orders';
import { TrangThaiDonHang } from '@/types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

const statusConfig = {
  da_dat: {
    label: 'Đã đặt',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  dang_xu_ly: {
    label: 'Đang xử lý',
    color: 'bg-blue-100 text-blue-800',
    icon: RefreshCw,
  },
  dang_giao_hang: {
    label: 'Đang giao hàng',
    color: 'bg-blue-100 text-blue-800',
    icon: Truck,
  },
  da_giao_hang: {
    label: 'Đã giao hàng',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  da_huy: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

export function OrderHistory() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TrangThaiDonHang | 'all'>(
    'all'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Fetch orders using react-query
  const {
    data: ordersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['orders', currentPage, statusFilter],
    queryFn: () =>
      getMyOrders({
        page: currentPage,
        limit,
        trangthai: statusFilter === 'all' ? undefined : statusFilter,
      }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Có lỗi xảy ra khi tải đơn hàng. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  const filteredOrders = ordersData?.data.filter((order) => {
    const matchesSearch =
      order.ma.toString().includes(searchTerm.toLowerCase()) ||
      order.chiTietDonHangs.some((item) =>
        item.sanPham.ten.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lịch sử đơn hàng
          </CardTitle>
          <CardDescription>
            Theo dõi và quản lý đơn hàng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value: TrangThaiDonHang | 'all') =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đơn hàng</SelectItem>
                <SelectItem value="da_dat">Đã đặt</SelectItem>
                <SelectItem value="dang_xu_ly">Đang xử lý</SelectItem>
                <SelectItem value="dang_giao_hang">Đang giao hàng</SelectItem>
                <SelectItem value="da_giao_hang">Đã giao hàng</SelectItem>
                <SelectItem value="da_huy">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {ordersData?.pagination.totalItems || 0}
              </div>
              <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {ordersData?.data.filter((o) => o.trangthai === 'da_giao_hang')
                  .length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Đã giao</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {ordersData?.data.filter(
                  (o) => o.trangthai === 'dang_giao_hang'
                ).length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Đang giao</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(
                  ordersData?.data.reduce(
                    (sum, order) => sum + order.tonggia,
                    0
                  ) || 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Không tìm thấy đơn hàng
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn'
                  : 'Bạn chưa có đơn hàng nào'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders?.map((order) => {
            const StatusIcon = statusConfig[order.trangthai].icon;

            return (
              <Card
                key={order.ma}
                className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={() => router.push(`/tai-khoan/don-hang/${order.ma}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">#{order.ma}</h3>
                        <p className="text-sm text-muted-foreground">
                          Đặt ngày{' '}
                          {format(new Date(order.ngaydat), 'dd/MM/yyyy', {
                            locale: vi,
                          })}
                        </p>
                      </div>

                      <Badge className={statusConfig[order.trangthai].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[order.trangthai].label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(order.tonggia)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.chiTietDonHangs.length} sản phẩm
                        </p>
                      </div>

                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}

        {/* Pagination */}
        {ordersData && ordersData.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(ordersData.pagination.totalPages, prev + 1)
                )
              }
              disabled={currentPage === ordersData.pagination.totalPages}
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
