import { z } from "zod";
import { productFormSchema } from "@/lib/validations/product.validator";

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
  bienThes?: BienThe[];
  _count?: {
    bienThes: number;
    danhGias: number;
  };
  hinhAnhMauSacs?: Record<number, HinhAnhMauSac[]>;
}

// export interface BienThe {
//   ma: number;
//   gia: number;
//   soluong: number;
//   msp: number;
//   mamausac: number;
//   makichco: number;
//   mauSac?: MauSac;
//   kichCo?: KichCo;
// }

// export interface HinhAnhMauSac {
//   ma: number;
//   hinhAnh: string;
//   anhChinh: boolean;
//   mamausac: number;
// }
interface HinhAnhMauSac {
  ma: number
  hinhAnh: string
  anhChinh: boolean
  mamausac: number,
  masp: number,
}

// Interface for BienThe
interface BienThe {
  ma: number
  gia: string
  soluong: number
  msp: number
  mamausac: number
  makichco: number
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
  bienThes?: BienThe[];
  mauSacs?: HinhAnhMauSac[];
}