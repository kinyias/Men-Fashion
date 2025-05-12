import api from '@/lib/axios-client';
import { MauSac, MauSacFormValues, MauSacQueryParams, MauSacResponse } from '@/types';

export const getColors = async (
  queryParams: MauSacQueryParams
): Promise<MauSacResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  params.append('sortBy', (queryParams.sortBy || 'ma'));
  params.append('sortOrder', queryParams.sortOrder || 'asc');
  if (queryParams.search) params.append('search', queryParams.search);

  const response = await api.get(`/api/mausac?${params.toString()}`);
  return response.data;
};

export const getColorById = async (id: number): Promise<MauSac> => {
  const response = await api.get(`/api/mausac/${id}`);
  return response.data;
};

export const createColor = async (data: MauSacFormValues): Promise<MauSac> => {
  const response = await api.post('/api/mausac', data);
  return response.data.mauSac;
};

export const updateColor = async (id: number, data: MauSacFormValues): Promise<MauSac> => {
  const response = await api.put(`/api/mausac/${id}`, data);
  return response.data.mauSac;
};

export const deleteColor = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/api/mausac/${id}`);
  return response.data;
};

export const deleteManyColors = async (ids: number[]): Promise<{ message: string }> => {
  const response = await api.delete('/api/mausac/bulk', { data: { ids } });
  return response.data;
};