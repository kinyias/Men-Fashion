import api from '@/lib/axios-client';
import {
  DanhGia,
  DanhGiaFormValues,
  DanhGiaQueryParams,
  DanhGiaResponse,
} from '@/types';

export const getReviews = async (
  queryParams: DanhGiaQueryParams
): Promise<DanhGiaResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  params.append('sortBy', queryParams.sortBy || 'ngaydang');
  params.append('sortOrder', queryParams.sortOrder || 'desc');
  if (queryParams.search) params.append('search', queryParams.search);
  if (queryParams.masp) params.append('masp', queryParams.masp.toString());

  const response = await api.get(`/api/danhgia?${params.toString()}`);
  return response.data;
};

export const getReviewById = async (id: number): Promise<DanhGia> => {
  const response = await api.get(`/api/danhgia/${id}`);
  return response.data;
};

export const createReview = async (
  data: DanhGiaFormValues
): Promise<DanhGia> => {
  const response = await api.post('/api/danhgia', data);
  return response.data.danhGia;
};

export const updateReview = async (
  id: number,
  data: Partial<DanhGiaFormValues>
): Promise<DanhGia> => {
  const response = await api.put(`/api/danhgia/${id}`, data);
  return response.data.danhGia;
};

export const deleteReview = async (
  id: number
): Promise<{ message: string }> => {
  const response = await api.delete(`/api/danhgia/${id}`);
  return response.data;
};

export const deleteManyReviews = async (
  ids: number[]
): Promise<{ message: string }> => {
  const response = await api.delete('/api/danhgia/bulk', { data: { ids } });
  return response.data;
};
