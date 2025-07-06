'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, StarHalf, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WriteReviewModal } from './WriteReviewModal';
import { getReviews } from '@/lib/api/api-reviews';
import { useQuery } from '@tanstack/react-query';

interface ReviewsSectionProps {
  productId: number;
  averageRating: number;
  totalReviews: number;
}

export function ReviewsSection({
  productId,
  averageRating,
  totalReviews,
}: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Fetch reviews with React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () =>
      getReviews({
        page: 1,
        limit: 50, // Get a larger number to handle client-side filtering
        masp: productId,
        sortBy: 'ngaydang',
        sortOrder: 'desc',
      }),
  });

  const reviews = data?.data || [];

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter((review) => {
      if (filterRating === 'all') return true;
      return review.sosao === Number.parseInt(filterRating);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.ngaydang).getTime() - new Date(a.ngaydang).getTime()
          );
        case 'oldest':
          return (
            new Date(a.ngaydang).getTime() - new Date(b.ngaydang).getTime()
          );
        case 'highest':
          return b.sosao - a.sosao;
        case 'lowest':
          return a.sosao - b.sosao;
        default:
          return 0;
      }
    });

  const displayedReviews = showAllReviews
    ? filteredAndSortedReviews
    : filteredAndSortedReviews.slice(0, 3);

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          if (star <= rating) {
            return (
              <Star
                key={star}
                className={`${sizeClasses[size]} fill-amber-400 text-amber-400`}
              />
            );
          } else if (star - 0.5 <= rating) {
            return (
              <StarHalf
                key={star}
                className={`${sizeClasses[size]} fill-amber-400 text-amber-400`}
              />
            );
          } else {
            return (
              <Star
                key={star}
                className={`${sizeClasses[size]} text-gray-300`}
              />
            );
          }
        })}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Reviews Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Đánh giá sản phẩm</span>
            {/* {user && (
              <Button onClick={() => setShowWriteReview(true)}>Viết đánh giá</Button>
            )} */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rating Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">
                  {averageRating.toFixed(1)}
                </div>
                <div>
                  {renderStars(averageRating, 'lg')}
                  <p className="text-sm text-muted-foreground mt-1">
                    Dựa trên {totalReviews} đánh giá
                  </p>
                </div>
              </div>

              {/* Rating Breakdown */}
              {/* <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-8">{rating}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <Progress
                      value={(ratingBreakdown[rating as keyof typeof ratingBreakdown] / totalReviews) * 100}
                      className="flex-1 h-2"
                    />
                    <span className="text-sm text-muted-foreground w-8">
                      {ratingBreakdown[rating as keyof typeof ratingBreakdown]}
                    </span>
                  </div>
                ))}
              </div> */}
            </div>

            {/* Simple Stats */}
            <div className="space-y-4">
              <h3 className="font-medium">Đánh giá tổng quan</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {totalReviews > 0
                      ? Math.round(
                          (reviews.filter((r) => r.sosao >= 4).length /
                            totalReviews) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">Tích cực</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalReviews}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Số lượt đánh giá
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Lọc & Sắp xếp</span>
        </div>
        <div className="flex gap-2">
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="5">5 Sao</SelectItem>
              <SelectItem value="4">4 Sao</SelectItem>
              <SelectItem value="3">3 Sao</SelectItem>
              <SelectItem value="2">2 Sao</SelectItem>
              <SelectItem value="1">1 Sao</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
              <SelectItem value="highest">Tốt nhất</SelectItem>
              <SelectItem value="lowest">Xấu nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-8">Đang tải đánh giá...</div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Không thể tải đánh giá. Vui lòng thử lại sau.
        </div>
      ) : displayedReviews.length === 0 ? (
        <div className="text-center py-8">
          Chưa có đánh giá nào cho sản phẩm này
        </div>
      ) : (
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <Card key={review.ma}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {review.nguoiDung.ho} {review.nguoiDung.ten}
                          </span>
                        </div>
                        <p className="font-small text-gray-400">
                          {review.nguoiDung.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.sosao, 'sm')}
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.ngaydang)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Comment */}
                  <div>
                    <p className="text-muted-foreground">{review.binhluan}</p>
                  </div>

                  {/* Review Images */}
                  {review.hinhAnh && (
                    <div className="flex gap-2">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden">
                        <Image
                          src={review.hinhAnh || '/placeholder.svg'}
                          alt={`Review image ${review.sosao}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Reviews */}
      {filteredAndSortedReviews.length > 3 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="flex items-center gap-2"
          >
            {showAllReviews
              ? 'Hiển thị ít hơn'
              : `Xem tất cả ${filteredAndSortedReviews.length} đánh giá`}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showAllReviews ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </div>
      )}

      {/* Write Review Modal */}
      {showWriteReview && (
        <WriteReviewModal
          productId={productId}
          onClose={() => setShowWriteReview(false)}
        />
      )}
    </div>
  );
}
