import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  updateAdminUserRole,
} from '@/lib/api/api-user';
import {
  AdminUserListParams,
  CreateUserFormValues,
  UpdateUserRoleFormValues,
} from '@/types';
import toast from 'react-hot-toast';

export function useUsers(params: AdminUserListParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', params],
    queryFn: () => getAdminUsers(params),
  });

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserFormValues) => createAdminUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Tạo người dùng thành công');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng'
      );
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: any }) =>
      updateAdminUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Cập nhật thông tin thành công');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin'
      );
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number;
      data: UpdateUserRoleFormValues;
    }) => updateAdminUserRole(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Cập nhật vai trò thành công');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật vai trò'
      );
    },
  });

  return {
    users: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    updateUserRole: updateUserRoleMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isUpdatingRole: updateUserRoleMutation.isPending,
  };
}
