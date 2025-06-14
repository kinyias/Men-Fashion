'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BlogCard from './BlogCard';
import { BlogQueryParams } from '@/types';
import { getBlogs, getGenres } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const sortOptions = [
  { value: 'ngaydang-asc', label: 'Ngày: Mới nhất' },
  { value: 'ngaydang-desc', label: 'Ngày: Cũ nhất' },
  { value: 'tieude-asc', label: 'Tên: A-Z' },
  { value: 'tieude-desc', label: 'Tên: Z-A' },
  { value: 'soluotxem-desc', label: 'Lượt xem: Cao nhất' },
];

export function BlogListingContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(0);
  const [sortBy, setSortBy] = useState('ngaydang-asc');
  const [sortField, sortOrder] = sortBy.split('-');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Fetch active genres
  const { data: genresData, isLoading: isLoadingGenres } = useQuery({
    queryKey: ['genresActive'],
    queryFn: () => getGenres({ page: 1, limit: 100, trangthai: true }),
  });
  const genres = genresData?.data || [];

  // Prepare query params for blogs
  const queryParams: BlogQueryParams = {
    page: currentPage,
    limit: postsPerPage,
    search: searchQuery || undefined,
    maloaitin: selectedGenre,
    sortBy: sortField,
    sortOrder: sortOrder as 'asc' | 'desc',
    trangthai: true,
  };

  // Fetch blogs with query params
  const { data: blogsData, isLoading: isLoadingBlogs } = useQuery({
    queryKey: ['blogsActive', queryParams],
    queryFn: () => getBlogs(queryParams),
  });
  const blogs = blogsData?.data || [];
  const totalPages = blogsData?.pagination.totalPages || 1;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Tất cả bài viết
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Khám phá bộ sưu tập đầy đủ các hướng dẫn phong cách, mẹo thời
              trang và góc nhìn ngành dành cho nam giới
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              {isLoadingGenres ? (
                 <div className="w-[140px] h-10 rounded-md border border-input bg-background">
                 <div className="flex items-center justify-between h-full px-3">
                   <Skeleton className="h-4 w-20" />
                   <Skeleton className="h-4 w-4" />
                 </div>
               </div>
              ) : (
                <Select
                  value={selectedGenre?.toString() || '0'}
                  onValueChange={(value) =>
                    setSelectedGenre(value ? parseInt(value) : undefined)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Chủ đề" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Tất cả</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre.ma} value={genre.ma.toString()}>
                        {genre.tenloaitin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container px-4 md:px-6 mx-auto">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">
                {isLoadingBlogs
                  ? 'Đang tải...'
                  : blogsData?.pagination.totalItems === blogs.length
                  ? 'Tất cả bài viết'
                  : `${blogsData?.pagination.totalItems} bài viết được tìm thấy`}
              </h2>
              {blogs.length > 0 && (
                <p className="text-muted-foreground mt-1">
                  Hiển thị {(currentPage - 1) * postsPerPage + 1}-
                  {Math.min(
                    currentPage * postsPerPage,
                    blogsData?.pagination.totalItems || 0
                  )}{' '}
                  trên tổng {blogsData?.pagination.totalItems}
                </p>
              )}
            </div>
          </div>

          {/* Posts Grid */}
          {isLoadingBlogs ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-2">Đang tải...</h3>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-2">
                  Không tìm thấy bài viết
                </h3>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((post) => (
                  <BlogCard key={post.ma} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Tiếp
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
