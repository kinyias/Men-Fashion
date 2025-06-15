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
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/currency';
import EllipsisPagination from '../ui/EllipsisPagination';
import { formatDate } from '@/utils/formatTime';
import Image from 'next/image';
import { OrderSummaryStats } from './OrderSummaryStats';

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const {
    data: ordersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['orders', page, limit, statusFilter],
    queryFn: () =>
      getMyOrders({
        page,
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h2>

      <OrderSummaryStats />

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
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden border">
                          <Image
                            src={
                              order.chiTietDonHangs[0]?.sanPham.hinhanh ||
                              '/placeholder.svg'
                            }
                            alt={order.chiTietDonHangs[0]?.sanPham.ten}
                            className="object-cover w-full h-full"
                            width={64}
                            height={64}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">#{order.ma}</h3>
                          <p className="text-sm text-muted-foreground">
                            Đặt ngày {formatDate(order.ngaydat)}
                          </p>
                          <div className="mt-1">
                            <p className="text-sm font-medium line-clamp-1">
                              {order.chiTietDonHangs[0]?.sanPham.ten}
                              {order.chiTietDonHangs.length > 1 &&
                                ` và ${
                                  order.chiTietDonHangs.length - 1
                                } sản phẩm khác`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.chiTietDonHangs[0]?.bienThe.mauSac.ten} -{' '}
                              {order.chiTietDonHangs[0]?.bienThe.kichCo.ten}
                            </p>
                          </div>
                        </div>

                        <Badge className={statusConfig[order.trangthai].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[order.trangthai].label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(order.tonggia)}
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
          {ordersData &&
            ordersData.pagination &&
            ordersData.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Số hàng mỗi trang</p>
                  <select
                    value={limit}
                    onChange={(e) => {
                      const newLimit = Number(e.target.value);
                      setLimit(newLimit);
                      setPage(1);
                    }}
                    className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
                  >
                    {[5, 10, 20, 30, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <EllipsisPagination
                    currentPage={page}
                    totalPages={ordersData.pagination.totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
