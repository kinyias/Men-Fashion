import { getOrders } from '@/lib/api/api-orders';
import { TrangThaiDonHang } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';

const statusMap: Record<
  TrangThaiDonHang,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
  }
> = {
  [TrangThaiDonHang.DA_GIAO_HANG]: {
    label: 'Đã giao hàng',
    variant: 'default',
  },
  [TrangThaiDonHang.DANG_GIAO_HANG]: {
    label: 'Đang giao hàng',
    variant: 'secondary',
  },
  [TrangThaiDonHang.DANG_XU_LY]: { label: 'Đang xử lý', variant: 'outline' },
  [TrangThaiDonHang.DA_DAT]: { label: 'Đã đặt', variant: 'outline' },
  [TrangThaiDonHang.DA_HUY]: { label: 'Đã hủy', variant: 'destructive' },
};

export function RecentOrders() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['recentOrders'],
    queryFn: () =>
      getOrders({
        page: 1,
        limit: 5,
        sortBy: 'ngaydat',
        sortOrder: 'desc',
      }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div>
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded mt-2" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ordersData?.data.map((order) => (
        <div
          key={order.ma}
          className="flex items-center justify-between space-x-4"
        >
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium leading-none">{order.ten}</p>
              <p className="text-sm text-muted-foreground">
                {order.chiTietDonHangs[0].bienThe.sanPham.ten}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={statusMap[order.trangthai].variant}
              className="text-xs"
            >
              {statusMap[order.trangthai].label}
            </Badge>
            <p className="text-sm font-medium">
              {formatCurrency(order.tonggia)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
