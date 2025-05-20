import { MauSac } from "./colors";
import { KhuyenMai } from "./coupons";
import { KichCo } from "./sizes";
import { User } from "./user";

export interface DonHang {
  ma: number;
  ngaydat: Date;
  ho: string;
  ten: string;
  email?: string;
  giamgia?: number;
  tamtinh: number;
  tonggia: number;
  diachi: string;
  thanhpho: string;
  quan: string;
  phuong: string;
  ngaygiao?: Date;
  ngayhuy?: Date;
  sdt: string;
  trangthai: TrangThaiDonHang;
  ghichu?: string;
  manguoidung: number;
  maKhuyenMai?: number;
  nguoiDung?: User;
  khuyenMai?: KhuyenMai;
  chiTietDonHangs: ChiTietDonHang[];
  thanhToans: ThanhToan[];
  paymentUrl?: string;
}

export interface ChiTietDonHang {
  ma: number;
  soluong: number;
  dongia: number;
  masp: number;
  madh: number;
  mabienthe: number;
  sanPham: {
    ma: number;
    ten: string;
    hinhanh: string;
  };
  bienThe: {
    mauSac: MauSac;
    kichCo: KichCo;
  };
}

export interface ThanhToan {
  ma: number;
  phuongthuc: string;
  ngaythanhtoan: Date;
  trangthai: boolean;
  madh: number;
}


export enum TrangThaiDonHang {
  DA_DAT = 'da_dat',
  DANG_XU_LY = 'dang_xu_ly',
  DANG_GIAO_HANG = 'dang_giao_hang',
  DA_GIAO_HANG = 'da_giao_hang'
}

export interface DonHangResponse {
  data: DonHang[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface DonHangQueryParams {
  page: number;
  limit: number;
  search?: string;
  trangthai?: TrangThaiDonHang;
  startDate?: string;
  endDate?: string;
  manguoidung?: number;
}

export interface DonHangFormValues {
  ho: string;
  ten: string;
  email?: string;
  diachi: string;
  thanhpho: string;
  quan: string;
  phuong: string;
  sdt: string;
  ghichu?: string;
  maKhuyenMai?: number;
  tamtinh: number;
  tonggia: number;
  phigiaohang: number;
  phuongthucgiaohang:string;
  chiTietDonHangs: {
    masp: number;
    mabienthe: number;
    soluong: number;
    dongia: number;
  }[];
  thanhToan?: {
    phuongthuc: string;
    trangthai?: boolean;
  };
}