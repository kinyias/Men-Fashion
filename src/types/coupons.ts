import { LoaiKhuyenMai } from "@/lib/validations/coupons.validator";

export interface KhuyenMai {
  ma: number;
  ten: string;
  loaikhuyenmai: LoaiKhuyenMai;
  giatrigiam: number;
  giatridonhang: number;
  ngaybatdat: string;
  ngayketthuc: string;
}

export interface KhuyenMaiResponse {
  data: KhuyenMai[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface KhuyenMaiFormValues {
  ten: string;
  loaikhuyenmai: LoaiKhuyenMai;
  giatrigiam: number;
  giatridonhang: number;
  ngaybatdat: string;
  ngayketthuc: string;
}

export interface KhuyenMaiQueryParams {
  page: number;
  limit: number;
  search?: string;
  loaikhuyenmai?: string;
  active?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}