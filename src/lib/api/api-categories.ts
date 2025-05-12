import api from '@/lib/axios-client';
import { DanhMuc, DanhMucFormValues, DanhMucQueryParams, DanhMucResponse } from '@/types';

export const getCategories = async (
 queryParams: DanhMucQueryParams
): Promise<DanhMucResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  params.append('sortBy', (queryParams.sortBy || 'ma'));
  params.append('sortOrder', queryParams.sortOrder || 'asc');
  if (queryParams.search) params.append('search', queryParams.search);

  const response = await api.get(`/api/danhmuc?${params.toString()}`);
  return response.data;
};

export const getCategoryById = async (id: number): Promise<DanhMuc> => {
  const response = await api.get(`/api/danhmuc/${id}`);
  return response.data;
};

export const createCategory = async (data: DanhMucFormValues): Promise<DanhMuc> => {
  const response = await api.post('/api/danhmuc', data);
  return response.data.danhMuc;
};

export const updateCategory = async (id: number, data: DanhMucFormValues): Promise<DanhMuc> => {
  const response = await api.put(`/api/danhmuc/${id}`, data);
  return response.data.danhMuc;
};

export const deleteCategory = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/api/danhmuc/${id}`);
  return response.data;
};

export const deleteManyCategories = async (ids: number[]): Promise<{ message: string }> => {
  const response = await api.delete('/api/danhmuc/bulk', { data: { ids } });
  return response.data;
};