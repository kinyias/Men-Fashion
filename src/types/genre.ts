import { z } from 'zod';
import { genreFormSchema } from '@/lib/validations/genre.validator';

export type GenreFormValues = z.infer<typeof genreFormSchema>;

export interface Genre {
  ma: number;
  tenloaitin: string;
  trangthai: boolean;
  _count?: {
    tin: number;
  };
}

export interface GenreQueryParams {
  page: number;
  limit: number;
  search?: string;
  trangthai?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GenreResponse {
  data: Genre[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
