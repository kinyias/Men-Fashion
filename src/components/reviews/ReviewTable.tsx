'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Star, Search, Loader2 } from 'lucide-react';
import { ReviewActions } from '@/components/reviews/ReviewAction';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DanhGiaAdminQueryParams } from '@/types';
import {
  getAdminReviews,
  deleteReview,
  deleteManyReviews,
} from '@/lib/api/api-reviews';
import toast from 'react-hot-toast';
import EllipsisPagination from '../ui/EllipsisPagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface RowSelection {
  [key: string]: boolean;
}

export function ReviewTable() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelection>({});
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [queryParams, setQueryParams] = useState<DanhGiaAdminQueryParams>({
    page: 1,
    limit: 5,
    sortBy: 'ngaydang',
    sortOrder: 'desc',
    search: '',
  });

  // Update search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, search: searchQuery, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch reviews
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-reviews', queryParams],
    queryFn: () => getAdminReviews(queryParams),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  const reviews = data?.data || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  };

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success('Đã xóa đánh giá thành công');
    },
    onError: (error) => {
      console.error('Error deleting review:', error);
      toast.error('Xóa đánh giá thất bại');
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteManyReviews(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success(
        `Đã xóa ${Object.keys(rowSelection).length} đánh giá thành công`
      );
      setBulkDeleteOpen(false);
      setRowSelection({});
    },
    onError: (error) => {
      console.error('Error bulk deleting reviews:', error);
      toast.error('Xóa đánh giá hàng loạt thất bại');
    },
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error in handleDelete:', error);
    }
  };

  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map((index) => {
      return reviews[Number(index)].ma;
    });
    bulkDeleteMutation.mutate(selectedIds);
  };

  const handleRatingFilter = (rating: string) => {
    setQueryParams((prev) => ({
      ...prev,
      rating: rating === 'all' ? undefined : Number(rating),
      page: 1,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex gap-5">
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý đánh giá
          </h1>
          {Object.keys(rowSelection).length > 0 && (
            <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Xoá đánh giá đã chọn
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xác nhận xóa hàng loạt</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa {Object.keys(rowSelection).length}{' '}
                    đánh giá đã chọn? Hành động này không thể hoàn tác.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setBulkDeleteOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                  >
                    {bulkDeleteMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {bulkDeleteMutation.isPending ? 'Đang xoá...' : 'Xóa'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:gap-2">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm đánh giá..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={queryParams.rating?.toString() || 'all'}
            onValueChange={handleRatingFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo số sao" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="5">5 sao</SelectItem>
              <SelectItem value="4">4 sao</SelectItem>
              <SelectItem value="3">3 sao</SelectItem>
              <SelectItem value="2">2 sao</SelectItem>
              <SelectItem value="1">1 sao</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-destructive">
            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        reviews.length > 0 &&
                        Object.keys(rowSelection).length === reviews.length
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          const newSelection: RowSelection = {};
                          reviews.forEach((_, index) => {
                            newSelection[index] = true;
                          });
                          setRowSelection(newSelection);
                        } else {
                          setRowSelection({});
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Bình luận</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Không có dữ liệu nào để hiển thị.
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review, index) => (
                    <TableRow key={review.ma}>
                      <TableCell>
                        <Checkbox
                          checked={rowSelection[index] || false}
                          onCheckedChange={(checked) => {
                            setRowSelection((prev) => ({
                              ...prev,
                              [index]: checked,
                            }));
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {review.sanPham.ten}
                      </TableCell>
                      <TableCell>{`${review.nguoiDung.ho} ${review.nguoiDung.ten}`}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.sosao
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {review.binhluan}
                      </TableCell>
                      <TableCell>
                        {new Date(review.ngaydang).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <ReviewActions
                          review={review}
                          onDelete={() => handleDelete(review.ma)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Số hàng mỗi trang</p>
              <select
                value={queryParams.limit}
                onChange={(e) => {
                  const newLimit = Number(e.target.value);
                  setQueryParams((prev) => ({
                    ...prev,
                    limit: newLimit,
                    page: 1,
                  }));
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
              >
                {[5, 10, 20, 30, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <EllipsisPagination
                currentPage={queryParams.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) =>
                  setQueryParams((prev) => ({ ...prev, page }))
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
