export interface DashboardStats {
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
}

export interface MonthlyRevenue {
  // Array of 12 numbers representing revenue for each month
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
