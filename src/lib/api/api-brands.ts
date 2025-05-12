import api from '@/lib/axios-client';
import { ThuongHieu, ThuongHieuFormValues, ThuongHieuQueryParams, ThuongHieuResponse } from '@/types';

export const getBrands = async (
  queryParams: ThuongHieuQueryParams
): Promise<ThuongHieuResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  params.append('sortBy', (queryParams.sortBy || 'ma'));
  params.append('sortOrder', queryParams.sortOrder || 'asc');
  if (queryParams.search) params.append('search', queryParams.search);

  const response = await api.get(`/api/thuonghieu?${params.toString()}`);
  return response.data;
};

export const getBrandById = async (id: number): Promise<ThuongHieu> => {
  const response = await api.get(`/api/thuonghieu/${id}`);
  return response.data;
};

export const createBrand = async (data: ThuongHieuFormValues): Promise<ThuongHieu> => {
  const response = await api.post('/api/thuonghieu', data);
  return response.data.thuongHieu;
};

export const updateBrand = async (id: number, data: ThuongHieuFormValues): Promise<ThuongHieu> => {
  const response = await api.put(`/api/thuonghieu/${id}`, data);
  return response.data.thuongHieu;
};

export const deleteBrand = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/api/thuonghieu/${id}`);
  return response.data;
};

export const deleteManyBrands = async (ids: number[]): Promise<{ message: string }> => {
  const response = await api.delete('/api/thuonghieu/bulk', { data: { ids } });
  return response.data;
};