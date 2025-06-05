export interface DanhGia {
  ma: number;
  sosao: number;
  binhluan: string;
  hinhAnh?: string;
  ngaydang: string;
  manguoidung: number;
  masp: number;
  nguoiDung: {
    ma: number;
    ho: string;
    ten: string;
    email: string;
  };
  sanPham: {
    ma: number;
    ten: string;
  };
}

export interface DanhGiaResponse {
  data: DanhGia[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface DanhGiaFormValues {
  sosao: number;
  binhluan: string;
  hinhAnh?: string;
}

export interface DanhGiaQueryParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  masp?: number;
}

export interface DanhGiaAdminQueryParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  rating?: number;
}
