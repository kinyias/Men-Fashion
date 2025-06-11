'use client';

import { getMonthlyRevenue } from '@/lib/api/api-report';
import { formatCurrency } from '@/utils/currency';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const monthNames = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export function SalesChart() {
  const currentYear = new Date().getFullYear();

  const { data: monthlyRevenue, isLoading } = useQuery({
    queryKey: ['monthlyRevenue', currentYear],
    queryFn: () => getMonthlyRevenue(currentYear),
  });

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  // Transform the data for the chart
  const chartData =
    monthlyRevenue?.data.map((total, index) => ({
      name: monthNames[index],
      total,
    })) || [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickMargin={8}
          tickFormatter={(value) => `${formatCurrency(Number(value))}`}
        />
        <Tooltip
          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          formatter={(value) => [
            `${formatCurrency(Number(value))}`,
            'Doanh thu',
          ]}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
