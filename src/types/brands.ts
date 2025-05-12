export interface ThuongHieu {
  ma: number;
  ten: string;
  mota: string;
  _count?: {
    sanPhams: number;
  };
}

export interface ThuongHieuResponse {
  data: ThuongHieu[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ThuongHieuFormValues {
  ten: string;
  mota?: string;
}

export interface ThuongHieuQueryParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}