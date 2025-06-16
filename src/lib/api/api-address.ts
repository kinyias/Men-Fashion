import api from '@/lib/axios-client';
import {
  Address,
  AddressQueryParams,
  AddressResponse,
  AddressFormValues,
} from '@/types/address';

export const getAddresses = async (
  queryParams: AddressQueryParams
): Promise<AddressResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  if (queryParams.sortBy) params.append('sortBy', queryParams.sortBy);
  if (queryParams.sortOrder) params.append('sortOrder', queryParams.sortOrder);
  if (queryParams.search) params.append('search', queryParams.search);
  if (queryParams.loaidiachi)
    params.append('loaidiachi', queryParams.loaidiachi);
  if (queryParams.macdinh !== undefined)
    params.append('macdinh', queryParams.macdinh.toString());

  const response = await api.get(`/api/diachi?${params.toString()}`);
  return response.data;
};

export const getAddressById = async (id: number): Promise<Address> => {
  const response = await api.get(`/api/diachi/${id}`);
  return response.data;
};

export const getAddressesByUserId = async (
  userId: number
): Promise<AddressResponse> => {
  const response = await api.get(`/api/diachi/by-user/${userId}`);
  return response.data;
};

export const createAddress = async (
  data: AddressFormValues
): Promise<Address> => {
  const response = await api.post('/api/diachi', data);
  return response.data.diaChi;
};

export const updateAddress = async (
  id: number,
  data: AddressFormValues
): Promise<Address> => {
  const response = await api.put(`/api/diachi/${id}`, data);
  return response.data.diaChi;
};

export const deleteAddress = async (
  id: number
): Promise<{ message: string }> => {
  const response = await api.delete(`/api/diachi/${id}`);
  return response.data;
};

export const deleteManyAddresses = async (
  ids: number[]
): Promise<{ message: string }> => {
  const response = await api.delete('/api/diachi/bulk', { data: { ids } });
  return response.data;
};
