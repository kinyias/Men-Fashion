import api from '@/lib/axios-client';
import { CancelOrderResponse, DonHang, DonHangFormValues, DonHangQueryParams, DonHangResponse } from '@/types';

export const getOrders = async (
  queryParams: DonHangQueryParams
): Promise<DonHangResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  if (queryParams.search) params.append('search', queryParams.search);
  if (queryParams.trangthai) params.append('trangthai', queryParams.trangthai);
  if (queryParams.startDate) params.append('startDate', queryParams.startDate);
  if (queryParams.endDate) params.append('endDate', queryParams.endDate);
  if (queryParams.manguoidung) params.append('manguoidung', queryParams.manguoidung.toString());

  const response = await api.get(`/api/donhang?${params.toString()}`);
  return response.data;
};

export const getOrderWithOrderItemsById = async (id: string): Promise<DonHang> => {
  const response = await api.get(`/api/donhang/${id}`);
  return response.data;
};

export const getOrderById = async (id: string): Promise<DonHang> => {
  const response = await api.get(`/api/donhang/${id}/xac-nhan`);
  return response.data;
};

export const getMyOrders = async (
  queryParams: Omit<DonHangQueryParams, 'manguoidung'>
): Promise<DonHangResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  if (queryParams.trangthai) params.append('trangthai', queryParams.trangthai);
  const response = await api.get(`/api/donhang/user/me?${params.toString()}`);
  return response.data;
};

export const createOrder = async (data: DonHangFormValues): Promise<DonHang> => {
  const response = await api.post('/api/donhang', data);
  return response.data.donHang;
};

export const updateOrderStatus = async (
  id: string,
  trangthai: string,
  mavandon?: string,
  ngaygiao?: string
): Promise<DonHang> => {
  const response = await api.patch(`/api/donhang/${id}/status`, { trangthai, ngaygiao, mavandon });
  return response.data.donHang;
};

export const cancelOrder = async (id: string, reason?: string): Promise<CancelOrderResponse> => {
  const response = await api.post(`/api/donhang/${id}/cancel`, { reason });
  return response.data;
};

export const updatePaymentStatus = async (
  id: number,
  trangthai: boolean
): Promise<{ message: string }> => {
  const response = await api.patch(`/api/donhang/thanhtoan/${id}`, { trangthai });
  return response.data;
};