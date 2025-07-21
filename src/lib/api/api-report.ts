import api from '@/lib/axios-client';
import {
  DashboardStats,
  MonthlyRevenue,
  CustomerStats,
  FeaturedProduct,
  RevenueReport,
} from '@/types/report';

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/api/report/dashboard-stats');
  return response.data;
};

// Get monthly revenue for a specific year
export const getMonthlyRevenue = async (
  year?: number
): Promise<MonthlyRevenue> => {
  const params = new URLSearchParams();
  if (year) {
    params.append('year', year.toString());
  }
  const response = await api.get(
    `/api/report/monthly-revenue?${params.toString()}`
  );
  return { data: response.data };
};

// Get customer statistics
export const getCustomerStats = async (
  customerId: number
): Promise<CustomerStats> => {
  const response = await api.get(`/api/report/customer-stats/${customerId}`);
  return response.data;
};

// Get featured products
export const getFeaturedProducts = async (
  limit?: number
): Promise<FeaturedProduct[]> => {
  const params = new URLSearchParams();
  if (limit) {
    params.append('limit', limit.toString());
  }
  const response = await api.get(
    `/api/report/featured-products?${params.toString()}`
  );
  return response.data;
};

// Get revenue by year
export const getRevenueByYear = async (year?: number): Promise<number> => {
  const params = new URLSearchParams();
  if (year) {
    params.append('year', year.toString());
  }
  const response = await api.get(
    `/api/report/revenue/year?${params.toString()}`
  );
  return response.data.revenue;
};

// Get revenue by month
export const getRevenueByMonth = async (
  year?: number,
  month?: number
): Promise<number> => {
  const params = new URLSearchParams();
  if (year) params.append('year', year.toString());
  if (month) params.append('month', month.toString());
  const response = await api.get(
    `/api/report/revenue/month?${params.toString()}`
  );
  return response.data.revenue;
};

// Get revenue by week
export const getRevenueByWeek = async (startDate: string): Promise<number> => {
  const params = new URLSearchParams();
  params.append('startDate', startDate);
  const response = await api.get(
    `/api/report/revenue/week?${params.toString()}`
  );
  return response.data.revenue;
};

// Get detailed revenue report
export const getDetailedRevenueReport = async (
  startDate: string,
  endDate: string,
  groupBy?: 'day' | 'week' | 'month'
): Promise<RevenueReport[]> => {
  const params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  if (groupBy) params.append('groupBy', groupBy);
  const response = await api.get(
    `/api/report/revenue/report?${params.toString()}`
  );
  return response.data;
};
