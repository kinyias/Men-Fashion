'use client';

import GenreForm from '@/components/genre/GenreForm';
import { getGenreById } from '@/lib/api/api-genre';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function GenreEditPage() {
  const params = useParams();
  const genreId = params.id !== 'create' ? Number(params.id) : undefined;
  const isEditMode = !!genreId;

  // Fetch genre data if in edit mode
  const { data: genre, isLoading: isLoadingGenre } = useQuery({
    queryKey: ['genre', genreId],
    queryFn: () => getGenreById(genreId!),
    enabled: isEditMode,
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? 'Cập nhật loại tin' : 'Tạo loại tin'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? 'Cập nhật thông tin loại tin'
              : 'Tạo loại tin mới cho website'}
          </p>
        </div>
      </div>
      <div className="mt-8">
        {isLoadingGenre ? (
          <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg font-medium">
              Đang tải dữ liệu loại tin...
            </span>
          </div>
        ) : (
          <GenreForm genre={genre!} />
        )}
      </div>
    </div>
  );
}
