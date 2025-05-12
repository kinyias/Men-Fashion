export interface KichCo {
  ma: number;
  ten: string;
  _count?: {
    bienThes: number;
  };
}

export interface KichCoResponse {
  data: KichCo[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface KichCoFormValues {
  ten: string;
}

export interface KichCoQueryParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}