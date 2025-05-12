import api from '@/lib/axios-client';
import { LoaiSanPham, LoaiSanPhamQueryParams, LoaiSanPhamResponse, LoaiSanPhamFormValues } from '@/types/sub-category';

export const getSubCategories = async (
  queryParams: LoaiSanPhamQueryParams
): Promise<LoaiSanPhamResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  if (queryParams.sortBy) params.append('sortBy', queryParams.sortBy);
  if (queryParams.sortOrder) params.append('sortOrder', queryParams.sortOrder);
  if (queryParams.search) params.append('search', queryParams.search);
  if (queryParams.madanhmuc) params.append('madanhmuc', queryParams.madanhmuc.toString());

  const response = await api.get(`/api/loaisanpham?${params.toString()}`);
  return response.data;
};

export const getSubCategoryById = async (id: number): Promise<LoaiSanPham> => {
  const response = await api.get(`/api/loaisanpham/${id}`);
  return response.data;
};

export const createSubCategory = async (data: LoaiSanPhamFormValues): Promise<LoaiSanPham> => {
  const response = await api.post('/api/loaisanpham', data);
  return response.data.loaiSanPham;
};

export const updateSubCategory = async (id: number, data: LoaiSanPhamFormValues): Promise<LoaiSanPham> => {
  const response = await api.put(`/api/loaisanpham/${id}`, data);
  return response.data.loaiSanPham;
};

export const deleteSubCategory = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/api/loaisanpham/${id}`);
  return response.data;
};

export const deleteManySubCategories = async (ids: number[]): Promise<{ message: string }> => {
  const response = await api.delete('/api/loaisanpham/bulk', { data: { ids } });
  return response.data;
};