import api from '@/lib/axios-client';
import { KhuyenMai, KhuyenMaiFormValues, KhuyenMaiQueryParams, KhuyenMaiResponse } from '@/types';

export const getCoupons = async (
  queryParams: KhuyenMaiQueryParams
): Promise<KhuyenMaiResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  if (queryParams.search) params.append('search', queryParams.search);
  if (queryParams.loaikhuyenmai) params.append('loaikhuyenmai', queryParams.loaikhuyenmai);
  if (queryParams.active) params.append('active', queryParams.active);
  if (queryParams.sortBy) params.append('sortBy', queryParams.sortBy);
  if (queryParams.sortOrder) params.append('sortOrder', queryParams.sortOrder);

  const response = await api.get(`/api/khuyenmai?${params.toString()}`);
  return response.data;
};

export const getCouponById = async (id: number): Promise<KhuyenMai> => {
  const response = await api.get(`/api/khuyenmai/${id}`);
  return response.data;
};

export const createCoupon = async (data: KhuyenMaiFormValues): Promise<KhuyenMai> => {
  const response = await api.post('/api/khuyenmai', data);
  return response.data.khuyenMai;
};

export const updateCoupon = async (id: number, data: KhuyenMaiFormValues): Promise<KhuyenMai> => {
  const response = await api.put(`/api/khuyenmai/${id}`, data);
  return response.data.khuyenMai;
};