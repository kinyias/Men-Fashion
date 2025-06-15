'use client';
import { Card } from '@/components/ui/card';
import { Star, Gift } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { formatDate } from '@/utils/formatTime';
import { formatCurrency } from '@/utils/currency';
import { getCustomerStats } from '@/lib/api/api-report';
import { useQuery } from '@tanstack/react-query';

export function AccountHeader() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['customerStats', user?.ma],
    queryFn: () => getCustomerStats(user?.ma || 0),
    enabled: !!user?.ma,
  });

  if (!user) return null;
  console.log(stats)
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">{user.ten}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Gia nhập từ{' '}
                  {formatDate(user.ngay_tao || new Date().toISOString())}
                </p>
              </div>
            </div>

            {/* Stats and Loyalty Info */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:ml-auto">
              {/* Total Orders */}
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Gift className="h-4 w-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-800">
                    {isLoading ? '...' : stats?.totalOrders || 0}
                  </span>
                </div>
                <p className="text-sm font-medium">Tổng đơn hàng</p>
                <p className="text-xs text-muted-foreground">
                  Tất cả thời gian
                </p>
              </div>

              {/* Total Spent */}
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold text-green-800">
                    {isLoading
                      ? '...'
                      : formatCurrency(stats?.totalSpending || 0)}
                  </span>
                </div>
                <p className="text-sm font-medium">Tổng tiền</p>
                <p className="text-xs text-muted-foreground">
                  Tất cả thời gian
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
