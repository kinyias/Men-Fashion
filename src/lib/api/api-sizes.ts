import api from '@/lib/axios-client';
import { KichCo, KichCoFormValues, KichCoQueryParams, KichCoResponse } from '@/types';

export const getSizes = async (
  queryParams: KichCoQueryParams
): Promise<KichCoResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  params.append('sortBy', (queryParams.sortBy || 'ma'));
  params.append('sortOrder', queryParams.sortOrder || 'asc');
  if (queryParams.search) params.append('search', queryParams.search);

  const response = await api.get(`/api/kichco?${params.toString()}`);
  return response.data;
};

export const getSizeById = async (id: number): Promise<KichCo> => {
  const response = await api.get(`/api/kichco/${id}`);
  return response.data;
};

export const createSize = async (data: KichCoFormValues): Promise<KichCo> => {
  const response = await api.post('/api/kichco', data);
  return response.data.kichCo;
};

export const updateSize = async (id: number, data: KichCoFormValues): Promise<KichCo> => {
  const response = await api.put(`/api/kichco/${id}`, data);
  return response.data.kichCo;
};

export const deleteSize = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/api/kichco/${id}`);
  return response.data;
};

export const deleteManySizes = async (ids: number[]): Promise<{ message: string }> => {
  const response = await api.delete('/api/kichco/bulk', { data: { ids } });
  return response.data;
};