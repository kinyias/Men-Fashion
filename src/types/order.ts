import { MauSac } from './colors';
import { KhuyenMai } from './coupons';
import { KichCo } from './sizes';
import { User } from './user';

export interface DonHang {
  ma: string;
  ngaydat: Date;
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
  phigiaohang: number;
  phuongthucgiaohang: string;
  lydo?: string;
  mavandon?: string;
  ghichu?: string;
  manguoidung: number;
  maKhuyenMai?: number;
  nguoiDung?: User;
  khuyenMai?: KhuyenMai;
  chiTietDonHangs: ChiTietDonHang[];
  thanhToans: ThanhToan;
  paymentUrl?: string;
}

export interface ChiTietDonHang {
  ma: number;
  soluong: number;
  dongia: number;
  madh: string;
  mabienthe: number;
  bienThe: {
    mauSac: MauSac;
    kichCo: KichCo;
    sanPham: {
      ma: number;
      ten: string;
      hinhanh: string;
    };
  };
}

export interface ThanhToan {
  ma: number;
  phuongthuc: string;
  ngaythanhtoan: Date;
  trangthai: boolean;
  madh: string;
  transId?: string;
}

export enum TrangThaiDonHang {
  DA_DAT = 'da_dat',
  DANG_XU_LY = 'dang_xu_ly',
  DANG_GIAO_HANG = 'dang_giao_hang',
  DA_GIAO_HANG = 'da_giao_hang',
  DA_HUY = 'da_huy',
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
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DonHangFormValues {
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
  phuongthucgiaohang: string;
  chiTietDonHangs: {
    mabienthe: number;
    soluong: number;
    dongia: number;
  }[];
  thanhToan?: {
    phuongthuc: string;
    trangthai?: boolean;
  };
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
  trangthai: TrangThaiDonHang;
  data: {
    requestId: string;
    orderId: string;
    transId: string;
    amount: number;
    message: string;
  };
  donHang: DonHang;
}