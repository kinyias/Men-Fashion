'use client';

import { useState } from 'react';
import {
  getMonthlyRevenue,
  getDetailedRevenueReport,
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
import { Brain, CalendarIcon, Copy, Download } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { RevenueGroupBy } from '@/types/report';
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from '../ui/dialog';
import toast from 'react-hot-toast';
import { generateReportWithGemini } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';
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
    from: Date | undefined;
    to: Date | undefined;
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
  const fromDateString = dateRange.from?.toISOString().split('T')[0] || null;
  const toDateString = dateRange.to?.toISOString().split('T')[0] || null;
  const [aiReport, setAiReport] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  // Query for custom date range
  const rangeQuery = useQuery({
    queryKey: ['revenueReport', fromDateString, toDateString, groupBy],
    queryFn: () =>
      getDetailedRevenueReport(
        dateRange.from!.toISOString() || new Date().toISOString(),
        dateRange.to!.toISOString() || new Date().toISOString(),
        groupBy
      ),
    enabled:
      viewType === 'range' && dateRange.from != null && dateRange.to != null,
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
  const generateAIReport = async () => {
    if (chartData.length === 0) {
      toast.error('Không có dữ liệu để tạo báo cáo.');
      return;
    }

    setIsGeneratingReport(true);
    try {
    const response = await generateReportWithGemini(
      chartData,
      viewType,
      selectedYear,
      dateRange,
      groupBy
    )
      setAiReport(response);
      setShowReportDialog(true);

      toast.success('Báo cáo chi tiết đã được tạo thành công bằng AI.');
    } catch (error) {
      console.error('Error generating AI report:', error);
      toast.error('Không thể tạo báo cáo. Vui lòng thử lại.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const copyReportToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(aiReport);
      toast.success('Báo cáo đã được sao chép vào clipboard.');
    } catch (error) {
      console.error('Error generating AI report:', error);
      toast.error('Không thể sao chép báo cáo');
    }
  };

  const downloadReport = () => {
    const blob = new Blob([aiReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bao-cao-doanh-thu-${
      new Date().toISOString().split('T')[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Doanh thu</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={generateAIReport}
                disabled={isGeneratingReport || chartData.length === 0}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Brain className="h-4 w-4" />
                {isGeneratingReport ? 'Đang tạo...' : 'Tạo báo cáo AI'}
              </Button>
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
                          setDateRange({
                            from: range?.from,
                            to: range?.to,
                          });
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
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="min-w-[60vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Báo cáo chi tiết doanh thu
            </DialogTitle>
            <DialogDescription>
              Phân tích chi tiết được tạo bởi AI dựa trên dữ liệu doanh thu hiện
              tại
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={copyReportToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Copy className="h-4 w-4" />
                Sao chép
              </Button>
              <Button
                onClick={downloadReport}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Tải xuống
              </Button>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                <ReactMarkdown>
                {aiReport}
                  </ReactMarkdown> 
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
