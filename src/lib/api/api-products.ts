import api from '@/lib/axios-client';
import { SanPham, SanPhamQueryParams, SanPhamResponse, CreateSanPhamData, SanPhamWithRatingResonse } from '@/types/product';

export const getProducts = async (
  queryParams: SanPhamQueryParams
): Promise<SanPhamResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  if (queryParams.sortBy) params.append('sortBy', queryParams.sortBy);
  if (queryParams.sortOrder) params.append('sortOrder', queryParams.sortOrder);
  if (queryParams.search) params.append('search', queryParams.search);
  if (queryParams.madanhmuc) params.append('madanhmuc', queryParams.madanhmuc.toString());
  if (queryParams.maloaisanpham) params.append('maloaisanpham', queryParams.maloaisanpham.toString());
  if (queryParams.mathuonghieu) params.append('mathuonghieu', queryParams.mathuonghieu.toString());
  if (queryParams.noibat !== undefined) params.append('noibat', queryParams.noibat.toString());
  if (queryParams.trangthai !== undefined) params.append('trangthai', queryParams.trangthai.toString());

  const response = await api.get(`/api/sanpham?${params.toString()}`);
  return response.data;
};

export const getProductsWithVariant = async (
  queryParams: SanPhamQueryParams
): Promise<SanPhamWithRatingResonse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  if (queryParams.sortBy) params.append('sortBy', queryParams.sortBy);
  if (queryParams.sortOrder) params.append('sortOrder', queryParams.sortOrder);
  if (queryParams.search) params.append('search', queryParams.search);
  if (queryParams.madanhmuc) params.append('madanhmuc', queryParams.madanhmuc.toString());
  if (queryParams.maloaisanpham) params.append('maloaisanpham', queryParams.maloaisanpham.toString());
  if (queryParams.mathuonghieu) params.append('mathuonghieu', queryParams.mathuonghieu.toString());
  if (queryParams.noibat !== undefined) params.append('noibat', queryParams.noibat.toString());
  if (queryParams.trangthai !== undefined) params.append('trangthai', queryParams.trangthai.toString());

  const response = await api.get(`/api/sanpham/with-variants?${params.toString()}`);
  return response.data;
};

export const getProductById = async (id: number): Promise<SanPham> => {
  const response = await api.get(`/api/sanpham/${id}`);
  return response.data;
};

export const createProduct = async (data: CreateSanPhamData): Promise<SanPham> => {
  const response = await api.post('/api/sanpham', data);
  return response.data.sanPham;
};

export const updateProduct = async (id: number, data: Partial<CreateSanPhamData>): Promise<SanPham> => {
  const response = await api.put(`/api/sanpham/${id}`, data);
  return response.data.sanPham;
};

export const deleteProduct = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/api/sanpham/${id}`);
  return response.data;
};

export const deleteManyProducts = async (ids: number[]): Promise<{ message: string }> => {
  const response = await api.delete('/api/sanpham/bulk', { data: { ids } });
  return response.data;
};