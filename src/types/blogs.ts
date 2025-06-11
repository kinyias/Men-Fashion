import { z } from 'zod';
import { blogFormSchema } from '@/lib/validations/blog.validator';

export type BlogFormValues = z.infer<typeof blogFormSchema>;

export interface Blog {
  ma: number;
  tieude: string;
  noidung: string;
  ngaydang: string;
  hinhdaidien: string;
  tinhot: boolean;
  trangthai: boolean;
  manguoidung: number;
  maloaitin: number;
  loaitin?: {
    ma: number;
    tenloaitin: string;
  };
  nguoiDung?: {
    ma: number;
    ho: string;
    ten: string;
    email: string;
  };
}

export interface BlogQueryParams {
  page: number;
  limit: number;
  search?: string;
  maloaitin?: number;
  tinhot?: boolean;
  trangthai?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BlogResponse {
  data: Blog[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
