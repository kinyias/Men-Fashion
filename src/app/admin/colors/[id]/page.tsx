'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { getColorById, updateColor, createColor } from '@/lib/api/api-colors';
import { ColorForm } from '@/components/products/colors/ColorForm';
import { MauSacFormValues } from '@/types';
import toast from 'react-hot-toast';

export default function ColorPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const colorId = params.id !== 'create' ? Number(params.id) : undefined;
  const isEditMode = !!colorId;
  
  // Fetch color data if in edit mode
  const { data: color, isLoading, isError } = useQuery({
    queryKey: ['color', colorId],
    queryFn: () => getColorById(colorId!),
    enabled: isEditMode,
  });

  // Create color mutation
  const createMutation = useMutation({
    mutationFn: (data: MauSacFormValues) => createColor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      toast.success('Tạo màu sắc thành công');
      router.push('/admin/colors');
    },
    onError: (error) => {
      console.error('Error creating color:', error);
      toast.error('Tạo màu sắc thất bại');
    },
  });

  // Update color mutation
  const updateMutation = useMutation({
    mutationFn: (data: MauSacFormValues) => updateColor(colorId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      queryClient.invalidateQueries({ queryKey: ['color', colorId] });
      toast.success('Cập nhật màu sắc thành công');
      router.push('/admin/colors');
    },
    onError: (error) => {
      console.error('Error updating color:', error);
      toast.error('Cập nhật màu sắc thất bại');
    },
  });

  const handleSubmit = async (data: MauSacFormValues) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isEditMode && (isError || !color)) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Không thể tải thông tin màu sắc. Vui lòng thử lại sau.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditMode ? "Chỉnh sửa màu sắc" : "Thêm màu sắc mới"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode ? "Cập nhật thông tin màu sắc trong hệ thống" : "Tạo màu sắc mới trong hệ thống"}
        </p>
      </div>
      
      <div className="max-w-2xl">
        <ColorForm 
          initialData={color} 
          onSubmit={handleSubmit} 
          isSubmitting={isEditMode ? updateMutation.isPending : createMutation.isPending} 
        />
      </div>
    </div>
  );
}