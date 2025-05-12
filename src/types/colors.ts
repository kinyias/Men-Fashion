export interface MauSac {
  ma: number;
  ten: string;
  ma_mau: string;
  _count?: {
    bienThes: number;
    hinhAnhMauSacs: number;
  };
}

export interface MauSacResponse {
  data: MauSac[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface MauSacFormValues {
  ten: string;
  ma_mau: string;
}

export interface MauSacQueryParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}