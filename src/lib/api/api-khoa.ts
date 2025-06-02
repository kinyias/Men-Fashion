import api from '@/lib/axios-client';
import { Khoa } from '@/types/khoa';

export const getAllKhoa = async (): Promise<Khoa[]> => {
  const response = await api.get(`/api/khoa`);
  return response.data;
};
