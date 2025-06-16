import { z } from 'zod';
import { addressFormSchema } from '@/lib/validations/address.validator';

export type AddressFormValues = z.infer<typeof addressFormSchema>;

export type AddressType = 'NHA' | 'VAN_PHONG' | 'KHAC';

export interface Address {
  ma: number;
  tennguoinhan: string;
  email?: string;
  sodienthoai: string;
  diachi: string;
  phuongxa: string;
  quanhuyen: string;
  tinhthanh: string;
  macdinh: boolean;
  loaidiachi: AddressType;
  manguoidung: number;
  nguoiDung?: {
    ma: number;
    ho: string;
    ten: string;
    email: string;
  };
}

export interface AddressQueryParams {
  page: number;
  limit: number;
  search?: string;
  loaidiachi?: AddressType;
  macdinh?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AddressResponse {
  data: Address[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
