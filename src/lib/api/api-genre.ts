import api from '@/lib/axios-client';
import {
  Genre,
  GenreQueryParams,
  GenreResponse,
  GenreFormValues,
} from '@/types/genre';

export const getGenres = async (
  queryParams: GenreQueryParams
): Promise<GenreResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  if (queryParams.sortBy) params.append('sortBy', queryParams.sortBy);
  if (queryParams.sortOrder) params.append('sortOrder', queryParams.sortOrder);
  if (queryParams.search) params.append('search', queryParams.search);
  if (queryParams.trangthai !== undefined)
    params.append('trangthai', queryParams.trangthai.toString());

  const response = await api.get(`/api/loaitin?${params.toString()}`);
  return response.data;
};

export const getGenreById = async (id: number): Promise<Genre> => {
  const response = await api.get(`/api/loaitin/${id}`);
  return response.data;
};

export const createGenre = async (data: GenreFormValues): Promise<Genre> => {
  const response = await api.post('/api/loaitin', data);
  return response.data.loaiTin;
};

export const updateGenre = async (
  id: number,
  data: GenreFormValues
): Promise<Genre> => {
  const response = await api.put(`/api/loaitin/${id}`, data);
  return response.data.loaiTin;
};

export const deleteGenre = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/api/loaitin/${id}`);
  return response.data;
};

export const deleteManyGenres = async (
  ids: number[]
): Promise<{ message: string }> => {
  const response = await api.delete('/api/loaitin/bulk', { data: { ids } });
  return response.data;
};

export const getGenresByStatus = async (status: boolean): Promise<Genre[]> => {
  const response = await api.get(`/api/loaitin/by-trangthai/${status}`);
  return response.data.data;
};

export const getActiveGenres = async (): Promise<GenreResponse> => {
  const params = new URLSearchParams();
  params.append('page', '1');
  params.append('limit', '100');
  params.append('sortBy', 'ma');
  params.append('sortOrder', 'asc');
  params.append('trangthai', 'true');

  const response = await api.get(`/api/loaitin?${params.toString()}`);
  return response.data;
};
