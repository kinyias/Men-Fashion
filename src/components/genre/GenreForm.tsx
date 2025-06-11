'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { genreFormSchema } from '@/lib/validations/genre.validator';
import { Genre } from '@/types/genre';
import { createGenre, updateGenre } from '@/lib/api/api-genre';

export default function GenreForm({ genre }: { genre?: Genre }) {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const genreId = params?.id ? Number(params.id) : undefined;
  const isEditMode = !!genreId;

  const form = useForm({
    resolver: zodResolver(genreFormSchema),
    defaultValues: {
      tenloaitin: genre?.tenloaitin || '',
      trangthai: genre?.trangthai || true,
    },
  });

  // Create genre mutation
  const createMutation = useMutation({
    mutationFn: (data: { tenloaitin: string; trangthai: boolean }) =>
      createGenre(data),
    onSuccess: () => {
      toast.success('Tạo loại tin thành công');
      router.push('/admin/genre');
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
    onError: (error) => {
      console.error('Error creating genre:', error);
      toast.error('Tạo loại tin thất bại');
    },
  });

  // Update genre mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { tenloaitin: string; trangthai: boolean };
    }) => updateGenre(id, data),
    onSuccess: () => {
      toast.success('Cập nhật loại tin thành công');
      router.push('/admin/genre');
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      queryClient.invalidateQueries({ queryKey: ['genre', genreId] });
    },
    onError: (error) => {
      console.error('Error updating genre:', error);
      toast.error('Cập nhật loại tin thất bại');
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(data: { tenloaitin: string; trangthai: boolean }) {
    if (isEditMode && genreId) {
      updateMutation.mutate({ id: genreId, data });
    } else {
      createMutation.mutate(data);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? 'Cập nhật loại tin' : 'Thông tin loại tin'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="tenloaitin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên loại tin</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên loại tin" {...field} />
                  </FormControl>
                  <FormDescription>Tên loại tin tức.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trangthai"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <div className="space-y-1 leading-none">
                    <FormLabel>Trạng thái</FormLabel>
                    <FormDescription>
                      Bật/tắt để hiển thị hoặc ẩn loại tin này.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Lưu'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
