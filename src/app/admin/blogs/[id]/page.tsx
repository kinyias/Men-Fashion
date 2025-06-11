'use client';

import BlogForm from '@/components/blog/BlogForm';
import { getBlogById } from '@/lib/api/api-blogs';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function BlogEditPage() {
  const params = useParams();
  const blogId = params.id !== 'create' ? Number(params.id) : undefined;
  const isEditMode = !!blogId;

  // Fetch blog data if in edit mode
  const { data: blog, isLoading: isLoadingBlog } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => getBlogById(blogId!),
    enabled: isEditMode,
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? 'Cập nhật tin tức' : 'Tạo tin tức'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? 'Cập nhật thông tin tin tức'
              : 'Tạo tin tức mới cho website'}
          </p>
        </div>
      </div>
      <div className="mt-8">
        {isLoadingBlog ? (
          <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg font-medium">
              Đang tải dữ liệu tin tức...
            </span>
          </div>
        ) : (
          <BlogForm blog={blog!} />
        )}
      </div>
    </div>
  );
}
