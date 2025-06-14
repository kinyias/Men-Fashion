import api from '@/lib/axios-client';
import {
  Blog,
  BlogQueryParams,
  BlogResponse,
  BlogFormValues,
} from '@/types/blogs';

export const getBlogs = async (
  queryParams: BlogQueryParams
): Promise<BlogResponse> => {
  const params = new URLSearchParams();
  params.append('page', queryParams.page.toString());
  params.append('limit', queryParams.limit.toString());
  if (queryParams.sortBy) params.append('sortBy', queryParams.sortBy);
  if (queryParams.sortOrder) params.append('sortOrder', queryParams.sortOrder);
  if (queryParams.search) params.append('search', queryParams.search);
  if (queryParams.maloaitin)
    params.append('maloaitin', queryParams.maloaitin.toString());
  if (queryParams.tinhot !== undefined)
    params.append('tinhot', queryParams.tinhot.toString());
  if (queryParams.trangthai !== undefined)
    params.append('trangthai', queryParams.trangthai.toString());

  const response = await api.get(`/api/tintuc?${params.toString()}`);
  return response.data;
};

export const getBlogById = async (id: number): Promise<Blog> => {
  const response = await api.get(`/api/tintuc/${id}`);
  return response.data;
};

export const createBlog = async (data: BlogFormValues): Promise<Blog> => {
  const response = await api.post('/api/tintuc', data);
  return response.data.tinTuc;
};

export const updateBlog = async (
  id: number,
  data: BlogFormValues
): Promise<Blog> => {
  const response = await api.put(`/api/tintuc/${id}`, data);
  return response.data.tinTuc;
};

export const deleteBlog = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/api/tintuc/${id}`);
  return response.data;
};

export const deleteManyBlogs = async (
  ids: number[]
): Promise<{ message: string }> => {
  const response = await api.delete('/api/tintuc/bulk', { data: { ids } });
  return response.data;
};

export const getBlogsByCategory = async (
  categoryId: number
): Promise<Blog[]> => {
  const response = await api.get(`/api/tintuc/by-loaitin/${categoryId}`);
  return response.data.data;
};

export const getHotBlogs = async (): Promise<BlogResponse> => {
  const params = new URLSearchParams();
  params.append('page', '1');
  params.append('limit', '100');
  params.append('sortBy', 'ngaydang');
  params.append('sortOrder', 'desc');
  params.append('tinhot', 'true');

  const response = await api.get(`/api/tintuc?${params.toString()}`);
  return response.data;
};
export const increaseBlogViews = async (id: number): Promise<Blog> => {
  const response = await api.patch(`/api/tintuc/${id}/views`);
  return response.data;
}

export const getRelatedBlogs = async (id: number, limit: number): Promise<Blog[]> => {
  const response = await api.get(`/api/tintuc/${id}/related?limit=${limit}`);
  return response.data.data;
}
