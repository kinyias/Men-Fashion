'use client';

import { useQuery } from '@tanstack/react-query';
import { getCustomerStats } from '@/lib/api/api-report';
import { useAuth } from '@/context/auth-provider';
import { formatCurrency } from '@/utils/currency';

export function OrderSummaryStats() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['customerStats', user?.ma],
    queryFn: () => getCustomerStats(user?.ma || 0),
    enabled: !!user?.ma,
  });

  if (!user) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="text-center p-4 bg-primary/5 rounded-lg">
        <div className="text-2xl font-bold text-primary">
          {isLoading ? '...' : stats?.totalOrders || 0}
        </div>
        <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
      </div>

      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">
          {isLoading ? '...' : stats?.totalGoing || 0}
        </div>
        <p className="text-sm text-muted-foreground">Đang giao</p>
      </div>

      <div className="text-center p-4 bg-yellow-50 rounded-lg">
        <div className="text-2xl font-bold text-yellow-600">    
          {isLoading ? '...' : formatCurrency(stats?.totalSpending || 0)}
        </div>
        <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
      </div>
    </div>
  );
}
