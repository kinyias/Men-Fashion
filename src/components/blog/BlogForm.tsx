'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { blogFormSchema } from '@/lib/validations/blog.validator';
import { Blog, BlogFormValues } from '@/types/blogs';
import { createBlog, updateBlog } from '@/lib/api/api-blogs';
import { getActiveGenres } from '@/lib/api/api-genre';
import { UploadButton } from '@/utils/uploadthing';
import axios from 'axios';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '../ui/skeleton';

export default function BlogForm({ blog }: { blog?: Blog }) {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const blogId = params?.id ? Number(params.id) : undefined;
  const isEditMode = !!blogId;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch active genres for dropdown
  const { data: genresData, isLoading: isLoadingGenres } = useQuery({
    queryKey: ['active-genres'],
    queryFn: getActiveGenres,
  });
  const genres = genresData?.data || [];

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      tieude: blog?.tieude || '',
      noidung: blog?.noidung || '',
      hinhdaidien: blog?.hinhdaidien || '',
      tinhot: blog?.tinhot || false,
      trangthai: blog?.trangthai || true,
      maloaitin: blog?.maloaitin || undefined,
    },
  });

  // Create blog mutation
  const createMutation = useMutation({
    mutationFn: (data: BlogFormValues) => createBlog(data),
    onSuccess: () => {
      toast.success('Tạo tin tức thành công');
      router.push('/admin/blogs');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error) => {
      console.error('Error creating blog:', error);
      toast.error('Tạo tin tức thất bại');
    },
  });

  // Update blog mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BlogFormValues }) =>
      updateBlog(id, data),
    onSuccess: () => {
      toast.success('Cập nhật tin tức thành công');
      router.push('/admin/blogs');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] });
    },
    onError: (error) => {
      console.error('Error updating blog:', error);
      toast.error('Cập nhật tin tức thất bại');
    },
  });

  const handleImageDelete = (image: string) => {
    const imageKey = image.substring(image.lastIndexOf('/') + 1);

    axios
      .post('/api/uploadthing/delete', { imageKey })
      .then((res) => {
        if (res.data.success) {
          form.setValue('hinhdaidien', '');
          toast.success('Hình ảnh đã được xoá');
        }
      })
      .catch(() => {
        toast.error('Đã xảy ra lỗi khi xoá hình ảnh');
      });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(data: BlogFormValues) {
    if (isEditMode && blogId) {
      updateMutation.mutate({ id: blogId, data });
    } else {
      createMutation.mutate(data);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditMode ? 'Cập nhật tin tức' : 'Thông tin tin tức'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="tieude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề tin tức" {...field} />
                      </FormControl>
                      <FormDescription>Tiêu đề của tin tức.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maloaitin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại tin</FormLabel>
                      {isLoadingGenres ? (
                        <div className="space-y-2">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      ) : (
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          value={
                            field.value ? field.value.toString() : undefined
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại tin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genres.map((genre) => (
                              <SelectItem
                                key={genre.ma}
                                value={genre.ma.toString()}
                              >
                                {genre.tenloaitin}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <FormDescription>Chọn loại tin tức.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="noidung"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập nội dung tin tức"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nội dung chi tiết của tin tức.
                      </FormDescription>
                      <FormMessage />
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
                  {isSubmitting
                    ? 'Đang lưu...'
                    : isEditMode
                    ? 'Cập nhật'
                    : 'Lưu'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="hinhdaidien"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hình ảnh đại diện</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {field.value && (
                            <div className="relative w-full h-full overflow-hidden rounded-md">
                              <Image
                                src={field.value}
                                alt="Ảnh đại diện"
                                className="object-cover w-full h-full"
                                width={500}
                                height={300}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() =>
                                  field.value && handleImageDelete(field.value)
                                }
                              >
                                Xóa
                              </Button>
                            </div>
                          )}

                          {!field.value && (
                            <div className="flex flex-col items-center h-full max-w-[500px] p-6 border-2 border-dashed border-primary/50 rounded">
                              {isUploading && (
                                <div className="w-full mb-4">
                                  <p className="text-sm text-muted-foreground mb-2 text-center">
                                    Đang tải lên: {uploadProgress / 100}%
                                  </p>
                                  <Progress
                                    value={uploadProgress}
                                    className="h-2"
                                  />
                                </div>
                              )}

                              <UploadButton
                                endpoint="imageUploader"
                                onUploadBegin={() => {
                                  setIsUploading(true);
                                  setUploadProgress(0);
                                }}
                                onUploadProgress={(progress) => {
                                  setUploadProgress(Math.round(progress * 100));
                                }}
                                onClientUploadComplete={(res) => {
                                  // Update the form field with the uploaded image URL
                                  field.onChange(res[0].url);

                                  // Reset upload state
                                  setIsUploading(false);
                                  setUploadProgress(0);

                                  // Show success toast
                                  toast.success('Tải ảnh lên thành công');
                                }}
                                onUploadError={(error: Error) => {
                                  // Reset upload state
                                  setIsUploading(false);
                                  setUploadProgress(0);

                                  // Show error toast
                                  toast.error(`Lỗi tải ảnh: ${error.message}`);
                                }}
                                appearance={{
                                  button:
                                    'bg-blue-500 text-primary-foreground hover:bg-primary/90 px-5',
                                  allowedContent:
                                    'text-sm text-muted-foreground',
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Hình ảnh đại diện cho tin tức.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="tinhot"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 flex-1">
                        <div className="space-y-1 leading-none">
                          <FormLabel>Tin hot</FormLabel>
                          <FormDescription>
                            Bật/tắt để đánh dấu là tin hot.
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

                  <FormField
                    control={form.control}
                    name="trangthai"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 flex-1">
                        <div className="space-y-1 leading-none">
                          <FormLabel>Trạng thái</FormLabel>
                          <FormDescription>
                            Bật/tắt để hiển thị hoặc ẩn tin tức này.
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
