'use client';

import { useState } from 'react';
import {
  getMonthlyRevenue,
  getDetailedRevenueReport,
  getRevenueByYear,
} from '@/lib/api/api-report';
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
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { RevenueGroupBy } from '@/types/report';

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
  const [viewType, setViewType] = useState<'year' | 'range'>('year');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(currentYear, 0, 1),
    to: new Date(currentYear, 11, 31),
  });
  const [groupBy, setGroupBy] = useState<RevenueGroupBy>('month');

  // Query for yearly view (monthly data)
  const yearlyQuery = useQuery({
    queryKey: ['monthlyRevenue', selectedYear],
    queryFn: () => getMonthlyRevenue(selectedYear),
    enabled: viewType === 'year',
  });

  // Query for custom date range
  const rangeQuery = useQuery({
    queryKey: [
      'revenueReport',
      dateRange.from.toISOString(),
      dateRange.to.toISOString(),
      groupBy,
    ],
    queryFn: () =>
      getDetailedRevenueReport(
        dateRange.from.toISOString(),
        dateRange.to.toISOString(),
        groupBy
      ),
    enabled: viewType === 'range',
  });

  // Transform data for the chart
  const chartData =
    viewType === 'year'
      ? yearlyQuery.data?.data.map((total, index) => ({
          name: monthNames[index],
          revenue: total,
        })) || []
      : rangeQuery.data
          ?.reduce((acc, item) => {
            const formattedDate = format(
              new Date(item.date),
              groupBy === 'month' ? 'MM/yyyy' : 'dd/MM/yyyy',
              { locale: vi }
            );

            const existingItem = acc.find((i) => i.name === formattedDate);
            if (existingItem) {
              existingItem.revenue += item.revenue;
            } else {
              acc.push({
                name: formattedDate,
                revenue: item.revenue,
              });
            }
            return acc;
          }, [] as { name: string; revenue: number }[])
          .sort((a, b) => {
            const [aMonth, aYear] = a.name.split('/').reverse();
            const [bMonth, bYear] = b.name.split('/').reverse();
            const dateA = new Date(Number(aYear), Number(aMonth) - 1);
            const dateB = new Date(Number(bYear), Number(bMonth) - 1);
            return dateA.getTime() - dateB.getTime();
          }) || [];
  const isLoading =
    viewType === 'year' ? yearlyQuery.isLoading : rangeQuery.isLoading;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Doanh thu</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {/* View Type Selection */}
            <Select
              value={viewType}
              onValueChange={(value: 'year' | 'range') => setViewType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn kiểu xem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Theo năm</SelectItem>
                <SelectItem value="range">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>

            {viewType === 'year' ? (
              // Year Selection
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Chọn năm" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => currentYear - i).map(
                    (year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            ) : (
              <>
                {/* Date Range Selection */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[280px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'dd/MM/yyyy')} -{' '}
                            {format(dateRange.to, 'dd/MM/yyyy')}
                          </>
                        ) : (
                          format(dateRange.from, 'dd/MM/yyyy')
                        )
                      ) : (
                        <span>Chọn khoảng thời gian</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={{
                        from: dateRange?.from,
                        to: dateRange?.to,
                      }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange({
                            from: range.from,
                            to: range.to,
                          });
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                {/* Group By Selection */}
                <Select
                  value={groupBy}
                  onValueChange={(value: RevenueGroupBy) => setGroupBy(value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Nhóm theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Tuần</SelectItem>
                    <SelectItem value="month">Tháng</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickMargin={8}
              interval={0}
              angle={viewType === 'range' ? -45 : 0}
              textAnchor={viewType === 'range' ? 'end' : 'middle'}
              height={60}
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
            <Legend />
            <Bar
              name="Doanh thu"
              dataKey="revenue"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
