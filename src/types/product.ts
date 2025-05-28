import { z } from "zod";
import { productFormSchema } from "@/lib/validations/product.validator";
import { MauSac } from "./colors";
import { KichCo } from "./sizes";

export type ProductFormValues = z.infer<typeof productFormSchema>;

export interface SanPham {
  ma: number;
  ten: string;
  mota?: string;
  giaban: number;
  giagiam?: number;
  hinhanh?: string;
  noibat: boolean;
  trangthai: boolean;
  madanhmuc: number;
  maloaisanpham: number;
  mathuonghieu: number;
  danhMuc?: {
    ma: number;
    ten: string;
  };
  loaiSanPham?: {
    ma: number;
    ten: string;
  };
  thuongHieu?: {
    ma: number;
    ten: string;
  };
  bienThes: BienThe[];
  _count: {
    danhGias: number;
  };
  hinhAnhMauSacs?: Record<number, HinhAnhMauSac[]>;
}

export interface SanPhamWithRating extends SanPham  {
  danhGia_trungbinh: number;
}
export interface SanPhamWithRatingResonse {
  data: SanPhamWithRating[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface HinhAnhMauSac {
  ma: number
  hinhAnh: string
  anhChinh: boolean
  mamausac: number,
  masp: number,
}

// Interface for BienThe
export interface BienThe {
  ma: number
  gia: string
  soluong: number
  masp: number
  mamausac: number
  makichco: number
  mauSac: MauSac
  kichCo: KichCo
}
export interface MauSacWithImages {
  ma: number
  ten: string
  ma_mau: string
  hinhAnhs: HinhAnhMauSac[]
}

export interface SanPhamQueryParams {
  page: number;
  limit: number;
  search?: string;
  madanhmuc?: number;
  maloaisanpham?: number;
  mathuonghieu?: number;
  noibat?: boolean;
  trangthai?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SanPhamResponse {
  data: SanPham[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CreateSanPhamData {
  ten: string;
  mota?: string;
  giaban: number;
  giagiam?: number;
  hinhanh?: string;
  noibat: boolean;
  trangthai: boolean;
  madanhmuc: number;
  maloaisanpham: number;
  mathuonghieu: number;
  bienThes?: {
    gia: string
    soluong: number
    masp: number
    mamausac: number
    makichco: number
  }[];
  mauSacs?: {
    hinhAnh: string
    anhChinh: boolean
    mamausac: number,
    masp: number,
  }[];
}


export interface AdvancedSearchParams extends Omit<SanPhamQueryParams, 'madanhmuc' | 'maloaisanpham' | 'mathuonghieu'> {
  madanhmuc?: number[];
  maloaisanpham?: number[];
  mathuonghieu?: number[];
  mamausac?: number[];
  makichco?: number[];
  minPrice?: number;
  maxPrice?: number;
}