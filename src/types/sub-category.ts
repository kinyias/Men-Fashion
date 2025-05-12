import { z } from "zod";
import { loaiSanPhamFormSchema } from "@/lib/validations/subCategory.validator";

export type LoaiSanPhamFormValues = z.infer<typeof loaiSanPhamFormSchema>;

export interface LoaiSanPham {
  ma: number;
  ten: string;
  mota?: string;
  hinhanh?: string;
  noibat: boolean;
  madanhmuc: number;
  danhMuc?: {
    ma: number;
    ten: string;
  };
  _count?: {
    sanPhams: number;
  };
}

export interface LoaiSanPhamQueryParams {
  page: number;
  limit: number;
  search?: string;
  madanhmuc?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LoaiSanPhamResponse {
  data: LoaiSanPham[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}