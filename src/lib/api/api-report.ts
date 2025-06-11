import api from '@/lib/axios-client';
import {
  DashboardStats,
  MonthlyRevenue,
  CustomerStats,
  FeaturedProduct,
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
