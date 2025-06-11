'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tag,
  Search,
  Filter,
  Copy,
  Clock,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { getCoupons } from '@/lib/api/api-coupons';
import type { KhuyenMai } from '@/types';
import { LoaiKhuyenMai } from '@/lib/validations/coupons.validator';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/formatTime';
import EllipsisPagination from '../ui/EllipsisPagination';

export function CouponsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loaikhuyenmai, setLoaikhuyenmai] = useState('all');
  const [sortBy, setSortBy] = useState('ngayketthuc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const {
    data: couponsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'coupons',
      { page, limit, search: searchTerm, loaikhuyenmai, sortBy },
    ],
    queryFn: () =>
      getCoupons({
        page,
        limit,
        search: searchTerm,
        loaikhuyenmai,
        active: 'true',
        sortBy,
        sortOrder: 'asc',
      }),
  });

  const handleCopyCoupon = (ma: string) => {
    navigator.clipboard.writeText(ma.toString());
    toast.success('Mã khuyến mãi đã được sao chép');
  };

  const formatDiscountValue = (coupon: KhuyenMai) => {
    if (coupon.loaikhuyenmai === LoaiKhuyenMai.PHAN_TRAM) {
      return `${coupon.giatrigiam}% GIẢM`;
    } else {
      return `${formatCurrency(coupon.giatrigiam)} GIẢM`;
    }
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Hết hạn hôm nay';
    } else if (diffDays === 1) {
      return 'Hết hạn ngày mai';
    } else if (diffDays <= 7) {
      return `Còn ${diffDays} ngày`;
    } else {
      return `HSD: ${formatDate(date)}`;
    }
  };

  const isExpiringSoon = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Đã có lỗi xảy ra khi tải danh sách khuyến mãi</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Khuyến mãi của tôi
          </CardTitle>
          <CardDescription>
            Danh sách mã khuyến mãi có thể sử dụng
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm mã khuyến mãi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={loaikhuyenmai} onValueChange={setLoaikhuyenmai}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Loại khuyến mãi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="phan_tram">Giảm theo %</SelectItem>
                <SelectItem value="tien_mat">Giảm số tiền</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ngayketthuc">Ngày hết hạn</SelectItem>
                <SelectItem value="giatrigiam">Giá trị giảm</SelectItem>
                <SelectItem value="ten">Tên</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Coupons Grid */}
      {!couponsData || couponsData.data.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Không tìm thấy khuyến mãi
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || loaikhuyenmai
                ? 'Thử điều chỉnh bộ lọc tìm kiếm của bạn'
                : 'Hiện tại bạn không có mã khuyến mãi nào có thể sử dụng'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {couponsData.data.map((coupon) => (
            <Card key={coupon.ma} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent" />

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">
                        {formatDiscountValue(coupon)}
                      </h3>
                      {isExpiringSoon(coupon.ngayketthuc) && (
                        <Badge variant="destructive" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Sắp hết hạn
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-base mb-1">
                      {coupon.ten}
                    </h4>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Mã khuyến mãi
                      </p>
                      <p className="font-mono font-bold text-lg tracking-wider">
                      {coupon.ten}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCoupon(coupon.ten)}
                      className="ml-2"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Sao chép
                    </Button>
                  </div>
                </div>

                {/* Coupon Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hết hạn:</span>
                    <span
                      className={
                        isExpiringSoon(coupon.ngayketthuc)
                          ? 'text-destructive font-medium'
                          : ''
                      }
                    >
                      {formatExpiryDate(coupon.ngayketthuc)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Giá trị đơn tối thiểu:
                    </span>
                    <span>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(coupon.giatridonhang)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1">Áp dụng khi thanh toán</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Add this before the closing div of the component */}
      {couponsData && couponsData.pagination && couponsData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Số hàng mỗi trang</p>
            <select
              value={limit}
              onChange={(e) => {
                const newLimit = Number(e.target.value);
                setLimit(newLimit);
                setPage(1);
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
              currentPage={page}
              totalPages={couponsData.pagination.totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
