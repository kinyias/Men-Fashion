export interface DashboardStats {
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
}

export interface MonthlyRevenue {
  data: number[];
}

export interface CustomerStats {
  totalOrders: number;
  totalSpending: number;
  totalGoing: number;
}

export interface FeaturedProduct {
  ma: number;
  ten: string;
  giaban: number;
  giagiam: number | null;
  hinhanh: string;
  totalSales: number;
  danhMuc: {
    ma: number;
    ten: string;
  };
  thuongHieu: {
    ma: number;
    ten: string;
  };
}

export interface RevenueReport {
  date: string;
  revenue: number;
}

export type RevenueGroupBy = 'day' | 'week' | 'month';
