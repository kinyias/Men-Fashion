export interface DanhMuc {
  ma: number;
  ten: string;
  mota: string;
  _count?: {
    sanPhams: number;
    loaiSanPhams: number;
  };
}

export interface DanhMucResponse {
  data: DanhMuc[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface DanhMucFormValues {
  ten: string;
  mota?: string;
}
export interface DanhMucQueryParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}